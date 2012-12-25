/*
 * step17.js: 
 * Requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.pers
 *		jquery
 *
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
(function(GLOB){
    if (NB$){
	var $ = NB$;
    }

GLOB.pers.init = function(){
    //GLOB.pers.admin=true;
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView8.js",  "/content/modules/dev/ui.drawable4.js"],
		    css: [ "/content/modules/dev/ui.docView5.css" , "/content/modules/dev/ui.drawable.css" ]
		    }, 
		notepaneview: {js: ["/content/modules/dev/ui.notepaneView8.js"],css: ["/content/modules/dev/ui.notepaneView6.css"] }, 
		threadview: {js: ["/content/modules/dev/ui.threadview2.js"],css: [] },
		editorview: {js: ["/content/modules/dev/ui.editorview2.js"],css: [] },
		treeview: {js: ["/content/modules/dev/ui.treeview6.js"],css: [] },
		filesview:  {js: ["/content/modules/dev/ui.filesview3.js","/content/modules/calendrical/jquery.calendrical.js" ],css: ["/content/modules/calendrical/calendrical.css"] },
	});
    
    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory("admin_init", "admin_viewer", function(id){
		    var pers_id		= "pers_"+id;
		    var $vp		= $("<div class='dummy-viewport'><div class='ui-widget-header' style='height:24px;' /></div>").prependTo("body");
		    var $pers		= $("<div id='"+pers_id+"'/>").appendTo($vp);
		    var treeview	=  {priority: 1, min_width: 100, desired_width: 20, 
					    content: function($div){
			    $.mods.ready("treeview", function(){
			    $div.treeView({admin:GLOB.pers.admin});
			    $div.treeView("set_model",GLOB.pers.store );
				});
			}
		    };
		    var filesview	=  {priority: 1, min_width: 700, desired_width: 80, 
					    content: function($div){
			    $.mods.ready("filesview", function(){
				    $div.filesView({img_server: GLOB.conf.servers.img,  admin: GLOB.pers.admin});
				    $div.filesView("set_model",GLOB.pers.store );
				});
			}
		    }; 
		    $pers.perspective({
			    height: function(){return $vp.height() - $pers.offset().top;}, 
				listens: {
				close_view: function(evt){
				    if (evt.value == this.l.element[0].id){
					delete($.concierge.features.doc_viewer[id]);
				    }
				    $.L("closeview: ", evt, this.l.element[0].id);
				}, 
				    successful_login: function(evt){
				    GLOB.auth.set_cookie("ckey", evt.value);
				    document.location ="http://"+document.location.host+document.location.pathname;
				    $.I("Welcome !");
				},
				    ensemble: function(evt){
				    $.L("loading stats for ensemble"+evt.value);
				    $.concierge.get_component("get_file_stats")({"id_ensemble": evt.value}, function(P2){
					    GLOB.pers.store.add("file_stats", P2["file_stats"]);
					    $.L("stats loaded !");
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
    if ("id_ensemble" in GLOB.pers.params){
	payload_objects["payload"]= {id_ensemble: GLOB.pers.params.id_ensemble};
    }
    GLOB.pers.call("getObjects",payload_objects, GLOB.pers.createStore);
    $.concierge.addComponents({
	    add_file_menu:		function(P, cb){GLOB.files.addFile(P.id_ensemble, P.id_folder);},
		source_id_getter:	function(P, cb){GLOB.pers.call("request_source_id", P, cb);}, 
		add_folder_menu:	function(P, cb){GLOB.files.addFolder(P.id_ensemble, P.id_folder);}, 
		add_folder:		function(P, cb){GLOB.pers.call("add_folder", P, cb)}, 		
		rename_file_menu:	function(P, cb){GLOB.files.rename_file(P.id);},
		rename_file:		function(P, cb){GLOB.pers.call("rename_file", P, cb)},
		delete_file_menu:	function(P, cb){GLOB.files.delete_file(P.id)},
		delete_file:		function(P, cb){GLOB.pers.call("delete_file", P, cb)},
		move_file_menu:		function(P, cb){GLOB.files.move_file(P.id);},
		move_file:		function(P, cb){GLOB.pers.call("move_file", P, cb);},
		update_file_menu:	function(P, cb){GLOB.files.update_file(P.id)},		
		add_ensemble_menu:	function(P, cb){GLOB.files.addEnsemble();}, 
		add_ensemble:		function(P, cb){GLOB.pers.call("add_ensemble", P, cb)}, 	
		invite_users_menu:	function(P, cb){GLOB.files.inviteUsers(P.id_ensemble);}, 
		invite_users:		function(P, cb){GLOB.pers.call("sendInvites", P, cb)},
		assignment_file_menu:	function(P, cb){GLOB.files.edit_assignment(P.id)},
		edit_assignment:	function(P, cb){GLOB.pers.call("edit_assignment", P, cb)},

	});
    
    $.concierge.addComponents({
	    notes_loader:	function(P, cb){GLOB.pers.call("getNotes", P, cb);}, 
		note_creator:	function(P, cb){GLOB.pers.call("saveNote", P, cb);},
		note_editor:	function(P, cb){GLOB.pers.call("editNote", P, cb);},
		});   
};


    
GLOB.pers.createStore = function(payload){
    GLOB.pers.store = new GLOB.models.Store();
    GLOB.pers.store.create(payload, {
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
	    seen:{references: {id_location: "location"}}
	});
    $.concierge.setHistoryHelper(function(payload, cb){GLOB.pers.call("log_history", payload, cb);}, 120000);
    GLOB.files.set_model(GLOB.pers.store);
    $.concierge.trigger({type:"admin_init", value: 0});
    //get more stats (pending stuff)
    GLOB.pers.call("getPending", {}, function(P){
	    GLOB.pers.store.add("question", P["questions"]);
	    GLOB.pers.store.add("comment", P["comments"]);	
	});
};
})(NB);

