/* Foos plugin: Template for views...
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
		var VIEWID = self.element.attr("id");
		/*
		 * UI Event handlers
		 */
		var _click_page= function(evt){
		    let id_item =  this.getAttribute("id_item");
		    $.concierge.trigger({type:"page", value: id_item});
		};
		let controls = $("<div class='panel controls'>controls</div>");
		self.element.addClass("fooView").html(controls);
	    },
	    _defaultHandler: function(evt){
	    }, 
	    set_model: function(model){
		this._setData('model', model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		//SACHA: continue here
	    },
	    _update: function(){
	    },
	    __update_file: function(){
	    },
	    update: function(action, payload, props){
	    }
	});
    $.widget("ui.fooView",V_OBJ );
    $.ui.fooView.defaults = $.extend({}, {});
    $.extend($.ui.fooView, {
	    defaults: {
		provides: ["foos"], 
		    listens: {
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
