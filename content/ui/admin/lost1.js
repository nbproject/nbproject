/*
 * lost.js
 * This module defines the namespace NB.lost
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.rpc
 *		jquery
 *
 *
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.createNamespace("NB.lost", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

$(document).ready(function(){
	//	NB.lost.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){$.concierge.addConstants(p.value)});
    });

NB.lost.onLostButton = function(){    
    var cb = function(p){
    var payload = p.payload;
	$(".email").text(payload.email);

    if (p.status.errno){
    	$(".error-msg").show();
    }
    else{
	    $("#form1").hide();
	    $("#success").show();
	}
    };
    $.post("/pdf4/rpc", {"f": "passwordLost", "cid":0, "a": JSON.stringify({email: $("#email")[0].value})}, cb, "json");
};

