var express = require('express');
var request = require("request");
var vision = require('./vision');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index')
});

// app.get('/enviar', function (request, response) {
//   response.render('pages/enviar')
// });

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});