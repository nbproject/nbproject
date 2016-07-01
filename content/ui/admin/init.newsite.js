/*
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

define(function(require) {
  var $               = require('jquery');
  var Conf          = require('conf');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  var url = "/newsite_form"

  Pers.init = function () {
    if(!Conf.userinfo.guest) {
      // Redirect to homepage if logged in.
      window.location.href = "/";
      return;
    }
    $.get(url, cb, "json");
  };

  function cb(data, status){
    if(data.status.errno){
      $(".nb-widget-body").empty();
      $(".nb-widget-body").append("<h1>Error: " + data.status.msg + "</h1>");
      return;
    }
    var p = data.payload
    if(p.redirect){
      window.location.href = p.redirect;
      return;
    }
    $(".nb-widget-body").empty();
    $(".nb-widget-body").append(require('hbs!templates_dir/newsite')(p));
    setPageHandlers();
  };

  function setPageHandlers() {
    $("form.create-site").submit(function(e){
      e.preventDefault();
      data = {
        // User details
        firstname: $("#id_firstname").val(),
        lastname: $("#id_lastname").val(),
        email: $("#id_email").val(),
        password: $("#id_password").val(),
        confirm_password: $("#id_confirm_password").val(),

        // Class (i.e. ensemble) details
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
      }
      $.post(url, data, cb, "json");
    });
  }

});
