/* Exhibit-based fileView plugin
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
		self.repaint();
		self.element.addClass("fileView");
		self.files_loaded = {}; 
	    },
	    _defaultHandler: function(evt){
	
	    },
	    set_model: function(model){
		var self = this;
		$("img.exhibit-facet-header-collapse", self.element).click(function(){
			self._update();
		    });
		this._setData("model", model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    },
	    update: function(action, payload, props){
		var self = this;
		$.D("[fileview] TODO updating:, ", action, payload, props);
	    }, 
	    _update: function(){
		let outerview = this.element.parent();
		let hidden = false;
		//needs to remove hiding for a moment, so we have meaningful dimensions. 
		if (outerview.hasClass("ui-tabs-hide")){
		    hidden = true;
		    outerview.removeClass("ui-tabs-hide");
		}
		let files = $("div.files", this.element);
		let controls =  $("div.controls", this.element);
		let y0 = files.offset().top +parseInt(files.css("margin-top")) - this.element.offset().top;
		files.height(this.element.height() - y0);
		if (hidden){
		    outerview.addClass("ui-tabs-hide");
		}
	    },
	});
    $.widget("ui.fileView",V_OBJ );
    $.ui.fileView.defaults = $.extend({}, {});
    $.extend($.ui.fileView, {
	    defaults: {
		provides: [], 
		    listens: {
		}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
