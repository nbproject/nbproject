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

(function (GLOB) {
  GLOB.pers.init = function () {
    var nextpage = GLOB.pers.params.next;
    if (nextpage) {
      document.location = 'http://' + document.location.host + nextpage;
    }
  };

  var myJquery = NB$ || $;
  myJquery(function () {
    GLOB.pers.params = GLOB.dom.getParams();
    GLOB.pers.admin = false;
    GLOB.pers.preinit(false);
  });
})(NB);
