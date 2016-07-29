/*
 Author
 cf AUTHORS.txt
 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
define(function(require) {
  var $ = require('jquery');
  var Dom = require('dom');
  var Pers = require('pers');
  var Auth = require('auth');
  var concierge = require('concierge');
  var Handlebars 	= require('handlebars');
  var static_footer = require("hbs!templates_dir/static_footer");

  Pers.init = function () {
    /*
      In Pers.__configure_user_menu() in pers.js file, the navbar elemements gets prepended to the body. Since these
       elements have a height of 100% of the viewport height, the previous content of <body> will no longer be
       visible. To fix that, we retrieve the previous content of the <body> and insert them into ".nb-widget-body"
       which is where the navbar elements expect the page content to be.
    */
    $(".nb-viewport").nextAll().appendTo(".nb-widget-body");
    $(".nb-widget-body-container").append(static_footer);

    $('#auth_submit').click(function () {
      var err = function (msg) {
        $('div.form_errors').hide().text(msg).show('fast');
      };

      var payload = {
        email: $('#login_user_email')[0].value,
        password: $('#login_user_password')[0].value,
      };
      $.concierge.get_component('login_user')(payload, function (p) {
        if (p.ckey !== null) {
          Auth.set_cookie('ckey', p.ckey);
          Auth.set_cookie('userinfo', p.userinfo);
          Conf.userinfo = JSON.parse(unescape(p.userinfo));
          var nextpage = Pers.params.next || '/';
          document.location = document.location.protocol + '//' + document.location.host + nextpage;
          $.I('Welcome !');
        } else {
          err("email or password doesn't match. Please try again");
        }
      });
    });

    $('#login_user_password').keypress(function (e) {if (e.keyCode === 13 && this.value.length > 0) {
      $('#auth_submit').click();
    }});

  };

});
