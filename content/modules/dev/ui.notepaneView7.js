/* notepaneView Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *

 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		self._setData("pages", {}); //pages that have been rendered
		self._setData("maxpage", 0); //last (i.e. max page number of) page that has been rendered
		self._setData("page", null); 
		self._setData("scrollTimerID", null);
		self.element.addClass("notepaneView").append("<div class='notepaneView-header'><button action='prev'>Prev</button> <button action='next'>Next</button> <a style='color:#777777;' href='javascript:NB.pers.expandGlobalComments()'><span class='global_comments_cnt'>0</span> global comments</a> <a style='color:#777777; margin-left: 10px;' href='javascript:$.concierge.trigger({type: \"global_editor\", value: true})'>New ...</a> </div><div class='notepaneView-pages'/>");
		$("button[action=prev]", self.element).click(function(){
			alert("todo");
		    });
		$("button[action=next]", self.element).click(function(){
			alert("todo");
		    });
		$.mods.declare({
			notepaneView1: {js: [], css: ["/content/modules/dev/ui.notepaneView6.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("notepaneView1", function(){});
		$.mods.ready("contextmenu", function(){});
		$("body").append("<ul id='contextmenu_notepaneView' class='contextMenu'><li class='reply'><a href='#reply'>Reply</a></li></ul>");	       	    },
	    _defaultHandler: function(evt){
		if (this._getData("id_source") ==  $.concierge.get_state("file")){
		    switch (evt.type){
		    case "page":
		    this._setData("page", evt.value);			
		    this._render();
		    break;
		    case "note_hover": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("hovered");
		    break;
		    case "note_out": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("hovered");		
		    break;
		    case "select_thread": 
		    var o = this._getData("model").o.location[evt.value];
		    if (o.page !=  this._getData("page")){
			this._setData("page", o.page);
			this._render();
		    }
		    //		    $("div.location-lens[id_item="+evt.value+"]").click();
		    //no "break" statement here b/c we need to fall through in order to select the location. 
		    //		    case "select_thread": 	    
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
		    }	
		}	
	    },
	    _lens: function(l){
		return "<div class='location-lens' id_item='"+l.ID+"'><div class='location-shortbody'><div class='location-shortbody-text'>"+$.E(l.body)+"</div></div></div>";
	    }, 
	    _keydown: function(event){
		var codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
		var new_sel, id_item, id_new;
		if (event.keyCode in codes){
		    var sel = $("div.location-lens.selected", this.element);
		    if (sel.length){
			new_sel = sel[codes[event.keyCode].sel]();
			if (new_sel.length){
			    new_sel.click();
			}
			else { // we need to find next location on subsequent pages
			    id_item = sel.attr("id_item");
			    id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: this._getData("model"), direction: codes[event.keyCode].dir}); 
			    if (id_new != null){
				$.concierge.trigger({type:"select_thread", value: id_new});
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
			    //			    $.L("moving selection");
			}
		    }
		    return false;
		}
		else{
		    return true; // let the event be captured for other stuff
		}
		//		$.L("keypressed");
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
		var f = this._getData("model").o.file[ this._getData("id_source")];
		var p = this._getData("page");
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
		if (!(page in this._getData("pages"))){
		    var self	= this;
		    var model	= self._getData("model"); 
		    var $pane	= $("div.notepaneView-comments[page="+page+"]", self.element).empty();
		    var locs	= model.get("location", {id_source:  this._getData("id_source"), page: page }).sort(self.options.loc_sort_fct);
		    var o;
		    for (var i=0;i<locs.length;i++){
			o = locs[i];
			$pane.append(self._lens(o));
		    }
		    $("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass("lens-odd").filter(":odd").addClass("lens-odd");
		    self._getData("pages")[page] = true;
		    if (page > self._getData("maxpage")){
			self._setData("maxpage", page)
		    }
		    return locs;
		}
		return null;
	    }, 
	    set_model: function(model){
		var self=this;
		self._setData("model", model);
		var id_source = $.concierge.get_state("file");
		self._setData("id_source", id_source ); 
		model.register($.ui.view.prototype.get_adapter.call(this),  {location: null});
		//make placeholders for each page: 
		var f = model.o.file[id_source];
		var $pane = $("div.notepaneView-pages", self.element);
		$pane.scroll(function(evt){
			var timerID = self._getData("scrollTimerID");
			if (timerID != null){
			    window.clearTimeout(timerID);
			}			
			timerID = window.setTimeout(function(){
				//Are we within 20px from the bottom of scrolling ?
				while ($pane.children().last().offset().top - $pane.offset().top - $pane.height() < 20){
				    var maxpage = self._getData("maxpage");
				    if (maxpage < f.numpages){
					self._render_one(maxpage+1);
				    }
				    else{
					return; //last page has been rendered. 
				    }
				}
			    }, 300);
			self._setData("scrollTimerID", timerID);   
			
		    });
		for (var i = 1;i<=f.numpages;i++){
		    $pane.append("<div class='notepaneView-comments' page='"+i+"'/>");
		}
		this._update();	
	    }, 
	    update: function(action, payload, items_fieldname){
		if (action == "add" && items_fieldname=="location"){
		    var id_source	= this._getData("id_source"); 
		    var page		= this._getData("page");
		    if (page == null || id_source == null ){
			//initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set. 
			this._setData("page", 1);
			this._render();
			//TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already. 
		    }
		    else{
			//send signal to redraw pages that needs to be redrawn: 
			var D		= payload.diff;
			var pages	= this._getData("pages");
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
			    this._render();//re-render now if al least one note on active page
			}
		    }
		}
	    }
	});
	
    $.widget("ui.notepaneView",V_OBJ );
    $.ui.notepaneView.defaults = $.extend({}, {});
    $.extend($.ui.notepaneView, {
	    defaults: {
		loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
		    expand: "div.notepaneView-pages", 

		    listens: {
		    page: null, 
			note_hover: null, 
			note_out: null, 
			select_thread: null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
