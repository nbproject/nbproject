/* threadselect Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
(function ($) {
  var $str = 'NB$' in window ? 'NB$' : 'jQuery';
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self.element.addClass('threadselect');
      self._model = null;
      self.comments = {};
      self._render();
    },

    _defaultHandler: function (evt) {
      this._render();
    },

    _render: function () {
      var self = this;

      self.element.empty();

      for (var loc_id in self.comments) {
        self.element.append(
            $('<div>').append(
                $("<input type='checkbox' checked='checked'>").
                    attr('name', 'loc[' + loc_id + ']').
                    attr('loc_id', loc_id)
            ).append(
                $("<ins class='locationflag lf-numnotes'>").
                    text(self.comments[loc_id].replies)
            ).append(
			$("<div class='location-shortbody-text'>").
                    text(self.comments[loc_id].head_body)
            )
        );
      }

      self.element.append(
          $("<input type='button' value='Ok'>").
                    click(function () {
                      var locs = [];
                      self.element.find('input:checked').each(function () {
                        var loc_id = parseInt($(this).attr('loc_id'), 10);
                        if (isNaN(loc_id) === false) {
                          locs.push(loc_id);
                        }
                      });

                      if (self.options.callbacks.onOk) {
                        self.options.callbacks.onOk(locs);
                      }
                    })
            );

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

    set_locs: function (locs) {
      var self = this;
      var payload = { id_locations: locs };
      $.concierge.get_component('get_top_comments_from_locations')(payload, function (result) {
        self.comments = result.comments;
        self._render();
      });
    },
  });

  $.widget('ui.threadselect', V_OBJ);
  $.ui.threadselect.prototype.options = {
    listens: {
    },
    admin: false,
    loc_array: [],
    callbacks: {
      onOk: null,
    },
  };
})(jQuery);
