/* stackView Plugin
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
	    _create: function() {
		$.ui.view.prototype._create.call(this);
		var self = this;
		self._children		= [];
		self._active		= 0;
		self.element.addClass("stackView").html("<div id='stackview-splash'>STACKVIEW</div>");
		var i,v, $div;
		for ( i in self.options.views){
		    v = self.options.views[i];
		    $div = $("<div class='card'/>");
		    self.element.append($div);
		    v.content($div);
		    self._children.push(v);    
		}
	    },
	    _defaultHandler: function(evt){
		switch (evt.type){
		case "folder": 
		this._id_ensemble	= this._model.o.folder[evt.value].id_ensemble;
		this._id_folder		= evt.value;
		break;
		case "ensemble": 
		this._id_ensemble	= evt.value;
		this._id_folder		= null;
		break;
		}		
		this._render();
	    },
	    _update: function(){
		/*
		  var self = this;
		  self.element.append("<p>_update request</p>");
		*/
	    }
	});
			 
    $.widget("ui.stackView",V_OBJ );
    $.ui.stackView.prototype.options = {
	listens: {
	    folder:null, 
	    ensemble: null
	}, 
	views:{}, 
    };
})(jQuery);
