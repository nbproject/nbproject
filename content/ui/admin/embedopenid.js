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

(function (GLOB) {
  //require auth
  if ('NB$' in window) {
    var $ = NB$;
  }

  GLOB.pers.init = function () {
    //get data:
    console.log('bok');
    $.concierge.addComponents({});
    window.addEventListener('message', function (e) {
      console.log('reply to ', e.origin);
      if (e.data === 'confkey') {
        e.source.postMessage(GLOB.conf.userinfo.ckey, e.origin);
      }
    }, false);

  };

  (function () {
    var myJquery = NB$ || $;
    myJquery(function () {
      GLOB.pers.params = GLOB.dom.getParams();
      GLOB.pers.admin = false;
      GLOB.pers.preinit(false);
    });
  })();

})(NB);
