/* filterwizard Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
(function ($) {
  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self.element.addClass('filterWizard');
      self._model = null;
      self._render();
    },

    _defaultHandler: function (evt) {
      this._render();
    },

    _render: function () {
      var self = this;
      self.element.empty();

      var $h = $('<h3>Filter Threads&#x2026;</h3>');
      var $e = $('<p>').addClass('error-message');
      var $p = $('<p>');

      self.element.append($h).append($e).append($p);

      // Basic Idea:
      // The controls for these text fields are:
      //  - $n : number (raw or %, according to $r)
      //  - $r : ratio? (either "percentage" or "total")
      //  - $filterType : type of filter ["random", "reply", "students", "longest"]

      var $n = $('<input>').attr('type', 'text').addClass('filter-number').val(10);
      var $r = $('<select>')
          .append("<option value='threads'>threads</option>")
          .append("<option value='percent'>% of all threads</option>");
      var $filterType = $('<select>')
          .append("<option value='reply'>that have the most responses</option>")
          .append("<option value='students'>that have the most student participation</option>")
          .append("<option value='longest'>that have the longest initial post</option>")
          .append("<option value='random'>randomly</option>");
      var $go = $('<input>').attr('type', 'button').attr('value', 'Go');
      var $cancel = $('<input>').attr('type', 'button').attr('value', 'Cancel');

      $p.append('Show me&#160;').
          append($n).append('&#160;').
          append($r).append('&#160;').
          append($filterType).append('.&#160;').
          append($go).
          append($cancel);

      $cancel.click(function () {
        if (self.options.callbacks.onCancel) {
          self.options.callbacks.onCancel();
        }
      });

      $go.click(function () {
        // Step 1: validate [formatting + n/r compatibility]
        var n = parseInt($n.val(), 10);
        var r = $r.val();
        var filterType = $filterType.val();

        $('.input-error', self.element).removeClass('input-error');

        if (isNaN(n) || n < 0) {
          $n.addClass('input-error');
          $e.text('You must enter a valid number or percentage of posts.');
          return;
        }

        if (r === 'percent') {
          if (n > 100) {
            $n.addClass('input-error');
            $e.text('You must enter a valid percentage between 0 and 100.');
            return;
          }
        } else if (r === 'threads') {
            // any thread-specific checking
        } else {
          $r.addClass('input-error');
          $e.text('You must choose a valid quantity.');
          return;
        }

        // Step 2: fire event OR callback
        if (self.options.callbacks.fireEvent) {
          self.options.callbacks.fireEvent(n, r, filterType);
        } else {
          $.concierge.trigger({
            type: 'filter_threads',
            value: {
              n: n,
              r: r,
              type: filterType,
            },
          });
        }

        // Step 3: call callback if set
        if (self.options.callbacks.onOk) {
          self.options.callbacks.onOk();
        }

      });

    },

    set_model: function (model) {
      var self = this;
      self._model = model;
      model.register(
          $.ui.view.prototype.get_adapter.call(this),
                {
                  file: null,
                  folder: null,
                  file_stats: null,
                  replyrating: null,
                  question: null,
                });

    },

    update: function (action, payload, items_fieldname) {

    },
  });

  $.widget('ui.filterWizard', V_OBJ);
  $.ui.filterWizard.prototype.options = {
    listens: {
    },
    admin: false,
    callbacks: {
      onOk: null,
      fireEvent: null,
      onCancel: null,
    },
  };
})(jQuery);
