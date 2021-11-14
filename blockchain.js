const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
    calculateHash(){
        //signature of transaction is valid or not
        return SHA256(this.fromAddress + this.toAddress +this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex')!== this.fromAddress ){
            throw new Error('No signature in this transaction');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);

    }

}

class Block{
    constructor(timestamp, transactions , previousHash=''){
        //this.index = index; //removing index bcz BC is indexed by order in Array
        this.timestamp = timestamp;
        this.transactions = transactions;
        
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    /*
    It is possible to add many blocks as any user wants and our chain gets heavy and accepting all the transactions 
    so we implement proof of work(concensis protocol) so every block is minned after some required calculation
    */
   //Proof of work
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash()
        }
        console.log("Block mined:"+this.hash);
    }
    
    hasValidTransactions(){
        //iterate all valid TX
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
    

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    //Create genesis manually
    createGenesisBlock(){
        return new Block("13/11/2021","Genesis Block","0");
    }
    //latest block in chain 
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    //add block to the chain
    // addBlock(newBlock){

    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     //newBlock.hash = newBlock.calculateHash();
    //     this.chain.push(newBlock);
    // }
    minePendingTransactions(miningRewardAddress){
        let block= new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Sucessfully mined:');
        this.chain.push(block);

        this.pendingTransactions = [new Transactions(null,miningRewardAddress,this.miningReward)];

    }
    addTransaction(transaction){
        if(!transaction.fromAddress||!transaction.toAddress){
            throw new Error('Transaction must include from or To address');
        }
        if(!transaction.isValid()){
            throw new Error('cannot add invalid TX to chain');

        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // verification of Blockchain by using previous hash method
    isChainValid(){
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if(currentBlock.hash !== currentBlock.calculateHash() ){
                return false;
            }
            if(previousBlock.hash !== currentBlock.previousHash){
                return false;
            }
        }
        return true;
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;