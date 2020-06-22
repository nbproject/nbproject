/* filterwizardEmoticon Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
 */
/*global jQuery:true NB$:true */
define(['concierge','view','jquery'],
       function(concierge,view,$) {

  var $str        = NB$ ? 'NB$' : 'jQuery';
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self.element.addClass('filterWizardEmoticon');
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

      var $emot = [];

	var but_toggle = () => {
	    var e = $(this);
	    if (e.hasClass('clicked')) {
		e.removeClass('clicked').addClass('unclicked');
	    } else {
		e.removeClass('unclicked').addClass('clicked');
	    }
	}
	['curious','confused','useful','interested','frustrated',
	 'help','question','idea','discuss','examable','learning-goal',
	 'real-life','study-tool'].forEach(tag => {
	     $emot.push($("<img>").attr('title',tag).attr('id',tag).addClass('emoticon unclicked').addClass(tag).click(but_toggle));
	 });
	

      var $go = $("<input>").attr("type", "button").attr("value", "Go");
      var $cancel = $("<input>").attr("type", "button").attr("value", "Cancel");

      $p.append($emot);	

      $p.append($go)
        .append($cancel);

      $cancel.click(function () {
        if (self.options.callbacks.onCancel) {
          self.options.callbacks.onCancel();
        }
      });

      $go.click(function() {
        // Step 1: validate [formatting + n/r compatibility]

        //there is only buttons, no validation needed
        var chosenEmot=[];

        for(var i=0; i< $emot.length; i++)
        {
          if ($emot[i].hasClass("clicked"))
          {
            chosenEmot.push($emot[i].attr("id"));
            $emot[i].removeClass('clicked').addClass('unclicked');
            //$emot[i].toggleClass("filterClicked filterUnclicked");
            //var srcLen = $emot[i].attr("src").length;
            //var tmpsrc = $emot[i].attr("src").substring(0,srcLen-7);
            //$emot[i].attr("src",tmpsrc+'.png');
          }
        }


        // Step 2: fire event OR callback
        if (self.options.callbacks.fireEvent) {
          self.options.callbacks.fireEvent(chosenEmot);
        } else {
          $.concierge.trigger({
            type: "filter_emoticons",
            value: chosenEmot
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

  $.widget('ui.filterWizardEmoticon', V_OBJ);
  $.ui.filterWizardEmoticon.prototype.options = {
    listens: {
    },
    admin: false,
    callbacks: {
      onOk: null,
      fireEvent: null,
      onCancel: null,
    },
  };
});
