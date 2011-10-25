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
    Copyright (c) 2010 Massachusetts Institute of Technology.
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
NB.pers.docs = null;

$(document).ready(function(){

    NB.debug("in ready() !");
    //if email and password provided by server, set them as cookies for auto-login
    //so that we're authenticated for subsequent function calls
    if ($("#user_settings").attr("email") != ""){
	NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
    }
    //old way
    NB.pers.call("getEnsembles",{},NB.pers.fillEnsembles);
    
    //Tell View system about events hierarchy: 
    $.concierge.setHierarchy({file: null, page:"file"});

    //new way: 
    NB.pers.call("getObjects",{types: ["ensembles", "folders", "files"]},NB.pers.on_getStore);
    
    $("#pers1").perspective();
    $("#viewport1, #viewport2, #viewport3").viewport({maxAppendTo:"#pers1", dock_visible: false} );
    $("#view-1").view({listens:{openDocument:function(evt){
		    console.debug("[view-1]", evt);
    }}});
    $("#view-3").sourcetree({transitions:{openDocument: "thumbnails"}});
    $("#view-9").fileLister({transitions:{"file": "thumbnails"}});

    //    $("#view-10").view({provides: ["thumbnails"]});
    $("#view-10").thumbnailView();

    $("#pers1").perspective("update");

    $("#demo2").tree({
	    data  : {
		type  : "json",
		    json  : [ 
			     { attributes: { id : "pjson_1" }, state: "open", data: "Root node 1", children : [
													       { attributes: { id : "pjson_2" }, data: { title : "Custom icon", icon : "../media/images/ok.png" } },
													       { attributes: { id : "pjson_3" }, data: "Child node 2" },
													       { attributes: { id : "pjson_4" }, data: "Some other child node" }
													       ]}, 
			     { attributes: { id : "pjson_5" }, data: "Root node 2" } 
			      ]
		    }
	});
    var NEWBRANCH = {attributes: { id : "pjson_10" }, state: "open", data: "Root node 1", children : [
													       { attributes: { id : "pjson_20" }, data: { title : "Custom icon", icon : "../media/images/ok.png" } },
													       { attributes: { id : "pjson_30" }, data: "Child node 2" },
													       { attributes: { id : "pjson_40" }, data: "Some other child node" }
												      ]}; 
    $.tree_reference('demo2').create(NEWBRANCH,$('#pjson_3'));
    });

NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");
    NB.pers.folders = new NB.mvc.collection("folders");

    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0]);
    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    NB.pers.ensembles.register( $("#view-1").view('get_adapter') );
    NB.pers.sources.register( $("#view-1").view('get_adapter')  );
    NB.pers.ensembles.register( $("#view-3").sourcetree('get_adapter') );
    NB.pers.sources.register( $("#view-3").sourcetree('get_adapter')  );
    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");
    NB.pers.folders.modify("create", payload, "folders");
};

NB.pers.on_getStore = function(payload){
    //new docs paradigm:
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload, {ensemble:{fieldName: "ensembles"}, folder: {fieldName: "folders"}, file:{fieldName: "files"}});
    NB.pers.store.addIndex("ensemble", "file", "id_ensemble")
    $("#view-9").fileLister('set_model', NB.pers.store);
    $("#view-10").thumbnailView('set_model', NB.pers.store);

    //    NB.pers.store.register($("#view-9").fileLister('get_adapter'), {ensemble: null, folder:null});

};

NB.pers.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};

