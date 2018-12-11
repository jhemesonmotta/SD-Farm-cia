var express = require('express');
var request = require("request");
var mockController = require('./controllers');
var blockchainController = require('./Blockchain');
const Envio = require('./classes/envio');
var bodyParser = require('body-parser');
var store = require('store');

var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/myPeerServer'});

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
      currentSharedDataAsJson = JSON.parse(currentSharedDataAsString);

      if(currentSharedDataAsJson.listaRemedios != null && currentSharedDataAsJson.listaRemedios != undefined && currentSharedDataAsJson.listaRemedios != []){
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
        // abacate
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
    var usuarioLogado = store.get('userLoggedIn');
    var remedios = store.get('listaRemedios');
    var meusRemedios = [];
    var i;

    for(i = 0; i < remedios.length; i++){
      if(remedios[i].dono.nome == usuarioLogado.nome){
        meusRemedios.push(remedios[i]);
      }
    }

    var usuariosExistentes = [];

    mockController.getUserList(function (data){
      usuariosExistentes = data;
    });

    response.render('pages/enviar', {meusRemedios: meusRemedios, usuariosExistentes:usuariosExistentes});
  }
});
// fim rotas de enviar remedios

app.post('/enviar-remedios', function (request, response) {
  console.log("enviar-remedios");
    var idRemedio = request.body.remedio;
    var idDestinatario = request.body.destinatario;
    var destinatarioObj;
    var usuarioLogado = store.get('userLoggedIn');
    var remedioObj;

    mockController.getUserById(idDestinatario, function (data) {
      if(data != null && data != undefined)
      {
        destinatarioObj = data;
      }
    });

    mockController.getRemedioById(idRemedio, function (data) {
      if(data != null && data != undefined)
      {
        remedioObj = data;
      }
    });

    var currentSharedDataAsString = request.body.currentSharedData;
    var currentSharedDataAsJson = null;
    
    if(currentSharedDataAsString != null && currentSharedDataAsString != undefined && currentSharedDataAsString != ""){
      currentSharedDataAsJson = JSON.parse(currentSharedDataAsString);

      if(currentSharedDataAsJson.listaRemedios != null && currentSharedDataAsJson.listaRemedios != undefined && currentSharedDataAsJson.listaRemedios != []){
        store.set("listaRemedios", currentSharedDataAsJson.listaRemedios);
      }
    }

    remedios = store.get('listaRemedios');
    for(i = 0; i < remedios.length; i++){
      if(remedios[i].id == idRemedio){
        remedios[i].dono = destinatarioObj;
      }
    }

    store.set("listaRemedios", remedios);

    if(currentSharedDataAsJson != null){
      // sincronizar blocos antes de add
      
      if(currentSharedDataAsJson.blockchain != null && currentSharedDataAsJson.blockchain != undefined && currentSharedDataAsJson.blockchain != []){
        blockchainController.igualaBlockchain(currentSharedDataAsJson.blockchain, function(data){});
      }
    }

    var blockchainRetornado;
    var envio = new Envio(usuarioLogado, destinatarioObj, remedioObj, new Date());
    blockchainController.addBlock(envio, function(data){
      if(data != null && data != undefined){
        if(data.success){
          blockchainRetornado = data.blockchain;
          store.set("blockchainAtual", blockchainRetornado);
        }
      }
    });

    var returnObj = { retorno:{ 
      listaRemedios       :     remedios,
      blockchain          :     blockchainRetornado,
      toString            :     JSON.stringify(
        {
          listaRemedios       :     remedios,
          blockchain          :     blockchainRetornado
        })
      }};

    response.render('pages/listar', returnObj);
});

// rota de inicializar conex�o p2p
app.get('/inicializa-p2p', function (request, response) {
    response.render('pages/forneceid');
});
// fim rota de inicializar conex�o p2p

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});



// npm install
// npm install object-hash
// npm install crypto-js






