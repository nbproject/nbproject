/*
 * pdf.js
 * models for pdf annotation
 * This module defines the namespace NB.pdf
 * It requires the following modules:
 *		Module
 *		NB
 *		mvc
 *		jquery
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
    Module.createNamespace("NB.pdf", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}


NB.pdf.USER2PX = 150.0/72;
NB.pdf.w0 = 220;
NB.pdf.h0 = 60;
NB.pdf.EDIT_SPACE = 30;
NB.pdf.NUMCHARS_SHORT_VIEW = 18;
NB.pdf.TYPE_DESC = {
    "OpenComment": "an open comment. Everyone can see it (without your name)", 
    "Assignment": "a submitted assignment, that can be shown to the class (without your name)", 
    "PubAssignment": "an assignment that has been made readable by the whole class (without your name)", 
    "PrivateNote": "a personal note: Only you can see it"
};
NB.pdf.NOTES_TYPES = {
    "1": "PrivateNote", 
    "2": "Assignment", 
    "3": "PubAssignment", 
    "4": "OpenComment"
};
     

/**
 * A view component that observes ensembles and views
 */
NB.pdf.sourceTreeView = function(container, cb_leaf){
    this.superclass();
    if (container.id !== ""){
	this.id = container.id;
	container.className += "NB-pdf-sourceTreeView";
    }
    this.container = container; //a dom element
    this.cb_leaf = cb_leaf;
    if (cb_leaf !== undefined){
	container.setAttribute("cb_leaf", cb_leaf);
    }
};
NB.pdf.sourceTreeView.prototype = new NB.mvc.view();
NB.pdf.sourceTreeView.prototype.constructor = NB.pdf.sourceTreeView;
NB.pdf.sourceTreeView.prototype.superclass = NB.mvc.view;
NB.pdf.sourceTreeView.prototype.update = function(action, payload, items_fieldname){
    var model = payload.model;
    var diff = payload.diff;
    var i=0;
    var s="";
    var a;
    var items;
    if (model.type == "ensemble"){
	if (action == "create"){
	    items = model.getItems();
	    for (i in items){
		a = items[i];
		s += "<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div onclick='NB.pdf.sourceTreeController(event)' ondblclick='NB.pdf.sourceTreeController(event)' class='branchname'>"+a.name+"</div><div class='leaves'/></div>";
	    }
	    $(this.container).html(s);
	}
	else if(action == "add"){
	    items = diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		s += "<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div onclick='NB.pdf.sourceTreeController(event)' ondblclick='NB.pdf.sourceTreeController(event)' class='branchname'>"+a.name+"</div><div class='leaves'/></div>";
	    }
	    $(this.container).append(s);
	}
	else if(action == "delete"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		$("#ensemble_"+a.id+"_"+this.id).remove();
	    } 
	}
	else if(action == "update"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		$("#ensemble_"+a.id+"_"+this.id).html("<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div onclick='NB.pdf.sourceTreeController(event)' ondblclick='NB.pdf.sourceTreeController(event)' class='branchname'>"+a.name+"</div><div class='leaves'/></div>");
	    } 
	}
    }
    else if (model.type == "source"){
	if (action == "create" || action == "add"){
	    items = model.getItems();
	    for (i in items){
		a = items[i];
		s = "<div class='leaf' id='source_" + a.id_source+"_"+this.id+"' page='1' numpages='"+a.numpages+"' numx='"+a.numx+"' numy='"+a.numy+"' id_source='"+a.id_source+"' onclick='NB.pdf.sourceTreeController(event)' ondblclick='NB.pdf.sourceTreeController(event)'  >"+a.title+"</div>";
		$("#ensemble_"+a.id_ensemble+"_"+this.id+">.leaves").append(s);
	    }
	}
	else if(action == "delete"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		$("#source_"+a.id+"_"+this.id).remove();
	    } 
	}
	else if(action == "update"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		$("#source_"+a.id+"_"+this.id).html("<div class='leaf' id='source_" + a.id_source+"_"+this.id+"' page='1' numpages='"+a.numpages+"' numx='"+a.numx+"' numy='"+a.numy+"' id_source='"+a.id_source+"' onclick='NB.pdf.sourceTreeController(event)' ondblclick='NB.pdf.sourceTreeController(event)'  >"+a.title+"</div>");
	    } 
	}
    }
};


NB.pdf.sourceTreeController = function(event){
    var cb;
    var t = $(event.currentTarget);
    t.parents(".NB-pdf-sourceTreeView").find("[selected]").removeAttr("selected");
    t.attr("selected", "1");
    if (event.type == "click"){
	//    if (event.type == "dblclick"){
	cb = eval(t.parents(".NB-pdf-sourceTreeView").attr("cb_leaf"));
	//SACHA TODO: check if double click on branch or leaf. 
	cb(t[0]);	
    }
    
};


/**
 * A view component that observes ensembles 
 */
NB.pdf.ensembleSelectView = function(container){
    this.superclass();
    this.container = container; //a dom "select" element
};
NB.pdf.ensembleSelectView.prototype= new NB.mvc.view();
NB.pdf.ensembleSelectView.prototype.constructor = NB.pdf.ensembleSelectView;
NB.pdf.ensembleSelectView.prototype.superclass = NB.mvc.view;
NB.pdf.ensembleSelectView.prototype.update = function(action, payload, items_fieldname){
    var model = payload.model;
    var diff = payload.diff;
    var items; 
    var i=0;
    var a;
    var s="";
    
    if (model.type == "ensemble"){
	if (action == "create"){
	    items= model.getItems();
	    for (i in items){
		a = items[i];
		s += "<option id_ensemble=\""+a.id+"\">"+a.name+"</option>";
	    }
	    $(this.container).html(s);
	}
	else if(action == "add"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		s += "<option id_ensemble=\""+a.id+"\">"+a.name+"</option>";
	    }
	    $(this.container).append(s);
	}
	else if(action == "delete"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		$(this.container).find(">option[id_ensemble="+a.id+"]").remove();
	    } 
	}
	else if(action == "update"){
	    items= diff[items_fieldname];
	    for (i=0;i<items.length;i++){
		a = items[i];
		//if we don't remove and add, selection begaves weirdly, 
		//SACHA FIXME: even like this, still resets selection, but at least begaves ok after that
		$(this.container).find(">option[id_ensemble="+a.id+"]").remove();
		$(this.container).append("<option id_ensemble=\""+a.id+"\">"+a.name+"</option>");
	    } 
	}
    }
};



NB.pdf.Doc = function(payload, docs){
    //    this.superclass();
    this.id		= payload.id;
    this.numpages	= payload.numpages;
    this.numx		= payload.numx;
    this.numy		= payload.numy;
    this.title		= payload.title;
    this.id_ensemble	= payload.id_ensemble;
    this.docs		= docs;
    this.pages = {};
    this.editors_r = {};
    this.msgs = {};		//global comments
    this.docs.getAnnotations({"id_source": this.id, "id_ensemble": this.id_ensemble, "page": 0});
}; 
//NB.pdf.Doc.prototype = new NB.mvc.model();
//NB.pdf.Doc.prototype.constructor = NB.pdf.Doc;
//NB.pdf.Doc.prototype.superclass = NB.mvc.model;
NB.pdf.Doc.prototype.modify = function(action, payload){
    var i;
    if (action == "add"){
	this.__addPage(payload.page);
    }
    else if(action == "update_selection"){
	
    }
    else{
	alert("[NB.pdf.Doc.modify] unknown action: " + action);
	return;
    }
    for (i in this.observers){
	this.observers[i].o.update(action, {"model": this, "diff": payload});
    }
};

