/* homepage Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
 * FEATURES PROVIDED: 
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
	    self.model = null;
	    var VIEWID = self.element.attr("id");
	    /*
	     * UI Event handlers
	     */
	    var _click_aag= function(evt){
		$.concierge.trigger({type:"collection", value: "newtopics"});
	    };
	    //	    self.element.addClass("homepage").html("<img src='/data/icons/png/proto/homepage.png'/>");	    
	    self.element.addClass("homepage").html("<iframe class='homepage_proto' style='width:650px;height:550px' src='/data/proto/homepage.svg'/>");	    
	    $("iframe").load(function(){
		    let svg = $("iframe.homepage_proto").contents();
		    $("#aag", svg)[0].addEventListener("click", _click_aag, false);
		    //		    alert("iframeready");
		});
	    },
	_defaultHandler: function(evt){
	    var self = this;
	    if (evt.type == "page"){
		$.L("[homepage]: TODO - current_page, look at thumbnail");
	    }
	    else if (evt.type == "file"){
		//bring to front
		self.element.parent().viewport("select", self.element.attr("id"));
	    }
	}, 
	set_model: function(model){
	    this.model = model;
	    //for now, we don't register to receive any particular updates.
	    model.register($.ui.view.prototype.get_adapter.call(this),  {});
	},
	update: function(action, payload, props){
	    var self = this;
	    $.L("[thumbnailview] TODO updating:, ", action, payload, props);
	}
    });
    $.widget("ui.homepage",V_OBJ );
    $.ui.homepage.defaults = $.extend({}, {});
    $.extend($.ui.homepage, {
    defaults: {
    provides: ["doc"], 
		  listens: {
		  file:null, 
				   page:null, 
				   }		    
    },
		  getter:$.ui.view.getter
			     });
})(jQuery);
