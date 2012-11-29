/* threadview Plugin
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
		self._setData("location", null); 

		self.element.addClass("threadview").append("<div class='threadview-header'><button action='prev'>Prev</button> <button action='next'>Next</button> </div><div class='threadview-pane'/>");
		$("button[action=prev]", self.element).click(function(){
			alert("todo");
		    });
		$("button[action=next]", self.element).click(function(){
			alert("todo");
		    });
		$.mods.declare({
			threadview1: {js: [], css: ["/content/modules/dev/ui.threadview1.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("threadview1", function(){});
		$.mods.ready("contextmenu", function(){});
		$("body").append("<ul id='contextmenu_threadview' class='contextMenu'><li class='reply'><a href='#reply'>Reply</a></li></ul>");	       	    
	    },
	    _defaultHandler: function(evt){
		if (this._getData("file") ==  $.concierge.get_state("file")){
		    switch (evt.type){
		    case "select_thread":
		    this._setData("location", evt.value);
		    this._render();
		    break;
		    }	
		}	
	    },
	    _lens: function(o){
		return "<div class='note-lens' id_item='"+o.ID+"'>"+$.E(o.body)+"</div>";
	    },
	    _comment_sort_fct: function(o1, o2){return o1.ID-o2.ID;},
	    _fill_tree: function(m, c){
		var $div = $("<div class='threadview-branch'>"+this._lens(c)+"</div>");
		var children = m.get("comment", {ID_location: c.ID_location, id_parent: c.ID}).sort(this._comment_sort_fct);		
		for (var i = 0; i<children.length;i++){
		    $div.append(this._fill_tree(m,children[i]));
		}
		return $div;
	    },
	    _render: function(){	
		var self	= this;
		var model	= self._getData("model"); 			      
		var $pane	= $("div.threadview-pane", self.element).empty();
		var root	= model.get("comment", {ID_location: self._getData("location"), id_parent: null}).sort(this._comment_sort_fct)[0];
		$pane.append(this._fill_tree(model, root));
		var f_context = function(action, el, pos){		    
		    switch (action){
		    case "reply": 
		    $.concierge.get_component("editor_menu")();
		    $.L("open", el);
		    break;
		    }
		};
		$("div.note-lens", $pane).contextMenu({menu: "contextmenu_threadview"}, f_context);
	    }, 
	    set_model: function(model){
		var self=this;
		self._setData("model", model);
		var id_source = $.concierge.get_state("file");
		self._setData('file', id_source ); 
		model.register($.ui.view.prototype.get_adapter.call(this),  {location: null, comment: null});
	    },
	    update: function(action, payload, items_fieldname){
	    }
	});
			 
    $.widget("ui.threadview",V_OBJ );
    $.ui.threadview.defaults = $.extend({}, {});
    $.extend($.ui.threadview, {
	    defaults: {
		loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
		    listens: {
		    select_thread: null, 
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
