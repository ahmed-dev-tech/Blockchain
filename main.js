const SHA256 = require('crypto-js/sha256');
const { sha256 } = require('hash.js');
class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
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

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
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
    createTransaction(transaction){
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

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
    


}
//test coin
// let myCoin = new Blockchain();
// console.log('Mining block 1........');
// myCoin.addBlock(new Block(1,"11/12/2021",{amount:4}));
// console.log('Mining block 2........');
// myCoin.addBlock(new Block(2,"13/12/2021",{amount:10}));

//console.log(JSON.stringify(myCoin, null , 4)); // simple printing of chain
// console.log("Is chain Valid? "+ myCoin.isChainValid()); //rturns True
// myCoin.chain[1].transactions = {amount : 1000}; // tempering
// console.log("Is chain Valid? "+ myCoin.isChainValid()); //return False

// recalculate hash method

// console.log("Is chain Valid? "+ myCoin.isChainValid()); //rturns True
// myCoin.chain[1].transactions = {amount : 1000}; // tempering
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash()
// console.log(JSON.stringify(myCoin, null , 4));
// console.log("Is chain Valid? "+ myCoin.isChainValid()); //return False

//mining Reward & Transactions
let myCoin = new Blockchain();
myCoin.createTransaction(new Transactions('address1','address2',100));
myCoin.createTransaction(new Transactions('address2','address1',10));

console.log('\n Starting the miner......');
myCoin.minePendingTransactions('ahmed-address');

console.log('\nBalance of Ahmed is:',myCoin.getBalanceAddress('ahmed-address'));
console.log('\n Starting the miner again....');

myCoin.minePendingTransactions('ahmed-address');
console.log('\nBalance of Ahmed is:',myCoin.getBalanceAddress('ahmed-address'));
