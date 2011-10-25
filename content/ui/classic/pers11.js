/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.logging
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
    Module.require("NB.mvc", 0.1);
    Module.require("NB.logging", 0.1);
    Module.require("NB.pdf", 0.1);
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
NB.pers.explorer = null;

//NB.pers.view2 = null;

$(document).ready(function(){
	NB.pers.makeWinlets();
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
    
    NB.pers.explorer = $("<div id='TC2'/>");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0], "NB.pers.openPDF");
    //NB.pers.view1 = new NB.pdf.sourceTreeView(NB.pers.explorer[0], "NB.pers.openPDF");
    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");
    NB.pers.docs = new NB.pdf.Docs();
    NB.pers.docs.setLogger(NB.pers.logger);
    NB.pers.docs.set_annotation_getter(function(msg, cb){
	    NB.pers.call("getAnnotations_pdf", msg, cb);
	});
    NB.pers.docs.set_annotation_setter(function(msg, cb){
	    if ("__action__" in msg) {
		if (msg.__action__ == "delete"){
		    NB.pers.call("delete_annotation", msg, cb);
		}
		else if (msg.__action__ == "highlight"){
		    msg.mark=1;
		    NB.pers.call("mark_annotation", msg, cb);
		}
		else if (msg.__action__ == "hide"){
		    msg.mark=-1;
		    NB.pers.call("mark_annotation", msg, cb);
		}
		else if (msg.__action__ == "unmark"){
		    msg.mark=0;
		    NB.pers.call("mark_annotation", msg, cb);
		}
		else{
		    NB.debug("[NB.pers.docs.set_annotation_setter] unknown action: "+msg.__action__);
		}
	    }
	    else{
		NB.pers.call("new_annotation2", msg, cb);
	    }
	});
    NB.pers.docs.set_comment_getter(function(msg, cb){
	    NB.pers.call("getComments", msg, cb);
	});
    NB.pers.docs.set_comment_setter(function(msg, cb){
	    NB.pers.call("newComment", msg, cb);
	});
    NB.pers.viewer = new NB.pdf.Viewer($("#PDF-Viewer")[0]);    
    NB.pers.viewer.set_sidetab($("#Global-Comments")[0]);
    NB.pers.viewer.set_notepane($("#Notepane")[0]);
    NB.pers.viewer.set_filters($("#Filters")[0]);
    NB.pers.homepage = new NB.homepage.Homepage({
	f_call: NB.pers.call, 
		    logger: NB.pers.logger}); 
    //    NB.pers.homepage.setExplorer(NB.pers.view1);
    NB.pers.viewer.set_homepage(NB.pers.homepage);
    NB.pers.docs.register(NB.pers.viewer);
    //now look at URL to see if we should open tabs by default: 
    var s = document.location.search;
    if (s != ""){	
	s = s.substring(1);
	var params = {};
	var a = s.split("&");
	var i, a1,id_source, p;
	for (i in a){
	    a1 = a[i].split("=");
	    params[a1[0]] = a1[1];
	}
	//	console.debug("args: ", params);
	if ("id_source" in params){
	    id_source = params["id_source"];
	    if (id_source in NB.pers.docs.items){
		NB.debug(id_source + "already open");
	    }
	    else{
		p = NB.pers.sources.get(id_source);
		if (("page" in params) &&  (params["page"] < p.numpages)){
		    p.page = params["page"];
		}
		if ("id_ann" in params){
		    p.id_ann = params["id_ann"];
		}
		NB.pers.docs.modify("open", p);
	    }
	}
    }

};
NB.pers.sampleEnsembleAdd = function(){
    var payload = {};
    var id = (new Date()).getTime();
    payload.ensembles = [{"admin": 1, "id": id, "name":id }];
    $("#DEBUG").append("adding ensemble "+id+"\n");
    NB.pers.ensembles.modify("add", payload, "ensembles");
};
NB.pers.sampleEnsembleDelete = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[0].id;
    payload.ensembles = [{"id": id}];
    $("#DEBUG").append("deleting ensemble "+id+"\n");
    NB.pers.ensembles.modify("delete", payload, "ensembles");
};
NB.pers.sampleEnsembleUpdate = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[1].id;
    payload.ensembles = [{"id": id, "name":"new name !!!", "admin":1}];
    $("#DEBUG").append("update ensemble "+id+"\n");
    NB.pers.ensembles.modify("update", payload, "ensembles");
};
NB.pers.openPDF = function(elt){
    var payload, id;
    if (elt.hasAttribute("id_source")){
	NB.debug("opening PDF given by " + elt);
	id = elt.getAttribute("id_source");
	payload = NB.pers.sources.get(id);
	NB.pers.docs.modify("open", payload);
    }
};
NB.pers.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};
NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location ="http://"+document.location.hostname;
};
NB.pers.__WINLETS_OPTS = {
    "handle": "div.winlet-tb", 
    "stack": {group: "div.winlet-ct", min: 10},
    "start": function(event, ui){
	$(event.currentTarget).find("div.winlet-tb").css("cursor", "-moz-grabbing");
    },
    "stop": function(event, ui){
     $(event.currentTarget).find("div.winlet-tb").css("cursor", "-moz-grab");
    }
};
/*
NB.pers.__WINLETS = {
    "Explorer": {"css": {"top": 0, "z-index": 12, "left": 0}}, 
    "PDF-Viewer": {"css": {"top": 0, "left": 0, "right":0, "bottom":0},
	       "fullscreen": true}, 
    "Global-Comments": {"css": {"width": "100%", "bottom": 0, "z-index": 3, "left": 0}, "minimized": true}, 
    "Notepane": {"css": {"min-width": "200px", "min-height": "300px", "top": "150px", "z-index": 3, "left": "700px"},  "minimized": true, "resizeable": true}, 
 "Filters": {"css": {"min-width": "200px", "min-height": "300px", "top": "150px", "z-index": 3, "left": "200px"},  "minimized": true, "resizeable": true}, 


};
*/