NB.pdf.Doc.prototype.getPage = function(i){
    if (i in this.pages){
	NB.debug("[Doc] got page " +i);
    }
    else{
	this.__addPage(i);
    }
    return this.pages[i];
};

NB.pdf.Doc.prototype.__addPage = function(page){
    var i,j,left,top, id, div, img;
    if ( page in this.pages){
	NB.debug("[Doc.__addPage] got page " +page);
    }
    else{
	//	div = $("<div  style='position: absolute'/>");
	div = $("<div />");

	for (j=0;j<this.numy;j++){
	    for (i=0;i<this.numx;i++){
		id =  page+"-"+i+"-"+j;
		left = 256*i;
		top = 256*j;
		img = $("<img src=\"/pdf/cache/"+this.id+"-"+id+".png\" class=\"tile\" />").css({"top": top+"px", "left": left+"px"});		    
		div.append(img);
	    }
	}
	//img.load(function(event){NB.debug("ready to scroll:loaded");});
	this.pages[page] = {"div": div, "msgs": {}, "links": {}, "editors": {}, "editors_c": {}, "comments": {}};
	this.docs.getAnnotations({"id_source": this.id, "id_ensemble": this.id_ensemble, "page": page});

    }
};


NB.pdf.Doc.prototype.createEditor_r = function(){
    var id = (new Date()).getTime();
    var ed = {"type": "Assignment", "body":"", "x0": 0, "y0": 0, "left": 0, "top": 0, "w": 0, "h":0};

    this.editors_r[id] = ed; 
    //now need to relay info to viewers: 
    this.docs.modify("neweditor_r", {"id": this.id});
    
};


NB.pdf.Doc.prototype.createEditor_c = function(p){
    var id = (new Date()).getTime();
    var ed = {"body":"", "id_ann": p.id_ann};
    this.pages[p.page].editors_c[id] = ed; 
    //now need to relay info to viewers: 
    this.docs.modify("neweditor_c", {"id": this.id, "page": p.page, "id_ann": p.id_ann});
    
};



NB.pdf.Doc.prototype.createEditor = function(p){
    var id = (new Date()).getTime();
    var ed = {"type": "Assignment", "body":"", "x0": 0, "y0": 0, "left": p.left, "top": p.top, "w": NB.pdf.w0, "h":NB.pdf.h0};
    this.pages[p.page].editors[id] = ed; 
    //now need to relay info to viewers: 
    this.docs.modify("neweditor", {"id": this.id, "page": p.page});
    
};






NB.pdf.Doc.prototype.submitComment = function(page, id_item){
    var ed = this.pages[page].editors_c[id_item];
    var msg = {};
    msg.body = ed.body;   
    msg.page = page;
    msg.id_source = this.id;
    msg.id_ensemble = this.id_ensemble;
    msg.id_editor_c = id_item;
    msg.id_ann = ed.id_ann;
    this.docs.setComment(msg);
};




NB.pdf.Doc.prototype.submitNote = function(page, id_item){
    var ed;
    if (page === 0){
	ed = this.editors_r[id_item];
    }
    else{
	ed = this.pages[page].editors[id_item];
    }
    var msg = {};
    msg.type = ed.type;
    msg.body = ed.body;
    msg.top = ed.top;
    msg.left = ed.left;
    msg.w = ed.w;
    msg.h = ed.h;
    msg.y0 = ed.y0;
    msg.x0 = ed.x0;
    msg.page = page;
    msg.id_source = this.id;
    msg.id_ensemble = this.id_ensemble;
    msg.id_editor = id_item;
    this.docs.setAnnotation(msg);
};

/** 
 * Collection of Docs
 */
NB.pdf.Docs = function(){
    this.superclass();
    this.items = {}; //indexed by item.id
    this.annotation_getter = null;
    this.annotation_setter = null;
    this.comment_setter = null;
    this.comment_getter = null;
}; 
NB.pdf.Docs.prototype = new NB.mvc.model();
NB.pdf.Docs.prototype.constructor = NB.pdf.Docs;
NB.pdf.Docs.prototype.superclass = NB.mvc.model;
NB.pdf.Docs.prototype.modify = function(action, payload){
    var i, pos, x, field;
    if (action == "open"){
	if ( payload.id in this.items){
	    NB.debug("I have this doc already");
	}
	else{
	    var d ;
	    d = new NB.pdf.Doc(payload, this);
	    //d = NB.mvc.collection("docs");
	    this.items[payload.id] = d;
	}
	//sanity check to see if we gave good page argument: 
	if ((payload.page < 1) || (payload.page >  this.items[payload.id].numpages)){
	    payload.page = 1;
	}
    }
    else if (action == "addnotes"){
	NB.pdf.__addNotes(this, payload);
    }
    else if (action == "addcomments"){
	NB.pdf.__addComments(this, payload);
    }
    else if (action == "neweditor" || action == "neweditor_c" || action == "neweditor_r"){
	//just relay...
    }
    else if (action == "removedoc"){
	delete(this.items[payload.id_source]);
    }
    else{
	alert("[NB.pdf.Docs.modify] unknown action: " + action);
	return;
    }
    for (i in this.observers){
	this.observers[i].o.update(action, {"model": this, "diff": payload});
    }
};

NB.pdf.__addNotes = function(self, p){
    //we expect an array where each element has the follwing: id,  id_source, page
    self.__addField("msgs", p);
    self.__addField("links", p);
};


NB.pdf.__addComments = function(self, p){
    //we expect an array where each element has the follwing: id,  id_source, page
    self.__addField("comments", p);
};



NB.pdf.Docs.prototype.__addField = function(field, p){
    var i;
    var x =  p[field];
    for (i in x){
	if (x[i].id_source in this.items){
	    if (x[i].page ===0){
		this.items[x[i].id_source][field][x[i].id] = x[i];		
	    }
	    else{
		this.items[x[i].id_source].pages[x[i].page][field][x[i].id] = x[i];		
	    }
	}
    }
};

NB.pdf.Docs.prototype.getItems = function(){
    return this.items;
};

NB.pdf.Docs.prototype.get = function(id){
    return this.items[id];
};


NB.pdf.Docs.prototype.set_annotation_getter = function(f){
    this.annotation_getter = f;
};


NB.pdf.Docs.prototype.set_annotation_setter = function(f){
    this.annotation_setter = f;
};


NB.pdf.Docs.prototype.set_comment_setter = function(f){
    this.comment_setter = f;
};


NB.pdf.Docs.prototype.set_comment_getter = function(f){
    this.comment_getter = f;
};


