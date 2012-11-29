/*
 * pers1.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.dom
 *		NB.auth
 *		NB.rpc
 *		jquery
 *
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.dom", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.rpc", 0.1);
    Module.require("NB.observer", 0.1);
    Module.createNamespace("NB.pdf", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pdf.saveTimeout = null;
NB.pdf.isDown  = false; 
NB.pdf.X = 0;  //where user just clicked
NB.pdf.Y = 0;
NB.pdf.toolbarSelection1 = null;
NB.pdf.toolbarSelection2 = null;
NB.pdf.viewVisible = null;
NB.pdf.noteIndex=0;
NB.pdf.USER2PX = 150.0/72;
NB.pdf.ExhibitDone = false;
NB.pdf.KEYCODES={
    "PAGEUP":33, 
    "PAGEDOWN":34,
    "UP": 38, 
    "DOWN": 40,
    "LEFT": 37,
    "RIGHT": 39,
    "RETURN": 13
};
    
NB.pdf.onUpload = function(event){
    $("#source_"+event.id_source).removeClass("leaf_processing").attr(
    {
	"className": "leaf", 
	    "page": 1, 
	    "numpages": event.numpages, 
	    "numx": event.numx, 
	    "numy":event.numy, 
	    "id_source":event.id_source, 
	    "onclick": "NB.pdf.treecontroller(event, NB.pdf.selectFile)"
	    }
    ).text(event.title);
    NB.pdf.banner(event.msg);
};


NB.pdf.onEmbeddedReady = function(event){
    NB.pdf.banner("Embbeded ready !");
};

NB.pdf.onlink = function(event){
    var t = $(event.currentTarget);
    if (t.attr("S") == "/URI"){
	window.open(t.attr("body"));	
    }
    else if (t.attr("S") == "/GoTo"){
	var coords = eval(t.attr("body"));
	NB.pdf.goToPage(coords[0]);
	NB.pdf.banner("Go to page " + coords[0]);
    }
    else{
	NB.pdf.banner("unknown link: "+t.attr("S")+": "+t.attr("body"));
    }
};

NB.pdf.onReady = function(event){
    NB.debug("in ready() !");
    //if email and password provided by server, set them as cookies for auto-login
    //so that we're authenticated for subsequent function calls
    if ($("#user_settings").attr("email") != ""){
	NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
    }
    NB.observer.register("/__RESPONDER", {
	"UPLOAD_DONE":NB.pdf.onUpload
	    });

    //cursor option ineffective b/c overrriden outside to moz-grab in a more css-specific way
    $("#doc_div").draggable({
	    "start": function(evt, ui){$(this).css("cursor",  "-moz-grabbing");}, 
		"stop":	 function(evt, ui){$(this).css("cursor",  "-moz-grab");}
	});
    NB.pdf.loadPage();
    // get list of ensembles I belong 
    NB.pdf.call("getEnsembles",{},NB.pdf.fillEnsembles);
    //set up toolbar: 
    $("#notebox, #editbox").hide();
    var INIT_VIEW  = "home";
    NB.pdf.viewVisible = $("#"+INIT_VIEW+"_view");
    NB.pdf.viewVisible.show();
    $("#"+INIT_VIEW+"_toolbar").show();
    
    $(".toolbar_button").attr("onclick", "NB.pdf.onToolbar(event)"); 
    $("#default_settings .simple_button").attr("onclick", "NB.pdf.onDefaultSetting(event)"); 
    $("#current_settings .mini_button").attr("onclick", "NB.pdf.onCurrentSetting(event)"); 
    $("#edit_settings .mini_button").attr("onclick", "NB.pdf.onEditSetting(event)"); 


    NB.pdf.toolbarSelection1 = document.getElementById(INIT_VIEW+"_mode");
    NB.pdf.toolbarSelection1.setAttribute("selected", "1");

    NB.pdf.toolbarSelection2 = document.getElementById("move_mode");
    NB.pdf.toolbarSelection2.setAttribute("selected", "1");

};


NB.pdf.onDefaultSetting = function(event){
    $("#default_settings .simple_button").removeAttr("selected");
    event.currentTarget.setAttribute("selected", "1");
};


NB.pdf.onEditSetting = function(event){
    $("#edit_settings .mini_button").removeAttr("selected");
    event.currentTarget.setAttribute("selected", "1");
    NB.pdf.banner("The note is now " +  event.currentTarget.getAttribute("id_item"));
};




NB.pdf.onCurrentSetting = function(event){
    $("#current_settings .mini_button").removeAttr("selected");
    event.currentTarget.setAttribute("selected", "1");
    NB.pdf.banner("The current note is now " +  event.currentTarget.getAttribute("id_item"));
};



NB.pdf.fillEnsembles = function(payload){
    var a = 0;
    var i=0;
    var s1="";
    var s2="";
    for (i=0;i<payload.ensembles.length;i++){
	a = payload.ensembles[i];
	s1 += "<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"'><span onclick='NB.pdf.selectChannel(event)' class='branchname'>"+a.name+"</span><div class='leaves'/></div>";
	s2+="<option id_ensemble=\""+a.id+"\">"+a.name+"</option>";
    }
    $("#groupslist").html(s1);
    $("#add_file_dialog_select_group").html(s2);

    //Fill those ensembles with file names: 
    //    NB.pdf.call("getFilesNames",{},NB.pdf.fillEnsembles);
    for (i=0;i<payload.sources.length;i++){
	a = payload.sources[i];
	s1 = "<div class='leaf' id='source_" + a.id_source+"' page='1' numpages='"+a.numpages+"' numx='"+a.numx+"' numy='"+a.numy+"' id_source='"+a.id_source+"' onclick='NB.pdf.treecontroller(event, NB.pdf.selectFile)'  >"+a.title+"</div>";
	$("#ensemble_"+a.id_ensemble+">.leaves").append(s1);
    }
};

NB.pdf.treecontroller = function(event, cb){
    
    var t = $(event.currentTarget);
    var root_id = event.currentTarget.parentNode.parentNode.parentNode.id;
    /*
      var old_sel =  $("#"+root_id+" .leaf-selected");
      if (old_sel.length > 0){
      old_sel.removeClass("leaf-selected").addClass("leaf");
      }
    */
    $("#"+root_id+" .leaf-selected").removeClass("leaf-selected").addClass("leaf");
    t.addClass("leaf-selected");
    cb(event);
};

