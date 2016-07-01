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

  if ('NB$' in window) {
    var $ = NB$;
  }

  Pers.init = function () {
    //get data:
    var payload_objects = { types: ['settings'] };
    Pers.call('getObjects', payload_objects, Pers.createStore);
    $.concierge.addComponents({});
    $(".nb-widget-body").append(require("hbs!templates_dir/your_settings")());
  };

  Pers.createStore = function (payload) {
    Pers.store = new Models.Store();
    Pers.store.create(payload.settings, {
      ds:     { pFieldName: 'ds' },
      us:     { pFieldName: 'us' },
      sl:     { pFieldName: 'sl' },
    });
    Pers.settings_menu();
  };

  Pers.validateNewPassword = function (event) {
    var savebutton =  $('#save_button');
    var passwd1 = $('#new_password1')[0].value;
    var passwd2 = $('#new_password2')[0].value;

    if (passwd1.indexOf('/') !== -1 || passwd2.indexOf('/') !== -1) {
      savebutton.attr('disabled', 'disabled');
      $('#newpassword_msg').text("Your password can't contain the following character(s): /");
      return;
    }

    if (passwd1 === '' || passwd2 === '') {
      savebutton.attr('disabled', 'disabled');
      $('#newpassword_msg').text('');
      return;
    }

    if (passwd1 === passwd2) {
      savebutton.removeAttr('disabled');
      $('#newpassword_msg').text('Passwords match');
    } else {
      savebutton.attr('disabled', 'disabled');
      $('#newpassword_msg').html("<span style='color: #FF0000;'>Passwords don't match...</span>");
    }
  };

  Pers.on_setting_change = function (event) {
    var t = event.currentTarget;
    var id_item = t.getAttribute('id_item');
    Pers.newSettings[id_item] = t.options[t.selectedIndex].value;
  };

  Pers.settings_menu = function () {
    Pers.newSettings = {};
    $('select.settings_selector').each(function () {
      var m = Pers.store;
      var elt = $(this);
      elt.empty();

      var id_item = this.getAttribute('id_item');
      id_item = m.get('ds', { name: id_item }).first().id;
      var labels = m.get('sl', { setting_id: id_item }).items;
      var set_value =  m.o.ds[id_item].value;
      var us = m.get('us', { setting_id: id_item }).first();
      if (us !== null) {
        set_value =  us.value;
      }

      var default_str, l;
      for (var v in labels) {
        l = labels[v];
        default_str = (set_value === l.value) ? ' selected="true" ' : '';
        elt.append('<option ' + default_str + ' value="' + l.value + '">' + l.label + '</option>');
      }

    });

    var f_cleanup = function (do_save) {
      if (do_save) {
        var passwd = $('#new_password1')[0].value;
        if (passwd !== '') {
          Pers.newSettings['__PASSWD__'] = passwd;
          $('#newpassword_msg').hide();
          $('#new_password1')[0].value = '';
          $('#new_password2')[0].value = '';
        }

        Pers.call('save_settings', Pers.newSettings, function (payload) {
          //update new settings
          Pers.store.add('us', payload.settings.us);
        });

        $.I('Your changes have been saved...');
      }
    };

    $('#cancel_button').click(function () {f_cleanup(false);});

    $('#save_button').click(function () {f_cleanup(true);});

    var u = Conf.userinfo;
    $('#your_firstname').text(u.firstname);
    $('#your_lastname').text(u.lastname);
    $('#your_email').text(u.email);

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
