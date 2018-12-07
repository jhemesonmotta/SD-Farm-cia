const Block = require('../Classes/block')

class BlockchainIntegrity {
    /**
         * função para conferir a validade da cadeia. Precisa garantir que: O hash de cada Bloco foi gerado corretamente;O index dos Blocos está em sequência;Os Blocos estão ligados entre si através dos hashes
         * @param {blocks} input list of the blocks
         * @returns an boolean that says if the sequence is valid
     */
    isValid(blocks) {
        for (let i = 1; i < blocks.length; i++) {
            const currentBlock = blocks[i]
            const previousBlock = blocks[i - 1]
    
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
}

module.exports = BlockchainIntegrity