NB.pdf.newFileFromUrl = function(url, id_ensemble){
    var msg ={};
    msg.url  = url;
    msg.id_ensemble = id_ensemble;
    NB.pdf.call("new_file_from_url",msg,NB.pdf.onFileAdded);
};

NB.pdf.onFileAdded = function(payload){
    //$("#add_file_dialog").dialog("close");
    $("#processing_add").hide();
    $('#add_file_dialog').dialog("close");
    NB.debug("file added !!!");
};

NB.pdf.displayFetched = function(payload){
    var i;
    var strokes = payload.strokes;
    var path;
    /*
    for (i=0;i<strokes.length;i++){
	path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute( "stroke", "blue");
	path.setAttribute( "stroke-width", "2");
	path.setAttribute( "fill", "none");
	path.setAttribute( "d", strokes[i].body);
	document.getElementById("layer2").appendChild(path);
    }
    */
    var msgs = payload.msgs;
    //    msgs = msgs.items;
    for (i=0;i<msgs.length;i++){
	NB.pdf.displayAnnotation(msgs[i]);
    }

    var links = payload.links;
    for (i=0;i<links.length;i++){
	NB.pdf.displayLink(links[i]);
    }

};

NB.pdf.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location.reload();
};

NB.pdf.goToPage = function(page){
    var current_page =  Number($("#doc_div").attr("page"));
    var new_page;
    if (page=="NEXT"){
	new_page = current_page+1;
    }
    else if (page =="PREVIOUS"){
	new_page = current_page-1;
    }
    else if (page =="LAST"){
	new_page = Number($("#doc_div").attr("numpages"));
    }
    else{
	new_page = page;
    }
    $("#doc_div").attr("page", new_page);
    NB.pdf.loadPage();
};

