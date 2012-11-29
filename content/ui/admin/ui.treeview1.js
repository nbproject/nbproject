/* treeView Plugin
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
		self.element.html("<b>This is a Tree View !</b><br/><div class='tree'/>");
	    },
	    _defaultHandler: function(evt){
		var self = this;
		// by default we listen to events directed to everyone
		switch (evt.type){
		case "hello": 
		    self.element.append("got a hello event with value:"+evt.value +"<br/>" );
		}
	    },
	    select: function(){
		let id = this._getData("file");
		if (id && id != $.concierge.get_state("file")){
		    $.concierge.trigger({type:"file", value:this._getData("file") });
		}
	    }, 
	    set_model: function(model){
		let self=this;
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		//build view: 
		let ensemble = model.o.ensemble;
		let folder = model.o.folder;

		data = [];
		let sel_folder = null;
		let children_folder = null;
		let sel_file = null;
		let children_file = null;
		//		let sel
		for (let i in ensemble){
		    children_folder = [];
		    sel_folder  = model.get("folder", {id_ensemble: i}); 
		    for (let j in sel_folder){
			children_file = [];
			sel_file  = model.get("file", {id_folder: j}); 
			for (let k in sel_file){
			    //    children_file.push({data: sel_file[k].title, attr: {rel: "file"}});
			    children_file.push({data: sel_file[k].title + " " + k, attr: {rel: "file"}});

			}
			children_folder.push({data: sel_folder[j].name, attr: {rel: "folder"}, children: children_file});
		    }
		    data.push({data:  ensemble[i].name, children: children_folder});
		}
		tree_data = {
            plugins : [ "themes", "json_data" ],
	    json_data : {data : data}, 
	    core: {html_titles: true}
		};
		let T = $("div.tree", self.element);
		T.jstree(tree_data);
		T.jstree("create_node", $("li.jstree-leaf")[0], "inside", {attr: {id : "gar"}, data: "gar"});
	    },
	    _update: function(){
		var self = this;
		self.element.append("<p>_update request</p>");
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
