var express = require("express");
var mongo = require('mongodb');
var BSON = require('mongodb').BSONPure;
var Db = require('mongodb').Db;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/household';

console.log("URI: " + mongoUri);
//TO RELOAD ON UPDATE: supervisor server.js

var app = express();
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
});

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

app.post('/login', function(req, resp) {
	console.log("--login--:" + req.body);
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('families', function(er, collection){
			collection.findOne(req.body, function(err, item) {
				db.close();
				resp.send(item);
			});
		});
	});
});

app.get('/families', function(req, resp){
	console.log("--getFamilies--:");
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('families', function(er, collection){
			collection.find().toArray(function(err, items){
				resp.send(items);
			});
		});
	});
});

app.get('/familyinfo/:id', function(req, resp){
	var famid = req.params.id;
	var returnObj = {};
	console.log("--getFamilyInfo--:" + famid);
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		//--Find Family--
		db.collection('families', function(er, collection){
			var o_id = new BSON.ObjectID(famid);
			collection.findOne({'_id':o_id}, function(err, item) {
				returnObj["family"] = item;
				//--Get Tasks--
				db.collection('tasks', function(er, taskCollection){
					taskCollection.find({'familyId':famid}).toArray(function(err, taskItems) {
						returnObj["tasks"] = taskItems;
						resp.send(returnObj);
					});
				});

				//--Get Members
				db.collection('members', function(er, taskCollection){
					taskCollection.find({'familyId':famid}).toArray(function(err, taskItems) {
						returnObj["members"] = taskItems;
						resp.send(returnObj);
					});
				});
			});
		});
	});
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

/*
------------ Members --------------
*/

app.post('/member/make', function(req, resp){
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('members', function(er, collection){
			collection.insert(req.body, function(er, rs){
				db.close();
				resp.send(rs[0]);
			});
		});
	});
});

app.get('/member/:id', function(req, resp){
	var id = req.params.id;
	console.log("--getMember--:" + id);
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('members', function(er, collection){
			console.log("memberId: " + id);
			var o_id = new BSON.ObjectID(id);
			collection.findOne({'_id':o_id}, function(err, item) {
				db.close();
				resp.send(item);
			});
		});
	});
});


/*
------------ Tasks ----------------
*/

app.post('/task/make', function(req, resp){
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('tasks', function(er, collection){
			collection.insert(req.body, function(er, rs){
				db.close();
				resp.send(rs[0]);
			});
		});
	});
});

app.get('/task/:id', function(req, resp){
	var id = req.params.id;
	console.log("--getTask--:" + id);
	Db.connect(mongoUri+"?safe=true",  function(err, db){
		db.collection('tasks', function(er, collection){
			console.log("taskId: " + id);
			var o_id = new BSON.ObjectID(id);
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
