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

app.get('/', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    response.render('pages/index', {usuario: usuarioLogado});
  }
});

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

app.get('/listar-remedios', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    response.render('pages/listar');
  }
});

app.get('/precedencia', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');
  response.render('pages/precedencia');
});

app.get('/enviar-remedios', function (request, response) {
  var usuarioLogado = store.get('userLoggedIn');

  if(usuarioLogado == null){
    response.render('pages/login');
  }
  else{
    response.render('pages/enviar');
  }
});

app.get('/inicializa-p2p', function (request, response) {
    response.render('pages/forneceid');
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

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});