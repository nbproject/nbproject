var express = require("express");
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017';


var app = express();
app.use(express.logger());

//mongo server
//var server = new mongo.Server(mongoUri);

app.use(express.static(__dirname));

app.get('/hello', function(request, response) {
	response.send('Hello World!');
});

app.get('/post', function(req, resp){
	resp.send({'name': 'hello'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);

});
