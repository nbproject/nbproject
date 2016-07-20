/*
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

define(function(require) {
  var $ 			= require('jquery');
  var Pers 			= require('pers');
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
  };

});
