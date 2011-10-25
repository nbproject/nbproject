/* docView Plugin v5
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
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		//self._bring_to_front();
		//self.repaint();
		self.element.append("<div class='util'/><div class='contents'/>");
		self._setData("last_clicked_selection", 0);
		self._setData("h", 100);//sample init
		self._setData("in_page_transition", false);
		self._setData("area_indicator", false);
		self._setData("__pbar_old", 1);
		self._setData("__best_fit", true);
		self._setData("__best_fit_zoom", 1.0); //this is computed later

	    },
	    _defaultHandler: function(evt){
		var self = this;
		var id_file = self._getData("file") ;
		if (id_file != $.concierge.get_state("file")){
		    if (!(evt.type=="notes_loaded_for_file" && evt.value==id_file)){
			//this event isn't for us ! 
			return;
		    }
		}
		/*
		 * From now on, we assume the event is directed to this view ! 
		 */ 
		switch (evt.type){
		case "page": 
		this._setData("page", evt.value);		
		$("div.material.selected", self.element).removeClass("selected");
		$("div.material[page="+evt.value+"]", self.element).addClass("selected").drawable();
		self._scroll_to_page();
		break;
		//		case "file": 
		//self._bring_to_front();
		break;
		case "zoom": 
		self._setData("__best_fit", false);
		self._generate_contents();
		self._generate_selections();
		self._scroll_to_page();
		break;
		case "notes_loaded_for_file":
		case "new_notes":
		self._generate_selections();
		break;
		case "note_hover": 
		//		$("div.selection.selected", self.element).removeClass("selected");
		$("div.selection[id_item="+evt.value+"]", self.element).addClass("hovered");
		break;
		case "note_out":
		$("div.selection[id_item="+evt.value+"]", self.element).removeClass("hovered");
		break;
		case "visibility":
		var fct = evt.value ? "show":"hide";
		$("div.selections, self.element")[fct]();
		break;
		case "global_editor": 
		var $editor = $("<div/>");
		$("div.global-editors", this.element).append($editor);
		$editor.editor();
		break;
		case "select_thread": 
		var o = this._getData("model").o.location[evt.value];
		if (o.page !=  this._getData("page")){
		    this._setData("page", o.page);
		    $("div.material.selected", self.element).removeClass("selected");
		    $("div.material[page="+o.page+"]", self.element).addClass("selected").drawable();
		    //		self._scroll_to_page();
		    //no "break" statement here b/c we need to fall through in order to select the location. 	
		}
		/*
		 * SACHA TODO: sendd-to-back feature
		 * do we really need this feature (since we now have arrow keys to select )
		// is it second time we click on this selection ?
		if (self._getData("last_clicked_selection")==evt.value){
		    // then send to back
		    var original = $("div.selection[id_item="+evt.value+"]", self.element);
		    var parent = original.parent();
		    var clone = original.clone(true);
		    original.remove();
		    parent.prepend(clone);
		    $.concierge.trigger({type:"note_out", value: evt.value});
		}
		self._setData("last_clicked_selection", evt.value);
		*/
		$("div.selection", self.element).removeClass("selected");
		var sel = $("div.selection[id_item="+evt.value+"]", self.element).addClass("selected");
		if (sel.length>0){
		    self._setData("in_page_transition", true); //prevent page change due to the upcoming scrolling
		    var scrollby;
		    var h = sel.height() ;
		    var H = this.element.height();
		    var delta_top = sel.offset().top - this.element.offset().top;
		    var delta_bottom = delta_top + h - H;
		    if (delta_top > 0){ //we're not too high
			if (delta_bottom > 0) {//but we're too low... recenter
			    scrollby = delta_bottom + H/2-h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget. 
			    this.element.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300); 	
			}
		    }
		    else{  //too high: recenter: 
			scrollby = delta_top + (h-H)/2;
			this.element.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300); 	
		    }		  		    
		    self._setData("in_page_transition", false);
		}
		break;
		}

	    },
	    select: function(){
		var id = this._getData("file");
		if (id && id != $.concierge.get_state("file")){
		    $.concierge.trigger({type:"file", value:this._getData("file") });
		}
	    }, 
	    set_model: function(model){
		var self=this;
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		//build view: 
		var current_file = $.concierge.get_state("file");
		self._setData('file', current_file); 
		self._setData('model', model);
		self.element.addClass("docView");/*.scroll(function(evt){
			if (self._timerID != null){
			    window.clearTimeout(self._timerID);
			    self._timerID = null;
			}
			if (self._getData("in_page_transition")==false){
			    self._timerID = window.setTimeout(function(){
				    var st = evt.currentTarget.scrollTop;
				    var h = self._getData("h");
				    var pbar = (st==0)? 1 :  Math.ceil(st/h);
				    var prem = h-st%h;
				    var area_indicator = (prem-0.5*evt.currentTarget.clientHeight)>0;
				    var pbar_old = self._getData("__pbar_old");
				    if ( (area_indicator != self._getData("area_indicator")) || (pbar!=pbar_old)){
					var newpage = (area_indicator) ?  pbar: pbar+1;
					self._setData("in_page_transition", true); //prevent animation
					$.D("[scroll listener] triggering 'page' to " + newpage);
					$.concierge.trigger({type: "page", value:newpage});
					self._setData("in_page_transition", false);
				    }
				    self._setData("__pbar_old", pbar);
				    self._setData("area_indicator", area_indicator);
				    
				    
				}, 300);
			    
			}
			});*/
		self._update_best_fit_zoom();
		self._generate_contents();
	    },
	    _keydown: function(event){
		var codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
		var new_sel, id_item, id_new;
		if (event.keyCode in codes){
		    var sel = $("div.selection.selected", this.element);
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
			new_sel = $("div.selection")[codes[event.keyCode].no_sel](); 
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
	    update: function(action, payload, props){
		var self = this;
		$.D("[docview.update] TODO:, ", action, payload, props);
	    }, 
	    _update: function(){
		$.ui.view.prototype._update.call(this);
		var self = this;
		self._update_best_fit_zoom();
		self._generate_contents();
		self._generate_selections();
		self._scroll_to_page();
	    },
	    _update_best_fit_zoom: function(){		
		this._setData("__best_fit_zoom", (this.element.width()+0.0)/this._getData("model").o.file[$.concierge.get_state("file")].w);
	    }, 
	    close: function(){
		var id =  this._getData("file");
		delete $.concierge.features["doc_viewer"][id];
		$.ui.view.prototype.close.call(this);
		$.D("closing docviewer",  id);
	    },
	    _scroll_to_page: function(cb){
		var self = this;
		var st = self.element[0].scrollTop;
		var pbar = Math.ceil((st+0.01)/self._getData("h"));
		//		var current_page = $.concierge.get_state("page");
		var current_page = self._getData("page");
		if ((self._getData("in_page_transition")==false) && (pbar != current_page)){
		    self._setData("in_page_transition", true);
		    var divOffset = self.element.offset().top;
		    var imgOffset = 	$("img.material[page="+current_page+"]", self.element).parent().offset().top;
		    self.element.animate({scrollTop: '+=' + (imgOffset-divOffset) + 'px'}, 500, function(){
			    $.D("scroll2page done");
			    self._setData("in_page_transition", false);
			    //if (cb)
			});
		}
		else{
		    $.D("animation to page "+current_page+" prevented, pbar="+pbar);
		}
		var w1 = $("div.material[page=1]", self.element).width();
		var w2 = self.element.width();
		self.element.scrollLeft((w1-w2)/2); //centers page
			
	    },
	    _generate_selections: function(){
		/* 
		 *  unlike generate_contents, we always regenerate the selections, irrespective 
		 *  of whether they were there previously or not
		 */
		var self = this;
		var contents;
		var id_file = self._getData("file") ;
		var model = this._getData("model");		
		var numpages = model.o.file[id_file].numpages;
		var t,l,w,h, ID, locs, o;
		var s = ($.concierge.get_constant("res")*self._getData("scale")+0.0)/($.concierge.get_constant("RESOLUTION_COORDINATES")*100);
		for (var p=1;p<=numpages;p++){		    
		    contents="";
		    locs = model.get("location", {id_source: id_file, page: p}).sort(self.options.loc_sort_fct);
		    //facet_page._filter(p, "", true);
		    for (var i=0;i<locs.length;i++){
			o = locs[i];
			ID=o.ID;
			t=o.top*s;
			l=o.left*s;
			w=o.w*s;
			h=o.h*s;
			contents+=("<div class='selection' id_item='"+ID+"' style='top: "+t+"px; left: "+l+"px; width: "+w+"px; height: "+h+"px'/>");
		    }
		    $("div.material[page="+p+"]>div.selections",  self.element).html(contents);
		}
		$("div.material>div.selections>div.selection", self.element).mouseover(function(evt){
			var id_item = evt.currentTarget.getAttribute("id_item");
			$.concierge.trigger({type:"note_hover", value: id_item});
		    }).mouseout(function(evt){
			    var id_item=evt.currentTarget.getAttribute("id_item");
			    $.concierge.trigger({type:"note_out", value: id_item});
			}).click(function(evt){
				var id_item=evt.currentTarget.getAttribute("id_item");
				$.concierge.trigger({type:"select_thread", value: id_item});
			    });
		
	    },
	    _generate_links: function(){
		var self = this;
		var contents;
		var id_file = self._getData("file");
		var m = this._getData("model");
		// use our index to find links for this file: 
		var index = m.indexes["file"]["link"][id_file];
		var links = m.o.link;
		var numpages = m.o.file[id_file].numpages;
		var link;
		var s = ($.concierge.get_constant("res")*self._getData("scale")+0.0)/($.concierge.get_constant("RESOLUTION_COORDINATES")*100);

		for (var p=1;p<=numpages;p++){		    
		    contents="";
		    for (var id in index){
			link = links[id];
			if (link.page==p){
			    //SACHA continue here !!!
			    ID=note.ID[0];
			    t=note.top[0]*s;
			    l=note.left[0]*s;
			    w=note.w[0]*s;
			    h=note.h[0]*s;
			    contents+=("<div class='selection' id_item='"+ID+"' style='top: "+t+"px; left: "+l+"px; width: "+w+"px; height: "+h+"px'/>");
			}
		    }
		    $("div.material[page="+p+"]>div.selections",  self.element).html(contents);
		}
		$("div.material>div.selections>div.selection", self.element).mouseover(function(evt){
			var id_item=evt.currentTarget.getAttribute("id_item");
			$.concierge.trigger({type:"note_hover", value: id_item});
 
		    }).mouseout(function(evt){
			    var id_item=evt.currentTarget.getAttribute("id_item");
			    $.concierge.trigger({type:"note_out", value: id_item});
			}).click(function(evt){
				var id_item=evt.currentTarget.getAttribute("id_item");
				$.concierge.trigger({type:"select_thread", value: id_item});
			    });


		
	    }, 
	    _generate_contents: function(){
		/*
		 * either generates or updates contents
		 * we don't systematically generate it so we can keep the editors, drawables etc...
		 */
		var self = this;
		var contents = "<div class='global-editors'><a style='color:#777777;' href='javascript:NB.pers.expandGlobalComments()'><span class='global_comments_cnt'>0</span> global comments</a> <a style='color:#777777; margin-left: 10px;' href='javascript:$.concierge.trigger({type: \"global_editor\", value: true})'>New ...</a></div>";
		var current_file = $.concierge.get_state("file");
		var model = this._getData("model");
		// SACHA TODO: adapt the original resolution to the screen size		
		var res0	= $.concierge.get_constant("res");
		var scale0	= $.concierge.get_constant("scale");
		var width0	= model.o.file[current_file].w;
		//var width0	= 612; //SACHA: FIXME - should check it's really the case ! 

		//		var height0	= 792;
		var height0	= model.o.file[current_file].h;
		var zoom	= self._getData("__best_fit") ? self._getData("__best_fit_zoom") : $.concierge.get_state("zoom");
		var RESOLUTIONS = $.concierge.get_constant("RESOLUTIONS");
		var res		= res0;
		var scale	= scale0;
		var candidate_scale = scale;
		var desired_scale = zoom * scale0;
		var resols	= [];
		for (scale in RESOLUTIONS[res]){
		    resols.push(parseInt(scale));
		}
		resols.sort(function(a,b){return a-b;});
		candidate_scale = resols[resols.length-1];
		for (var i=resols.length-1;i>-1;i--){
		    if (resols[i]<desired_scale){
			break;
		    }
		    else{
			candidate_scale=resols[i];
		    }
		}
		scale		= candidate_scale;
		//		$.D("selected scale: ", scale);
		self._setData("resolution", res0);
		self._setData("scale", scale);
		$.concierge.trigger({type: "scale", value: scale}); //way to let other views (such as editor) know. 
		var w = parseInt((width0*scale)/scale0); //page width
		var h = parseInt((height0*scale)/scale0);
		//self._setData("h", h+15); //SACHA: FIXME: 15pixels correpoding to margins shouldn't be hard-encoded
		self._setData("h", h);
		var src="";


		if ($(">div.contents>div.material", self.element).length==0){ // material never generated
		    for (var i=1;i<=model.o.file[current_file].numpages;i++){
			src = self.options.img_server+"/pdf/cache2/"+res+"/"+scale+"/"+current_file+"?invite_key="+self.options.invite_key+"&amp;page="+i;
			style = "width: "+w+"px;height: "+h+"px";
			contents+="<div class='material'  page='"+i+"' style='"+style+"' ><div class='selections'/><div class='links'/><img class='material' page='"+i+"' src='"+src+"'/></div>";
		    }
		    $("div.contents", self.element).html(contents);
		    $("div.material", self.element).click(function(evt){
			    var numpage = evt.currentTarget.getAttribute("page");
			    //			    if (numpage != $.concierge.get_state("page")){
			    if (numpage != self._getData("page")){
				self._setData("in_page_transition", true); //prevent animation
				$.concierge.trigger({type: "page", value:numpage});
				self._setData("in_page_transition", false);
			    }
			});
		}
		else{ //update existing contents: 
		    $(">div.contents>div.material", self.element).each(function(j){
			    var $this = $(this);
			    var i = $this.attr("page");
			    src = self.options.img_server+"/pdf/cache2/"+res+"/"+scale+"/"+current_file+"?invite_key="+self.options.invite_key+"&amp;page="+i;
			    style = "width: "+w+"px;height: "+h+"px";
			    $this.attr("style", style);
			    $this.children("img.material").attr("src", src);
			});
		}
	    }
	});
			 
    $.widget("ui.docView",V_OBJ );
    $.ui.docView.defaults = $.extend({}, {});
    $.extend($.ui.docView, {
	    defaults: {
		img_server: "http://localhost", 
		loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
		    invite_key: "", 
		    provides: ["doc"], 
		    listens: {
		    file:null, 
			page:null, 
			zoom: null, 
			notes_loaded_for_file: null, 
			new_notes: null, 
			note_hover: null, 
			note_out: null, 
			visibility: null, 
			global_editor: null, 
			select_thread: null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