NB.pdf.selectFile = function(event){
    var t = $(event.currentTarget);
    $("#doc_div").attr("page", t.attr("page"));
    $("#doc_div").attr("numpages", t.attr("numpages"));
    $("#doc_div").attr("numx", t.attr("numx"));
    $("#doc_div").attr("numy", t.attr("numy"));
    $("#doc_div").attr("id_source", t.attr("id_source"));
    $("#doc_div").attr("id_ensemble", t.parent().parent().attr("id_channel"));

    NB.pdf.loadPage();
    //switch to paper view, for instance by simulating click on paper icon:
    var evt={};
    evt.currentTarget = $("#paper_mode")[0];
    NB.pdf.onToolbar(evt);
};

NB.pdf.loadPage = function(){
    $(".tile, .existing_annotation:not(#annotation_template), path, .existing_link:not(#link_template)").remove();
    var i,j,id, dom_id, left, top, elt, fn,page,numpages,   numx, numy;
    fn  = 	$("#doc_div").attr("id_source");
    page = 	Number($("#doc_div").attr("page"));
    numpages = 	Number($("#doc_div").attr("numpages"));
    numx = 	Number($("#doc_div").attr("numx"));
    numy = 	Number($("#doc_div").attr("numy"));
    for (j=0;j<numy;j++){
	for (i=0;i<numx;i++){
	    id =  page+"-"+i+"-"+j;
	    dom_id = "img"+id;
	    left = 256*i;
	    top = 256*j;
	    $("#doc_div").prepend("<img src=\"/pdf/cache/"+fn+"-"+id+".png\" class=\"tile\" id=\""+dom_id+"\"/> ");
	    elt = document.getElementById(dom_id);
	    elt.style.top = top+"px";
	    elt.style.left = left+"px";
	}
    }
    //fetch annotations
    var msg = {};
    msg.id_source = $("#doc_div").attr("id_source");
    msg.id_ensemble = $("#doc_div").attr("id_ensemble");
    msg.page = $("#doc_div").attr("page");
    NB.pdf.call("getAnnotations_pdf",msg,NB.pdf.displayFetched);
    //update page indicators
    //TODO: Observer Pattern
    $("#pagestats").text(page + " / " + numpages);
};

NB.pdf.proceedUpload = function(payload){
    var id_ensemble = $("#add_file_dialog_select_group>option:selected").attr("id_ensemble") ;
    //time to add the new file to our tree
    var s = "<div class='leaf_processing' id='source_" + payload.id_source+"' id_source='"+payload.id_source+"'>Processing...</div>";
    $("#ensemble_"+id_ensemble+">.leaves").append(s);
    var form = $("#file_upload_form")[0];
    // we need a way to pass the id_ensemble: we do it in the URL
    form.setAttribute("action", "/pdf/upload?id_ensemble="+id_ensemble+"&connection_id="+document.documentElement.getAttribute("connection_id")+"&id_source="+ payload.id_source);
    form.submit();
    $("#processing_add").text("Adding document to remote database..");
    $('#add_file_dialog').dialog("close");
};


NB.pdf.onInviteSent = function(event){
    NB.pdf.banner(event.msg);
};

NB.pdf.newInvite = function(){
    $("#invite_channelname").text($("#edit_channel_name").text());
    $('#new_invite').dialog({
	    title: "Send an invitation...", 
		       width: 390, 
		       height: 580,
		       buttons: { 
		"Cancel": function() { 
		    $(this).dialog("close");  
		},
		    "Ok": function() {
			var id_channel = $("#edit_channel").attr("id_channel");
			//			var name_channel =
			var to = $("#invite_emails").attr("value");
			var msg = $("#invite_msg").attr("value");
			NB.pdf.call("send_new_invite", {"id_channel": id_channel, "to": to, "msg": msg}, NB.pdf.onInviteSent);
			$(this).dialog("close");  

		    }
	    }
      });
  $('#new_invite').dialog("open");

};


NB.pdf.onNewFile = function(){
    $('#add_file_dialog').dialog({
	    title: "Add a File...", 
		       width: 420, 
		       height: 260,
		       buttons: { 
		"Cancel": function() { 
		    $(this).dialog("close");  
		},
		    "Ok": function() {
			if ($("input[name=check_url_or_upload][checked]").attr("id") == "url_check"){
			    var url =  $("#add_file_url").attr("value");

			    var id_ensemble = $("#add_file_dialog_select_group>option:selected").attr("id_ensemble");
			    NB.debug("adding file at URL: "+url+", in ensemble: "+id_ensemble);
			    NB.pdf.newFileFromUrl(url, id_ensemble );
			}
			else{
			    NB.pdf.call("request_source_id", {}, NB.pdf.proceedUpload);
			}
			$("#processing_add").show();
		    }
	    }
    }
				 );
    $('#add_file_dialog').dialog("open");
};

