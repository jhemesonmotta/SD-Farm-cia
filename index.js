var express = require('express');
var request = require("request");
var mockController = require('./controllers');
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

// rotas de criar de remédio
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

    console.log(nome);
    console.log(origem);
    console.log(local);
    console.log(via);

    mockController.criarRemedio(nome, origem, local, via, function (data) {
      if(data != null && data != undefined)
      {
        store.set("listaRemedios", data);
        console.log(data);

        // onload dessa página terá um método q enviará a lista de remédios para os pontos conhecidos
        // todos os pontos, ao receberem a lista, atualizam a sua
        response.render('pages/listar', { listaRemedios: data });
      }
    });
});
// fim rotas de criar de remédio

// rotas de listar remédios
app.get('/listar-remedios', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    remedios = store.get('listaRemedios');
    response.render('pages/listar', { listaRemedios: remedios });
  }
});
// fim rotas de listar remédios

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

// rota de inicializar conexão p2p
app.get('/inicializa-p2p', function (request, response) {
    response.render('pages/forneceid');
});
// fim rota de inicializar conexão p2p

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});



// npm install
// npm i peer
// npm install object-hash
