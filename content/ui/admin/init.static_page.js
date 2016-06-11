/*
 * step21.js:
 * Requires the following modules:
 *        Module
 *        NB
 *        NB.auth
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global unescape:true NB:true NB$:true jQuery:true alert:false*/

define(function(require) {
  var $               = require('jquery');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');

  Pers.init = function () {
    $(".nb-viewport").append("<div class='nb-widget-body-container'><div class='nb-widget-body'></div></div>");
    // $(".nb-widget-body").append(require('hbs!templates_dir/welcome')());
    // $(".nb-widget-body").append(require('hbs!templates_dir/faq_student')());
    $(".nb-widget-body").append(require('hbs!templates_dir/faq_professor')());
  };
    
});
