const sha256 = require('crypto-js/sha256')

class Block {
    constructor(index = 0, previousHash = null, data = 'Genesis block', difficulty = 1) {
        this.index = index
        this.previousHash = previousHash
        this.data = data
        this.timestamp = new Date()

        //dificuldade geral do sistema
        this.difficulty = difficulty

        //quantidade de tentativas até que o hash correto seja criado
        this.nonce = 0
        
        this.mine()
    }

    /**
         * This function generates the hashcode.
         * @returns the hashcode
     */
    generateHash() {
        return sha256(
            this.index
            + this.previousHash
            + JSON.stringify(this.data)
            + this.timestamp
            + this.nonce
        ).toString()
    }

    /**
         * A função mine vai criar hashes até que a quantidade de zeros à esquerda do hash seja atentida.
         * @returns nothing
     */
    mine() {
        this.hash = this.generateHash()
    
        while (!(/^0*$/.test(this.hash.substring(0, this.difficulty)))) {
                this.nonce++
                this.hash = this.generateHash()
        }
    }
}

module.exports = Block