NB.pdf.Docs.prototype.getAnnotations = function(msg){
    var self = this;
    if (this.annotation_getter !== null){
	var cb2 = function(p){
	    //simulates a modify
	    var i;
	    NB.pdf.__addNotes(self,  p);
	    for (i in self.observers){
		self.observers[i].o.update("addnotes", {"model": self, "diff": p});
	    }
	    //SACHA FIXME: Assume, that at this stage, all msgs in diff have same id_source, page, id_ensemble
	    var p2  ={};
	    var m;
	    if (p.msgs.length > 0){
		m = p.msgs[0];
		p2.id_ensemble = self.items[m.id_source].id_ensemble;
		p2.page = m.page;
		p2.id_source = m.id_source;
		// get comments
		self.getComments(p2);
	    }
	};
	this.annotation_getter(msg, cb2);
    }
    else{
	NB.debug("No annotation getter has been set !");
    }
};


NB.pdf.Docs.prototype.getComments = function(msg){
    var self = this;
    if (this.comment_getter !== null){
	var cb2 = function(p){
	    //simulates a modify
	    var i;
	    NB.pdf.__addComments(self,  p);
	    for (i in self.observers){
		self.observers[i].o.update("addcomments", {"model": self, "diff": p});
	    }
	};
	this.comment_getter(msg, cb2);
    }
    else{
	NB.debug("No comment getter has been set !");
    }
};



NB.pdf.Docs.prototype.setAnnotation = function(msg){
    var self = this;
    if (this.annotation_setter !== null){
	var cb2 = function(p){
	    //simulates a modify
	    var i, id_source, page, id_editor;
	    if (("__action__" in p) && (p.__action__=="delete")){ //no editors to delete if an __action__ is returned
		if (p.page == 0){
		    delete(self.items[p.id_source].msgs[p.id_ann]);
		}
		else{
		    delete(self.items[p.id_source].pages[p.page].msgs[p.id_ann]);
		}
		for (i in self.observers){
		    self.observers[i].o.update("delnotes", {"model": self, "diff": p});
		}
	    }
	    else{
		self.__addField("msgs", p);
		for (i in p.msgs){ //delete editor representation
		    id_source = p.msgs[i].id_source;
		    page =  p.msgs[i].page;
		    id_editor = p.msgs[i].id_editor;
		    if (page === 0){
			delete(self.items[id_source].editors_r[id_editor]);
		    }
		    else{
			delete(self.items[id_source].pages[page].editors[id_editor]);
		    }
		}
		for (i in self.observers){
		    self.observers[i].o.update("delete_editor", {"model": self, "diff": p});
		    self.observers[i].o.update("addnotes", {"model": self, "diff": p});
		}
		self.info("Note taken successfully !");
	    }
	  
	};
	this.annotation_setter(msg, cb2);
    }
    else{
	NB.debug("No annotation setter has been set !");
    }
};

NB.pdf.Docs.prototype.setComment = function(msg){
    var self = this;
    if (this.comment_setter !== null){
	var cb2 = function(p){
	    //simulates a modify
	    var i, id_source, page, id_editor;
	    self.__addField("comments", p);
	    for (i in p.comments){
		id_source = p.comments[i].id_source;
		page =  p.comments[i].page;
		id_editor = p.comments[i].id_editor;
		delete(self.items[id_source].pages[page].editors_c[id_editor]);
	    }
	    //	    NB.pdf.__addNotes(self,  p);
	    for (i in self.observers){
		self.observers[i].o.update("delete_editor_c", {"model": self, "diff": p});
		self.observers[i].o.update("addcomments", {"model": self, "diff": p});
	    }
	    self.info("Comment sent successfully !");
	};
	this.comment_setter(msg, cb2);
    }
    else{
	NB.debug("No comment setter has been set !");
    }
};





/**
 * A view component that observes Doc 
 */
NB.pdf.Tab = function(container, viewer){
    this.superclass();
    this.container = container; //dom element 
    this.viewer = viewer;
    this.doc = null;
    this.winlet = null;
    this.page = 1; 
    this.id_ann = null;
};
NB.pdf.Tab.prototype= new NB.mvc.view();
NB.pdf.Tab.prototype.constructor = NB.pdf.Tab;
NB.pdf.Tab.prototype.superclass = NB.mvc.view;
NB.pdf.Tab.prototype.update = function(action, payload){
    var self = this;
    if (this.doc === null){
	this.doc = payload.model;
    }
    var div, page, i, msgs, comments;
    if (action == "gotopage"){
	this.page = payload.page;
	/*
	 * SACHA TODO: for now, we do all the rendering here, but we can imaging registering 
	 * special renderers for rendering different things etc...
	 */
	page = this.doc.getPage(this.page);
	div = page.div;
	var img_loaded = function(){
	    //	    NB.debug("IMG LOADED !!!!!!");
	    //SACHA FIXME: We assume the page shoule be rendered by now, so good time for scrolling
	    if (self.id_ann !== null){
		NB.debug("SCROLLING");
		var ann = $(self.container).find("div.existing_annotation[id_ann="+self.id_ann+"]");
		if (ann.length > 0){
		    ann.css({"background-color":"#FF8855", "font-size": "large", "z-index": 100});
		    ann.find("div.shortview").hide();
		    ann.find("div.fullview").show();
		    var pos = Math.max(0,ann.offset().top-50);
		    var prms = {"scrollTop": pos }
		    //		    $(self.container).attr(prms);
		    $(self.container).animate(prms, 500);

		    document.body.style.cursor = "auto";

		}
	    }
	}
	$(this.container).html(div.clone());
	//	this.__addWinlets();
	this.__addNotes();
	this.__addEditors();
	this.__addEditors_c();
	this.__addComments();
	this.viewer.update("pagestats", {"page": this.page, "diff": this.doc});
	if ("id_ann" in payload){
	    this.id_ann = payload.id_ann;
	    //	    $(this.container).find("img.tile")[0].addEventListener("load",img_loaded,  false);
	    document.body.style.cursor = "wait";
	    window.setTimeout(img_loaded, 2000);
	   
	}
    }
    else if (action == "addnotes"){
	this.__addNotes();
    }
    else if (action == "addcomments"){
	this.__addComments();


    }
    else if (action == "neweditor"){
	this.__addEditors();
    }
    else if (action == "neweditor_c"){
	this.__addEditors_c();
    }
    else if (action == "delete_editor"){
	msgs =  payload.diff.msgs;
	for (i in msgs){
	    if (this.page == msgs[i].page){
		$(this.container).find(".edit-selection[id_item="+msgs[i].id_editor+"], .editor[id_item="+msgs[i].id_editor+"]").remove();
	    }
	}
    }
    else if (action == "delete_editor_c"){
	comments =  payload.diff.comments;
	for (i in comments){
	    if (this.page == comments[i].page){
		$(this.container).find(".editor_c[id_item="+comments[i].id_editor_c+"]").remove();
	    }
	}
    }
};


