/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.pdf
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
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.ensembles = null;
NB.pers.sources = null;
NB.pers.view1 = null;
NB.pers.logger = null;
NB.pers.popupView= null;
NB.pers.logView= null;
$(document).ready(function(){
	//if email and password provided by server (example. when we just accepted an invite), set them as cookies for auto-login
	//so that we're authenticated for subsequent function calls
	if ($("#user_settings").attr("email") != ""){
	    NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	    NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
	}

	NB.pers.call("getEnsembles",{},NB.pers.fillEnsembles);
    });


NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");
    NB.pers.logger = new NB.logging.logger();
    NB.pers.popupView= new NB.logging.popupView($("#POPUPVIEW")[0]);
    NB.pers.logView=  new NB.logging.logView($("#LOGVIEW")[0]);
    NB.pers.logger.register(NB.pers.popupView );
    NB.pers.logger.register(NB.pers.logView );



    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0], "NB.pers.openPDF");

    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );

    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");


};

NB.pers.openPDF = function(elt){
    var payload, id;
    if (elt.hasAttribute("id_source")){
	NB.debug("opening PDF given by " + elt);
	id = elt.getAttribute("id_source");
	payload = NB.pers.sources.get(id);
	var fDone = function() {
	    window.exhibit = Exhibit.create();
	    window.exhibit.configureFromDOM();
	};
	window.database = Exhibit.Database.create();
	window.database._loadLinks( [ "/?a=DATA_ADMIN&id_source="+id+"&id_ensemble="+payload.id_ensemble ],   fDone   );
    }
};



NB.pers.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};


NB.pers.edit = function(event){
    var div = event.currentTarget;
    var id2 = div.getAttribute("id2");
    //hide comment and add textarea
    $(div).hide();
    var editdiv = $("<div class=\"inline-editor\"> <div class=\"titlebar\"><div class=\"button\" id2=\""+id2+"\" title=\"Cancel\" onclick=\"NB.pers.cancelEdit(event)\"><img src=\"/data/icons/png/window-close.png\"/></div><div class=\"button\"  id2=\""+id2+"\" title=\"Save\" onclick=\"NB.pers.saveEdit(event)\"><img src=\"/data/icons/png/save_24.png\"/></div></div><br/><textarea id2=\""+id2+"\" rows=\"10\" cols=\"100\" class=\"editarea\">"+$(div).text()+"</textarea></div>");
    div.parentNode.appendChild(editdiv[0]);
    var textarea = $("textarea[id2="+id2+"]")[0];
    textarea.focus();
    textarea.select();
    
};

NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location ="http://"+document.location.hostname;
};

NB.pers.cancelEdit = function(event){
    var button = event.currentTarget;
    $(".notecomment[id2="+button.getAttribute("id2")+"]").show();
    $(button.parentNode.parentNode).remove();
};


NB.pers.saveEdit = function(event){
    var button = event.currentTarget;
    var id = button.getAttribute("id2");
    var body =  $(button.parentNode.parentNode).find("textarea").val();
    $(".notecomment[id2="+id+"]").text(body).show();
    $(button.parentNode.parentNode).remove();
    NB.pers.call("saveAdminComment",{"id": id, "body": body},NB.pers.onSaved);

};

NB.pers.onSaved = function(payload){
    NB.pers.logger.info("Comment added successfully!");

};

NB.pers.on_preselect = function(payload){
    NB.pers.logger.info("Preselection Saved: "+payload.value+" for note "+payload.id);

};


NB.pers.on_publish = function(payload){
    NB.pers.logger.info("Published Saved: "+payload.value+" for note "+payload.id);

};


NB.pers.publish = function(id){

};


facetData = {};
facetData["author-facet"]  = {"expression": ".Author", "facetLabel": "Author"};

function makeFacet(div) {
    div.className = "";    
    var facet = Exhibit.UI.createFacet(facetData[div.id], div, window.exhibit.getUIContext());
    window.exhibit.setComponent(div.id, facet);    
    div.firstChild.onclick = function() { unmakeFacet(div); }
    div.onclick = null;
};

function unmakeFacet(div) {
 var facet = window.exhibit.getComponent(div.id);
 if (facet.hasRestrictions() && !window.confirm("You have something selected in this facet. OK to clear your selection?")) {
 return;
 }

 window.exhibit.disposeComponent(div.id);

  div.innerHTML = facetData[div.id].facetLabel;
 div.className = "collapsed-facet";
 div.onclick = function() { makeFacet(div); };
}

function togglePreselected(img) {
    var itemid = img.getAttribute("itemid");
    var ps = window.database.getObject(itemid, "ps");
    if (ps == "yes") {
	window.database.addStatement(itemid, "ps", "no");
	window.database.removeStatement(itemid, "ps", "yes");
	img.src = "/data/icons/png/gray-star.png";
	NB.pers.call("set_admin_attr", {"id": itemid, "name": "preselected", "value": 0}, NB.pers.on_preselect);
    } 
    else {
	window.database.addStatement(itemid, "ps", "yes");
	window.database.removeStatement(itemid, "ps", "no");
	img.src = "/data/icons/png/yellow-star.png";
	NB.pers.call("set_admin_attr", {"id": itemid, "name": "preselected", "value": 1}, NB.pers.on_preselect);

    }
}


function togglePublished(img) {
    var itemid = img.getAttribute("itemid");
    var ps = window.database.getObject(itemid, "ps");
    if (ps == "yes") {
	window.database.addStatement(itemid, "ps", "no");
	window.database.removeStatement(itemid, "ps", "yes");
	img.src = "/data/icons/png/gray-star.png";
	NB.pers.call("set_admin_attr", {"id": itemid, "name": "type", "value": 2}, NB.pers.on_publish);
    } 
    else {
	window.database.addStatement(itemid, "ps", "yes");
	window.database.removeStatement(itemid, "ps", "no");
	img.src = "/data/icons/png/yellow-star.png";
	NB.pers.call("set_admin_attr", {"id": itemid, "name": "type", "value": 3}, NB.pers.on_publish);

    }
}



