/*jslint eqeq: true*/

/* breadcrumb Plugin */

(function($) {
  var V_OBJ = $.extend({},$.ui.view.prototype,{
    options: {
      trail: [],
    },
    _create: function() {
      this._model    = null;
      this._admin    = this.options.admin;
      this._active = -1;  // index of active element in the trail
      // -1 indicates that the last element is active
      this.refresh();
    },
    _setOptions: function(options) {
      // Compare previous and current trail
      // if the new trail is a subset of the old trail, then don't
      // change the breadcrumbs (only modify the active element)
      var old_trail = this.options.trail;
      var new_trail = options.trail;
      var is_subset = false;
      var i = -1;
      if(old_trail.length>new_trail.length) {
        is_subset = true;
        for(i =0;i<new_trail.length;i++) {
          if (!((new_trail[i].name == old_trail[i].name) &&
          (new_trail[i].rel == old_trail[i].rel) &&
          (new_trail[i].id_item == old_trail[i].id_item))) {
            is_subset = false;
            break;
          }
        }
      }

      if(is_subset) {
        this._active = i;
      } else {
        this._active = -1; // last element in trail is active
        this.options = options;
      }

      this.refresh();
    },
    set_model: function(model){
      var self=this;
      self._model =  model;
      model.register($.ui.view.prototype.get_adapter.call(this),  {folder: null, ensemble: null});
    },
    refresh: function() {
      // Create breadcrumb list
      var list = $("<ul/>");
      var self = this;
      self.options.trail.forEach(function(e,i) {
        $("<li><span class='link-style'>"+e.name+"</span></li>")
        .appendTo(list)
        .on("click", function(){
          $.concierge.trigger({type:e.rel, value:e.id_item});
        });
      });
      // Add the list to the parent
      $(self.bindings[0]).empty();  // Delete previous list
      $(self.bindings[0]).append(list);

      // Set active child
      $(self.bindings[0]).find('li.active').removeClass('active');
      var selector = self._active===-1?":last-child":":nth-child("+self._active+")";
      $(self.bindings[0]).find('li'+selector).addClass("active");
    }

  });
  $.widget("ui.breadcrumb",V_OBJ );
})(jQuery);
