/* notepaneView Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		self.element.addClass("notepaneView").append("<div class='notepaneView-header'><button action='prev'>Prev</button> <button action='next'>Next</button> </div><div class='notepaneView-comments'/>");
		$("button[action=prev]", self.element).click(function(){
			alert("todo");
		    });
		$("button[action=next]", self.element).click(function(){
			alert("todo");
		    });
		//self.element.keypress(function(event){
		self.keyboard_grabber().keypress(function(event){
			var codes = {37: {sel: "prev", no_sel: "last", dir: "up"}, 39: {sel: "next", no_sel:"first", dir: "down"}}; 
			var new_sel, id_item, id_new;
			if (event.keyCode in codes){
			    var sel = $("div.location-lens.selected", self.element);
			    if (sel.length){
				new_sel = sel[codes[event.keyCode].sel]();
				if (new_sel.length){
				    new_sel.click();
				    $.L("moving selection");
				}
				else { // we need to find next location on subsequent pages
				    id_item = sel.attr("id_item");
				    id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: self._getData("model"), direction: codes[event.keyCode].dir}); 
				    $.concierge.trigger({type:"location", value: id_new});
				}
			    }
			    else{ // no selection on the page
				new_sel = $("div.location-lens")[codes[event.keyCode].no_sel](); 
				if (new_sel.length){
				    new_sel.click();
				    $.L("moving selection");
				}
			    }

			}
			$.L("keypressed");
		    });
		$.mods.declare({
			notepaneView1: {js: [], css: ["/content/modules/dev/ui.notepaneView6.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("notepaneView1", function(){});
		$.mods.ready("contextmenu", function(){});
		$("body").append("<ul id='contextmenu_notepaneView' class='contextMenu'><li class='reply'><a href='#reply'>Reply</a></li></ul>");	       	    },
	    _defaultHandler: function(evt){
		if (this._getData("file") ==  $.concierge.get_state("file")){
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
		    case "location":		    
		    var o = this._getData("model").o.location[evt.value];
		    this._setData("page", o.page);
		    this._render();
		    $("div.location-lens[id_item="+evt.value+"]").click();
		    //no "break" statement here b/c we need to fall through in order to select the location. 
		    case "sel_click": 
		    case "note_click": 
		    var e = $("div.location-lens[id_item="+evt.value+"]",self.element);
		    $("div.location-lens", self.element).removeClass("selected");

		    if (e.length>0){
			var divOffset = this.element.offset().top;
			this.element.animate({scrollTop: '+=' + (e.offset().top-divOffset-50) + 'px'}, 200, function(){});
			//		    e[0].scrollIntoView();
			e.addClass("selected");
		    }
		    break;
		    }	
		}	
	    },
	    _lens: function(l){
		return "<div class='location-lens' id_item='"+l.ID+"'><div class='location-shortbody'><div class='location-shortbody-ellipsis'/><div class='location-shortbody-text'>"+$.E(l.body)+"</div></div></div>";
	    }, 	  
	    _f_location_click : function(event){
		var id_item = event.currentTarget.getAttribute("id_item");
		$.concierge.trigger({type:"note_click", value: id_item});
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
		var self=this;
		var model = self._getData("model"); 
		var $pane = $("div.notepaneView-comments", self.element).empty();
		var locs =  model.get("location", {id_source:  this._getData("file"), page:  this._getData("page")}).sort(self.options.loc_sort_fct);
		var l;
		for (var i=0;i<locs.length;i++){
		    l = locs[i];
		    $pane.append(self._lens(l));
		}
		$("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out);///.each(function(i){
	    }, 
	    set_model: function(model){
		var self=this;
		self._setData("model", model);
		self._setData('file', $.concierge.get_state("file")); 
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    },
	    _update: function(){
		/*
		  var self = this;
		  self.element.append("<p>_update request</p>");
		*/
	    }, 
	    update: function(action, payload, items_fieldname){
		alert("TODO update:  "+ action);
	    }
	});
			 
    $.widget("ui.notepaneView",V_OBJ );
    $.ui.notepaneView.defaults = $.extend({}, {});
    $.extend($.ui.notepaneView, {
	    defaults: {
		loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
		    listens: {
		    page: null, 
			note_hover: null, 
			note_out: null, 
			sel_click: null, 
			note_click: null, 
			location: null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
