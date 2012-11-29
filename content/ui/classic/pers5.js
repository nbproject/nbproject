/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.rpc
 *		jquery
 *
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.rpc", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.ensembles = null;
NB.pers.sources = null;
NB.pers.view1 = null;
NB.pers.view2 = null;



$(document).ready(function(){
	NB.debug("in ready() !");
	//if email and password provided by server, set them as cookies for auto-login
	//so that we're authenticated for subsequent function calls
	if ($("#user_settings").attr("email") != ""){
	    NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	    NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
	}
	NB.pers.call("getEnsembles",{},NB.pers.fillEnsembles);
    });

NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");

    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0]);
    NB.pers.view2 = new NB.pdf.ensembleSelectView($("#SEL")[0]);

    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    NB.pers.ensembles.register( NB.pers.view2 );

    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");

    /*
    // add sample ensemble: pnup
    payload.action = "add"; 
    payload.ensemble = [{"admin": 1, "id": 585, "name": "pnup"}];
    NB.debug("refreshing models");
    NB.pers.ensembles.modify(payload, "ensembles");
    NB.pers.sources.modify(payload, "sources");
    */


};

NB.pers.sampleEnsembleAdd = function(){
    var payload = {};
    var id = (new Date).getTime();
    payload.ensembles = [{"admin": 1, "id": id, "name":id }];
    $("#DEBUG").append("adding ensemble "+id+"\n");
    NB.pers.ensembles.modify("add", payload, "ensembles");
};


NB.pers.sampleEnsembleDelete = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[0].id;
    payload.ensembles = [{"id": id}];
    $("#DEBUG").append("deleting ensemble "+id+"\n");
    NB.pers.ensembles.modify("delete", payload, "ensembles");
};


NB.pers.sampleEnsembleUpdate = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[1].id;
    payload.ensembles = [{"id": id, "name":"new name !!!", "admin":1}];
    $("#DEBUG").append("update ensemble "+id+"\n");
    NB.pers.ensembles.modify("update", payload, "ensembles");
};





NB.pers.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};
