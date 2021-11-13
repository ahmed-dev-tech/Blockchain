const SHA256 = require('crypto-js/sha256');
const { sha256 } = require('hash.js');
class Block{
    constructor(index, timestamp, data , previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    //Create genesis manually
    createGenesisBlock(){
        return new Block(0,"13/11/2021","Genesis Block","0");
    }
    //latest block in chain 
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    //add block to the chain
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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
let myCoin = new Blockchain();
myCoin.addBlock(new Block(1,"11/12/2021",{amount:4}));
myCoin.addBlock(new Block(2,"13/12/2021",{amount:10}));

//console.log(JSON.stringify(myCoin, null , 4)); // simple printing of chain
// console.log("Is chain Valid? "+ myCoin.isChainValid()); //rturns True
// myCoin.chain[1].data = {amount : 1000}; // tempering
// console.log("Is chain Valid? "+ myCoin.isChainValid()); //return False

// recalculate hash method

console.log("Is chain Valid? "+ myCoin.isChainValid()); //rturns True
myCoin.chain[1].data = {amount : 1000}; // tempering
myCoin.chain[1].hash = myCoin.chain[1].calculateHash()
console.log(JSON.stringify(myCoin, null , 4));
console.log("Is chain Valid? "+ myCoin.isChainValid()); //return False