NB.pdf.onNewChannelReply = function(event){
 var s;
    s = "<div class='branch' onclick='NB.pdf.selectChannel(event)'  id_channel='"+event.id_channel+"'  id='ensemble_"+event.id_channel+"'><span class='branchname'>"+event.name+"</span><div class='leaves'/></div>";
    $("#groupslist").append(s);
    s ="<option id_ensemble=\""+event.id_channel+"\">"+event.name+"</option>";
    $("#add_file_dialog_select_group").append(s);
    NB.pdf.banner(event.msg);
};

NB.pdf.selectChannel  = function(event){
    var t = $(event.currentTarget.parentNode);
    var id_channel =  t.attr("id_channel");
    //    $(edit_channel).attr("id_channel",id_channel);
    $('#edit_channel').dialog({
	    title: "Properties for channel... ",
		       width: 420, 
		       height: 300
		});
    $('#edit_channel').dialog("open");
    NB.pdf.call("request_channel_details", {"id_channel": id_channel}, NB.pdf.onChannelDetails);
};

NB.pdf.onChannelDetails = function(payload){
    var s, i;

    $("#edit_channel").attr("id_channel",payload.id_channel );
    $("#edit_channel_name").text(payload.name);
    $("#edit_channel_description").text(payload.description);

    //update subscribers description
    s="";
    $("#edit_channel_subscribers .subscriber").remove();
    for (i in payload.subscribers){
	s = "<tr class='subscriber' id_user='"+payload.subscribers[i].id_user+"'><td>"+payload.subscribers[i].email+"</td><td>"+payload.subscribers[i].status+"</td></tr>";
	$("#edit_channel_subscribers").append(s);
    }

    //update admins description
    s="";
    for (i in payload.admins){
	s += payload.admins[i].email + " ";
    }
    $("#edit_channel_admins").text(s);




};

NB.pdf.banner = function(msg){
    $("#banner").text(msg).show("slow").hide(2000);
};




NB.pdf.onNewChannel = function(){
    $('#new_channel').dialog({
	    title: "Create a New Channel",
		       width: 420, 
		       height: 300,
 buttons: { 
		"Cancel": function() { 
		    $(this).dialog("close");  
		},
		    "Ok": function() {
			var msg = {};
			msg.name =  $("#new_channel_name").attr("value");
			msg.description =  $("#new_channel_description").attr("value");
			if (msg.name !== ""){
			    NB.pdf.call("new_channel", msg, NB.pdf.onNewChannelReply);
			    $(this).dialog("close");  
			}
			else{
			    $("#new_channel_status").text("'Name' can't be empty");
			    $("#new_channel_status").show();

			}
		    }
	    }
    }
			     );
    $("#new_channel_status").hide();
    $('#new_channel').dialog("open");
};


NB.pdf.onToolbar = function(event){
    var level = $(event.currentTarget).attr("level");
    if (level == "1"){ //change view
	var newmode = event.currentTarget.id;
	newmode  = newmode.substring(0, newmode.indexOf("_"));	
	var v2 = 	NB.pdf.viewVisible;
	v2.hide();
	NB.pdf.viewVisible = $("#"+newmode+"_view");
	NB.pdf.viewVisible.show();
	NB.debug("switch to "+NB.pdf.viewVisible);

	//change toolbar
	$(".secondary_toolbar").hide();
	$("#"+newmode+"_toolbar").show();


	/*	
	//build exhibit if not done already:
	if (!NB.pdf.ExhibitDone){
	    NB.pdf.ExhibitDone = true;
	    var fDone = function() {
		window.exhibit = Exhibit.create();
		window.exhibit.configureFromDOM();
	    };
	    window.database = Exhibit.Database.create();
	    window.database._loadLinks( [ "/?a=DATA" ],   fDone   );
	}
	*/
	
    }
    var k = "toolbarSelection"+level;
    NB.pdf[k].setAttribute("selected", "0");
    NB.pdf[k] =  event.currentTarget;
    NB.pdf[k].setAttribute("selected", "1");
    NB.debug("click on " + event.currentTarget.id);

    //cursor:
    if (NB.pdf.toolbarSelection2.id == "move_mode"){
	$("#doc_div").css("cursor",  "-moz-grab").draggable("enable");
		

    }else{
	$("#doc_div").css("cursor",  "url(/data/icons/png/draw_cursor_up.png) 1 1,pointer ").draggable("disable");

    }
};

