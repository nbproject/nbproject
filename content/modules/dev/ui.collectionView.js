/* CollectionView Plugin
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
		self.model = null;
		self.element.addClass("collectionView").html("<img src='/data/icons/png/proto/collection1.png'/>");
	    },
	    _defaultHandler: function(evt){
		var self = this;
		if (evt.type == "collection"){
		    //bring to front
		    self.element.parent().viewport("smoothSelect", self.element.attr("id"));
		}
		else{
		    $.L("[collectionView]: TODO -", evt.type);
		}
	    }, 
	    set_model: function(model){
		this.model = model;
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    },
	    update: function(action, payload, props){
		var self = this;
		$.L("[collectionview] TODO updating:, ", action, payload, props);
	    }
	});
    $.widget("ui.collectionView",V_OBJ );
    $.ui.collectionView.defaults = $.extend({}, {});
    $.extend($.ui.collectionView, {
	    defaults: {
		provides: ["collections"], 
		    listens: {
		    collection:null, 
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
