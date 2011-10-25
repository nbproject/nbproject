/*
 * fullpers.js
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
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.conf", 0.1);
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.init = function(){
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
    //put views update here, before updating perspective. 
    $("#pers1").perspective("update");
};

NB.pers.on_getStore = function(payload){
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload, {
	    ensemble:	{pFieldName: "ensembles"}, 
		file:	{pFieldName: "files", references: {id_ensemble: "ensemble"}}, 
		folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}});
};
