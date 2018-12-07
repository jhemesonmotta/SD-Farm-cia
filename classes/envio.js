class Envio {
    constructor(entidadeRemetente, entidadeDestinatario, medicamento, data) {
      this.entidadeRemetente = entidadeRemetente;
        // inferido pela entidade logada
      this.entidadeDestinatario = entidadeDestinatario;
        // drop com entidades cadastradas
      this.medicamento = medicamento;
        // medicamento setado para o envio
      this.data = data;
        // inferido dinamicamente
    }
  }

  module.exports = Envio;
  // � uma inst�ncia de envio q vai ser o conte�do no blockchain