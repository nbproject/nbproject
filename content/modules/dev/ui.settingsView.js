/* settingsView Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
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
        self._bring_to_front();
        self.repaint();
        self.element.html("<div class='util'/><div class='contents'/>");
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
        self.element.addClass("settingsView");
        self.element.html("<div>No settings yet</div>");

    },
    update: function(action, payload, props){
        var self = this;
        $.L("[settingsView] TODO updating:, ", action, payload, props);
    }, 
    });
             
    $.widget("ui.settingsView",V_OBJ );
    $.ui.settingsView.defaults = $.extend({}, {});
    $.extend($.ui.settingsView, {
    defaults: {
    provides: ["settings"], 
          listens: {
          settings: null
    }            
    },
          getter:$.ui.view.getter
                 });
})(jQuery);
