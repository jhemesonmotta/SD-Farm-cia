export class Entidade {
    constructor(id, nome, tipo, endereco, telefone, email, senha) {
      this.id = id;
      this.nome = nome;
      this.tipo = tipo; // tipo = Fabricante, Distribuidor, farmácia... etc (cliente não)
      this.endereco = endereco;
      this.telefone = telefone;
      this.email = email;
      this.senha = senha;
    }
  }