NB.pdf.newEditor = function(event){
    NB.debug("new annotation");
    $("#notebox").css("top", event.clientY);
    $("#notebox").css("left", event.clientX);
    $("#notebox").show("fast");
    $("#annotate-text").focus();
    return true; 
};

NB.pdf.onKey = function(event){
    NB.debug("key: "+ event.keyCode + " inittarget: " + event.target);
    if (event.target.id == "annotate-text") {
	if ((event.keyCode== NB.pdf.KEYCODES.RETURN) && (event.ctrlKey)){
	    //accelerator for creating new note. 
	    NB.pdf.onOkPressed();
	}
	return;
    }
    if (event.target.id != "ROOT"){
	if (event.keyCode == NB.pdf.KEYCODES.PAGEDOWN){
	    NB.pdf.goToPage("NEXT");
	}
	else if (event.keyCode == NB.pdf.KEYCODES.PAGEUP){
	    NB.pdf.goToPage("PREVIOUS");
	}
	else if (event.keyCode == NB.pdf.KEYCODES.UP){
	    NB.pdf.moveBy(0, 20);
	}
	else if (event.keyCode == NB.pdf.KEYCODES.DOWN){
	    NB.pdf.moveBy(0, -20);
	}
	else if (event.keyCode == NB.pdf.KEYCODES.LEFT){
	    NB.pdf.moveBy(20, 0);
	}
	else if (event.keyCode == NB.pdf.KEYCODES.RIGHT){
	    NB.pdf.moveBy(-20, 0);
	}
	else{
	    return;
	}
    }
    return true;
};

NB.pdf.onDown = function(event){
    if (NB.pdf.toolbarSelection2.id == "move_mode"){
	return; // handled by jquery draggable
    }
    NB.pdf.X = event.clientX;
    NB.pdf.Y = event.clientY;
    $("#paper_view").css("cursor",  "url(/data/icons/png/draw_cursor_down.png) 1 1,pointer ");
    NB.pdf.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    NB.pdf.line.setAttribute("stroke", "blue");
    NB.pdf.line.setAttribute("stroke-width", "1");
    NB.pdf.line.setAttribute("fill", "none");
    var g = document.getElementById("layer2");
    var p1 = NB.pdf.getPosition(document.getElementById("doc_div"));
    var x =  NB.pdf.X-p1.left;
    var y =  NB.pdf.Y-p1.top;
    g.appendChild(	NB.pdf.line);
    NB.pdf.d = "M "+x+", "+y+" ";
    NB.pdf.line.setAttribute("d", 	NB.pdf.d);
    NB.pdf.isDown  = true;
};

NB.pdf.onUp = function(event){
    if (NB.pdf.toolbarSelection2.id == "move_mode"){
	return; // handled by jquery draggable
    }
    
    $("#paper_view").css("cursor",  "url(/data/icons/png/draw_cursor_up.png) 1 1,pointer ");
    var msg={};
    msg.page = $("#doc_div").attr("page");
    msg.id_source = $("#doc_div").attr("id_source");
    msg.id_ensemble = $("#doc_div").attr("id_ensemble");
    msg.body =  NB.pdf.d;
    NB.pdf.call("new_stroke",msg, NB.pdf.onStroke);
    NB.pdf.isDown  = false;
    NB.pdf.d="";
    NB.pdf.line=null;
};


NB.pdf.edit = function(event){
    $("#editbox").css({"top":event.currentTarget.style.top, "left":event.currentTarget.style.left}).show("fast");
    $("#edit-text")[0].value = $(event.currentTarget).text();
}
	     



NB.pdf.onStroke = function(payload){
    NB.debug("stroke sent, got id: "+payload.id);
};

NB.pdf.onCancelPressed = function(event){
    $("#notebox").hide("fast");
};


