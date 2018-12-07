const Blockchain = require('../classes/blockchain')
const blockchainInstance = new Blockchain()

const BlockchainIntegrity = require('../classes/blockchain-integrity')
const blockchainIntegrityInstance = new BlockchainIntegrity()

module.exports.addBlock = function(blockInfo, callback) {
    blockchainInstance.addBlock(blockInfo);
    if(blockchainIntegrityInstance.isValid(blockchainInstance.blocks)){
        callback({success: true, blockchain: blockchainInstance});
    }
    else{
        callback({success: false});
    }
}

module.exports.getCaminhoMedicamento = function(medicamentoId, callback) {
    var caminhoMedicamento = []

    for (i = 0; i < blockchainInstance.blocks.length; i++) {
        if(blockchainInstance.blocks[i].data.medicamento.id == medicamentoId){
            caminhoMedicamento.push(blockchainInstance.blocks[i].data); // .data = instância de Envio
        }
    }

    callback(caminhoMedicamento);
}

module.exports.igualaBlockchain = function(blockchainIntanceRecebido, callback) {
    if(blockchainIntanceRecebido != blockchainInstance){
        blockchainInstance = blockchainIntanceRecebido;
    }
    callback(true);
}

module.exports.getBlockchain = function(callback) {
    callback(blockchainInstance);
}