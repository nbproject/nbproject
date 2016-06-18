/*
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

define(function(require) {
  var $               = require('jquery');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  var url_parts = window.location.href.toString().split("/");
  var class_id = url_parts[url_parts.length - 1];

  Pers.init = function () {
    var payload = {
    	"payload":{"id_ensemble":class_id},
    	"types":["class_settings"]
    };
    var cb = function(p) {
      var host = window.location.host;
      var obj = {
        "name": p.class_settings.name,
        "host": host,
        "invitekey": p.class_settings.invitekey,
        "description": p.class_settings.description,
        "allow_staffonly": p.class_settings.allow_staffonly,
        "allow_anonymous": p.class_settings.allow_anonymous,
        "allow_tag_private": p.class_settings.allow_tag_private,
        "allow_guest": p.class_settings.allow_guest,
        "use_invitekey": p.class_settings.use_invitekey,
        "allow_download": p.class_settings.allow_download,
        "allow_ondemand": p.class_settings.allow_ondemand,
        "default_pause": p.class_settings.default_pause,
        "section_assignment": p.class_settings.section_assignment,
        "metadata": p.class_settings.metadata
      };
      $(".nb-widget-body").append(require('hbs!templates_dir/properties_ensemble')(obj));
      setPageHandlers();
    };

    Pers.call('getObjects', payload, cb);
  };

  function setPageHandlers() {
    $("#class-settings-form").submit(function(e){
      // Prevent page redirection in the form submission. This helps ensure that we can display the error
      // message if there's in an error when trying to edit the class settings.
      // Reference: http://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
      e.preventDefault();
      var payload = {
        id_ensemble: class_id,
        name: $('#id_name')[0].value,
        description: $('#id_description')[0].value,
        allow_staffonly:$('input[name=allow_staffonly]')[0].checked,
        allow_anonymous: $('input[name=allow_anonymous]')[0].checked,
        allow_tag_private: $('input[name=allow_tag_private]')[0].checked,
        allow_guest: $('input[name=allow_guest]')[0].checked,
        use_invitekey: $('input[name=use_invitekey]')[0].checked,
        allow_download: $('input[name=allow_download]')[0].checked,
        allow_ondemand: $('input[name=allow_ondemand]')[0].checked,
        default_pause: $('input[name=default_pause]')[0].checked,
        section_assignment: $('#id_section_assignment')[0].value,
        metadata: $('#id_metadata')[0].value
      };
      Pers.call("update_ensemble", payload, function(p){
        location.reload(); // Reload the page to show the new settings
      });
    });

  }

});
