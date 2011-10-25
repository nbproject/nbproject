/* notepaneView Plugin
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
		    //		    $.D("Marking thread " + id_location + " as seen !");
		    self._model.add("seen", new_seen);
		};
	    },
	    _create: function() {
		$.ui.view.prototype._create.call(this);
		var self = this;
		self._pages =  {}; //pages that have been rendered
		self._maxpage =  0; //last (i.e. max page number of) page that has been rendered
		self._page =  null; 
		self._scrollTimerID	=  null;
		self._seenTimerID	= null;
		self._id_location	= null;
		self._is_first_stroke	= true;
		self._rendered		= false;
		self.element.addClass("notepaneView").append("<div class='notepaneView-header'></div><div class='notepaneView-pages'/>");
		/*
		self.element.addClass("notepaneView").append("<div class='notepaneView-header'><button action='prev'>Prev</button> <button action='next'>Next</button> <a style='color:#777777;' href='javascript:NB.pers.expandGlobalComments()'><span class='global_comments_cnt'>0</span> global comments</a> <a style='color:#777777; margin-left: 10px;' href='javascript:$.concierge.trigger({type: \"global_editor\", value: true})'>New ...</a> </div><div class='notepaneView-pages'/>");
		
		$("button[action=prev]", self.element).click(function(){
			alert("todo");
		    });
		$("button[action=next]", self.element).click(function(){
			alert("todo");
		    });
		*/
		$.mods.declare({
			notepaneView1: {js: [], css: ["/content/modules/dev/ui.notepaneView6.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("notepaneView1", function(){});
		$.mods.ready("contextmenu", function(){});
		$("body").append("<ul id='contextmenu_notepaneView' class='contextMenu'><li class='reply'><a href='#reply'>Reply</a></li></ul>");	       	    },
	    _defaultHandler: function(evt){
		if (this._id_source ==  $.concierge.get_state("file")){
		    switch (evt.type){
		    case "page":
		    if (this._page != evt.value){
			this._page =  evt.value;			
			this._render();
			var scrollby;
			var container = $("div.notepaneView-pages", this.element);
			var sel = $("div.notepaneView-comments[page="+evt.value+"]",this.element);
			var delta_top = sel.offset().top - container.offset().top;
			container.stop(true).animate({scrollTop: (delta_top>0?"+="+delta_top:"-="+(-delta_top))  + 'px'}, 300); 
		    }
		    break;
		    case "note_hover": 
		    $("div.location-lens[id_item="+evt.value+"]", this.element).addClass("hovered");
		    break;
		    case "note_out": 
		    $("div.location-lens[id_item="+evt.value+"]", this.element).removeClass("hovered");		
		    break;
		    case "warn_page_change": 
		    var o = this._model.o.location[evt.value];
		    var page_summary;
		    if (o.page > this._page){
			this._render_one(o.page);
			page_summary = o.page;
		    }
		    else{
			page_summary = this._page
		    }
		    $("div.location-pagesummary[page="+page_summary+"]", this.element).addClass("selected");
		    break;
		    case "select_thread": 
		    $("div.location-pagesummary.selected", this.element).removeClass("selected");
		    this._id_location = evt.value;
		    if (this._seenTimerID != null){
			window.clearTimeout(this._seenTimerID);
		    }
		    this._seenTimerID = window.setTimeout(this._f_location_seen(this._id_location), 1000);
		    var o = this._model.o.location[evt.value];
		    if (o.page !=  this._page){
			this._page =  o.page;
			this._render();
		    }
		    $("div.location-lens", this.element).removeClass("selected");
		    var sel = $("div.location-lens[id_item="+evt.value+"]",this.element).addClass("selected");
		    var container = $("div.notepaneView-pages", this.element);
		    if (sel.length>0){
			var scrollby;
			var h = sel.height() ;
			var H = container.height();
			var delta_top = sel.offset().top - container.offset().top;
			var delta_bottom = delta_top + h - H;
			if (delta_top > 0){ //selected note is not too high
			    if (delta_bottom > 0) {//but it's too low... scroll down
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
		    this._keydown(evt.value);
		    break;
		    }	
		}	
	    },
	    _lens: function(l){
		var m = this._model;
		var numnotes = m.get("comment", {ID_location: l.ID}).length();
		var numseen = m.get("seen", {id_location: l.ID}).length();
		var numnew	= numnotes - numseen;
		/*
		var lf_numnotes =  "<ins class='locationflag'/>";
		if (numnew > 0){
		    lf_numnotes = "<ins class='locationflag lf-numnewnotes'>"+numnotes+"</ins>";
		}
		else if (numnotes > 1){
		    lf_numnotes = "<ins class='locationflag lf-numnotes'>"+numnotes+"</ins>";
		}
		*/
		var me = $.concierge.get_component("get_userinfo")();
		var lf_numnotes =  "<ins class='locationflag "+(numnew>0?"lf-numnewnotes":"lf-numnotes")+"'>"+numnotes+"</ins>";
		var lf_admin	= m.get("comment", {ID_location: l.ID, admin:1}).is_empty() ? "" : "<ins class='locationflag'><div class='nbicon adminicon' title='An instructor/admin has participated to this thread'/></ins>";
		var lf_me_private =  m.get("comment", {ID_location: l.ID, id_author:me.id}).is_empty() ? "": (m.get("comment", {ID_location: l.ID, type:1}).is_empty() ?  "<ins class='locationflag'><div class='nbicon meicon' title='I participated to this thread'/></ins>" : "<ins class='locationflag'><div class='nbicon privateicon' title='I have private comments in  this thread'/></ins>" );
		var bold_cl	= numnew > 0 ? "location-bold" : "";
		return "<div class='location-flags'>"+lf_numnotes+lf_admin+lf_me_private+"</div><div class='location-shortbody'><div class='location-shortbody-text "+bold_cl+"'>"+$.E(l.body)+"</div></div>";
	    }, 
	    _keydown: function(event){
		var codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
		var new_sel, id_item, id_new;
		if (event.keyCode in codes){
		    var sel = $("div.location-lens.selected", this.element);
		    if (sel.length){
			new_sel = sel[codes[event.keyCode].sel]("div.location-lens");
			if (new_sel.length){
			    this._is_first_stroke = true;
			    new_sel.click();
			}		
			else { // we need to find a following location on subsequent pages
			    id_item = sel.attr("id_item");
			    id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: this._model, direction: codes[event.keyCode].dir}); 
			    if (id_new != null){
				if (this._is_first_stroke){//add an extra keystroke between changing pages
				    this._is_first_stroke = false;			    
				    $.concierge.trigger({type:"warn_page_change", value: id_new});
				}
				else{
				    this._is_first_stroke = true;				    
				    $.concierge.trigger({type:"select_thread", value: id_new});
				}
			    }
			    else{
				$.I( codes[event.keyCode].msg);
			    }
			}
		    }
		    else{ // no selection on the page
			new_sel = $("div.location-lens")[codes[event.keyCode].no_sel](); 
			if (new_sel.length){
			    new_sel.click();
			    //			    $.D("moving selection");
			}
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
		var f = this._model.o.file[ this._id_source];
		var p = this._page;
		var p_after = p; 
		var p_before = p
		this._render_one(p);		
		//estimate how much space taken by annotations, and render a whole screen of them if not enough on current page
		var container = 	$("div.notepaneView-pages", this.element);		
		while ( container.children().last().offset().top - container.offset().top < container.height() ){
		    p_after++;
		    if (p_after<=f.numpages){
			this._render_one(p_after);
		    }		    
		    p_before--;
		    if (p_before>0){
			this._render_one(p_before);
		    }
		    if (p_before<1 && p_after >= f.numpages){
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
		    var locs	= model.get("location", {id_source:  this._id_source, page: page }).sort(self.options.loc_sort_fct);
		    var o;
		    if (locs.length){
			$pane.append("<div class='location-pagesummary' page='"+page+"'>"+locs.length+" thread"+$.pluralize(locs.length)+" on page "+page+"</div>");
		    }
		    for (var i=0;i<locs.length;i++){
			o = locs[i];
			$pane.append("<div class='location-lens' id_item='"+o.ID+"'>"+self._lens(o)+"</div>");
		    }
		    $("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass("lens-odd").filter(":odd").addClass("lens-odd");
		    self._pages[page] = true;		   
		    this._rendered = true;
		    return locs;
		}
		this._rendered = true;
		return null;
	    }, 
	    set_model: function(model){
		var self=this;
		self._model =  model;
		var id_source = $.concierge.get_state("file");
		self._id_source =  id_source ; 
		model.register($.ui.view.prototype.get_adapter.call(this),  {location: null, seen: null});
		//make placeholders for each page: 
		var f = model.o.file[id_source];
		var $pane = $("div.notepaneView-pages", self.element);
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
				    if (maxpage < f.numpages){
					self._render_one(maxpage+1);
				    }
				    else{
					return; //last page has been rendered. 
				    }
				}
			    }, 300);
			self._scrollTimerID =  timerID;   
			
		    });
		for (var i = 1;i<=f.numpages;i++){
		    $pane.append("<div class='notepaneView-comments' page='"+i+"'/>");
		}
		this._update();	
	    }, 
	    update: function(action, payload, items_fieldname){
		if (action == "add" && items_fieldname=="location"){
		    var id_source	= this._id_source; 
		    var page		= this._page;
		    if (page == null || id_source == null ){
			//initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set. 
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
			    if (D[i].id_source == id_source){
				delete pages[D[i].page];
				if (page == D[i].page){ 
				    do_render_now = true;
				}
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
			if (loc != null && loc.id_source == this._id_source && (!(loc.ID in locs_done))){
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
	    warn_page_change: null, 
	    keydown: null,
	}		    
    };
})(jQuery);
