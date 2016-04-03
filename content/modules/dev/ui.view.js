/* View Plugin v.5
 * Depends:
 *    ui.core.js
 *      concierge
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global jQuery:true*/
(function ($) {
  /*
 * The view object
 * options.headless set to false if the view is not meant to be displayed
 */
  var V_OBJ = {
    HEIGHT_MARGIN: 5,
    SERVICE: null,
    _create: function () {
      var self = this;
      var init = true;

      // initialization from scratch
      if (init) {
        if (self.options.provides) {
          $.concierge.addProviders(self.element[0].id, self.options.provides);
        }

        if (self.options.listens) {
          $.concierge.addListeners(self, self.options.listens);
        }

        if (self.options.transitions) {
          $.concierge.setTransitions(self.element[0].id, self.options.transitions);
        }

        if (!(self.options.headless)) {
          self.element.addClass('view');

          //implement a concept of "active view"
          self.element.mouseenter(function (evt) {
            $.concierge.activeView = self;
            $('div.view').removeClass('active-view');
            self.element.addClass('active-view');
          });

          //register for perspective events:
          self.element.closest('div.perspective').bind('resize_perspective', function (evt, directions) {
            self.repaint();
          });

        }

        // $.L("setting view ", this.element[0].id, " to " , this);
        $.concierge.views[this.element[0].id] = this;
      }
    },

    defaultHandler: function (evt) {
      $.L('[View]: default handler... override me !, evt=', evt);
    },

    beforeMove: function (evt) {
      $.L('[View]: default beforemove... override me !, evt=', evt);
    },

    afterMove: function (evt) {
      $.L('[View]: default aftermmove... override me !, evt=', evt);
    },

    set_model: function (model) {
      this._model = model;

      //for now, we don't register to receive any particular updates.
      model.register($.ui.view.prototype.get_adapter.call(this),  {});
    },

    repaint: function () {
      //PRE: not a headless view
      var self = this;
      /*
        var outerview = self.element.parent("div.outerview");
        var vp = outerview.parent("div.viewport");
        if(outerview.length && vp.length){
        //make sure we get offset of a visible component:
        var y0 = vp.children(".outerview:visible").offset().top - vp.offset().top;
        outerview.height(vp.height()-y0);
        }
      */
      self._update();
    },

    _update: function () {
      /*
       * If you override this function in your view, don't forget to either:
       * - to call this method to automatically use all the available space:
       *   $.ui.view.prototype._update.call(this);
       * - or to expand your view manually to fit the new space in the way you need
       *
       */

      this.element.height(this.element.parent().height());
      this.element.width(this.element.parent().width());
      this._expand();
    },

    _keydown: function (event) {
      $.L('[view._keydown] override me for ', this.element);
    },

    get_adapter: function () {
      /* enables a view to be called by the methods of an mvc.model */
      var self = this;
      var adapter = {
        update: function (action, payload, items_fieldname) {
          self.update(action, payload, items_fieldname);
        },
      };
      return adapter;
    },

    close: function () {
      var self = this;
      $.L('[View]: default closer ...override me !');
      delete $.concierge.views[self.element[0].id];
    },

    provides: function () {
      var self = this;
      return self.options.provides || {};
    },

    select: function () {
      $.L('[view]: selected ', this.element[0].id);
    },

    sayHello: function () {
      $.L("Hello, I'm view ", this.element.id);
    },

    update: function (action, payload, items_fieldname) {
      $.L('[view] updating view:, ', action, payload);
    },

    keyboard_grabber: function () {
      return $('input.focusgrabber', this.element);
    },

    _expand: function () {
      //pre: this.option.expand, is defined, refers to selectors for some children of the element
      if (!(this.options.expand)) {
        return;
      }

      var parent = this.element;
      var $expand    = parent.children(this.options.expand);
      if ($expand.length === 0) {
        return;
      }

      if ($expand.length === 1) { //allocate the whole available space
        var s0          = $expand.offset().top + parseInt($expand.css('margin-top') || 0, 10) + parseInt($expand.css('margin-bottom') || 0, 10) + parseInt($expand.css('border-top') || 0, 10) + parseInt($expand.css('border-bottom') || 0, 10) - this.element.offset().top;
        var new_height = this.element.height() - s0;
        $expand.height(new_height);
        return;
      }

      //expand refers to more than one element, so we'll allocate each height based on the expand elements' current heights.
      var $others = parent.children().not(this.options.expand);
      var h_others = 0;
      $others.each(function (i) {
        var $elt = $(this);
        h_others += $elt.height() + parseInt($elt.css('margin-top') || 0, 10) + parseInt($elt.css('margin-bottom') || 0, 10) + parseInt($elt.css('border-top') || 0, 10) + parseInt($elt.css('border-bottom') || 0, 10);
      });

      var h_available = parent.height() - parseInt(parent.css('padding-top') || 0, 10) - parseInt(parent.css('padding-bottom') || 0, 10) - h_others;
      var $expand_visible = $expand.filter(':visible');
      var FIXED_PART = 0.3; //percentage assigned equally to each widget (intedepent of its current height)
      var h_available_fixed = h_available * FIXED_PART;
      var h_available_proportional = h_available - h_available_fixed;

      //now get a sense of how much each widget needs:
      var h_expands = 0;
      $expand_visible.each(function (i) {
        this.style.height = ''; //reset previous resize
        var $elt  = $(this);
        var h    = $elt.height();
        var m    = parseInt($elt.css('margin-top') || 0, 10) + parseInt($elt.css('margin-bottom') || 0, 10) + parseInt($elt.css('border-top') || 0, 10) + parseInt($elt.css('border-bottom') || 0, 10);
        h_expands += h + m;

        //        heights.push(h);
        //            margins.push(m);
      });

      //now resize.
      var frac = h_available_proportional / h_expands;
      var fixed = parseInt(h_available_fixed / $expand_visible.length, 10);
      $expand_visible.each(function (i) {
        var $elt  = $(this);
        $elt.height(fixed + parseInt(frac * $elt.height(), 10));
      });
    },
  };

  $.widget('ui.view', V_OBJ);
  $.ui.view.prototype.options = {};
  $.extend($.ui.view, {
    version: '1.8',
    service: null,
    provides: null,
    listens: null,
    transitions: null,
  });
})(jQuery);