NB.pdf.Tab.prototype.__addEditors = function(){   
    var self = this;
    var page, div, editors, editor, sel,f_stop_drag_or_resize, f_ok, f_change_text, f_change_type, f_close, f_no_tip, f_no_tip_sel , i ;
    page = this.doc.getPage(this.page);
    div = $("<div class=\"text_editors\"/>");
    editors = page.editors;
    /*
     * SACHA FIXME: Methods below violate the MVC pattern, since they change the data in the model, without firing updates, and update the up (except f_ok), but for now, because we assume a given editors will mostly be viewed from only 1 View. 
     */
    f_stop_drag_or_resize = function(event, ui){
	var id_item = this.getAttribute("id_item");
	var $ed = $(this).find("~ .editor[id_item="+this.getAttribute("id_item")+"]");
	var ed = editors[id_item];
	var w = this.style.top	;
	ed.left = parseInt(this.style.left);
	ed.top = parseInt(this.style.top) ;
	ed.w = parseInt(this.style.width) ;
	ed.h =  parseInt(this.style.height) ;
	$ed.css({"top":(ed.y0+ ed.top)+"px", "left": (ed.x0+ed.left+ed.w+NB.pdf.EDIT_SPACE)+"px"});    
	//	NB.debug("stop_drag");
	//	self.doc.modify("update_selection", {"page": this.page, this);
    };
    f_no_tip = function(event){
	$(event.currentTarget).removeClass("annotate-text-tip");
    };
    f_no_tip_sel = function(event){
	$(event.currentTarget).removeClass("edit-selection-tip");
    };

    f_change_text = function(event){
	var id_item = this.getAttribute("id_item");
	var ed = editors[id_item];
	ed.body = event.currentTarget.value;
    };
    f_change_type = function(event){
	var id_item = $(this).parents("[id_item]")[0].getAttribute("id_item");
	var ed = editors[id_item];
	ed.type =  this.getAttribute("value");
	$(this).siblings().removeAttr("checked");
	this.setAttribute("checked", "checked");
	self.viewer.info("This note will now be "+ NB.pdf.TYPE_DESC[ed.type]);
    };

    f_ok = function(event){
	var id_item = this.getAttribute("id2"); //id_item in conflict with jquery selector.

	//make sure we have the right text: (cut and paste may not have trigger a f_change_text)
	var ed = editors[id_item];
	ed.body = $("textarea[id_item="+id_item+"]").val();

	// make sure we have the right type: 
	ed.type = $(".editor[id_item="+id_item+"] input[name="+id_item+"][checked]").attr("value");

	self.doc.submitNote(self.page, id_item);
	//	var $ed = $(this).find("~ .editor[id_item="+this.getAttribute("id_item")+"]");
	//	var ed = editors[id_item];
	
    };
    f_close = function(event){
	var id_item = $(this).parents("[id_item]")[0].getAttribute("id_item");
	delete(editors[id_item]);
	$(this).parents(".text_editors").find(".edit-selection[id_item="+id_item+"], .editor[id_item="+id_item+"]").remove();
    };
    

    for (i in editors){
	sel =  $("<div class=\"edit-selection edit-selection-tip\" id_item=\""+i+"\">").click(f_no_tip_sel);
	div.append(sel.css({
		    "top": editors[i].top+"px", 
			"left": editors[i].left+"px", 
			"width": editors[i].w+"px", 
			"height": editors[i].h+"px"
			}).resizable({"resize": f_stop_drag_or_resize}).draggable({"drag": f_stop_drag_or_resize}));


	editor = $("<div  id_item=\""+i+"\" class=\"editor\" ondblclick=\"event.stopPropagation();\" > <div class=\"editor-titlebar\"><div action=\"save\"  id2=\""+i+"\" class=\"mini_button left\" title=\"Save and Publish this Note\" ><img src=\"/data/icons/png/button_ok_24.png\"/></div><div action=\"close\"  class=\"mini_button right\" title=\"Discard this note\"><img  src=\"/data/icons/png/window-close.png\"/></div></div><div class=\"notebox-body\"><textarea  id_item=\""+i+"\" class=\"annotate-text annotate-text-tip\"  rows=\"10\" cols=\"40\">"+editors[i].body+"</textarea><br/></div> <div class=\"editor-footer\"><table><tr> <td><input type=\"radio\" name=\""+i+"\" value=\"OpenComment\" /></td>               <td> Open comment, visible by the class</td></tr><tr><td><input type=\"radio\" name=\""+i+"\" value=\"Assignment\"/></td>       <td>Reading assignment</td></tr><tr><td><input type=\"radio\" name=\""+i+"\" value=\"PrivateNote\"/></td> <td>Private note, visible by you only</td></tr></table><div style=\"padding-left: 30px; margin-left: 30px;\"></div></div> </div>");
	editor.find(".mini_button[action=save]").click(f_ok);
	editor.find("input[value="+editors[i].type+"]").attr("checked", "checked");
	editor.find("input[name="+i+"]").click(f_change_type);
	editor.find("textarea").keyup(f_change_text).click(f_no_tip);
	editor.find(".mini_button[action=close]").click(f_close);
	div.append(editor.css({"top":(editors[i].y0+ editors[i].top)+"px", "left": (editors[i].left+editors[i].x0+editors[i].w+NB.pdf.EDIT_SPACE)+"px"}));
    }
    $(this.container).find(" .text_editors").remove();
    $(this.container).append(div);
    

};





NB.pdf.Tab.prototype.__addEditors_c = function(){   
    var self = this;
    var page, div, editors_c, editor_c, sel,f_change_text, f_ok,  f_close,  i ;
    page = this.doc.getPage(this.page);
    editors_c = page.editors_c;
    /*
     * SACHA FIXME: Methods below violate the MVC pattern, since they change the data in the model, without firing updates, and update the up (except f_ok), but for now, because we assume a given editors_c will mostly be viewed from only 1 View. 
     */
   
    f_change_text = function(event){
	var id_item = this.getAttribute("id_item");
	var ed = editors_c[id_item];
	ed.body = event.currentTarget.value;
    };
    f_ok = function(event){
	var id_item = this.getAttribute("id2"); //id_item in conflict with jquery selector.

	//make sure we have the right text: (cut and paste may not have trigger a f_change_text)
	var ed = editors_c[id_item];
	ed.body = $("textarea[id_item="+id_item+"]").val();
	self.doc.submitComment(self.page, id_item);
    };
    f_close = function(event){
	var id_item = $(this).parents("[id_item]")[0].getAttribute("id_item");
	delete(editors_c[id_item]);
	$(this).parents(".editor_c").remove();
    };

    for (i in editors_c){
	div = $(self.container).find(".existing_annotation[id_ann="+editors_c[i].id_ann+"]");
	if (div.find(".editor_c[id_item="+i+"]").length == 0){
	    editor_c = $("<div onclick=\"event.stopPropagation();\"   id_item=\""+i+"\" class=\"editor_c\" ondblclick=\"event.stopPropagation();\" > <div class=\"editor_c-titlebar\"><div action=\"save\"  id2=\""+i+"\" class=\"mini_button left\" title=\"Save and publish this comment\" ><img src=\"/data/icons/png/save_24.png\"/></div><div action=\"close\"  class=\"mini_button right\" title=\"Close\"><img  src=\"/data/icons/png/window-close.png\"/></div></div>   <div class=\"editorc-body\"><textarea  id_item=\""+i+"\" class=\"annotate-text\"  rows=\"10\" cols=\"40\">"+editors_c[i].body+"</textarea><br/></div></div>");
	    editor_c.find(".mini_button[action=save]").click(f_ok);
	    editor_c.find(".mini_button[action=close]").click(f_close);
	    div = $(self.container).find(".existing_annotation[id_ann="+editors_c[i].id_ann+"]");
	    div.append(editor_c);
	}
    }
};





