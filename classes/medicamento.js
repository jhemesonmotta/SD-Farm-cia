export class Medicamento {
    constructor(id, nome, origem, localAcao, viaAdministracao) {
      this.id = id;
      this.nome = nome;
      this.origem = origem;
        // Natural, Vegetal, Animal, Mineral, Sintético
      this.localAcao = localAcao;
        // local ou sistêmica
      this.viaAdministracao = viaAdministracao;
        // Parental ou Enteral 
        
      // ------------------------------------------------------------------------------------------------------------------------------
        // o motivo de colocar mais informações que o sistema diretamente precisa é: 
          // como tinhamos falado, os mineradores receberão informações então quanto mais informações úteis tivermos, mais chances de termos gente querendo as informações
      // ------------------------------------------------------------------------------------------------------------------------------
    }
  }

  // https://www.portaleducacao.com.br/conteudo/artigos/farmacia/classificacao-dos-medicamentos/61664
  // https://www.portaleducacao.com.br/conteudo/artigos/farmacia/principais-vias-de-administracao-de-medicamentos/15323