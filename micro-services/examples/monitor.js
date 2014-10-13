// This service monitors all other services

var zonar = require('zonar');
var clc = require('cli-color');

var z = zonar.create({ net : 'foocafe', name: 'monitor'});

var list = {};
z.listen(function(){

    z.on('found', function(service) {
        list[service.name] = service;
        render(list);
    });

    z.on('dropped', function(service) {
        delete list[service.name];
        render(list);
    });

});

function render(list) {

    console.log(clc.reset);
    process.stdout.write(clc.moveTo(0, 0));

    var counter = 0;
    for(var s in list) {
        console.log("%s. %s", ++counter, s);
    }

    if (counter == 0) {
        console.log("No services found");
    }
    console.log("");

}

render(list);

// Greacefully quit
process.on('SIGINT', function() {
    z.stop(function() {
        process.exit( );
    });
})
