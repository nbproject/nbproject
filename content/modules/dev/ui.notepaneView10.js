/* notepaneView Plugin - Whole threads version
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *

 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _f_location_seen: function(id_location){
		var self = this;
		return function(){
		    var m = self._model;
		    var o = m.get("comment", {ID_location: id_location});
		    var i;
		    var new_seen = {};
		    for (i in o){
			if (o.hasOwnProperty(i) && (!(i in m.o.seen))){
			    new_seen[i] = {id: i, id_location: id_location};
			    $.concierge.logHistory("seen", i);
			}
		    }		    
		    self._model.add("seen", new_seen);
		};
	    },
	    _create: function() {
		$.ui.view.prototype._create.call(this);
		var self = this;
		self._pages =  {}; //pages that have been rendered
		self._maxpage =  0; //last (i.e. max page number of) page that has been rendered
		self._page =  null; //current page  
		self._scrollTimerID	=  null;
		self._seenTimerID	= null;
		self._id_location	= null;
		self._rendered		= false;
		self._id_collection =  null;
		self._collection = null;
		self._location = null; //selected location (might not be on current page)
		self._me = null;

		self.element.addClass("notepaneView").addClass("threadview").append("<div class='notepaneView-header'></div><div class='notepaneView-pages'/>");
       		$.mods.declare({
			notepaneView1: {js: [], css: ["/content/modules/dev/ui.notepaneView6.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("notepaneView1", function(){});
		$.mods.ready("contextmenu", function(){});
		$("body").append("<ul id='contextmenu_notepaneView' class='contextMenu'><li class='reply'><a href='#reply'>Reply</a></li></ul>");	       	    },
	    _defaultHandler: function(evt){
		var self	= this;
		switch (evt.type){
		case "page":
		    if (self._page != evt.value){
			self._page =  evt.value;			
			self._render();
			var scrollby;
			var container = $("div.notepaneView-pages", self.element);
			var sel = $("div.notepaneView-comments[page="+evt.value+"]",self.element);
			var delta_top = sel.offset().top - container.offset().top;
			container.stop(true).animate({scrollTop: (delta_top>0?"+="+delta_top:"-="+(-delta_top))  + 'px'}, 300); 
		    }
		    break;
		case "note_hover": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("hovered");
		    break;
		case "note_out": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("hovered");		
		    break;
		case "select_thread": 
		    self._id_location = evt.value;
		    if (self._seenTimerID != null){
			window.clearTimeout(self._seenTimerID);
		    }
		    self._seenTimerID = window.setTimeout(self._f_location_seen(self._id_location), 1000);
		    var o = self._model.o.location[evt.value];
		    if (self._location == null || o.ID != self._location.ID){
			self._location = o;
			self._page =  self._collection.index[o.ID]+1;
			self._render();
		    }
		    $("div.location-lens", self.element).removeClass("selected");
		    var sel = $("div.location-lens[id_item="+evt.value+"]",self.element).addClass("selected");
		    var container = $("div.notepaneView-pages", self.element);
		    if (sel.length>0){
			var scrollby;
			var h = sel.height() ;
			var H = container.height();
			var delta_top = sel.offset().top - container.offset().top;
			var delta_bottom = delta_top + h - H;
			if (delta_top > 0){ //we're not too high
			    if (delta_bottom > 0) {//but we're too low... recenter
				scrollby = delta_bottom + H/2-h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget. 
				container.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300); 	
			    }
			}
			else{ //too high: recenter: 
			    scrollby = delta_top + (h-H)/2;
			    container.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300); 	
			}
		    }
		    break;
		case "keydown": 
		    self._keydown(evt.value);
		    break;
		case "selection": //just display a "loading in progress"
		    var msg;
		    var v = evt.value;
		    var sel = v.sel;
		    var m = self._model;
		    var id_source = v.files[sel[1]-1].id ;
		    var id_author = v.users[sel[0]-1].id ;
		    if (id_author +"_" +id_source in m.o.stat){
			msg  = $.concierge.get_component("in_progress")();
		    }
		    else{
			msg = "<div class='no-notes'>No comments from this user</div>";
		    }
		    $pane = $("div.notepaneView-pages", self.element).html(msg);
		    $("div.notepaneView-header").empty(self.element);
		    break;
		case "collection": 
		    self._pages = {};
		    self._maxpage = 0;
		    self._page =  1;
		    self._rendered = false;
		    self.set_model(self._model);
		    break;
		}	
	    },
	    _commentlens: function(o){
		var m = this._model;
		var meta = this._collection.meta;
		if (o.id_author == meta.id_user){
		    var bold_cl = m.get("seen", {id: o.ID}).is_empty() ? "" : "note-bold";
		    var admin_info = o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class' /> ": " ";
		    var me_info = (o.id_author == this._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> ":" ";
		    var type_info = "";
		    if (o.type == 1) {
			type_info =  " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
		    }
		    else if (o.type ==2){
			type_info = " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
		    }			
		    var author_info =  " <span class='author'>"+o.fullname+"</span> ";
		    var creation_info = " <span class='created'> - "+o.created+"</span> ";
		    var replymenu = " <a class = 'replymenu' href='javascript:void(0)'>Reply</a> ";
		    var optionmenu = " <a class='optionmenu' href='javascript:void(0)'>Actions</a> ";
		    return ["<div class='note-lens' id_item='",o.ID,"'><div class='lensmenu'>", replymenu, optionmenu,"</div><span class='note-body ",bold_cl,"'>",$.E(o.body).replace(/\n/g, "<br/>"),"</span>", author_info,admin_info,me_info, type_info, creation_info,"</div>"].join("");
		}
		else{
		    return "<div class='note-abridgedlens' title=\""+$.E( o.body + " ["+o.fullname+"]").replace(/"/g, "''")+"\"><span class='abridged'>"+$.E($.ellipsis(o.body, 50))+"</span></div>"; //"
											 }
		},
		_comment_sort_fct: function(o1, o2){return o1.ID-o2.ID;},
		_fill_tree: function(c){
		    var m = this._model;
		    var $div = $("<div class='threadview-branch'>"+this._commentlens(c)+"</div>");
		    var children = m.get("comment", {ID_location: c.ID_location, id_parent: c.ID}).sort(this._comment_sort_fct);		
		    for (var i = 0; i<children.length;i++){
			$div.append(this._fill_tree(children[i]));
		    }
		    return $div;
		},
		_lens: function(l){
		    var m = this._model;
		    var root = m.get("comment", {ID_location: l.ID, id_parent: null}).first();
		    var loc_lens = $("<div class='location-lens' id_item='"+l.ID+"'/>");
		    loc_lens.append(this._fill_tree(root))
		    return loc_lens;
		}, 
		_keydown: function(event){
		    var codes = {37: {sel: "prev", no_sel: "last", dir: -1, msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: 1, msg:"No more comments below..."}}; 
		    var new_sel, id_item, id_new, new_page;
		    if (event.keyCode in codes){
			var sel = $("div.location-lens.selected", this.element);
			if (sel.length){
			    new_page =  this._collection.index[this._location.ID]+1 + codes[event.keyCode].dir;
			    if (new_page == 0 || new_page>this._collection.items.length){
				$.I( codes[event.keyCode].msg);
			    }
			    else{
				$.concierge.trigger({type:"select_thread", value: this._collection.items[new_page-1] });
			    }
			}
			else{ // no selection on the page
			    new_sel = codes[event.keyCode].no_sel == "first" ? 0 :  this._collection.items.length-1;
			    $.concierge.trigger({type:"select_thread", value: this._collection.items[new_sel]});
			    //	    new_sel.click();
			}
			return false;
		    }
		    else{
			return true; // let the event be captured for other stuff
		    }
		    //		$.D("keypressed");
		}, 
		_f_location_click : function(event){
		    var id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"select_thread", value: id_item});
		},
		_f_location_hover : function(event){
		    var id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_hover", value: id_item});
		}, 
		_f_location_out : function(event){
		    var id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_out", value: id_item});
		},
		_render: function(){
		    /*
		     * this is where we implement the caching strategy we want...
		     */
		    //first, render the current page...
		
		    //		var f = this._model.o.file[ this._id_source];
		    var m = this._model;
		    var meta = this._collection.meta;
		    var user = m.o.user[meta.id_user];
		    var file = m.o.file[meta.id_source];
		    $("div.notepaneView-header", this.element).html("<div class='collectioninfo'><span class='standout'>"+$.E(user.firstname + " " + user.lastname)+"</span>'s notes on <span class='standout'>" +$.E(file.title)+"</span></div>");
		    var items = this._collection.items;
		    
		    var p = this._page;
		    var p_after = p; 
		    var p_before = p
		    this._render_one(p);		
		    //estimate how much space taken by annotations, and render a whole screen of them if not enough on current page
		    var container = 	$("div.notepaneView-pages", this.element);		
		    while ( container.children().last().offset().top - container.offset().top < container.height() ){
			p_after++;
			if (p_after<=items.length){
			    this._render_one(p_after);
			}		    
			p_before--;
			if (p_before>0){
			    this._render_one(p_before);
			}
			if (p_before<1 && p_after >= items.length){
			    //There's just not enough annotations to render a whole screen 
			    return;
			}
		    }
		}, 
		_render_one: function(page){
		    if (page > this._maxpage){
			this._maxpage =  page;
		    }
		    if (!(page in this._pages)){
			var self	= this;
			var model	= self._model; 
			var $pane	= $("div.notepaneView-comments[page="+page+"]", self.element).empty();
			//		    var locs	= model.get("location", {id_source:  this._id_source, page: page }).sort(self.options.loc_sort_fct);
			var id_location = self._collection.items[page-1];
			var o = model.o.location[id_location];
			$pane.append(self._lens(o));
			$("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass("lens-odd").filter(":odd").addClass("lens-odd");
			self._pages[page] = true;		   
			this._rendered = true;
		    }
		    this._rendered = true;
		}, 
		set_model: function(model){
		    var self=this;
		    self._model =  model;
		    var id_collection = $.concierge.get_state("collection");
		    self._id_collection =  id_collection; 
		    //		var id_source = $.concierge.get_state("file");
		    //		self._id_source =  id_source ; 
		    //model.register($.ui.view.prototype.get_adapter.call(this),  {location: null, seen: null});
		    //make placeholders for each page: 
		    self._collection = $.concierge.get_component("get_collection")();
		    var items = self._collection.items;
		    self._me =  $.concierge.get_component("get_userinfo")();
		    //var f = model.o.file[id_source];
		    var $pane = $("div.notepaneView-pages", self.element).empty();
		    $pane.scroll(function(evt){
			    var timerID = self._scrollTimerID;
			    if (timerID != null){
				window.clearTimeout(timerID);
			    }			
			    timerID = window.setTimeout(function(){
				    //Are we within 20px from the bottom of scrolling ?
				    while ($pane.children().last().offset().top - $pane.offset().top - $pane.height() < 20){
					var maxpage = self._maxpage;
					$.D("scroll: maxpage="+maxpage);
					if (maxpage < items.length){
					    self._render_one(maxpage+1);
					}
					else{
					    return; //last page has been rendered. 
					}
				    }
				}, 300);
			    self._scrollTimerID =  timerID;   
			
			});
		    for (var i = 1;i<=items.length;i++){
			$pane.append("<div class='notepaneView-comments' page='"+i+"'/>");
		    }
		    this._update();	
		    if (this._page == null){
			this._page = 1;
		    }
		    if (items.length>0){
			this._render();
		    }
		}, 
		update: function(action, payload, items_fieldname){
		    if (action == "add" && items_fieldname=="location"){
			var id_collection	= this._id_collection; 
			var page		= this._page;
			if (page == null || id_collection == null ){
			    //initial rendering: Let's render the first page. We don't check the id_collection here since other documents will most likely have their page variable already set. 
			    this._page =  1;
			    this._pages = {};
			    this._maxpage = 0;
			    this._render();
			    //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already. 
			}
			else{
			    //send signal to redraw pages that needs to be redrawn: 
			    var D		= payload.diff;
			    var pages	= this._pages;
			    var do_render_now = false;
			    for (var i in D){
				delete pages[D[i].page];
				if (page == D[i].page){ 
				    do_render_now = true;
				}
			    }
			    if (do_render_now){
				this._maxpage = 0;
				this._render();//re-render now if al least one note on active page
			    }
			}
		    }
		    else if (action=="add" && items_fieldname=="seen" && this._rendered){
			var D		= payload.diff;
			var m		= this._model;
			var i, loc;
			var locs_done = {};
			for (i in D){
			    loc = m.get("location", {ID: D[i].id_location}).first();
			    if (loc != null  && (!(loc.ID in locs_done))){
				locs_done[loc.ID] = null;
				$("div.location-lens[id_item="+loc.ID+"]",this.element).html(this._lens(loc));
			    }
			}		   
		    }
		    else if (action == "remove" && items_fieldname == "location"){ //just re-render the pages where locations were just removed. 
			var D		= payload.diff;
			var pages_done	= {};
			var i, page;
			for (i in D){
			    page = D[i].page;
			    if (! (page in pages_done)){
				pages_done[page] = null;
				delete this._pages[page];
				this._render_one(page);
			    }
			}
		    }
		}	
	    });
	$.widget("ui.notepaneView",V_OBJ );
	$.ui.notepaneView.prototype.options = {
	    loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
	    expand: "div.notepaneView-pages", 
	    listens: {
		page: null, 
		note_hover: null, 
		note_out: null, 
		select_thread: null, 
		keydown: null,
		collection: null, 
		selection: null
	    }		    
	};
	})(jQuery);
