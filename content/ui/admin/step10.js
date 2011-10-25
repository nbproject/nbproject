/*
 * Requires:
 *		Module
 *		NB
 *		NB.auth
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
    //    Module.require("NB.conf", 0.1);
    Module.require("NB.files", 0.1);
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}
NB.pers.init = function(){
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView5.js", 	"/content/modules/dev/ui.editor4.js"],
		css: [ "/content/modules/dev/ui.docView.css" , "/content/modules/dev/ui.editor4.css"]
		}
	});
    $("#pers1").perspective();
 
    NB.pers.params = NB.dom.getParams();
    var identity = NB.auth.get_cookie("invite_key");
    if (identity != null){
	NB.conf.identity = identity;
    }
    //put views update here, before updating perspective. 
    $("#view-1").filesView({img_server: NB.conf.servers.img, invite_key: NB.conf.identity});
    $("#view-2").treeView();
    $("#pers1").perspective("update");
    
   
    //get data
    var payload_objects = {types: ["ensembles", "folders", "files"]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.createStore);
    $.concierge.allowRepeatedEvents(["ensemble", "folder"]);
    /* TODO, if we find a way to streamline
    var cpts = {};
    var actions = ["add_folder", "rename_file", "delete_file", "move_file", "add_enseble"];
    for (var i in actions){
	cpts[actions[i]] = function(P,cb){NB.pers.call(actions[i], P, cb)}
	cpts[actions[i]+"_menu"] = function(P,cb){NB.files[actions[i]], P, cb)}

    }
    */
    $.concierge.addComponents({
	    add_file_menu:		function(P, cb){NB.files.addFile(P.id_ensemble, P.id_folder);},
		source_id_getter:	function(P, cb){NB.pers.call("request_source_id", P, cb);}, 
		add_folder_menu:	function(P, cb){NB.files.addFolder(P.id_ensemble, P.id_folder);}, 
		add_folder:		function(P, cb){NB.pers.call("add_folder", P, cb)}, 		
		rename_file_menu:	function(P, cb){NB.files.rename_file(P.id);},
		rename_file:		function(P, cb){NB.pers.call("rename_file", P, cb)},
		delete_file_menu:	function(P, cb){NB.files.delete_file(P.id)},
		delete_file:		function(P, cb){NB.pers.call("delete_file", P, cb)},
		move_file_menu:		function(P, cb){NB.files.move_file(P.id);},
		move_file:		function(P, cb){NB.pers.call("move_file", P, cb);},
		update_file_menu:	function(P, cb){NB.files.update_file(P.id)},		
		add_ensemble_menu:	function(P, cb){NB.files.addEnsemble();}, 
		add_ensemble:		function(P, cb){NB.pers.call("add_ensemble", P, cb)}, 			
	});
    
};


    
NB.pers.createStore = function(payload){
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload, {
	    ensemble:	{pFieldName: "ensembles"}, 
		file:	{pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}}, 
		folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}});
    NB.files.set_model(NB.pers.store);
    $("#view-2").treeView('set_model', NB.pers.store);
    $("#view-1").filesView('set_model', NB.pers.store);



};
