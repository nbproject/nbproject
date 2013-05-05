var express = require("express");
var app = express();
app.use(express.logger());

app.use(express.static(__dirname));

app.get('/hello', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 8008;
app.listen(port, function() {
  console.log("Listening on " + port);
});


/*
var http = require('http');
var port = process.env.PORT || 5000;
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(port);

console.log('Server running on port ' + port);
*/