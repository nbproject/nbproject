/* filterwizardEmoticon Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
define(function(require) {
  var concierge       = require('concierge'),
      view            = require('view'),
      $               = require('jquery');

  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';
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
      $emot.push($("<img>").attr("title","curious").attr("id","curious").attr("onClick","but_toggle(this);").addClass("emoticon curiousUnclicked"));
      $emot.push($("<img>").attr("title","confused").attr("id","confused").attr("onClick","but_toggle(this);").addClass("emoticon confusedUnclicked"));
      $emot.push($("<img>").attr("title","useful").attr("id","useful").attr("onClick","but_toggle(this);").addClass("emoticon usefulUnclicked"));
      $emot.push($("<img>").attr("title","interested").attr("id","interested").attr("onClick","but_toggle(this);").addClass("emoticon interestedUnclicked"));
      $emot.push($("<img>").attr("title","frustrated").attr("id","frustrated").attr("onClick","but_toggle(this);").addClass("emoticon frustratedUnclicked"));
      $emot.push($("<img>").attr("title","help").attr("id","help").attr("onClick","but_toggle(this);").addClass("emoticon helpUnclicked"));
      $emot.push($("<img>").attr("title","question").attr("id","question").attr("onClick","but_toggle(this);").addClass("emoticon questionUnclicked"));
      $emot.push($("<img>").attr("title","idea").attr("id","idea").attr("onClick","but_toggle(this);").addClass("emoticon ideaUnclicked"));

      var togg = "if(el.className.indexOf('Unclicked')>-1) {el.className=el.className.replace('Unclicked','Clicked');}" +
                "else if(el.className.indexOf('Clicked')>-1) {el.className=el.className.replace('Clicked','Unclicked');} return;";
      var fun = "<script> function but_toggle(el) {"+togg+"} </script>";

      var $go = $("<input>").attr("type", "button").attr("value", "Go");
      var $cancel = $("<input>").attr("type", "button").attr("value", "Cancel");

      $p.append(fun);
      for(var i=0; i< $emot.length; i++)
      {
	  $p.append($emot[i]);
      }
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
                    if($emot[i].attr('class').indexOf("Clicked")>-1 && $emot[i].attr('class').indexOf("Unclicked")<0)
                    {
                        chosenEmot.push($emot[i].attr("id"));
                        $emot[i].attr('class',$emot[i].attr('class').replace("Clicked","Unclicked"));
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