NB.pdf.Tab.prototype.__addComments = function(){   
    var self = this;
    var page, div, sel, i, comments, $c, ctime;
    page = this.doc.getPage(this.page);
    comments = page.comments;
    for (i in comments){
	div = $(self.container).find(".existing_annotation[id_ann="+comments[i].id_ann+"] .comments");
	if (div.find(".comment[id_item="+i+"]").length == 0){
	    if ("ctime" in comments[i]){
		ctime = comments[i].ctime.split(".")[0];
	    }
	    else{
		ctime = new Date();
	    }
	    $c = $("<div  id_item=\""+i+"\" class=\"comment\"  title=\"Comment #"+comments[i].id+" on "+ctime+"\" >"+comments[i].body+"</div>");
	    //SACHA FIXME: Find stg more elegant !
	    div.addClass("comments-nonempty").append($c);
	}
    }
};





NB.pdf.text_br = function($e, text){
    if (text==null){
	return;
    }
    var e, i, sentences;
    e = $e[0];
    sentences = text.split("\n");
    for (i in sentences){
	e.appendChild(document.createTextNode(sentences[i]));
	$e.append($("<br/>"));
    }
};

NB.pdf.Tab.prototype.__addWinlets = function(){   
    this.winlet = $("<div class=\"winlet\"></div>");
    $(this.container).append(this.winlet);
};



NB.pdf.Tab.prototype.__addNotes = function(){   
    var self = this;
    var page, $div, $sels, $notes,  notes, note, sel, i, link, links, l, w, b, h, cb, notebody, adminreply, comments, status,f_note, f_sel, f_context, fullview, shortview, shortbody, f_toggle, noteheader;
    page = this.doc.getPage(this.page);
    // now display annotations: 
    $div = $("<div class=\"text_notes\"/>");
    $sels = $("<div class=\"selections\"/>");
    $notes = $("<div class=\"notes\"/>");
    notes = page.msgs;
    f_note =  function(event){
	var id_item = event.currentTarget.getAttribute("id_ann");
	$sels.find("div.selection[id_ann="+id_item+"]").toggleClass("hilite");
    }
    f_sel = function(event){
	var id_item = event.currentTarget.getAttribute("id_ann");
	$notes.find("div.existing_annotation[id_ann="+id_item+"]>div.shortview").toggleClass("hilite");
    }
    f_context = function(action, el, pos){
	if (action == "comment"){
	    NB.pdf.editor_cFactory(el, pos, self);
	}
	else if (action == "delete"){
	    var msg={"__action__":"delete", "id_ann": $(el).attr("id_ann"), "id_source": self.doc.id, "page": self.page};
	    self.doc.docs.setAnnotation(msg);
	}
	else{
	    NB.debug( 'Action: ' + action);
	}
    };
    f_toggle = function(event){
	var t = $(event.currentTarget);
	if (t.children(".fullview:visible").length == 1){
	    t.children(".fullview").hide();
	    t.children(".shortview").show();

	}
	else{
	    t.children(".shortview").hide();
	    t.children(".fullview").show();
	}
    };
    for (i in notes){
	sel =  $("<div class=\"selection\" id_ann=\""+i+"\" >");
	note = $("<div class=\"existing_annotation abs\" title=\"Click to toggle full view\">").click(f_toggle);
	fullview = $("<div class=\"fullview\"/>");
	shortview =  $("<div class=\"shortview\"/>");
	notebody = $("<div class=\"notebody\"/>");
	noteheader = $("<span class=\"noteheader\">["+i+"]</span>");

	
	adminreply = $("<div class=\"admin-reply\"/>");
	comments = $("<div class=\"comments\"/> ");
	if (notes[i].comment!=null){
	    adminreply.addClass("admin-replied");
	    shortview.addClass("short-admin-replied");
	}
	notebody.addClass(notes[i].type);
	notebody.append(noteheader);
	NB.pdf.text_br(notebody, notes[i].body);
	NB.pdf.text_br(adminreply, notes[i].comment);
	if (notes[i].body.length < NB.pdf.NUMCHARS_SHORT_VIEW){
	    shortbody = notes[i].body;
	}
	else{
	    shortbody = notes[i].body.substring(0, NB.pdf.NUMCHARS_SHORT_VIEW)+ "(...)";
	}
	shortview.text(shortbody);
	fullview.append(notebody).append(adminreply).append(comments).hide();
	$notes.append(note.append(fullview).append(shortview).attr("id_ann", i).css({"top":(notes[i].y0+ notes[i].top)+"px", "left": (notes[i].left+notes[i].x0+notes[i].w)+"px"}));
	//	note.append(fullview);
	$sels.append(sel.css({
		    "top": notes[i].top+"px", 
			"left": notes[i].left+"px", 
			"width": notes[i].w+"px", 
			"height": notes[i].h+"px"
			}));	
    }
    $div.append($sels).append($notes);
    $div.find(".existing_annotation").contextMenu({"menu": 'PNUP'}, f_context);
    $sels.find("div.selection").mouseover(f_sel).mouseout(f_sel);
    //    var $notes2 = $notes.find("div.existing_annotation").mouseover(f_note).mouseout(f_note).clone();
    //    this.winlet.html($notes2.removeClass("abs"));




    $(this.container).find(" .text_notes").remove();
    
    //hide it if notes turned off:
    status = $(this.viewer.container).find(".notes-icon").attr("status");
    if (status == "off"){
	$div.hide("fast");
    }
    //specify alignment:
    status = $(this.viewer.container).find(".align-icon").attr("status");
    if (status == "off"){
	$div.find(".existing_annotation").removeClass("right-aligned");
    }
    else{
	$div.find(".existing_annotation").addClass("right-aligned");

    }
    $(this.container).append($div);
    
    //now add links: 
    $div = $("<div class=\"text_links\"/>");
    links = page.links;
    cb = function(event){NB.pdf.onlink(self, event);};
    for (i in links){
	link = $("<pre class=\"existing_link\" />");
	l = Number(links[i].xll) * NB.pdf.USER2PX;
	w =  Number(links[i].xur) * NB.pdf.USER2PX - l;
	b = Number(links[i].yll) * NB.pdf.USER2PX;
	h = Number(links[i].yur) * NB.pdf.USER2PX - b;
	$div.append(link.css({"bottom": b+"px", "left": l+"px", "width": w+"px", "height": h+"px"}).attr({"id_item": links[i].id, "S": links[i].S, "body": links[i].body}) );
	link[0].addEventListener("click",cb,  false);
    }
    $(this.container).find(" .text_links").remove();
    $(this.container).append($div);
    
};





NB.pdf.editorFactory = function(evt, tab){
    var doc = tab.doc;
    var t = evt.currentTarget;
    var offset = $(t).offset();
    doc.createEditor({"page": tab.page, "left": evt.clientX-offset.left+t.scrollLeft-0.5*NB.pdf.w0, "top": evt.clientY-offset.top+t.scrollTop-0.5*NB.pdf.h0});   
    NB.debug("new editor");
};


NB.pdf.editor_cFactory = function(el, pos, tab){
    var doc = tab.doc;
    doc.createEditor_c({"page": tab.page, "id_ann": $(el).attr("id_ann")});   
    NB.debug("new editor_c");
};




