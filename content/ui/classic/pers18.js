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
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 *
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
    //    NB.pers.call("getEnsembles",{},NB.pers.fillEnsembles);
    
    //Tell View system about events hierarchy: 
    $.concierge.setHierarchy({
	    file: {page: 1, zoom: 1}, note_hover:{}, note_out: {}, notes_loaded_for_file:{}, note:{},new_notes:{}  });
    $.concierge.setConstants({res: 288, scale: 25});
 
    //    $.concierge.setHierarchy({file: null, page:"file", zoom: "file"}, {page: 1, zoom: 1});

    //new way: 
    NB.pers.call("getObjects",{types: ["ensembles", "folders", "files", "assignments"]},NB.pers.on_getStore);
    NB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){$.concierge.addConstants(p.value)});
    
    //    $("#pers1").perspective({constraints:{viewport3:{"max-width":"200px"}}});
    $("#pers1").perspective();
    $("#viewport1, #viewport2, #viewport3").viewport({perspective: "#pers1", maxAppendTo:"#pers1", dock_visible: false, select: function(panel){
		let id = panel.firstChild.id;
		if(id in $.concierge.views){
		    $.concierge.views[panel.firstChild.id].select();
		}
	    }});
    //    $("#view-9").fileLister({transitions:{current_file: "thumbnails"}});
    $("#view-9").fileLister();//{transitions:{current_file: "thumbnails"}});

    $("#view-92").fileLister2();

    $("#view-10").thumbnailView();
    $("#pers1").perspective("update");
    });

/*
NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");
    NB.pers.folders = new NB.mvc.collection("folders");
    NB.debug("creating views");
    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");
    NB.pers.folders.modify("create", payload, "folders");
};
*/
NB.pers.on_getStore = function(payload){
    //Set up components: 
    $.concierge.addComponents({
	    "notes_loader": function(payload, cb){NB.pers.call("getNotes", payload, cb);}, 
	    "note_creator": function(payload, cb){NB.pers.call("saveNote", payload, cb);},
	    "note_editor": function(payload, cb){NB.pers.call("editNote", payload, cb);}
	});
    
    //new docs paradigm:
    NB.pers.store = new NB.models.Store(true);
    NB.pers.store.create(payload, {
	    ensemble:{fieldName: "ensembles"}, 
		folder: {fieldName: "folders"}, 
		file:{fieldName: "files", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "ensemble", props: {valueType: "item"}}}}, 
		note:{fieldName: "notes", exhibit_properties:{id_source: {type: "file", field: "file", props: {valueType: "item"}}}}, 
		location:{fieldName: "locations", exhibit_properties:{id_source: {type: "file", field: "file", props: {valueType: "item"}}}},
		comment:{fieldName: "comments", exhibit_properties:{ID_location: {type: "location", field: "location", props: {valueType: "item"}}}}, 

		assignment:{fieldName: "assignments", exhibit_properties:{ID_source: {type: "file", field: "file", props: {valueType: "item"}}}}
});
    NB.pers.store.addIndex("ensemble", "file", "ID_ensemble");
    $("#view-9").fileLister('set_model', NB.pers.store);
    $("#view-92").fileLister2('set_model', NB.pers.store);
    $("#view-10").thumbnailView('set_model', NB.pers.store);
    $("#view-4").homepage();
    $("#view-7").notepaneView();
    $("#view-7").notepaneView('set_model', NB.pers.store);
    $("#obs-1").noteObserver();
    $("#obs-1").noteObserver('set_model', NB.pers.store);


    //factories:
    $.concierge.addFactory("collection", "collection_view", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "Collection" );
	    $("#"+view_id).collectionView();
	    $("#"+view_id).collectionView('set_model',NB.pers.store );
	});
    
    $.concierge.addFactory("file", "doc_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, NB.pers.store.o.file[id].title );
	    //	    $("#"+view_id).docViewer(id, NB.pers.store);
	    //trial: 
	    /*
	      $("#"+view_id).thumbnailView();
	      $("#"+view_id).thumbnailView('set_model',NB.pers.store );
	    */
	    $("#"+view_id).docView();
	    $("#"+view_id).docView('set_model',NB.pers.store );

	});
    

    //mess around with exhibit views. 
    //    let db = new Exhibit.Database.create();
    //db.loadItems(o2a(NB.pers.store.o.file, "file"), "localhost");
    //    let ex1 = Exhibit.create(NB.db);
    //    ex1.configure
    NB.pers.ex1 = Exhibit.create(NB.pers.store.db);
    window.exhibit = NB.pers.ex1; // fix to make tabular views work
    //    NB.pers.ex1.configureFromDOM($("#view-5")[0]);
    NB.pers.ex1.configureFromDOM();

    $("#view-5-outer").css({"max-height": "100%", "overflow-y": "auto"});
};

NB.pers.call = function(fctname, dict, callback, nowait){
    if (!(nowait)){
	document.body.style.cursor="wait";
    }
    NB.rpc.rpc_json("pdf2/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};

function o2a(o, type){
    let a=[];
    for (let key in o){
	if (!("label" in o[key])){
	    o[key].label = o[key].id;
	}
	a.push(o[key]);
    }
    return a;
}


NB.pers.on_file = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"file", value: id_item});
}

NB.pers.on_note = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"note", value: id_item});
}

