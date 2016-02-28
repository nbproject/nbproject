/* duplicatewizard Plugin
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
      self.element.addClass('duplicateWizard');
      self._model = null;
      self._render();
    },

    _defaultHandler: function (evt) {
      this._render();
    },

    __model_dependents: [],
    _render: function () {
      var self = this;
      if (self.option.files === null) {
        return;
      }

      self.element.empty();
      self.__model_dependents = [];

      var current_step = 1;

      /// Element Structure:
      /// * Header $h
      /// * Error Message(s) $e
      /// * Wizard Steps $wizard
      ///    o Step 1
      ///       - Description $d1
      ///       - New File Name
      ///       - FilesView
      ///    o Step 2
      ///       - FilterWizard
      ///    o Step 3
      ///       - Description $d
      ///       - ThreadSelect
      /// * Buttons $b
      ///    o $next
      ///    o $cancel

      var $h = $('<h2>Duplicate File</h2>');
      var $e = $('<p>').addClass('error-message');
      var $wizard = $('<div>').addClass('wizard-steps');
      var $b = $('<div>').addClass('wizard-buttons');

      var $next = $('<input type="button" value="Copy" />');
      var $cancel = $('<input type="button" value="Cancel" />');
      $b.append($next).append($cancel);

      // Step 1:
      var $step1 = $('<div>').addClass('wizard-step').attr('wizard-step', '1').addClass('current');
      var $desc1 = $('<p>').addClass('item-description').text('Please enter the desired file name and location for the duplicate file.');
      var $fileNameLabel = $('<label>').attr('for', 'filename').text('File Name: ');
      var $fileName = $('<input>').attr('type', 'text').attr('name', 'filename');
      var target_location_id = null;
      var target_location_type = null;
      var $filesView = $('<div>').addClass('treeview');
      $filesView.treeView({
        admin: self.options.admin,
        callbacks: {
          folder: function (payload) {
            target_location_id = payload.value;
            target_location_type = payload.type;
          },

          ensemble: function (payload) {
            target_location_id = payload.value;
            target_location_type = payload.type;

            // TODO: - merge two callback functions
          },
        },
      });
      self.__model_dependents.push({ m: $filesView, f: $filesView.treeView });

      $step1.append($desc1).append($fileNameLabel).append($fileName).append($filesView);

      var $step2 = $('<div>').addClass('wizard-step').attr('wizard-step', '2');
      var $s2h1 = $('<h3>').text('File Copied...');
      var $s2d1 = $('<p>').text(
          'File copy complete. Would you like to transfer annotations ' +
          'into the document you just created?'
      );

      var $s2b = $('<div>');
      var $s2b1 = $('<a href="" target="_blank">Choose Annotations to Transfer</a>');

      $s2b.append($s2b1);
      $step2.append($s2h1).append($s2d1).append($s2b);
      $wizard.append($step1).append($step2);

      self.element.append($h).append($e).append($wizard).append($b);

      $next.click(function () {

        // if done:
        if (current_step === 1) {
          // Validate Inputs
          if ($fileName.val() === '' ||
              target_location_id === null ||
              target_location_type === null) {
            alert('You did not specify a target filename or location. Please do so before proceeding.');
            return;
          }

          self.target_filename = $fileName.val();
          self.target_location_id = target_location_id;
          self.target_location_type = target_location_type;

          $next.val('Done');
          $cancel.hide();

          // Step 1: Duplicate the file
          $.concierge.get_component('copy_file')({
            source_id: self.options.file_id,
            target_name: self.target_filename,
            target_id: self.target_location_id,
            target_type: self.target_location_type,
          }, function (copy_result) {
            $s2b1.attr('href', '/f/' + self.options.file_id + '#export_to=' + copy_result.id_source);
          });

        } else if (current_step === 2) {

          if (self.options.callbacks.onSubmit) {
            self.options.callbacks.onSubmit();
          }

          window.location.reload();

        }

        $('.wizard-step[wizard-step=' + current_step + ']').removeClass('current');
        current_step += 1;
        $('.wizard-step[wizard-step=' + current_step + ']').addClass('current');

      });

      $cancel.click(function () {
        // reset vars, etc.
        if (self.options.callbacks.onCancel) {
          self.options.callbacks.onCancel();
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

      self.__model_dependents.forEach(function (o) {
        o.f.call(o.m, 'set_model', model);
      });

    },

    update: function (action, payload, items_fieldname) {

    },
  });

  $.widget('ui.duplicateWizard', V_OBJ);
  $.ui.duplicateWizard.prototype.options = {
    listens: {
    },
    admin: false,
    file_id: null,
    callbacks: {
      onOk: null,
      onCancel: null,
    },
  };
})(jQuery);
