/*global $:true NB$:true NB:true $:true */
define(function(require) {
  var $               = require('jquery'),
      concierge       = require('concierge'),
      Pers            = require('pers'),
      Dom             = require('dom');

  var myJquery = NB$ || $;
  myJquery(function () {
    Pers.params = Dom.getParams();
    Pers.admin = false;
    Pers.preinit();
  });
});