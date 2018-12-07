var hash = require('object-hash');
var store = require('store');

const Entidade = require('../classes/entidade');
const Medicamento = require('../classes/medicamento');

var usuarios = []
var user1 = new Entidade(1, "Jhemeson", "Fabricante", "1503 S, Palmas-TO", "+55 63 98100-0000","jhemesonmotta@gmail.com", "12345678");
var user2 = new Entidade(2, "Ian", "Distribuidor", "103 N, Palmas-TO", "+55 63 98100-0000","ian@gmail.com", "12345678");
var user3 = new Entidade(3, "Alexandre", "Farmácia", "506 S, Palmas-TO", "+55 63 98100-0000","alexandre@gmail.com", "12345678");
var user4 = new Entidade(4, "Kennedy", "Farmácia", "1004 S, Palmas-TO", "+55 63 98100-0000","altmaisefequatro@gmail.com", "12345678");
usuarios = [user1,user2,user3,user4];

var userLoggedIn

var remedios = []

function getUsers(){
    return usuarios;
}

    module.exports.getUserByCredentials = function(email, senha, callback) {
        getUsers().map(function(item) {
            if(item.email == email && item.senha == senha){
                userLoggedIn = item;
            }
        });

        console.log(userLoggedIn)
        
        callback(userLoggedIn);
    }

    module.exports.criarRemedio = function(nome, origem, local, via, callback) {
        userLoggedIn = store.get('userLoggedIn');
        remedios = store.get('listaRemedios');

        var remedio = new Medicamento("hash", nome, origem, local, via, userLoggedIn);

        remedio.id = hash(remedio);

        if(remedios == null || remedios == undefined){
            remedios = [remedio]
        }
        else{
            remedios = remedios.push(remedio);
        }

        callback(remedios);
    }

    module.exports.getUserList = function(callback) {
        callback(getUsers());
    }