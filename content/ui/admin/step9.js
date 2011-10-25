/*
 * step9.js: 
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
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView5.js", 	"/content/modules/dev/ui.editor4.js", "/content/modules/dev/ui.drawable.js"],
		css: [ "/content/modules/dev/ui.docView5.css" , "/content/modules/dev/ui.editor4.css", "/content/modules/dev/ui.drawable.css" ]
	    }, 
	    notepaneview: {js: ["/content/modules/dev/ui.notepaneView6.js"],css: [] }
	});
    $("#pers1").perspective();

    //put views update here, before updating perspective. 
    $("#view-1").sampleView();
    $("#pers1").perspective("update");
    
    var getOrCreateViewport = function(){
	var $vp = $("div.viewport");
	// is a viewport already there ? 
	if ($vp.length==0){
	    //no, so we must have only one perspective: Embed it in a viewport now
	    $vp = $("div.perspective").wrap("<div class='viewport'/>").parent().viewport();
	}
	if ($vp.length != 1){
	    alert("Assertion failed: There should be 1 viewport but there are "+$vp.length);
	}
	return $vp;
    };
    
    
    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory("file", "doc_viewer", function(id){
	    
	    $.mods.ready("docview", function(){
		    var $vp		= getOrCreateViewport();
		    var pers_id		= $vp.viewport("newView", "tab_"+id,NB.pers.store.o.file[id].title);
		    var clientWidth	= $vp.viewport("getClientSize").width; 
		    var $pers		= $("#"+pers_id);
		    var thumbnails	=  {priority: 2, min: 150, desired: 300};
		    var docview		=  {priority: 1, min: 950, desired: 1000, 
					    content: function($div){
			    $div.docView({img_server: NB.conf.servers.img, invite_key: NB.conf.identity});
			    $div.docView("set_model",NB.pers.store );
			}
		    };
		    var notesview	=  {priority: 1, min: 650, desired: 800, 
					    content: function($div){
			    $.mods.ready("notepaneview", function(){
				    $div.notepaneView();
				    $div.notepaneView("set_model",NB.pers.store );
				});
			}
		    }; 
		    $pers.perspective({
			    width: function(){return $vp.viewport("getClientSize").width;}, 
				views: {
				v1:{data:thumbnails},
				    v2:{children: {v1:{ data: docview }, v2:{ data: notesview}}, orientation: "vertical"}, 
				    orientation: "vertical"}
			});
		    
		});
	});
    
    //get data: 
    NB.pers.params = NB.dom.getParams();
    var identity = NB.auth.get_cookie("invite_key");
    if (identity != null){
	NB.conf.identity = identity;
    }
    var payload_objects = {types: ["ensembles", "folders", "files"]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.createStore);
 
    
    $.concierge.setHierarchy({file: {visibility: true, page: 1, zoom: 1.05, scale: 25}});
    $.concierge.allowRepeatedEvents(["note_hover", "note_out", "sel_click", "note_click"]);
    $.concierge.setConstants({res: 288, scale: 25});
    $.concierge.addComponents({
	    notes_loader: function(payload, cb){NB.pers.call("getNotes", payload, cb);}, 
		note_creator: function(payload, cb){NB.pers.call("saveNote", payload, cb);},
		note_editor: function(payload, cb){NB.pers.call("editNote", payload, cb);},	 	    
		});   
    NB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){$.concierge.addConstants(p.value)});
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
		mark: {}
	});
    
    $("#obs-1").noteObserver();
    $("#obs-1").noteObserver('set_model', NB.pers.store);
};




var test_insert = function(){
    var new_id = 10999;
var s = NB.pers.store;
s.get("file", {id_folder: 2})
var f = s.o.file[517];
var f2 = $.extend( {}, f);
f2.id_folder=2;
s.add("file", {10999: f2});
    var success = new_id in s.file && new_id in s.indexes.folder.file[2];
    return success;
};



var test_update = function(){
var s = NB.pers.store;
s.get("file", {id_folder: 2})
var f = s.o.file[517];
var f2 = $.extend( {}, f);
f2.id_folder=2;
s.add("file", {517: f2});
//return stg that's true if success and false if not
};

var test_delete = function(){
    var s = NB.pers.store;
    s.get("file", {id_folder: 2})
    s.remove("file", 517)
    //return success;
};

