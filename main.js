const SHA256 = require("crypto-js/sha256");

class Trancaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block {
    constructor(timestamp, transcations, previousHash = '') {
        this.timestamp = timestamp;
        this.transcations = transcations;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined :" + this.hash);
    }


}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.minigReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/10/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(minigRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully Mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Trancaction(null, minigRewardAddress, this.minigReward)
        ];
    }

    createTransaction(transcation){
        this.pendingTransactions.push(transcation);
    }

    getBalanceofAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transcations){
                
                if(trans.fromAddress == address)
                        balance -= trans.amount;

                if(trans.toAddress == address)
                    balance += trans.amount;
            }
        }

        return balance;
    }




    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
             const currentBlock = this.chain[i];
             const previousBlock = this.chain[i - 1];

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

let savjeeCoin = new Blockchain();

savjeeCoin.createTransaction(new Trancaction('address1' ,'address2', 100 ));
savjeeCoin.createTransaction(new Trancaction('address2' ,'address1', 50 ));

console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions('areeb-address');

console.log('\n Balance of areeb is : ', savjeeCoin.getBalanceofAddress('areeb-address'));

console.log('\n Starting the miner again...');
savjeeCoin.minePendingTransactions('areeb-address');

console.log('\n Balance of areeb is : ', savjeeCoin.getBalanceofAddress('areeb-address'));





// console.log('mining block 1...');
// savjeeCoin.addBlock(new Block(1, "20/10/2018", { amount: 4 }));
// console.log('mining block 2...');
// savjeeCoin.addBlock(new Block(2, "25/10/2018", { amount: 10 }));



// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

// savjeeCoin.chain[1].data = { amount: 100 };
// console.log(JSON.stringify(savjeeCoin, null, 4));

// console.log('Is Blockchain valid? ' + savjeeCoin.isChainValid());

