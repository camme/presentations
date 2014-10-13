// This service monitors all other services

var zonar = require('zonar');
var clc = require('cli-color');

var options = { net : 'foocafe', name: 'foo-service', payload: { data: 'hello' } };
var z = zonar.create(options);

z.start(function(){ 
    console.log("Broadcasting %s", options.name);
});

// Greacefully quit
process.on('SIGINT', function() {
    z.stop(function() {
        process.exit( );
    });
})
