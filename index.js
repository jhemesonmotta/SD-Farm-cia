var express = require('express');
var request = require("request");
var mockController = require('./controllers');
var blockchainController = require('./Blockchain');
const Envio = require('./classes/envio');
var bodyParser = require('body-parser');
var store = require('store');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// rotas de base
app.get('/', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    response.render('pages/index', {usuario: usuarioLogado});
  }
});

app.post('/', function (request, response) {
  if(request.body.inputEmail != null && request.body.inputEmail != undefined){
    var email = request.body.inputEmail;
    var senha = request.body.inputPassword;

    mockController.getUserByCredentials(email, senha, function (data) {
      if(data != null && data != undefined)
      {
        store.set("userLoggedIn", data);
        // console.log(data);
        response.render('pages/index', { usuario: data });
      }
    });

  }
  else{
    store.set('userLoggedIn', null);
    response.render('pages/login');
  }
});
// fim rotas de base

// rotas de criar de rem�dio
app.get('/criar-remedio', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    if(usuarioLogado.tipo == "Fabricante"){
      response.render('pages/criar');
    }
    else{
      response.render('pages/index', {usuario: usuarioLogado});
   } 
  }
});

app.post('/criar-remedio', function (request, response) {
    var nome = request.body.nome;
    var origem = request.body.origem;
    var local = request.body.local;
    var via = request.body.via;
    var blockchainRetornado;

    mockController.criarRemedio(nome, origem, local, via, function (data) {
      if(data != null && data != undefined)
      {
        store.set("listaRemedios", data.remedios);

        var itemEnviado = new Envio(null, store.get('userLoggedIn'), data.remedio, Date.now());
        
          blockchainController.addBlock(itemEnviado, function(data){
            if(data != null && data != undefined){
              if(data.success){
                blockchainRetornado = data.blockchain;
                store.set("blockchainAtual", blockchainRetornado);
              }
            }
          });

        // onload dessa p�gina ter� um m�todo q enviar� a lista de rem�dios para os pontos conhecidos
        // onlead dessa página terá um método q enviará o blockchain para os pontos conhecidos
        // todos os pontos, ao receberem a lista, atualizam a sua


        var returnObj = { retorno:{ 
                                listaRemedios       :     data.remedios,
                                blockchain          :     blockchainRetornado,
                                toString            :     JSON.stringify(
                                  {
                                    listaRemedios       :     data.remedios,
                                    blockchain          :     blockchainRetornado
                                  })
                                }};



        response.render('pages/listar', returnObj);
      }
    });
});
// fim rotas de criar de rem�dio

// rotas de listar rem�dios
app.get('/listar-remedios', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    remedios = store.get('listaRemedios');

    var returnObj = { retorno:{ 
                              listaRemedios       :     remedios,
                              blockchain          :     store.get("blockchainAtual"),
                              toString            :     JSON.stringify(
                                {
                                  listaRemedios       :     remedios,
                                  blockchain          :     store.get("blockchainAtual")
                                })
                              }};

    response.render('pages/listar', returnObj);
  }
});
// fim rotas de listar rem�dios

// rotas de precedencia
app.get('/precedencia', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');
  response.render('pages/precedencia');
});
// fim rotas de precedencia

// rotas de enviar remedios
app.get('/enviar-remedios', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    response.render('pages/enviar');
  }
});
// fim rotas de enviar remedios

// rota de inicializar conex�o p2p
app.get('/inicializa-p2p', function (request, response) {
    response.render('pages/forneceid');
});
// fim rota de inicializar conex�o p2p

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});



// npm install
// npm i peer
// npm install object-hash
// npm install crypto-js