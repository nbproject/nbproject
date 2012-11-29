/*
 * template.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.pers
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
    Module.require("NB.conf", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}
$(document).ready(function(){
	NB.pers.params = NB.dom.getParams();
	var identity = NB.auth.get_cookie("invite_key");
	if (identity != null){
	    NB.conf.identity = identity;
	}
	let payload_objects = {types: ["ensembles", "folders", "files"]};
	if ("id_ensemble" in NB.pers.params){
	    payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
	}
	NB.pers.call("getObjects",payload_objects, NB.pers.on_getStore);
	$("#pers1").perspective();
	$("#viewport1, #viewport2").viewport({perspective: "#pers1", maxAppendTo:"#pers1", dock_visible: false, select: function(panel){
		    let id = panel.firstChild.id;
		    if(id in $.concierge.views){
			$.concierge.views[panel.firstChild.id].select();
		    }
		}}).bind("close_view", function(evt, id){
			if (id in $.concierge.views){
			    $.concierge.views[id].close();
			}
		    });
	//put views update here, before updateing perspective. 
	$("#pers1").perspective("update");
    });

NB.pers.on_getStore = function(payload){
    //newest store  paradigm:
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload, {
	    ensemble:	{pFieldName: "ensembles"}, 
		file:	{pFieldName: "files", references: {id_ensemble: "ensemble"}}, 
		folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}});
    $("#sampletree").jstree({
	    "plugins" : [ "themes", "json_data" ],
		"json_data" : {
		"data" : [
			  { 
			      "data" : "A node", 
				  "children" : [ "Child 1", "Child 2" ]
				  },
			  { 
			      "attr" : { "id" : "li.node.id" }, 
				  "data" : { 
				      "title" : "Long format demo", 
					  "attr" : { "href" : "#" } 
				  } 
			  }
			  ]
		    },
		"plugins" : [ "themes", "json_data" ]
		    });
};

NB.pers.call = function(fctname, dict, callback, nowait){
    if (!(nowait)){
	document.body.style.cursor="wait";
    }
    if (NB.conf.identity == ""){
	NB.conf.identity = prompt("Please enter your invite key...");
    }
    NB.rpc.rpc_json(NB.conf.servers.rpc+"/pdf3/rpc?invite_key=" + NB.conf.identity, fctname,[dict],NB.rpc.__callback, {"cb": callback});
};