NB.pdf.onlink = function(self, event){   
    var t = $(event.currentTarget);
    if (t.attr("S") == "/URI"){
	window.open(t.attr("body"));	
    }
    else if (t.attr("S") == "/GoTo"){
	var coords = eval(t.attr("body"));
	self.page =  coords[0];
	self.update("gotopage", {"page": coords[0]});
	NB.debug("Go to page " + coords[0]);
	self.viewer.info("Go to page " + coords[0]);
    }
    else{
	self.viewer.warning("unknown link: "+t.attr("S")+": "+t.attr("body"));
    }
};

/**
 * A view component that observes Docs 
 */
NB.pdf.Viewer = function(container){
    var self = this;
    this.superclass();
    this.container = container; //dom element
    this.tabs = {};
    this.temp_tab = $("<div class=\"temp_tab\"/>");
    this.id_current_tab = 0;
    this.model = null;
    this.sidetab = null; // dom element 
    this.existingNoteContextMenu = $("<ul id=\"PNUP\" class=\"contextMenu\"><li class=\"comment\"><a href=\"#comment\">Comment</a></li><li class=\"delete\"><a href=\"#delete\">Delete</a></li></ul>");
    $("body").append(this.existingNoteContextMenu);
    this.ul = $("<ul><li><a href=\"#tip_"+this.id+"\"><span>Home</span></a></li></ul>");
    var pb = "<div class=\"page_bar\"><!--<div action=\"GROUP_NOTES\"  class=\"detached_button\" title=\"Toggle notes grouping (grouped notes don't overlap)\" ><div class=\"align-icon\" status=\"off\"/></div>--><div action=\"ALIGN_NOTES\"  class=\"detached_button\" title=\"Toggle notes alignment\" ><div class=\"align-icon\" status=\"off\"/></div><div action=\"TOGGLE_NOTES\"  class=\"detached_button\" title=\"Toggle notes visibility\" ><div class=\"notes-icon\" status=\"on\"/></div> <div action=\"COLLAGE\"  class=\"detached_button\" title=\"Show all notes in a Collage View\" ><img  src=\"/data/icons/png/collage2_16.png\"/></div> <div action=\"DOWNLOAD\"  class=\"detached_button\" title=\"Download this PDF file\" ><img  src=\"/data/icons/png/download_16.png\"/></div> <div action=\"BEGIN\"  class=\"detached_button\" title=\"Begin\" ><img  src=\"/data/icons/png/go_beginning_16.png\"/></div> <div id=\"prev_button\"  class=\"detached_button\" title=\"Previous\" action=\"PREVIOUS\"><img src=\"/data/icons/png/go_previous_16.png\"/></div> <div id=\"pagestats\">? / ?</div> <div id=\"next_button\"  class=\"detached_button\" title=\"Next\" action=\"NEXT\"><img  src=\"/data/icons/png/go_next_16.png\"/></div> <div id=\"end_button\"  class=\"detached_button\" title=\"End\" action=\"LAST\" ><img  src=\"/data/icons/png/go_end_16.png\"/></div></div>";
    $(this.container).append(pb);
    $(this.container).find(" .detached_button").each(function(){
	    this.addEventListener("click", function(event){
		    var action = event.currentTarget.getAttribute("action");
		    var status, icon;
		    if (action == "COLLAGE"){
			window.open("?t=p10");
			return;
		    }
		    //		    NB.debug("click on ", event.currentTarget.getAttribute("action"), self);
		    var current_page =  Number(self.tabs[self.id_current_tab].page);
		    var numpages = self.model.items[self.id_current_tab].numpages;
		    var new_page = current_page;
		    if (action=="NEXT"){
			new_page = Math.min(current_page+1, numpages);
		    }
		    else if (action =="PREVIOUS"){
			new_page = Math.max(1, current_page-1);
		    }
		    else if (action =="LAST"){
			new_page = numpages;
		    }
		    else if (action == "BEGIN"){
			new_page = 1;
		    }
		    else if (action == "DOWNLOAD"){
			window.open("/pdf/repository/"+self.id_current_tab);
			return;
		    }    
		    else if (action == "TOGGLE_NOTES"){
			
			icon=  $(event.currentTarget).find("[status]");
			status = icon.attr("status");
			if (status == "on"){
			    icon.attr("status", "off");
			    $(self.tabs[self.id_current_tab].container).find(".text_notes").hide("fast");
			}
			else{
			    icon.attr("status", "on");
			    $(self.tabs[self.id_current_tab].container).find(".text_notes").show("fast");
			}
			return;
		    }
		    else if (action =="ALIGN_NOTES"){
			icon=  $(event.currentTarget).find("[status]");
			status = icon.attr("status");
			if (status == "on"){
			    icon.attr("status", "off");
			    $(self.tabs[self.id_current_tab].container).find(".existing_annotation").removeClass("right-aligned");
			}
			else{
			    icon.attr("status", "on");
			    $(self.tabs[self.id_current_tab].container).find(".existing_annotation").addClass("right-aligned");
			}
			return;
		    }
		    else if (action == "GROUP_NOTES"){
			var $notes = $(self.tabs[self.id_current_tab].container).find("div.notes");
			$notes.toggleClass("grouped").find(".existing_annotation").toggleClass("abs");
			return;

		    }
		    var p = {"page":new_page, "model": self.model.items[self.id_current_tab]};
		    self.tabs[self.id_current_tab].update("gotopage", p);
		    //$("#pagestats").text(new_page + " / " + numpages);


		}, false);
	});
    $(this.container).append(this.temp_tab);
    $(this.container).append(this.ul);
    $(this.container).append("<div class=\"announcement\" id=\"tip_"+this.id+"\"><p>Open a document by clicking where it appears on the tree on the left.</p><p>Once you've opened a document, annotate it by <b>double-clicking</b> anywhere on the page</p><h3>If you want to be able to...<ul><li>Zoom in and out</li><li>Minimize the panes you don't need, in order to have enough space to read the PDF</li><li>Filter which notes should be diplayed</li><li>Tag notes as <em>Highlighted</em> or <em>Hidden</em></li><li>etc...</li></ul>Try <a href='?t=p11'>our new (beta) interface...</a></h3>  </div>");
    this.closetab = function(event){
	NB.debug("closing tab");
	var id = event.currentTarget.parentNode.parentNode.getAttribute("href").substring(1);
	//	var idx = self.findTabIndex(id);
	self.model.modify("removedoc", {"id_source": id.split("_")[1]});
	//	self.ul.tabs("remove", idx);
	event.stopPropagation();
    };
    this.ul.tabs({
	    "add": function(e, ui) {		
		self.ul.tabs('select', '#' + ui.panel.id);
		var tabclose = $("<div class=\"tabclose\"/>").click(self.closetab);
		$(self.container).find(".ui-tabs-selected  span").prepend(tabclose);

	    }, 
		"show": function(e, ui) {
		    //		    NB.debug("expanding "+$("#"+ui.panel.id).attr("id_tab"));
		    self.id_current_tab = $("#"+ui.panel.id).attr("id_tab");
		    NB.pdf.expand($("#"+ui.panel.id));
		    if (self.id_current_tab){
			$("#pagestats").text(self.tabs[self.id_current_tab].page + " / " +  self.model.items[self.id_current_tab].numpages);
		    }
		    self.update_sidetab();
		} 
	});

};
    
