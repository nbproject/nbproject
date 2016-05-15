var DEMO={}; // one global object not to pollute namespace

$(document).ready(function(){
    $("#pers1").perspective();
    $("#viewport1, #viewport2, #viewport3").viewport({maxAppendTo:"#pers1", dock_visible: false} );
    /*
    $("#view-9").fileLister({transitions:{current_file: "thumbnails"}});
    $("#view-10").thumbnailView();
    $("#pers1").perspective("update");
    /*
	/* 
	 * ask server to populate your model here using your favorite rpc framework
	 */
	//  foo.rpc("getObjects",{types: [ "ensembles", "files"]},DEMO.on_getStore);
	// for this demo, we fake the server's response and make the callback ourself: 
	//payload = 




    });


};
