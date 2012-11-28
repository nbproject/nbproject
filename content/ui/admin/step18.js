/*
 * step18.js: Collage Views
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
    if ("q" in NB.pers.params){
	NB.pers.query = NB.pers.params.q;
    }
    else{
	NB.pers.query = "auth";
    }
    NB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){
	    $.concierge.addConstants(p.value);
	});
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView9.js",  "/content/modules/dev/ui.drawable4.js"],
		    css: [ "/content/modules/dev/ui.docView5.css" , "/content/modules/dev/ui.drawable.css" ]
		    }, 
		notepaneview: {js: ["/content/modules/dev/ui.notepaneView9.js"],css: ["/content/modules/dev/ui.notepaneView6.css"] }, 
		threadview: {js: ["/content/modules/dev/ui.threadview2.js"],css: [] },
		editorview: {js: ["/content/modules/dev/ui.editorview2.js"],css: [] },

		});
    
    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory("collection", "collection_viewer", function(id){
	    var pers_id		= "pers_"+id;
	    var $vp		= $("<div class='dummy-viewport'><div class='ui-widget-header' style='height:24px;' /></div>").prependTo("body");
	    var $pers		= $("<div id='"+pers_id+"'/>").appendTo($vp);
	    var docview		=  {priority: 1, min_width: 650, desired_width: 35, 
				    content: function($div){
		    $.mods.ready("docview", function(){
			    $div.docView({img_server: NB.conf.servers.img});
			    $div.docView("set_model",NB.pers.store );
			});
		}
	    };
	    var notesview	=  {priority: 1, min_width: 950, desired_width: 50, min_height: 1000, desired_height: 50, 
				    content: function($div){
		    $.mods.ready("notepaneview", function(){
			    $div.notepaneView();
			    $div.notepaneView("set_model",NB.pers.store );
			});
		}
	    }; 
	    var threadview	= {priority: 1, min_width: 950, desired_width: 50,  min_height: 1000, desired_height: 50, 
				   content: function($div){
		    $.mods.ready("threadview", function(){
			    $div.threadview();
			    $div.threadview("set_model",NB.pers.store );			    
			});
		}
	    };
	    var editorview	=  {priority: 1, min_width: 950, desired_width: 50,  min_height: 1000, desired_height: 50, transcient: true,  
				    content: function($div){
		    $.mods.ready("editorview", function(){
			    /* TODO: this needs to be done at comment creation time since we can have notes spanning several ensembles */
			    /*
			      var m = NB.pers.store;
			      var ensemble = m.o.ensemble[m.o.file[id].id_ensemble];				    
			      $div.editorview({allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous});
			    */
			    //temporary fix: restrict all
			    $div.editorview({allowStaffOnly: false, allowAnonymous: false});
			    $div.editorview("set_model",NB.pers.store );			    
			});
		}
	    };
	    $pers.perspective({
		    height: function(){return $vp.height() - $pers.offset().top;}, 
			listens: {
			page_peek: function(evt){
			    //need to add 1 value for uniqueness
			    var location = NB.pers.store.o.location[NB.pers.collection.items[Number(evt.value)-1]];		    
			    $.concierge.logHistory("page", location.page+"|"+location.id_source+"|"+(new Date()).getTime());
			}, 
			    close_view: function(evt){
			    if (evt.value == this.l.element[0].id){
				delete($.concierge.features.doc_viewer[id]);
			    }
			    $.L("closeview: ", evt, this.l.element[0].id);
			} 	
		    }, 
			views: {
			v1:{ data: docview }, 
			    v2:{children: {
				v1:{ data: notesview}, 
				    v2:{children: {v1: { data: threadview}, v2: {data: editorview}, orientation: "horizontal"}},  orientation: "horizontal"
																      }
			}, orientation: "vertical"}
		});
	});
    
    //get data: 
    var P2 =  {query: NB.pers.query};
    if ("id_ensemble" in NB.pers.params){
	P2["id_ensemble"] = NB.pers.params.id_ensemble;
    }
    if ("id_source" in NB.pers.params){
	P2["id_source"] = NB.pers.params.id_source;
    }
    if ("id_author" in NB.pers.params){
	P2["id_author"] = NB.pers.params.id_author;
    }
    if ("unread" in NB.pers.params){
	P2["unread"] = NB.pers.params.unread;
    }
    NB.pers.call("getMyNotes", P2,  NB.pers.createStore );
    $.concierge.addConstants({res: 288, scale: 25});

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
		get_sequence:		function(P, cb){return NB.pers.sequence;},
		get_collection:		function(P, cb){return NB.pers.collection;},
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
		comment:{pFieldName: "comments", references: {id_location: "location"}},
		location:{pFieldName: "locations",references: {id_ensemble: "ensemble", id_source: "file"}}, 
		link: {pFieldName: "links"}, 
		mark: {}, 
		draft: {},
		seen:{pFieldName: "seen", references: {id_location: "location"}}
	});
    NB.pers.sequence = payload.sequence;
    //generate collection: 
    var ids_location = [];
    var ids_location_idx = {};

    var items = NB.pers.sequence.data;
    var m = NB.pers.store;
    var c, l, id_comment, id_location;
    for (var i in items){
	id_comment = items[i];
	id_location = m.o.comment[id_comment].ID_location;
	if (!(id_location in ids_location_idx)){
	    ids_location.push(id_location);
	    ids_location_idx[id_location]=ids_location.length-1;
	}
    }
    NB.pers.collection = {type: "location", sequence: NB.pers.sequence, items: ids_location, index: ids_location_idx};
    $.concierge.setHistoryHelper(function(payload, cb){NB.pers.call("log_history", payload, cb);}, 120000);
    $.concierge.trigger({type:"collection", value: 1});
    document.title = $.E(NB.pers.sequence.description);
    //now check if need to move to a given annotation: 
    if ("c" in NB.pers.params){
	var id =  NB.pers.params.c;
	var c = m.get("comment", {ID: NB.pers.params.c}).items[id];
	$.concierge.trigger({type: "select_thread", value: c.ID_location});
    }
};


