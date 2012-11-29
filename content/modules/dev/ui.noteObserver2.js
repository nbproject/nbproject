/* Notes observer (headless view). 
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
 *
 * FEATURES PROVIDED: 
 *  - notes_observer

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
		var VIEWID = self.element[0].id;
		this._setData('files_notes_loaded', {});
	    },
	    _defaultHandler: function(evt){
		var self = this;
		if (evt.type == "page"){
		    var id_source =  $.concierge.get_state("file");
		    //need to add 1 value for uniqueness
		    $.concierge.logRemote("page", evt.value+"|"+id_source+"|"+(new Date()).getTime());
		}
		else if (evt.type == "file"){
		    //$.L("[noteObserver]: TODO - update file");
		    //load notes for that file if we don't have them already. 
		    var files_notes_loaded =  this._getData('files_notes_loaded');
		    if (evt.value in files_notes_loaded){
			$.L("[noteobserver]: notes already loaded for file ", evt.value);
		    }
		    else{
			$.L("[noteobserver]: loading notes for file ", evt.value);
			$.concierge.get_component("notes_loader")( {file:evt.value }, function(p){self._on_notes(p, self);});
			files_notes_loaded[evt.value]=true;
			//			this._setData('files_notes_loaded', 
		    }
		}
	    }, 
	    set_model: function(model){
		this._setData('model', model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    },
	    _on_notes: function(payload, self){
		$.L("[noteObserver]: received: ", payload );
		var m = self._getData('model');
		m.add("comment", payload["comments"]);
		m.add("location", payload["locations"]);
		m.add("link", payload["links"], 1);
		NB.pers.store.addIndex("file", "link", "id_source");//SACHA: FIXME: This should be figured out automatically ! 
		$.concierge.trigger({type:"notes_loaded_for_file",value:payload.file} );
	    }
	});
    $.widget("ui.noteObserver",V_OBJ );
    $.ui.noteObserver.defaults = $.extend({}, {});
    $.extend($.ui.noteObserver, {
	    defaults: {
		provides: ["notes_observer"], 
		    listens: {
		    file:null, 
			page:null 
			},
		    headless: true

		    },
		getter:$.ui.view.getter
		});
})(jQuery);
