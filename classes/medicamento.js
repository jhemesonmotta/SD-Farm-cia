class Medicamento {
    constructor(id, nome, origem, localAcao, viaAdministracao) {
      this.id = id;
      this.nome = nome;
      this.origem = origem;
        // Natural, Vegetal, Animal, Mineral, Sint�tico
      this.localAcao = localAcao;
        // local ou sist�mica
      this.viaAdministracao = viaAdministracao;
        // Parental ou Enteral 
        
      // ------------------------------------------------------------------------------------------------------------------------------
        // o motivo de colocar mais informa��es que o sistema diretamente precisa �: 
          // como tinhamos falado, os mineradores receber�o informa��es ent�o quanto mais informa��es �teis tivermos, mais chances de termos gente querendo as informa��es
      // ------------------------------------------------------------------------------------------------------------------------------
    }
  }

  module.exports = Medicamento;

  // https://www.portaleducacao.com.br/conteudo/artigos/farmacia/classificacao-dos-medicamentos/61664
  // https://www.portaleducacao.com.br/conteudo/artigos/farmacia/principais-vias-de-administracao-de-medicamentos/15323