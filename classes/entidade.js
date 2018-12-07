class Entidade {
    constructor(id, nome, tipo, endereco, telefone, email, senha) {
      this.id = id;
      this.nome = nome;
      this.tipo = tipo; // tipo = Fabricante, Distribuidor, farm�cia... etc (cliente n�o)
      this.endereco = endereco;
      this.telefone = telefone;
      this.email = email;
      this.senha = senha;
      this.peer = null; // setado toda vez q ele fizer login
    }
  }

  module.exports = Entidade;