NB.pdf.onEditCancelPressed = function(event){
    $("#editbox").hide("fast");
};

NB.pdf.displayAnnotation = function(msg){
    $("#annotation_template").show();
    $("#annotation_template").text(msg.body);
    $("#annotation_template").css("top", msg.top+"px" );
    $("#annotation_template").css("left", msg.left+"px" );
    var newDiv = $("#annotation_template").clone()[0];
    $("#annotation_template").hide();
    newDiv.id = "text_note"+NB.pdf.noteIndex;
    NB.pdf.noteIndex++;
    $("#text_annotations").append(newDiv);
};


NB.pdf.displayLink = function(msg){
    var left = Number(msg.xll) * NB.pdf.USER2PX;
    var width =  Number(msg.xur) * NB.pdf.USER2PX - left;
    var bottom = Number(msg.yll) * NB.pdf.USER2PX;
    var height = Number(msg.yur) * NB.pdf.USER2PX - bottom;
    $("#link_template").show();
    $("#link_template").css({"bottom": bottom+"px", "left": left+"px", "width": width+"px", "height": height+"px"} );
    var newDiv = $("#link_template").clone()[0];
    $("#link_template").hide();
    newDiv.id = "text_link"+msg.id;
    newDiv.setAttribute("id_item", msg.id);
    newDiv.setAttribute("S", msg.S);
    newDiv.setAttribute("body", msg.body);
    $("#text_links").append(newDiv);
};



NB.pdf.onOkPressed = function(event){
    var msg = {};
    msg.type =  $("#current_settings .mini_button[selected=1]").attr("id_item");
    msg.body =  $("#annotate-text").attr("value");
    NB.debug("entered: " + msg.body);
    //    $("#annotation_template").css("top");
    var p2 = NB.pdf.getPosition(document.getElementById("notebox"));
    var p1 = NB.pdf.getPosition(document.getElementById("doc_div"));
    msg.top = p2.top- p1.top;
    msg.left = p2.left- p1.left;
    msg.page = $("#doc_div").attr("page");
    msg.id_source = $("#doc_div").attr("id_source");
    msg.id_ensemble = $("#doc_div").attr("id_ensemble");
    msg.client = "pdf";
    NB.pdf.call("new_annotation",msg,NB.pdf.onSent);
    NB.pdf.displayAnnotation(msg);
    $("#notebox").hide("fast");
};

NB.pdf.onSent = function(payload){
    NB.debug("Msg sent !");
};

NB.pdf.getPosition = function(elt){
    var p = {};
    p.top = elt.style.top;
    p.left = elt.style.left;
    p.top = Number(p.top.substring(0, p.top.indexOf("px")));
    p.left = Number(p.left.substring(0, p.left.indexOf("px")));
    return p;
};

NB.pdf.moveBy  = function(dx, dy){
    var p = NB.pdf.getPosition(document.getElementById("doc_div"));
    p.top += dy;
    p.left += dx;
    $("#doc_div").css("top", p.top+"px" );
    $("#doc_div").css("left", p.left+"px" );
};

NB.pdf.onMove = function(event){
    if (NB.pdf.isDown){
	if (NB.pdf.toolbarSelection2.id == "move_mode"){
	    return; // handled by jquery draggable
	}
	NB.pdf.X = event.clientX;
	NB.pdf.Y =  event.clientY;
	var p1 = NB.pdf.getPosition(document.getElementById("doc_div"));
	var x =  NB.pdf.X-p1.left;
	var y =  NB.pdf.Y-p1.top;
	NB.pdf.d += " L "+x+", "+y+" "; 
	NB.pdf.line.setAttribute("d", NB.pdf.d);
    }
};

NB.pdf.call = function(fctname, dict, callback){
    document.body.style.cursor="wait";
    NB.rpc.rpc_json("pdf/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};

NB.pdf.edit_keypress = function(event){
    //reset timer for delayed saving...
    if (NB.pdf.saveTimeout !== null){
	clearTimeout(NB.pdf.saveTimeout);
    }
    NB.pdf.saveTimeout = setTimeout("NB.pdf.save_updates();", 5000);
    $("#editbox-msg").text("editing...");

};

NB.pdf.save_updates=function(){
    NB.pdf.banner('saving updates');
    $("#editbox-msg").text("saved...");
};