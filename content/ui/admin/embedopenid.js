/*
 * embedopenid.js:
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

define(function(require) {
  var $               = require('jquery'),
      concierge       = require('concierge'),
      Pers            = require('pers'),
      Conf            = require('conf'),
      Dom             = require('dom');
  //require auth
  if ('NB$' in window) {
    var $ = NB$;
  }

  Pers.init = function () {
    //get data:
    console.log('bok');
    $.concierge.addComponents({});
    window.addEventListener('message', function (e) {
      console.log('reply to ', e.origin);
      if (e.data === 'confkey') {
        e.source.postMessage(Conf.userinfo.ckey, e.origin);
      }
    }, false);

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
