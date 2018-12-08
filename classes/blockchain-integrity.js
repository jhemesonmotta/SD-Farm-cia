const Block = require('../Classes/block')
const sha256 = require('crypto-js/sha256')


class BlockchainIntegrity {
    /**
         * função para conferir a validade da cadeia. Precisa garantir que: O hash de cada Bloco foi gerado corretamente;O index dos Blocos está em sequência;Os Blocos estão ligados entre si através dos hashes
         * @param {blocks} input list of the blocks
         * @returns an boolean that says if the sequence is valid
     */
    isValid(blocks) {
        for (let i = 1; i < blocks.length; i++) {
            const currentBlock = new Block(blocks[i].index, blocks[i].previousHash, blocks[i].data, blocks[i].difficulty);
            const previousBlock = new Block(blocks[i-1].index, blocks[i-1].previousHash, blocks[i-1].data, blocks[i-1].difficulty);
    
            if (currentBlock.hash !== currentBlock.generateHash()) {
                return false
            }
    
            if (currentBlock.index !== previousBlock.index + 1) {
                return false
            }
    
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }
        return true
    }

    generateHash(block) {
        return sha256(
            block.index
            + block.previousHash
            + JSON.stringify(block.data)
            + block.timestamp
            + block.nonce
        ).toString()
    }
}

module.exports = BlockchainIntegrity