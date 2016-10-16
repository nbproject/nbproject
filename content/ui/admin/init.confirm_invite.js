/*
 * your_settings.js:
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true*/

define(function(require) {
  var Conf            = require('conf');
  var Dom             = require('dom');
  var Models          = require('models');
  var Pers            = require('pers');
  var Handlebars 	= require('handlebars');
  var concierge       = require('concierge');
  var $               = require('jquery');
  var invitekey = window.location.href.split(document.location.pathname + "?invite_key=")[1];
  if (typeof invitekey === 'undefined'){
    invitekey = "";
  }

  var form = null;

  if (NB$) {
    $ = NB$;
  }

  function cb(data, status){
    if(data.status.errno){
      $(".nb-widget-body").append("<h1>Error: " + data.status.msg + "</h1>");
      return;
    }
    var p = data.payload
    if(p.redirect){
      window.location.href = p.redirect;
      return;
    }
    $.L(p.membership);
    $(".nb-widget-body").empty();
    $(".nb-widget-body").append(require("hbs!templates_dir/confirm_invite")({"m": p}));
  };

  Pers.init = function () {
    var url = "/membership_from_invite?invite_key=" + invitekey;
    $.get(url, cb, "json");
  };

});
