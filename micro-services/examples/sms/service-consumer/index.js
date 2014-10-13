var zonar = require('zonar');                                                                   
var zmq = require('zmq');                                                                       
                                                                                                
var smsSocket = zmq.socket('sub');                                                              
var listener = zonar.create({ net: 'foocafe', name: 'sms-consumer' });                   
                                                                                                
listener.listen(function(err) {                                                                 
                                                                                                
    if (err) throw err;
                                                                                                
    console.log("Started listening");                                                           
                                                                                                
    listener.on('found.sms', function(service) {

        console.log("sms service found : ", service);                                           
                                                                                                
        smsSocket.connect("tcp://" + service.address + ":" + service.payload.port);              
        smsSocket.subscribe('all');                                                             
                                                                                                
        smsSocket.on('message', function(message) {                                             
            var dataString = message.toString().replace('all ', '');                            
            var data = JSON.parse(dataString);                                                  
	    console.log("got data", data);

	});
    });

});

process.on('SINGINT', function() {
listener.stop(function() {                                                                 
	smsSocket.close();
	process.exit();
});
});
