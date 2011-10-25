/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.logging
 *		NB.pdf
 *		jquery
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 *
 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.mvc", 0.1);
    Module.require("NB.logging", 0.1);
    Module.require("NB.pdf", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.ensembles = null;
NB.pers.sources = null;
NB.pers.view1 = null;
NB.pers.logger = null;
NB.pers.popupView= null;
NB.pers.logView= null;

//NB.pers.view2 = null;

$(document).ready(function(){
	//if email and password provided by server (example. when we just accepted an invite), set them as cookies for auto-login
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
    NB.pers.logger = new NB.logging.logger();
    NB.pers.popupView= new NB.logging.popupView($("#POPUPVIEW")[0]);
    NB.pers.logView=  new NB.logging.logView($("#LOGVIEW")[0]);
    NB.pers.logger.register(NB.pers.popupView );
    NB.pers.logger.register(NB.pers.logView );
    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0], "NB.pers.openPDF");
    //    NB.pers.view2 = new NB.pdf.ensembleSelectView($("#SEL")[0]);

    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    //    NB.pers.ensembles.register( NB.pers.view2 );

    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");

    NB.pers.docs = new NB.pdf.Docs();
    NB.pers.docs.setLogger(NB.pers.logger);


    NB.pers.docs.set_annotation_getter(function(msg, cb){
	    NB.pers.call("getAnnotations_pdf", msg, cb);
	});
    NB.pers.docs.set_annotation_setter(function(msg, cb){
	    if ("__action__" in msg) {
		if (msg.__action__ == "delete"){
		    NB.pers.call("delete_annotation", msg, cb);
		    //	    delete(msg.__action__);
		}
		else{
		    NB.debug("[NB.pers.docs.set_annotation_setter] unknown action: "+msg.__action__);
		}
	    }
	    else{
		NB.pers.call("new_annotation2", msg, cb);
	    }
	});
    NB.pers.docs.set_comment_getter(function(msg, cb){
	    NB.pers.call("getComments", msg, cb);
	});

    NB.pers.docs.set_comment_setter(function(msg, cb){
	    NB.pers.call("newComment", msg, cb);
	});
    NB.pers.viewer = new NB.pdf.Viewer($("#Viewer")[0]);    
    NB.pers.viewer.set_sidetab($("#Sidetab")[0]);
    NB.pers.docs.register(NB.pers.viewer);

    //now look at URL to see if we should open tabs by default: 
    var s = document.location.search;
    if (s !== ""){	
	s = s.substring(1);
	var params = {};
	var a = s.split("&");
	var i, a1,id_source, p;
	for (i in a){
	    a1 = a[i].split("=");
	    params[a1[0]] = a1[1];
	}
	//	console.debug("args: ", params);
	if ("id_source" in params){
	    id_source = params["id_source"];
	    if (id_source in NB.pers.docs.items){
		NB.debug(id_source + "already open");
	    }
	    else{
		p = NB.pers.sources.get(id_source);
		if (("page" in params) &&  (params["page"] < p.numpages)){
		    p.page = params["page"];
		}
		if ("id_ann" in params){
		    p.id_ann = params["id_ann"];
		}
		NB.pers.docs.modify("open", p);
	    }
	}
    }

};

NB.pers.sampleEnsembleAdd = function(){
    var payload = {};
    var id = (new Date()).getTime();
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

NB.pers.openPDF = function(elt){
    var payload, id;
    if (elt.hasAttribute("id_source")){
	NB.debug("opening PDF given by " + elt);
	id = elt.getAttribute("id_source");
	payload = NB.pers.sources.get(id);
	NB.pers.docs.modify("open", payload);
    }
};




NB.pers.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};

NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location ="http://"+document.location.hostname;
};
