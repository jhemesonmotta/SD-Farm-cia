var peer = new Peer({key: 'lwjd5qra8257b9'}); // essa key é a gratuita da PeerServer cloud API key... nela, os dados q utilizarmos serão compartilhados
console.log(peer);

$(function() {
    var objAsString = localStorage.getItem("myPeerId1");
    var objJson = JSON.parse(objAsString);
    if(objJson == null || objJson == undefined){
        objJson = {ponto : peer};

        var seen = [];

        objAsString = JSON.stringify(objJson, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        });

        localStorage.setItem("myPeerId1", objAsString);
    }
    else{
        peer = objJson.ponto; 
    }
  });

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

// Start connection
var pontoQueEstouConectado = peer.connect('dest-peer-id'); 
    // o peerJs não fornece nenhum método para sabermos um peer id... tem q ser passado a mão... descobrir como fazer
        // ideia: quando vai enviar algo ou minerar, pede pro cara fornecer o peer-id de outro pc (se enviar, peer id do destino)...
                  // mostra o meu peer-id sempre no rodapé... nesse caso, o peer id seria como uma "chave publica" para realizar o envio
        // aí coloca esse connect dentro de um método acionado quando faz isso

    // entra aqui quando o ponto q estou conectado me mandar algo
    pontoQueEstouConectado.on('data', function(data) {
        console.log('Received', data);
        // pega os dados recebidos e guarda no localStorage
      });


//Receive connection
peer.on('connection', function(pontoQueMeConectou) {

    var objAsString = localStorage.getItem("listaPontosConhecidos");
    var objJson = JSON.parse(objAsString);

    // guardar em localStorage o novo peer-id conhecido
    
        if(objJson == null || objJson == undefined){
            objJson = {listaPontosConhecidos : [pontoQueMeConectou.peer]};
                // de acordo com a documentação, .peer trará uma string com o id do outro ponto da conexão
        }
        else{
            objJson = objJson.listaPontosConhecidos.push(pontoQueMeConectou.peer);
        }
        
        objAsString = JSON.stringify(objJson);
        localStorage.setItem("listaPontosConhecidos", objAsString);

    // disparar um objeto com todas as conexões conhecidas...    //ao implementarmos o blockchain, este será um atributo desde objeto
        pontoQueMeConectou.send(objJson);
});




