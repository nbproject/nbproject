/* treeView Plugin
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
		self.element.html("<div class='tree'/>");
		$.mods.declare({treeview4: {js: [], css: ["/content/modules/dev/ui.treeview4.css"]}});
		$.mods.ready("treeview4", function(){});
	    },
	    _defaultHandler: function(evt){
		var self = this;
		// by default we listen to events directed to everyone
		switch (evt.type){
		case "hello": 
		    self.element.append("got a hello event with value:"+evt.value +"<br/>" );
		}
	    },
	    set_model: function(model){
		var self=this;
		self._setData("model", model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		//build view: 
		var ensemble = model.o.ensemble;
		var folder = model.o.folder;
		
		data = [];
		var sel_folder = null;
		var children_folder = null;
		for (var i in ensemble){
		    children_folder = [];
		    sel_folder  = model.get("folder", {id_ensemble: i}); 
		    for (var j in sel_folder){
			if (sel_folder.hasOwnProperty(j)){
			    numfiles  = model.get("file", {id_folder: j}).length(); 
			    children_folder.push({data: sel_folder[j].name+" <span class='numfiles'>"+numfiles+"</span>", attr: {rel: "folder", id_item: j}});
			}
		    }
		    data.push({data:  ensemble[i].name+" <span class='numfiles'>"+model.get("file", {id_ensemble: i}).length()+"</span>", children: children_folder, attr: {rel: "ensemble", id_item: i}});
		}
		tree_data = {
		    plugins : [ "themes", "json_data", "ui" ],
		    json_data : {data : data}, 
		    core: {html_titles: true}
		};
		//var T = $("div.tree", self.element);
		$.mods.declare({jstree: {js: ["../modules/jstree/jquery.jstree.js"], css: ["../modules/jstree/themes/default/style.css"]}});
		$.mods.ready("jstree", function(){
			$("div.tree", self.element).jstree(tree_data).bind("select_node.jstree", function (e, data) {
				var o = data.rslt.obj;
				$.concierge.trigger({type:o.attr("rel"), value:o.attr("id_item")});
				//return false;
			    }); 
		    });
	    },
	    _update: function(){
		/*
		  var self = this;
		  self.element.append("<p>_update request</p>");
		*/
	    }
	});
			 
    $.widget("ui.treeView",V_OBJ );
    $.ui.treeView.defaults = $.extend({}, {});
    $.extend($.ui.treeView, {
	    defaults: {
		listens: {
		    hello:null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