NB.pdf.Viewer.prototype= new NB.mvc.view();
NB.pdf.Viewer.prototype.constructor = NB.pdf.Viewer;
NB.pdf.Viewer.prototype.superclass = NB.mvc.view;
NB.pdf.Viewer.prototype.findTabIndex = function(id){
    var i;
    var divs = $(this.container).find(" > .ui-tabs-panel");
    for (i=0;i<divs.length;i++){
	if (divs[i].id == id){
	    return i;
	}
    }
    return -1;
};

NB.pdf.Viewer.prototype.update_sidetab = function(){
    var self = this;
    if (this.sidetab === null){
	return;
    }
    if (this.id_current_tab == undefined){
	$(this.sidetab).find(".sidetab_header").html("<i>No document selected</i>");
	$(this.sidetab).find(".sidetab_body").empty();
	$(this.sidetab).find(".sidetab_editors_r").empty();

	return;
    }
    //now, assume a real document is selected ! 
    var div = $("<div><span class=\"sidetab-title\">Remarks on <b>"+this.model.items[this.id_current_tab].title+"</b></span><button action=\"add\" title=\"Add a global remark about this document\">Add remark on whole document</button></div>");
    div.find("button").click(function(event){self.model.items[self.id_current_tab].createEditor_r();});
    $(this.sidetab).find(".sidetab_header").html(div);
    self.update("neweditor_r", {"diff": {"id": self.id_current_tab}});
    self.__addRemarks(self.model.items[self.id_current_tab].msgs);

};




NB.pdf.Viewer.prototype.update = function(action, payload){
    var self = this;
    if (this.model === null){ //with that we can call update even w/ empty model (for example, for a tab)
	this.model = payload.model;
    }
    //    var docs = payload.model;
    var div, tab, $div ;
    var pagenum = 1;
    var i, j, msgs;
    var ids_changed = {};
    if (action == "open"){
	if (payload.diff.id in this.tabs){
	    NB.debug("I have this tab already...");
	    this.ul.tabs("select",  this.findTabIndex("tab_"+payload.diff.id+"_"+this.id));
	    pagenum =  this.tabs[payload.diff.id].page;
	    $("#pagestats").text(pagenum + " / " + payload.diff.numpages);

	}
	else{
	    $div = $("<div id_tab=\""+payload.diff.id+"\" id=\"tab_"+payload.diff.id+"_"+this.id+"\" class=\"expandable\">");
	    div = $div[0];
	    $(this.temp_tab).append(div);
	    tab = new NB.pdf.Tab(div, this);
	    this.tabs[payload.diff.id] = tab;
 	    $div.dblclick( function(event){NB.pdf.editorFactory(event, tab);});
	    var p = {"id_ann": payload.diff.id_ann, "page":payload.diff.page || 1, "model": this.model.items[payload.diff.id]};
	    this.tabs[payload.diff.id].update("gotopage", p);
	    //add tab to Jquery UI tabs: 
	    this.ul.tabs("add","#tab_"+payload.diff.id+"_"+this.id,payload.diff.title );	
	    //remove tip
	    var tmp_idx = this.findTabIndex("tip_"+this.id);
	    /*	    if (tmp_idx != -1){
		    this.ul.tabs("remove", tmp_idx); //remove tips given at startup
		    }
	    */
	}

    }
    else if (action == "addnotes"){
	//need to find src and pages modified:
	this.find_ids_changed("msgs", ids_changed, payload.diff);
	this.find_ids_changed("links", ids_changed, payload.diff);
	for (i in ids_changed){
	    this.tabs[i].update("addnotes", {"model": this.model.items[i]});
	}
	//SACHA FIXME special processing for remarks, which are at document level: we look at 1st msg
	//	msgs = payload.diff.msgs;
	if (this.id_current_tab === undefined){
	    return;
	}
	NB.debug("current tab is "+this.id_current_tab);
	msgs = this.model.items[this.id_current_tab].msgs;
	//	if ((msgs.length > 0) && (msgs[0].page == 0)){
	this.__addRemarks(msgs);
	//}
    }
    else if (action == "delnotes"){
	i = payload.diff.id_source;
	if (payload.diff.page == 0){
	    if ((i == this.id_current_tab) && (this.sidetab !== null)){
		$(this.sidetab).find(".existing_remark[id_ann="+payload.diff.id_ann+"]").remove();
		NB.debug("SACHA TODO");
	    }
	}
	else{
	    this.tabs[i].update("addnotes", {"model": this.model.items[i]});
	}
    }
    else if (action == "addcomments"){
	//need to find src and pages modified:
	this.find_ids_changed("comments", ids_changed, payload.diff);
	for (i in ids_changed){
	    this.tabs[i].update("addcomments", {"model": this.model.items[i]});
	}
    }
    else if (action == "pagestats"){ //just update widget
	pagenum = payload.page;
	$("#pagestats").text(pagenum + " / " + payload.diff.numpages);
    }
    else if (action == "neweditor_c"){
	i = payload.diff.id;
	this.tabs[i].update("neweditor_c", payload.diff);
    }
    else if (action == "neweditor_r"){
	i = payload.diff.id;
	NB.debug("Draw editors_r for "+i);
	var editors_r = this.model.items[i].editors_r;
	var tab_editors_r = $(this.sidetab).find(".sidetab_editors_r").empty();
	var editor_r,  f_ok, f_change_text, f_change_type, f_close;   
	f_close = function(event){
	    var id_item = $(this).parents("[id_item]")[0].getAttribute("id_item");
	    delete(editors_r[id_item]);
	    $(this).parents(".editor_r").remove();
	};
	f_change_text = function(event){
	    var id_item = this.getAttribute("id_item");
	    var ed = editors_r[id_item];
	    ed.body = event.currentTarget.value;
	};
	f_change_type = function(event){
	    var id_item = $(this).parents("[id_item]")[0].getAttribute("id_item");
	    var ed = editors_r[id_item];
	    ed.type =  this.getAttribute("value");
	    $(this).siblings().removeAttr("checked");
	    this.setAttribute("checked", "checked");
	    self.info("This note will now be "+ NB.pdf.TYPE_DESC[ed.type]);
	};
	f_ok = function(event){
	    var id_item = this.getAttribute("id2"); //id_item in conflict with jquery selector.
	    
	    //make sure we have the right text: (cut and paste may not have trigger a f_change_text)
	    var ed = editors_r[id_item];
	    ed.body = $("textarea[id_item="+id_item+"]").val();
	    
	    // make sure we have the right type: 
	    ed.type = $(".editor_r[id_item="+id_item+"] input[name="+id_item+"][checked]").attr("value");
	    
	    self.model.items[i].submitNote(0, id_item);
	    //	var $ed = $(this).find("~ .editor[id_item="+this.getAttribute("id_item")+"]");
	    //	var ed = editors[id_item];
	
	};
	for (j in editors_r){
	    editor_r = $("<div  id_item=\""+j+"\" class=\"editor_r\" ><table><tr><td><textarea  id_item=\""+j+"\"  rows=\"5\" cols=\"80\">"+editors_r[j].body+"</textarea></td><td>  <table style=\"border: thin solid #a0a0a0\"><tr> <td><input type=\"radio\" name=\""+j+"\" value=\"OpenComment\" /></td>               <td> Open comment, visible by the class</td></tr><tr><td><input  type=\"radio\" name=\""+j+"\" value=\"Assignment\"/></td>       <td>Reading assignment</td></tr><tr><td><input type=\"radio\" name=\""+j+"\" value=\"PrivateNote\"/></td> <td>Private note, visible by you only</td></tr></table>   </td><td>  <div action=\"close\"  class=\"mini_button\" title=\"Discard this note\"><img  src=\"/data/icons/png/window-close.png\"/></div>   <br/><br/>    <div action=\"save\"  id2=\""+j+"\" class=\"mini_button\" title=\"Save and Publish this Note\" ><img src=\"/data/icons/png/button_ok_24.png\"/></div>   </td></tr> </table> </div>");
	    editor_r.find("input[value="+editors_r[j].type+"]").attr("checked", "checked");
	    editor_r.find(".mini_button[action=close]").click(f_close);
	    editor_r.find(".mini_button[action=save]").click(f_ok);
	    editor_r.find("textarea").keyup(f_change_text);
	    editor_r.find("input[name="+j+"]").click(f_change_type);

	    tab_editors_r.append(editor_r);
	}
    }
    else if (action == "delete_editor_c"){
	this.find_ids_changed("comments", ids_changed, payload.diff);
	for (i in ids_changed){
	    this.tabs[i].update("delete_editor_c", {"model": this.model.items[i], "diff": payload.diff});
	}
    }
    else if (action == "neweditor"){
	i = payload.diff.id;
	this.tabs[i].update("neweditor", payload.diff);
    }
    else if (action == "delete_editor"){
	this.find_ids_changed("msgs", ids_changed, payload.diff);
	for (i in ids_changed){
	    this.tabs[i].update("delete_editor", {"model": this.model.items[i], "diff": payload.diff});
	}
	//SACHA: Special processiong for remarks
	if (self.sidetab == null){
	    return;
	}
	for (i in payload.diff.msgs){
	    $(self.sidetab).find(".editor_r[id_item="+payload.diff.msgs[i].id_editor+"]").remove();
	}
    }
    else if (action == "removedoc"){
	var id_source = payload.diff.id_source;
	var id_tab = "tab_" + id_source +"_" + this.id;
	var idx = this.findTabIndex(id_tab);
	this.ul.tabs("remove", idx);
	delete(this.tabs[id_source]);
    }
    else{
	alert("[NB.pdf.Viewer.modify] unknown action: " + action);
    }
};




