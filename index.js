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
    response.render('pages/index');
  }
  
});

app.post('/', function (request, response) {
  console.log("aqui");
  var email = request.body.inputEmail;
  console.log(email);
  
  var senha = request.body.inputPassword;
  console.log(senha);
  console.log(mockController);

  mockController.getUserByCredentials(email, senha, function (data) {
    if(data != null && data != undefined)
    {
      response.render('pages/index', { usuario: data });
    }
  });
});

// app.get('/enviar', function (request, response) {
//   response.render('pages/enviar')
// });

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});