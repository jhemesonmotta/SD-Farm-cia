(function () {
    var destId = "n50q1axegj000000";

    var peer = null; // own peer object
    var peerId = null;
    var conn = null;
    var oppositePeer = { // Opposite peer object
        peerId: null
    };

    var msg = null;
    var command = null;
    var status = document.getElementById("status");
    var message = document.getElementById("message");
    var sendMessageBox = document.getElementById("sendMessageBox");
    var sendButton = document.getElementById("sendButton");

    // get first "GET style" parameter from href
    // would have been easier to just use location.hash
    function getUrlParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return null;
        else
            return results[1];
    };

    function ready() {
        // Receive data (only messages)
        conn.on('data', function (data) {
            addMessage("<span class=\"peerMsg\">Peer enviou:</span> " + data);
        });

        // Handle close or error
        conn.on('close', function () {
            status.innerHTML = "Connection closed";
        });
        peer.on('disconnected', function () {
            alert("Connection has been lost.");
            peer.reconnect();
        });
        peer.on('error', function (err) {
            alert('' + err)
        });

        // Check URL for comamnds that should be sent right away
        command = getUrlParam("command");
        if (command)
            conn.send(command);

        // Send message
        sendButton.onclick = function () {
            msg = sendMessageBox.value;
            sendMessageBox.value = "";
            conn.send(msg);
            console.log("Sent: " + msg)
            addMessage("<span class=\"selfMsg\">Self: </span> " + msg);
        };
    };

    function initialize() {
        // Create own peer object with connection to shared PeerJS server
        peer = new Peer(null, {
            debug: 2
        });

        peer.on('open', function (id) {
            peerId = id;
            console.log('ID: ' + id);
        });
        peer.on('error', function (err) {
            if (err.type === 'unavailable-id') {
                alert('' + err);
                peer.reconnect();
            }
            else
                alert('' + err);
        });
    };

    function join() {
        initialize();
        peer.on('open', function () {

            if (conn) {
                conn.close();
            }

            if (peer) {
                peer.destroy();
            }

            // Create connection to shared PeerJS server
            conn = peer.connect(destId, {
                reliable: true
            });
            conn.on('open', function () {
                oppositePeer.peerId = destId;
                status.innerHTML = "Connected to: " + destId;
                console.log("Connected to: " + destId)
                ready();
            });
        });
    };

    function addMessage(msg) {
        var now = new Date();
        var h = now.getHours();
        var m = addZero(now.getMinutes());
        var s = addZero(now.getSeconds());

        if (h > 12)
            h -= 12;
        else if (h === 0)
            h = 12;

        function addZero(t) {
            if (t < 10)
                t = "0" + t;
            return t;
        };

        message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
    };

    if (conn) {
        ready();
    }
    else {
        join();
    }

    document.getElementById("connect-button").onload = function() {
        join();
    };
})();