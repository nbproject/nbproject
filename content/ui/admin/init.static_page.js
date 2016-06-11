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
  var $ 			= require('jquery');
  var Pers 			= require('pers');
  var Handlebars 	= require('handlebars');
  var static_footer = require("hbs!templates_dir/static_footer");

  // ********************************** 
  // Start of Static templates config
  // ********************************** 
  // If you add or remove a line from here, also edit the appropriate value in the map below.
  require("hbs!templates_dir/welcome");
  require("hbs!templates_dir/faq_student");
  require("hbs!templates_dir/faq_instructor");
  require("hbs!templates_dir/tutorial");
  require("hbs!templates_dir/contact");
  require("hbs!templates_dir/about");
  require("hbs!templates_dir/disclaimer");
  require("hbs!templates_dir/login");
  require("hbs!templates_dir/password_reminder");
  require("hbs!templates_dir/terms_public_site");
  require("hbs!templates_dir/staff_benefits");
  require("hbs!templates_dir/subscribe_thanks");
  require("hbs!templates_dir/notallowed");
  require("hbs!templates_dir/newsite_thanks");
  require("hbs!templates_dir/logout");


  // The keys in these maps mirror the urls in nbsite/urls.py. If you add or remove a value from this map, 
  // also add or remove the appropriate template from the require statements above.
  var templateMap = {
  	"welcome": "hbs!templates_dir/welcome",
  	"faq_student": "hbs!templates_dir/faq_student",
  	"faq_instructor": "hbs!templates_dir/faq_instructor",
  	"tutorial": "hbs!templates_dir/tutorial",
  	"contact": "hbs!templates_dir/contact",
  	"about": "hbs!templates_dir/about",
  	"disclaimer": "hbs!templates_dir/disclaimer",
  	"login": "hbs!templates_dir/login",
  	"password_reminder": "hbs!templates_dir/password_reminder",
  	"terms_public_site": "hbs!templates_dir/terms_public_site",
  	"staff_benefits": "hbs!templates_dir/staff_benefits",
  	"subscribe_thanks": "hbs!templates_dir/subscribe_thanks",
  	"notallowed": "hbs!templates_dir/notallowed",
  	"newsite_thanks": "hbs!templates_dir/newsite_thanks",
  	"logout": "hbs!templates_dir/logout",
  };

  // ********************************** 
  // End of Static templates config
  // ********************************** 

  Pers.init = function () {
  	var location = window.location.href.toString().split(window.location.host + "/")[1];
  	location = location.replace(/#+$/, "").replace(/\/+$/, ""); // Remove trailing # and / before checking the map.
  	var template = templateMap[location];
  	if(!template) {
  		alert("Unable to find html template for " + location);
  		return;
  	}
    // $(".nb-viewport").append("<div class='nb-widget-body-container'><div class='nb-widget-body'></div></div>");
    $(".nb-widget-body").append(require(template)());
    $(".nb-widget-body-container").append(static_footer);
  };
    
});