// Self: {"listaRemedios":[{"id":"a2878de1ccadd3153794ed98e75b1976c15bb812","nome":"asdasd","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}}],"blockchain":{"blocks":[{"index":0,"previousHash":null,"data":"Genesis block","timestamp":"2018-12-08T01:28:37.769Z","difficulty":1,"nonce":60,"hash":"0784e6c39534f0bde2c1f521ff5fa07f844fc0bfaa6064a8e4e6f71f53bb476d"},{"index":1,"previousHash":"0784e6c39534f0bde2c1f521ff5fa07f844fc0bfaa6064a8e4e6f71f53bb476d","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"a2878de1ccadd3153794ed98e75b1976c15bb812","nome":"asdasd","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544233813950},"timestamp":"2018-12-08T01:50:13.950Z","difficulty":1,"nonce":7,"hash":"0f54d583fc4dd3f5dec17e2b36e790141cc20474d41a615bb2abe214b17e3cb9"}],"index":2,"difficulty":1}}

// {"listaRemedios":[{"id":"ab7d65d3437fa88a47763f8386a07d625238f9ac","nome":"xxxxxx","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},{"id":"27c01c4f1e312747e18ef3c40676d6b0d6ccecc3","nome":"rapaz","origem":"Natural","localAcao":"Local","viaAdministracao":"Enteral","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":3,"nome":"Alexandre","tipo":"Farmácia","endereco":"506 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"alexandre@gmail.com","senha":"12345678","peer":null}},{"id":"4df9ddf8e40341e71c382b9883855c5322f4795a","nome":"sdfsdf","origem":"Vegetal","localAcao":"Sistêmica","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}}],"blockchain":{"blocks":[{"index":0,"previousHash":null,"data":"Genesis block","timestamp":"2018-12-08T03:22:20.238Z","difficulty":1,"nonce":41,"hash":"093d761aa1d3ce597e3ff96f14ebedd375c0990693ef4d109def2334a5fe05f5"},{"index":1,"previousHash":"093d761aa1d3ce597e3ff96f14ebedd375c0990693ef4d109def2334a5fe05f5","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"67609c45e82d3b00d68198c2a146d3ffe896e521","nome":"asd","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544239365991},"timestamp":"2018-12-08T03:22:45.992Z","difficulty":1,"nonce":45,"hash":"00ced8d886af75031f94bf523b8183b1cf8edb06239382fb64f15cd787873e3f"},{"index":2,"previousHash":"00ced8d886af75031f94bf523b8183b1cf8edb06239382fb64f15cd787873e3f","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"26f22e98edc6c0cac84767278c677d32f252f301","nome":"asdasd","origem":"Animal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241006346},"timestamp":"2018-12-08T03:50:06.347Z","difficulty":1,"nonce":1,"hash":"02b97f83086dcba7dc051ff76c5aa9115b7e9de4bbd8492707dade6fde8db639"},{"index":3,"previousHash":"02b97f83086dcba7dc051ff76c5aa9115b7e9de4bbd8492707dade6fde8db639","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241275060},"timestamp":"2018-12-08T03:54:35.060Z","difficulty":1,"nonce":20,"hash":"0e0faebf7115a53c7120025ab5fc031c00f8f02aba5d8acb609e91a2dd8dd0e5"},{"index":4,"previousHash":"0e0faebf7115a53c7120025ab5fc031c00f8f02aba5d8acb609e91a2dd8dd0e5","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"27c01c4f1e312747e18ef3c40676d6b0d6ccecc3","nome":"rapaz","origem":"Natural","localAcao":"Local","viaAdministracao":"Enteral","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241381955},"timestamp":"2018-12-08T03:56:21.955Z","difficulty":1,"nonce":25,"hash":"044c9bc116476ef76757fe3f2c4e76ec7e40e51573acbc200c4404ae66075695"},{"index":5,"previousHash":"044c9bc116476ef76757fe3f2c4e76ec7e40e51573acbc200c4404ae66075695","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241854271},"timestamp":"2018-12-08T04:04:14.271Z","difficulty":1,"nonce":1,"hash":"014b388f2238bc1fed58845c735bfa092a8b99debc4b97bbf219a333ffc13f99"},{"index":6,"previousHash":"014b388f2238bc1fed58845c735bfa092a8b99debc4b97bbf219a333ffc13f99","data":{"entidadeRemetente":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"entidadeDestinatario":{"id":3,"nome":"Alexandre","tipo":"Farmácia","endereco":"506 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"alexandre@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":"2018-12-11T00:48:23.714Z"},"timestamp":"2018-12-11T00:48:23.714Z","difficulty":1,"nonce":17,"hash":"0e3645953e951c9876d94e9c8695c269e12f7b615a3f7b1748103b00c523a3a6"}],"index":7,"difficulty":1}}