/* mynotesView Plugin
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
	    self._bring_to_front();
	    self.repaint();
	    self.element.html("<iframe class='homepage_proto' style='width:100%;height:100%' src='?t=p10'/>")
	},
	_defaultHandler: function(evt){
	    var self = this;
	    self._bring_to_front();

	},
	select: function(){
	}, 
	set_model: function(model){	    
	    let self=this;
	    //for now, we don't register to receive any particular updates.
	    model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    //build view: 
	    self._setData('model', model);
	    self.element.addClass("mynotesView");
	},
	update: function(action, payload, props){
	    var self = this;
	    $.D("[mynotesView] TODO updating:, ", action, payload, props);
	}, 
    });
			 
    $.widget("ui.mynotesView",V_OBJ );
    $.ui.mynotesView.defaults = $.extend({}, {});
    $.extend($.ui.mynotesView, {
    defaults: {
    provides: ["mynotes"], 
		  listens: {
		  mynotes: null
    }		    
    },
		  getter:$.ui.view.getter
			     });
})(jQuery);
