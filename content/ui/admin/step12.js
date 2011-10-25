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
    NB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){$.concierge.addConstants(p.value)});
    $.mods.declare({
	    docview: {
		js: ["/content/modules/dev/ui.docView7.js", 	"/content/modules/dev/ui.editor4.js", "/content/modules/dev/ui.drawable2.js"],
		    css: [ "/content/modules/dev/ui.docView5.css" , "/content/modules/dev/ui.editor4.css", "/content/modules/dev/ui.drawable.css" ]
		    }, 
		notepaneview: {js: ["/content/modules/dev/ui.notepaneView7.js"],css: [] }, 
		threadview: {js: ["/content/modules/dev/ui.threadview1.js"],css: [] },
	});
    var $pers1 = $("#pers1");
    //we force to be in a viewport to avoid the problem of recalculating the height, taking tab height into consideration
    var $vp = $pers1.wrap("<div class='viewport'/>").parent().viewport();
    $pers1.perspective({
	    width: function(){return $vp.viewport("getClientSize").width;}, 
		height: function(){return $vp.viewport("getClientSize").height;} 

	});

    //put views update here, before updating perspective. 
    $("#view-1").sampleView();
    $pers1.perspective("update");
    
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
		    var pers_id		= $vp.viewport("newView", "tab_"+id,NB.pers.store.o.file[id].title, {show: function(){$.concierge.trigger({type: "file", value:  id});}});
		    var clientWidth	= $vp.viewport("getClientSize").width; 
		    var $pers		= $("#"+pers_id);
		    var thumbnails	=  {priority: 2, min_width: 150, desired_width: 15};
		    var docview		=  {priority: 1, min_width: 950, desired_width: 50, 
					    content: function($div){
			    $div.docView({img_server: NB.conf.servers.img, invite_key: NB.conf.identity});
			    $div.docView("set_model",NB.pers.store );
			}
		    };
		    var notesview	=  {priority: 1, min_width: 650, desired_width: 35, min_height: 1000, desired_height: 50, 
					    content: function($div){
			    $.mods.ready("notepaneview", function(){
				    $div.notepaneView();
				    $div.notepaneView("set_model",NB.pers.store );
				});
			}
		    }; 
		    var threadview	= {priority: 1, min_width: 650, desired_width: 35,  min_height: 1000, desired_height: 50, 
					   content: function($div){
			    $.mods.ready("threadview", function(){
				    $div.threadview();
				    $div.threadview("set_model",NB.pers.store );			    
				});
			}
		    };
		    $pers.perspective({
			    width: function(){return $vp.viewport("getClientSize").width;}, 
				height: function(){return $vp.viewport("getClientSize").height;}, 
				listens: {
				close_view: function(evt){
				    if (evt.value == this.l.element[0].id){
					delete($.concierge.features.doc_viewer[id]);
				    }
				    $.D("closeview: ", evt, this.l.element[0].id);
				}

			    }, 
				views: {
				    v1:{data:thumbnails},
				    v2:{children: {
					v1:{ data: docview }, 
					v2:{children: {
						v1:{ data: notesview}, 
						    v2:{ data: threadview} ,  orientation: "horizontal"
					    }
						}, orientation: "vertical"}}, 
				    orientation: "vertical"}
			});
		    $vp.viewport("smoothSelect", $pers.attr("id")+"-outer");
		});
	});
    
    //get data: 
    var payload_objects = {types: ["ensembles", "folders", "files"]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.createStore);
    $.concierge.allowRepeatedEvents(["note_hover", "note_out", "sel_click", "note_click"]);
    $.concierge.setConstants({res: 288, scale: 25});
    $.concierge.addComponents({
	    notes_loader: function(payload, cb){NB.pers.call("getNotes", payload, cb);}, 
		note_creator: function(payload, cb){NB.pers.call("saveNote", payload, cb);},
		note_editor: function(payload, cb){NB.pers.call("editNote", payload, cb);},	 	    
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
		mark: {}, 
		draft: {}
	});
    
    $("#obs-1").noteObserver();
    $("#obs-1").noteObserver('set_model', NB.pers.store);
};


