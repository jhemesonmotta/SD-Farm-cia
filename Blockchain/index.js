const Blockchain = require('../classes/blockchain')
const blockchainInstance = new Blockchain()

const BlockchainIntegrity = require('../classes/blockchain-integrity')
const blockchainIntegrityInstance = new BlockchainIntegrity()

var store = require('store');

module.exports.addBlock = function(blockInfo, callback) {
    var blockChainAtual = store.get("blockChainAtual");

    if(blockChainAtual != null && blockChainAtual != undefined){
        blockchainInstance.setAllInfo(blockChainAtual.blocks, blockChainAtual.index, blockChainAtual.difficulty);
    }
    
    blockchainInstance.addBlock(blockInfo);
    
    callback({success: true, blockchain: blockchainInstance});
}

module.exports.getCaminhoMedicamento = function(medicamentoId, callback) {
    var blockChainAtual = store.get("blockChainAtual");
    if(blockChainAtual != null && blockChainAtual != undefined){
        blockchainInstance.setAllInfo(blockChainAtual.blocks, blockChainAtual.index, blockChainAtual.difficulty); 
    }
    
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
        if(blockchainIntanceRecebido != null && blockchainIntanceRecebido != undefined){
            blockchainInstance.setAllInfo(blockchainIntanceRecebido.blocks, blockchainIntanceRecebido.index, blockchainIntanceRecebido.difficulty); 
            store.set("blockChainAtual", blockchainInstance);
        }
    }
    callback(true);
}

module.exports.getBlockchain = function(callback) {
    callback(blockchainInstance);
}