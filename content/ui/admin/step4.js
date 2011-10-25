/*
 * minimal.js: A minimal example of NB framework
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
    Module.require("NB.conf", 0.1);
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.init = function(){
    $("#pers1").perspective();
    //put views update here, before updating perspective. 
    $("#view-1").sampleView();
    $("#pers1").perspective("update");

    let getOrCreateViewport = function(){
	let $vp = $("div.viewport");
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
	    let $vp = getOrCreateViewport();
	    let pers_id =  $vp.viewport("newView", "tab_"+id, "my title");
	    let $pers = $("#"+pers_id).append("<div id='view1_"+id+"' style='min-width: 250px;'/> <div class='separator' orientation='vertical'/><div id='view2_"+id+"'>garblu</div>");

	    //have to bring to front so we can size appropratelty: 
	    // the alternative would be to have a post-trigger mechanism
	    $vp.viewport("select", $pers.parent()[0].id);

	    $pers.perspective();
	    // in practice, use NB.pers.store.o.file[id].title for the title
	    $("#view1_"+id).sampleView();
	    $pers.perspective("update");
	});
    
};

    