/*
 * based on jquery draggable
 *

 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true */

(function ($) {
  var V_OBJ = {
    _create: function () {
      this._mouseInit();
      this._model =  this.options.model;
      var helper = $("<div class='ui-drawable-helper'/>");
      this.element.addClass('ui-drawable').append(helper);
      this._helper =  helper;
    },

    destroy: function () {
      if (!this.element.data('drawable')) {return;}

      this.element.removeData('drawable').unbind('.drawable').removeClass('ui-drawable');
      $('div.ui-drawable-helper', this.element).remove();
      this._mouseDestroy();
    },

    _mouseCapture: function (event) {
      return true;
    },

    _mouseStart: function (event) {
      //only listen if on current page:
      /*
        if (this.element.attr("page")!=$.concierge.get_state("page")){
        return false;
        }
      */
      var p0 = { top:  event.pageY, left: event.pageX };
      var o = this.element.offset();
      var M0 = { top: (p0.top - o.top), left: (p0.left - o.left) };
      this._p0 =  p0;
      this._M0 =  M0;
      this._helper.show().css({ top: M0.top + 'px', left: M0.left + 'px' });
      $.concierge.trigger({ type: 'drawable_start', value:0 });
      return true;
    },

    _mouseDrag: function (event, noPropagation) {
      //        $.L("mousedrag");
      var p0 = this._p0;
      var M0 = this._M0;
      var p = {};
      var w =  event.pageX - p0.left;
      var h =  event.pageY - p0.top;

      if (w >= 0) {
        p.width = w;
      }      else {
        p.left = M0.left + w;
        p.width = -w;

      }

      if (h >= 0) {
        p.height = h;
      }      else {
        p.top = M0.top + h;
        p.height = -h;

      }

      this._helper.css(p);
      return false;
    },

    _mouseStop: function (event) {
      // make sure every view is at that page
      $.concierge.trigger({ type: 'page', value:this.element.attr('page') });
      this.editorFactory2();
      return false;
    },

    editorFactory2: function () {
      var h = this._helper;
      $.concierge.trigger({ type: 'new_thread', value: { selection: h } });
      h.hide();
    },
  };

  $.widget('ui.drawable', $.ui.mouse, V_OBJ);
  $.ui.drawable.prototype.options =  {
    distance: 5,
    model: null,
  };
  $.extend($.ui.drawable, {
    eventPrefix: 'drag',
  });

})(jQuery);
