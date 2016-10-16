/*
 * lost.js
 *
Author
    cf AUTHORS.txt

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
/*global NB$:true  NB:true*/

define(function(require) {
  var $ = require('jquery');
  var Pers = require('pers');
  var Dom = require('dom');
  var concierge = require('concierge');
  var Handlebars = require('handlebars');
  var static_footer = require("hbs!templates_dir/static_footer");

  var Lost = {};

  Lost.onLostButton = function () {
    var cb = function (p) {
      var payload = p.payload;
      $('.email').text(payload.email);

      if (p.status.errno) {
        $('.error-msg').show();
      }      else {
        $('#form1').hide();
        $('#success').show();
      }
    };

    $.post('/pdf4/rpc',
      { f: 'passwordLost',
        cid: 0,
        a: JSON.stringify({ email: $('#email')[0].value })
      },
      cb,
      'json'
    );
  };

  Pers.init = function () {
    /*
      In Pers.__configure_user_menu() in pers.js file, the navbar elemements gets prepended to the body. Since these
       elements have a height of 100% of the viewport height, the previous content of <body> will no longer be
       visible. To fix that, we retrieve the previous content of the <body> and insert them into ".nb-widget-body"
       which is where the navbar elements expect the page content to be.
    */
    $(".nb-viewport").nextAll().appendTo(".nb-widget-body");
    $(".nb-widget-body-container").append(static_footer);

    $("#email").focus();
    $('#email').keypress(function (e) {
     var key = e.which;
     if(key == 13)  // the enter key code
      {
        Lost.onLostButton();
        return false;
      }
    });
  };

  return Lost;
});
