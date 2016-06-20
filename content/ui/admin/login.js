/*
 * login.js
 * This module defines the namespace NB.lost
 * It requires the following modules:
 *        NB
 *        Auth
 *        jquery
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global $:true NB$:true NB:true $:true */
define(function(require) {
  var Dom             = require('dom'),
      Pers            = require('pers'),
      Auth            = require('auth'),
      concierge       = require('concierge');

  //require auth
  if ('NB$' in window) {
    var $ = NB$;
  }

  Pers.init = function () {
    $('#auth_fragment').append($.concierge.get_component('get_login_dialog_markup')());
    $('#loginbutton_classic').append($('#auth_submit').css('min-width', '80px'));
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
          document.location = 'http://' + document.location.host + nextpage;
          $.I('Welcome !');
        }        else {
          err("email or password doesn't match. Please try again");
        }
      });
    });

    $('#login_user_password').keypress(function (e) {if (e.keyCode === 13 && this.value.length > 0) {
      $.L('using shortcut');
      $('#auth_submit').click();
    }});

  };

  (function () {
    var myJquery = NB$ || $;
    myJquery(function () {
      Pers.params = Dom.getParams();
      Pers.admin = false;
      Pers.preinit(false);
    });
  })();

});
