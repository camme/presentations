var zmq = require('zmq');
var zonar = require('zonar');
var elks = require('sms-46elks');

// configs
var port = 6010;
var address = "tcp://31.192.227.45:" + port;

// zmq socket
var socket = zmq.socket('pub');

// sms endpoint
var smsServer = elks.create('/46elks/sms', 8787);

// zonar setup
var broadcaster = zonar.create({ net: 'foocafe', name: 'sms', payload: { port: port } });

// begin
smsServer.init(function() {

    socket.bind(address, function(err) {

        if (err) throw err;

        console.log("SMS publishing service started");

        broadcaster.start(function() {
            console.log("Broadcasting SMS service");
        });

        smsServer.on('incoming', function(sms) {
            console.log('SMS Service got "%s" from %s', sms.message, sms.from);
            socket.send('all ' + JSON.stringify(sms));
        });

    });

});


// greacefully quit
process.on('SIGINT', function() {
    console.log("");
    broadcaster.stop(function() {
        console.log("Zonar has stoped");
        socket.close(function() { });
        process.exit(0);
    });
});

