var express = require("express");
var mongo = require('mongodb');
var BSON = require('mongodb').BSONPure;
var Db = require('mongodb').Db;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/household';

//TO RELOAD ON UPDATE: supervisor server.js

var app = express();
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
});


//mongo server
//var server = new mongo.Server(mongoUri);

//Server config object
//var server = new mongo.Server(host, port, {auto_reconnect:true});

/*
db = mongo.db("localhost:27017?auto_reconnect=true",
  database: "testing"
  safe: true
)
*/


app.use(express.static(__dirname));

app.get('/hello', function(request, response) {
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('mydocs', function(er, collection){
			collection.insert({"mykey":"test" + Math.random()}, function(er, rs){
				response.send(rs);
			});
		});
	});
});

app.get('/post', function(req, resp){
	resp.send({'name': 'hello'});
});

app.post('/family/make', function(req, resp){
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('families', function(er, collection){
			collection.insert(req.body, function(er, rs){
				db.close();
				resp.send(rs[0]);
			});
		});
	});
});

app.get('/family/:id', function(req, resp){
	var famid = req.params.id;
	console.log("--getFamily--:" + famid);
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('families', function(er, collection){

			console.log("famId: " + famid);
			var o_id = new BSON.ObjectID(famid);
			collection.findOne({'_id':o_id}, function(err, item) {
				db.close();
				resp.send(item);
			});
		});
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);

});
