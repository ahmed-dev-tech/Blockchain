const {Blockchain , Transactions} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
let myCoin = new Blockchain();
const myKey = ec.keyFromPrivate('c05c931185e22be77ddcbb517630e1dee62ca5de1dd9d1f51d6c633e6ea3ec4b')
const myWalletAddress = myKey.getPublic('hex');

const tx1 = new Transactions(myWalletAddress,'public key',10);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);

console.log('\n Starting the miner......');

myCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of Ahmed is:',myCoin.getBalanceAddress(myWalletAddress));

console.log("is chain valid", myCoin.isChainValid())
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

// myCoin.createTransaction(new Transactions('address1','address2',100));
// myCoin.createTransaction(new Transactions('address2','address1',10));

// console.log('\n Starting the miner again....');

// myCoin.minePendingTransactions('ahmed-address');
// console.log('\nBalance of Ahmed is:',myCoin.getBalanceAddress('ahmed-address'));
