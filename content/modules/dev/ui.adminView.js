/* adminView Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
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
	    self._bring_to_front();
	    self.repaint();
	    self.element.addClass("adminView");
	    self.element.html("<div class='admin_header'><span class='admin_controls_ensemble'><span> <span  class='adminview_col n0' style='width: 7em'>Admin View</span> <span  class='adminview_col n3' style='width: 7em' >Grader View</span></span></span></div>");
	    self.element.append($("#viewpanel_admin"));	    
	    self.element.append($("#grader_menu"));

	    $("span.admin_controls_ensemble", self.element).css("margin", "1px");

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
	    


	},
	update: function(action, payload, props){
	    var self = this;
	    $.L("[adminView] TODO updating:, ", action, payload, props);
	}, 
    });
			 
    $.widget("ui.adminView",V_OBJ );
    $.ui.adminView.defaults = $.extend({}, {});
    $.extend($.ui.adminView, {
    defaults: {
    provides: ["admin"], 
		  listens: {
		  admin: null
    }		    
    },
		  getter:$.ui.view.getter
			     });
})(jQuery);
