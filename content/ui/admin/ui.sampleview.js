/* sampleView Plugin
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
		self.element.html("<b>This is a Sample View !</b><br/><span>Value for event: </span><input type='text'/><br/><a action='hello' href='javascript:void(0)'>click here to send a 'hello' event </a>(has handler in this view)<br/><a action='file' href='javascript:void(0)'>click here to send a 'file' event</a>");
		$("input", self.element)[0].value = 570;
		$("a", self.element).click(function(evt){
			$.concierge.trigger({type: evt.target.getAttribute("action"),value: $("input", self.element)[0].value});
		    });
		// self._setData("key", "value");

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
	    },
	    _update: function(){
		var self = this;
		self.element.append("<p>_update request</p>");
	    }
	});
			 
    $.widget("ui.sampleView",V_OBJ );
    $.ui.sampleView.defaults = $.extend({}, {});
    $.extend($.ui.sampleView, {
	    defaults: {
		    listens: {
		    hello:null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