NB.pers.__WINLETS = {
    "Explorer": {"css": {"top": "0px", "height": "100%","max-width": "150px",  "z-index": 15, "left": 0}}, 
  "PDF-Viewer": {"css": {"z-index": 10, "top": 0, "left": 0, "right":0, "bottom":0, "margin-left": "153px", "margin-right": "213px"},
	       "fullscreen": true}, 
    "Global-Comments": {"css": {"min-width": "80%", "top": "70%", "min-height":"30%" , "z-index": 12, "left": 0}, "minimized": true}, 
    "Notepane": {"css": {"width":"210px",  "min-height": "350px", "top": "71px", "z-index": 14, "right": 0},  "minimized": false, "resizeable": true}, 
    "Filters": {"css": {"width": "210px", "top": 0, "z-index": 11, "right": 0},  "minimized": false, "resizeable": true}, 
};


NB.pers.max_z_index = function($elts){
    var m = 0;
    $elts.each(function(){
	    var z = Number(this.style.zIndex);
	    if ( (!(isNaN(z))) && (z>m)){
		m=z;
	    }
	});
    return m;
};

NB.pers.makeWinlets = function(){
    var i,id, $ct, $tb, $prt, p, n, $tk_btn;
    var $mp = $("#main-panel");
    var WINLETS = NB.pers.__WINLETS;
    var mp_id = $mp.attr("id");
    var $wmp = $("<div class=\"winlet-mp\"/>");
    var $wtkb = $("<div class=\"winlet-tkb\"/>");
    var f_click = function(event){
	//don't bring to front if fullscreen
	if ($(event.currentTarget).find(">div.winlet-protection").is(".winlet-fullscreen")){
	    return;
	}
	var $winlets =  $mp.find("div.winlet-ct");
	event.currentTarget.style.zIndex = NB.pers.max_z_index($winlets)+1;
    };
    var f_toggle = function(event){
	//PRE: event.currentTarget has the right id_item attribute
	var id_item = event.currentTarget.getAttribute("id_item");
	var tkbtn = $("#"+mp_id+" div.winlet-tkbtn[id_item="+id_item+"]");
	var id_item = tkbtn.attr("id_item");
	var $winlets =  $mp.find("div.winlet-ct");
	var winlet = $winlets.filter("[id_item="+id_item+"]");
	var isVisible = winlet.is(':visible'); 
	if (isVisible){
	    winlet.effect("transfer", {to: tkbtn}, 200).hide();
	    tkbtn.effect("pulsate",{times: 3}, 200);
	}
	else{
	    winlet.show()[0].style.zIndex = NB.pers.max_z_index($winlets)+1;
	    //if winlet is out of bounds, bring it back !
	    var offset = winlet.offset();
	    if ((offset.top < 0)||(offset.top>$wmp.height()-10)){
		winlet.css("top", 0);
	    }
	    if ((offset.left < 0)||(offset.left>$wmp.width()-10)){
		winlet.css("left", 0);
	    }
	    tkbtn.effect("transfer",{to: winlet} , 200);
	}
		tkbtn.toggleClass("winlet-collapsed");
    };
    for (i in WINLETS){
	n = $("#"+i);
	if (n.length){
	    id = n.attr("id");
	    $tb = $("<div class=\"winlet-tb\" id_item=\""+id+"\"><span>"+id+"</span><div class=\"winlet-btns\"><div action=\"minimize\" id_item=\""+id+"\" class=\"winlet-btn\" title=\"Minimize this winlet down to the taskbar\"><div class=\"winlet-icon\" action=\"minimize\"/></div></div></div>");
	    $tb.find("div.winlet-btn[action=minimize]").click(f_toggle);
	    $tk_btn = $("<div class=\"winlet-tkbtn\"  id_item=\""+id+"\">"+id+"</div>").click(f_toggle);
	    $ct = $("<div class=\"winlet-ct\"  id_item=\""+id+"\"  />").click(f_click);
	    $prt = $("<div class=\"winlet-protection\"/>");
	    $mp[0].removeChild(n[0]);
	    $wmp.append($ct.append($tb).append($prt.append(n)));
	    $wtkb.append($tk_btn);
	    WINLETS[i].css.position = "absolute";
	    $ct.draggable(NB.pers.__WINLETS_OPTS).css( WINLETS[i].css);
	    if (("fullscreen" in  WINLETS[i]) && (WINLETS[i].fullscreen)){
		$ct.css({"top":0, "left":0, "bottom":0, "right":0}).find(">div.winlet-tb").hide();
		$ct.find(">div.winlet-protection").toggleClass("winlet-fullscreen");
	    }
	    if (("minimized" in  WINLETS[i]) && (WINLETS[i].minimized)){
		$ct.attr("minimized", true);
	    }
	}
    }
    $mp.append($wmp).append($wtkb).find("div.winlet-ct[minimized=true]").each(function(){
	f_toggle({"currentTarget": this});
    });
};
