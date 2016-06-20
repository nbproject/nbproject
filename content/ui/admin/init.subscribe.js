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
  var invitekey = window.location.href.split(document.location.pathname + "?key=")[1];
  if (typeof invitekey === 'undefined'){
    invitekey = "";
  }
  var url = "/subscribe_with_key?key=" + invitekey;
  var form = null;

  Pers.init = function () {
    $.get(url, cb, "json");
  };

  function cb(data, status){
    if(data.status.errno){
      $(".nb-widget-body").append("<h1>Error: " + data.status.msg + "</h1>");
      return;
    }
    var p = data.payload
    if(p.next){
      window.location.href = p.next;
      return;
    }
    form = p.form; // Set the field required in various places in this file.
    if(p.new_user) {
      $(".nb-widget-body").empty();
      $(".nb-widget-body").append(require('hbs!templates_dir/subscribe_new_user')(p));
    }
    else{
      $(".nb-widget-body").empty();
      $(".nb-widget-body").append(require('hbs!templates_dir/subscribe_existing_user')(p));
    }
    setPageHandlers();
  };

  function setPageHandlers() {
    $("form.confirm-existing-user").submit(function(e){
      e.preventDefault();
      $.post(url, {}, cb, "json");
    });

    $("form.confirm-new-user").submit(function(e){
      e.preventDefault();
      data = {};
      data.firstname = $("#id_firstname").val();
      data.lastname = $("#id_lastname").val();
      data.email = $("#id_email").val();
      data.password = $("#id_password").val();
      data.confirm_password = $("#id_confirm_password").val();
      $.post(url, data, cb, "json");
    });
  }

});
