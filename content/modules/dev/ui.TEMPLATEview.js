/* editorview Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
        $.ui.view.prototype._create.call(this);
        var self = this;
        $.mods.declare({
            editorview1: {js: [], css: ["/content/modules/dev/ui.editorview1.css"]}, 
                });
        $.mods.ready("editorview1", function(){});
        },
        _defaultHandler: function(evt){
        if (this._file ==  $.concierge.get_state("file")){
            switch (evt.type){
            case "__YOUR_EVENT_HERE__":
            break;
            }    
        }    
        },
        set_model: function(model){
        var self=this;
        self._model =  model;
        var id_source = $.concierge.get_state("file");
        self._file =  id_source ; 
        // add this to be notified of model events: 
        // model.register($.ui.view.prototype.get_adapter.call(this),  {YOUR_EVENT1: null});
        },
        update: function(action, payload, items_fieldname){
        }
    });
             
    $.widget("ui.editorview",V_OBJ );
    $.ui.editorview.prototype.options = {
    listens: {
        YOUR_EVENT_HERE: null, 
    }
    };
})(jQuery);
