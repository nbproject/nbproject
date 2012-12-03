/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.pdf
 *		jquery
 *
 *
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.mvc", 0.1);
    Module.require("NB.pdf", 0.1);
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
	var payload={};
	payload.ensembles = [{'admin': 1, 'id': 33, 'name': 'c1'}, {'admin': 1, 'id': 32, 'name': 'My Files'}];
	payload.sources = [{'numpages': 20, 'title': 'ln3-1.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id': 146, 'id_source': 146},{'numpages': 10, 'title': 'lecture4.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id_source': 148, 'id': 148} ];
	NB.pers.fillEnsembles(payload);
    });

NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");

    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0], "NB.pers.openPDF");
    NB.pers.view2 = new NB.pdf.ensembleSelectView($("#SEL")[0]);

    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    NB.pers.ensembles.register( NB.pers.view2 );

    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");
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
    var id;
    var items = NB.pers.ensembles.getItems();
    for (id in items){ //hack to get "1st" item id
	break;
    }
    payload.ensembles = [{"id": id}];
    $("#DEBUG").append("deleting ensemble "+id+"\n");
    NB.pers.ensembles.modify("delete", payload, "ensembles");
};


NB.pers.sampleEnsembleUpdate = function(){
    var payload = {};
    var id;
    var items = NB.pers.ensembles.getItems();
    for (id in items){ //hack to get "1st" item id
	break;
    }
    payload.ensembles = [{"id": id, "name":"new name !!!", "admin":1}];
    $("#DEBUG").append("update ensemble "+id+"\n");
    NB.pers.ensembles.modify("update", payload, "ensembles");
};

NB.pers.openPDF = function(elt){
    if (elt.hasAttribute("id_source")){
	NB.debug("opening PDF given by " + elt);
    }
}


