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
  var Pers            = require('pers'),
      Dom             = require('dom'),
      concierge       = require('concierge');

  if ('NB$' in window) {
    var $ = NB$;
  }

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

    $.post('/pdf4/rpc', { f: 'passwordLost', cid:0, a: JSON.stringify({ email: $('#email')[0].value }) }, cb, 'json');
  };
  return Lost;
});
