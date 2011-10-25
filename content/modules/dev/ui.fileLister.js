/* FileLister Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
 *
 * FEATURES PROVIDED: 
 *  - ensembleList
 *  - fileList
 *  - ensemble
 *  - file

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
		self.model = null;
		var VIEWID = self.element.attr("id");
		
		/*
		 * UI Event handlers
		 */
		var _click_ensemble= function(evt){
		    let id_item =  this.getAttribute("id_item");
		    $.concierge.trigger({type:"ensemble", value: id_item});
		};
		var _click_file= function(evt){
		    let id_item =  this.getAttribute("id_item");
		    $.concierge.trigger({type:"file", value: id_item}, self);
		};
		self.element.addClass("fileLister").html("<div class='panel fileLister-ensemble'/><div class='panel fileLister-file'/>");
		$("#"+VIEWID+">div.fileLister-ensemble > div.ensemble").live("click", _click_ensemble);
		$("#"+VIEWID+">div.fileLister-file > div.file").live("click", _click_file);
	    },
	    _defaultHandler: function(evt){
		var self = this;
		if (evt.type == "ensemble"){
		    //		    self._setData("current_ensemble", evt.value);
		    $("div.ensemble.selected", self.element).removeClass("selected");
		    $("div.ensemble[id_item="+evt.value+"]", self.element).addClass("selected");
		    self.__update_file();
		}
		else if (evt.type == "file"){
		    $("div.file.selected", self.element).removeClass("selected");
		    $("div.file[id_item="+evt.value+"]", self.element).addClass("selected");
		}
	    }, 
	    sayhello: function(evt){
		$.D("HELLO evt=", evt);
	    },
	    set_model: function(model){
		this.model = model;
		model.register($.ui.view.prototype.get_adapter.call(this),  {ensemble: null, folder:null});
	    }, 
	    __update_file: function(){
		var self = this;
		//PRE: current_ensemble set
		let current_ensemble = $.concierge.get_state("ensemble");
		let $w = $("div.fileLister-file", self.element);
		if (("ensemble" in self.model.indexes)  && ("file" in self.model.indexes.ensemble)){
		    let s = "";
		    for (let i in self.model.indexes.ensemble.file[current_ensemble]){
			let a = self.model.o.file[i];
			s += "<div class='file' id_item='" + i+"'>"+self.model.o.file[i].title+"</div>";
		    }
			    $w.html(s);
		}
	    },
	    update: function(action, payload, props){
		var self = this;
		//		$.D("[fileLister] updating:, ", action, payload, props);
		var model = payload.model;
		var diff = payload.diff;
		var VIEWID = self.element.attr("id");
		var items;
		for (let prop in props){
		    if (prop=="ensemble"){
			let $w = $("div.fileLister-ensemble", self.element);
			if (action == "create"){
			    let s="";
			    for (let id in model.o[prop]){
				let item = model.o[prop][id];
				s+="<div id_item='"+id+"' class='"+prop+"'>"+item.name+"</div>";
			    }
			    $w.html(s);
			    let current_ensemble = $.concierge.get_state("ensemble");
			    if (current_ensemble===null){
				//pick 1st value: 
				for (let id in model.o[prop]){
				    $.concierge.trigger({type:"ensemble", value: id});
				    break;
				}
			    }
			}
		    }
		    else if (prop== "file"){
			//PRE: current_ensemble set
			self.__update_file();
		    }
		}
	    }
	});
    $.widget("ui.fileLister",V_OBJ );
    $.ui.fileLister.defaults = $.extend({}, {});
    $.extend($.ui.fileLister, {
	    defaults: {
		provides: ["documentList"], 
		    listens: {
		    file:null, 
			ensemble:null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
