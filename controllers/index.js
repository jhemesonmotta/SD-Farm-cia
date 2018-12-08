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
        remediosAux = store.get("listaRemedios");

        if(remediosAux != null && remediosAux != undefined && remediosAux != []){
            remedios = remediosAux;
        }
        var remedio = new Medicamento("hash", nome, origem, local, via, userLoggedIn);

        remedio.id = hash(remedio);

        if(remedios == null || remedios == undefined){
            remedios = [remedio]
        }
        else{
            remedios.push(remedio);
        }
        var objRetorno = {
            remedios    :   remedios,
            remedio     :   remedio
        };

        callback(objRetorno);
    }

    module.exports.getUserList = function(callback) {
        callback(getUsers());
    }

// {"listaRemedios":[{"id":"ab7d65d3437fa88a47763f8386a07d625238f9ac","nome":"xxxxxx","origem":"Vegetal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},{"id":"27c01c4f1e312747e18ef3c40676d6b0d6ccecc3","nome":"rapaz","origem":"Natural","localAcao":"Local","viaAdministracao":"Enteral","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}}],"blockchain":{"blocks":[{"index":0,"previousHash":null,"data":"Genesis block","timestamp":"2018-12-08T03:22:20.238Z","difficulty":1,"nonce":41,"hash":"093d761aa1d3ce597e3ff96f14ebedd375c0990693ef4d109def2334a5fe05f5"},{"index":1,"previousHash":"093d761aa1d3ce597e3ff96f14ebedd375c0990693ef4d109def2334a5fe05f5","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"67609c45e82d3b00d68198c2a146d3ffe896e521","nome":"asd","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544239365991},"timestamp":"2018-12-08T03:22:45.992Z","difficulty":1,"nonce":45,"hash":"00ced8d886af75031f94bf523b8183b1cf8edb06239382fb64f15cd787873e3f"},{"index":2,"previousHash":"00ced8d886af75031f94bf523b8183b1cf8edb06239382fb64f15cd787873e3f","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"26f22e98edc6c0cac84767278c677d32f252f301","nome":"asdasd","origem":"Animal","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241006346},"timestamp":"2018-12-08T03:50:06.347Z","difficulty":1,"nonce":1,"hash":"02b97f83086dcba7dc051ff76c5aa9115b7e9de4bbd8492707dade6fde8db639"},{"index":3,"previousHash":"02b97f83086dcba7dc051ff76c5aa9115b7e9de4bbd8492707dade6fde8db639","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241275060},"timestamp":"2018-12-08T03:54:35.060Z","difficulty":1,"nonce":20,"hash":"0e0faebf7115a53c7120025ab5fc031c00f8f02aba5d8acb609e91a2dd8dd0e5"},{"index":4,"previousHash":"0e0faebf7115a53c7120025ab5fc031c00f8f02aba5d8acb609e91a2dd8dd0e5","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"27c01c4f1e312747e18ef3c40676d6b0d6ccecc3","nome":"rapaz","origem":"Natural","localAcao":"Local","viaAdministracao":"Enteral","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241381955},"timestamp":"2018-12-08T03:56:21.955Z","difficulty":1,"nonce":25,"hash":"044c9bc116476ef76757fe3f2c4e76ec7e40e51573acbc200c4404ae66075695"},{"index":5,"previousHash":"044c9bc116476ef76757fe3f2c4e76ec7e40e51573acbc200c4404ae66075695","data":{"entidadeRemetente":null,"entidadeDestinatario":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null},"medicamento":{"id":"565048dc4321ca4112cb13e1128b681ac6e4e0b2","nome":"dipiroca","origem":"Natural","localAcao":"Local","viaAdministracao":"Parental","dono":{"id":1,"nome":"Jhemeson","tipo":"Fabricante","endereco":"1503 S, Palmas-TO","telefone":"+55 63 98100-0000","email":"jhemesonmotta@gmail.com","senha":"12345678","peer":null}},"data":1544241854271},"timestamp":"2018-12-08T04:04:14.271Z","difficulty":1,"nonce":1,"hash":"014b388f2238bc1fed58845c735bfa092a8b99debc4b97bbf219a333ffc13f99"}],"index":6,"difficulty":1}}