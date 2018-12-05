export class Envio {
    constructor(idTransacao, entidadeRemetente, entidadeDestinatario, medicamentos, quantidade, data) {
      this.idTransacao = idTransacao;
      this.entidadeRemetente = entidadeRemetente;
        // inferido pela entidade logada
      this.entidadeDestinatario = entidadeDestinatario;
        // drop com entidades cadastradas
      this.medicamentos = medicamentos;
        // medicamentos setados para o envio
      this.data = data;
        // inferido dinamicamente
    }
  }

  // � uma inst�ncia de envio q vai ser o conte�do no blockchain