NB.pdf.Viewer.prototype.__addRemarks = function(msgs){   
    var self = this;
    if (self.sidetab == null){
	return;
    }
    var self = this;
    var  div, notes, note,  i, link, links, l, w, b, h, cb, notebody, adminreply, comments, status, f_context, fullview, shortview, shortbody, f_toggle, noteheader;
    div = $("<div/>")
    //    notes =  self.model.items[self.id_current_tab].msgs;
    notes =  msgs;

    f_context = function(action, el, pos){//inspired by Tab.__addnotes.f_context
	if (action == "comment"){
	    //	    NB.pdf.editor_cFactory(el, pos, self);
	    //SACHA TODO
	    self.info("Comments on global notes not implemented yet")
	}
	else if (action == "delete"){
	    var msg={"__action__":"delete", "id_ann": $(el).attr("id_ann"), "id_source": self.id_current_tab, "page": 0};
	    self.model.setAnnotation(msg);
	}
	else{
	    NB.debug( 'Action: ' + action);
	}
    };
    f_toggle = function(event){
	var t = $(event.currentTarget)
	if (t.children(".fullview:visible").length == 1){
	    t.children(".fullview").hide();
	    t.children(".shortview").show();

	}
	else{
	    t.children(".shortview").hide();
	    t.children(".fullview").show();
	}
    };
    for (i in notes){
	note = $("<div class=\"existing_remark\" title=\"Click to toggle full view\">").click(f_toggle);
	fullview = $("<div class=\"fullview\"/>");
	shortview =  $("<div class=\"shortview\"/>");
	notebody = $("<div class=\"notebody\"/>");
	noteheader = $("<span class=\"noteheader\">["+i+"]</span>");
	adminreply = $("<div class=\"admin-reply\"/>");
	comments = $("<div class=\"comments\"/> ");
	if (notes[i].comment!=null){
	    adminreply.addClass("admin-replied");
	    shortview.addClass("short-admin-replied");
	}
	notebody.addClass(notes[i].type);
	notebody.append(noteheader);
	NB.pdf.text_br(notebody, notes[i].body);
	NB.pdf.text_br(adminreply, notes[i].comment);
	if (notes[i].body.length < NB.pdf.NUMCHARS_SHORT_VIEW){
	    shortbody = notes[i].body;
	}
	else{
	    shortbody = notes[i].body.substring(0, NB.pdf.NUMCHARS_SHORT_VIEW)+ "(...)";
	}
	shortview.text(shortbody);
	fullview.append(notebody).append(adminreply).append(comments).hide();
	div.append(note.append(fullview).append(shortview).attr("id_ann", i));
    }
    div.find(".existing_remark").contextMenu({"menu": 'PNUP'}, f_context);
    //    $(this.sidetab).find(" .text_notes").remove();
    $(this.sidetab).find(".sidetab_body").html(div);
    
    
};



NB.pdf.Viewer.prototype.set_sidetab = function(elt){
    var div = $("<div class = \"sidetab\"> <div class = \"sidetab_header\">No Document Selected</div><div class=\"sidetab_editors_r\"/> <div class = \"sidetab_body\"/></div>");
    this.sidetab = elt; // should be a DOM element 
    $(this.sidetab).append(div);
}

    NB.pdf.Viewer.prototype.find_ids_changed = function(field, ids, p){
	var i;
	var x =  p[field];
	for (i in x){
	    /*
	      if (x[i].page == 0){
	      //	    ids[x[i].id_source] = 1;
	      }
	
	      else{
	    */
	    if ((x[i].id_source in this.tabs) && (!(x[i].id_source in ids)) && (x[i].page == this.tabs[x[i].id_source].page )){
		ids[x[i].id_source] = 1;
	    }
	    //}
	}
    };

NB.pdf.expand = function(q){
    //SACHA FIXME: Temporary hack for tab views
    var     SEP_INSIDE_SIZE = 6;
    var p = q.parents("[flex]");
    var w0 = p.width() - SEP_INSIDE_SIZE;
    var h0 = p.height() - $(" .ui-tabs-nav").height() - SEP_INSIDE_SIZE;
    
    var w = w0 - parseInt(0+q.css("margin-left")) - parseInt(0+q.css("margin-right")) -  parseInt(0+q.css("border-left"))  -  parseInt(0+q.css("border-right")) -  parseInt(0+q.css("padding-left"))  -  parseInt(0+q.css("padding-right")) ;
    var h = h0 - parseInt(0+q.css("margin-top")) - parseInt(0+q.css("margin-bottom")) -  parseInt(0+q.css("border-top"))  -  parseInt(0+q.css("border-bottom")) -  parseInt(0+q.css("padding-top"))  -  parseInt(0+q.css("padding-bottom")) ;
    q.css({"width":  w+"px", "height": h+"px"});
    //	    q.find("> .expandable").each(function(){expand($(this));});
};

