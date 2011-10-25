/*
 * ex_api1.js
 * This module requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.rpc
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
    Module.require("NB.rpc", 0.1);
    //    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}
NB.SERVERNAME = "http://nb.csail.mit.edu:8080";

function fillPageNumber(p){
    var i=p.files[542].numpages;
$("#numpages542").text(i);
for (var j=0; j<i; j++){
    $("#my_images").append("<img src='"+NB.SERVERNAME+"/pdf/cache2/72/20/542?page="+(j+1)+"'/>");

}
        
}

$(document).ready(function(){
	// $("#my_images").append("<img src='"+NB.SERVERNAME+"/pdf/cache2/72/20/542?page=2'/>");
	NB.nbcall("getObjects", {types: ["files"], payload: {id: 542}}, fillPageNumber)
    });

NB.nbcall = function(fctname, dict, callback, nowait){
    if (!(nowait)){
	document.body.style.cursor="wait";
    }
    if (!("identity" in NB)){
	NB.identity = prompt("Please enter your invite key...");
    }
    NB.rpc.rpc_json(NB.SERVERNAME+"/pdf3/rpc?invite_key=" + NB.identity, fctname,[dict],NB.rpc.__callback, {"cb": callback});
};
