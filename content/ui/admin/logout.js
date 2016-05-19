/*
 * logout
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global NB:true  NB$:true $:true*/

define(function(require) {
  var Pers            = require('pers'),
      Dom             = require('dom'),
      concierge       = require('concierge');

  Pers.init = function () {
    var nextpage = Pers.params.next;
    if (nextpage) {
      document.location = 'http://' + document.location.host + nextpage;
    }
  };

  var myJquery = NB$ || $;
  myJquery(function () {
    Pers.params = Dom.getParams();
    Pers.admin = false;
    Pers.preinit(false);
  });
});
