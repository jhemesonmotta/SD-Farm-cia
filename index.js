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
  console.log("criar-remedio");
    var nome = request.body.nome;
    var origem = request.body.origem;
    var local = request.body.local;
    var via = request.body.via;
    var currentSharedDataAsString = request.body.currentSharedData;
    var currentSharedDataAsJson = null;
    
    if(currentSharedDataAsString != null && currentSharedDataAsString != undefined && currentSharedDataAsString != ""){
      console.log("currentSharedDataAsString não é vazio");
      console.log("currentSharedDataAsString não é vazio");
      console.log("currentSharedDataAsString não é vazio");
      console.log("currentSharedDataAsString não é vazio");
      console.log("currentSharedDataAsString não é vazio");
      currentSharedDataAsJson = JSON.parse(currentSharedDataAsString);
      console.log("currentSharedDataAsJson");
      console.log(currentSharedDataAsJson);

      if(currentSharedDataAsJson.listaRemedios != null && currentSharedDataAsJson.listaRemedios != undefined && currentSharedDataAsJson.listaRemedios != []){
        console.log("currentSharedDataAsJson.listaRemedios não é vazio");
        console.log(currentSharedDataAsJson.listaRemedios);
        store.set("listaRemedios", currentSharedDataAsJson.listaRemedios);
      }
      else{
        console.log("currentSharedDataAsJson.listaRemedios é vazio");
      }
    }

    var blockchainRetornado;

    mockController.criarRemedio(nome, origem, local, via, function (data) {
      if(data != null && data != undefined)
      {
        store.set("listaRemedios", data.remedios);

        var itemEnviado = new Envio(null, store.get('userLoggedIn'), data.remedio, Date.now());
        
        if(currentSharedDataAsJson != null){
          // sincronizar blocos antes de add
          
          if(currentSharedDataAsJson.blockchain != null && currentSharedDataAsJson.blockchain != undefined && currentSharedDataAsJson.blockchain != []){
            blockchainController.igualaBlockchain(currentSharedDataAsJson.blockchain, function(data){});
          }
        }
        
          blockchainController.addBlock(itemEnviado, function(data){
            if(data != null && data != undefined){
              if(data.success){
                blockchainRetornado = data.blockchain;
                store.set("blockchainAtual", blockchainRetornado);
              }
            }
          });

        var returnObj = { retorno:{ 
                                listaRemedios       :     data.remedios,
                                blockchain          :     blockchainRetornado,
                                toString            :     JSON.stringify(
                                  {
                                    listaRemedios       :     data.remedios,
                                    blockchain          :     blockchainRetornado
                                  })
                                }};



        console.log("\n");
        console.log("\n");
        console.log(returnObj);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log(returnObj.retorno);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log(returnObj.retorno.listaRemedios);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log(returnObj.retorno.blockchain);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log(returnObj.retorno.toString);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        
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






// Self: {"listaRemedios":[{"id":"a2878de1ccadd3153794ed98e75b1976c15bb812","nome":"asdasd","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}}],"blockchain":{"blocks":[{"index":0,"previousHash":null,"data":"Genesis block","timestamp":"2018-12-08T01:28:37.769Z","difficulty":1,"nonce":60,"hash":"0784e6c39534f0bde2c1f521ff5fa07f844fc0bfaa6064a8e4e6f71f53bb476d"},{"index":1,"previousHash":"0784e6c39534f0bde2c1f521ff5fa07f844fc0bfaa6064a8e4e6f71f53bb476d","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"a2878de1ccadd3153794ed98e75b1976c15bb812","nome":"asdasd","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544233813950},"timestamp":"2018-12-08T01:50:13.950Z","difficulty":1,"nonce":7,"hash":"0f54d583fc4dd3f5dec17e2b36e790141cc20474d41a615bb2abe214b17e3cb9"}],"index":2,"difficulty":1}}