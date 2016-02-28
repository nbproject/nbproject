/*global $:true NB$:true NB:true $:true */
(function (GLOB) {
  var myJquery = NB$ || $;
  myJquery(function () {
    GLOB.pers.params = GLOB.dom.getParams();
    GLOB.pers.admin = false;
    GLOB.pers.preinit();
  });
})(NB);
