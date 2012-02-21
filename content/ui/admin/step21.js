/*
 * step21.js: 
 * Requires the following modules:
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
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.init = function(){
    //NB.pers.admin=true;
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView8.js",  "/content/modules/dev/ui.drawable4.js"],
		    css: [ "/content/modules/dev/ui.docView5.css" , "/content/modules/dev/ui.drawable.css" ]
		    }, 
		treeview: {js: ["/content/modules/dev/ui.treeview7.js"],css: [] },
		filesview:  {js: ["/content/modules/dev/ui.filesview4.js","/content/modules/calendrical/jquery.calendrical.js" ],css: ["/content/modules/calendrical/calendrical.css"] },
	});
    
    //Extra menus: 
    if (!(NB.conf.userinfo.guest)){
	$("#menu_settings").after("<li><a href='javascript:$.concierge.get_component(\"add_ensemble_menu\")()'>Create a new class.</a></li>");
    }

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory("admin_init", "admin_viewer", function(id){
		    var pers_id		= "pers_"+id;
		    var $vp		= $("<div class='dummy-viewport'><div class='ui-widget-header' style='height:24px;' /></div>").prependTo("body");
		    var $pers		= $("<div id='"+pers_id+"'/>").appendTo($vp);
		    var treeview	=  {priority: 1, min_width: 200, desired_width: 25, 
					    content: function($div){
			    $.mods.ready("treeview", function(){
			    $div.treeView({admin:NB.pers.admin});
			    $div.treeView("set_model",NB.pers.store );
				});
			}
		    };
		    var filesview	=  {priority: 1, min_width: 1000, desired_width: 85, 
					    content: function($div){
			    $.mods.ready("filesview", function(){
				    $div.filesView({img_server: NB.conf.servers.img,  admin: NB.pers.admin});
				    $div.filesView("set_model",NB.pers.store );
				});
			}
		    }; 
		    $pers.perspective({
			    height: function(){return $vp.height() - $pers.offset().top;}, 
				listens: {
				rate_reply: function(evt){
				    $.concierge.get_component("rate_reply")(evt.value, function(P){
					    NB.pers.store.add("replyrating", P["replyrating"]);
					    $.I("Thanks for your feedback !")});
				}, 
				close_view: function(evt){
				    if (evt.value == this.l.element[0].id){
					delete($.concierge.features.doc_viewer[id]);
				    }
				    $.D("closeview: ", evt, this.l.element[0].id);
				}, 
				    ensemble: function(evt){
				    $.D("loading stats for ensemble"+evt.value);
				    $.concierge.get_component("get_file_stats")({"id_ensemble": evt.value}, function(P2){
					    NB.pers.store.add("file_stats", P2["file_stats"]);
					    $.D("stats loaded !");
					});
				}
			    }, 
				views: {
					v1:{ data: treeview }, 
				    v2:{ data: filesview }, orientation: "vertical"}
			});
	});
    
    //get data: 
    var payload_objects = {types: ["ensembles", "folders", "files"]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.createStore);
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
		invite_users_menu:	function(P, cb){NB.files.inviteUsers(P.id_ensemble);}, 
		invite_users:		function(P, cb){NB.pers.call("sendInvites", P, cb)},
		assignment_file_menu:	function(P, cb){NB.files.edit_assignment(P.id)},
		edit_assignment:	function(P, cb){NB.pers.call("edit_assignment", P, cb)},

	});
    
    $.concierge.addComponents({
	    notes_loader:	function(P, cb){NB.pers.call("getNotes", P, cb);}, 
		note_creator:	function(P, cb){NB.pers.call("saveNote", P, cb);},
		note_editor:	function(P, cb){NB.pers.call("editNote", P, cb);},
		});   
};


    
NB.pers.createStore = function(payload){
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload, {
	    ensemble:	{pFieldName: "ensembles"}, 
		file:	{pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}}, 
		folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}, 
		comment:{references: {id_location: "location"}},
		location:{references: {id_ensemble: "ensemble", id_source: "file"}}, 
		link: {pFieldName: "links"}, 
		file_stats:{references: {id: "file"}},
		mark: {}, 
		draft: {},
		question: {references: {location_id: "location"}},
		seen:{references: {id_location: "location"}}, 
		basecomment:{references: {id_location: "location"}},
		replyrating:{references: {comment_id: "comment"}},
	});
    var cb2 = function(P2){
	var m = NB.pers.store;
	m.set("location", P2["locations"]);
	m.set("comment", P2["comments"]); 
	m.set("basecomment", P2["basecomments"]);
	m.set("question", P2["questions"]);
    }
    $.concierge.setHistoryHelper(function(_payload, cb){
	    _payload["__return"] = {type:"newPending", a:{}};
	    NB.pers.call("log_history", _payload, cb);
	}, 120000, cb2, 600000);
    NB.files.set_model(NB.pers.store);
    $.concierge.trigger({type:"admin_init", value: 0});
  //get more stats (pending stuff)
    NB.pers.call("getPending", {}, function(P){
	    NB.pers.store.add("location", P["locations"]);
	    NB.pers.store.add("comment", P["comments"]); 
       	    NB.pers.store.add("basecomment", P["basecomments"]); 
	    NB.pers.store.add("question", P["questions"]);
	});

};


