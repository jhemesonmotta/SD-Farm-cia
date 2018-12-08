const Block = require('./block')

class Blockchain {
    constructor(difficulty = 1) {
        // inicializado o array já com o "Genesis Block" --> o primeiro bloco criado na cadeia
        this.blocks = [new Block()]
        this.index = 1
        this.difficulty = difficulty
    }

    setAllInfo(blocks, index, difficulty){
        this.blocks = blocks
        this.index = index
        this.difficulty = difficulty
    }

    /**
         * função para pegar o último block da cadeia 
     */
    getLastBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    getFirstBlock() {
        return this.blocks[0]
    }

    /**
         * função para pegar o último block da cadeia 
         * @param {data} input the data do record in the block
         * @returns nothing
     */
    addBlock(data) {
        const index = this.index
        const previousHash = this.getLastBlock().hash

        const block = new Block(index, previousHash, data)

        this.index++
        this.blocks.push(block)
    }
}

module.exports = Blockchain