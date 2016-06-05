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
  var concierge       = require('concierge');
  var Pers            = require('pers');
  var Conf            = require('conf');
  var Models          = require('models');
  var perspective     = require('perspective');
  var treeview        = require('treeview');
  var filesview       = require('filesview');
  var Auth            = require('auth');
  var breadcrumb      = require('breadcrumb');
  var Files           = require('files');
  var Handlebars     = require('handlebars');

  var escapeSpecialChar = function (s) {
    return s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'None';
  };

  Pers.init = function () {
    var userinfo = Conf.userinfo = JSON.parse(unescape(Auth.get_cookie('userinfo'))) || { guest: true };
    var screenname = "Guest";
    var nbNavClass2 = "nb-nav--guest";
    var mainContentClass2 = "content_main--guest";

    if (!Conf.userinfo.guest) {
      screenname = userinfo.firstname === null ? escapeSpecialChar(userinfo.email) : escapeSpecialChar(userinfo.firstname) + ' ' + escapeSpecialChar(userinfo.lastname);
      nbNavClass2 = "";
      mainContentClass2 = "";
    }

    $("body").empty();
    $("body").append(require('hbs!templates_dir/nav_template')({
      "screenname": screenname,
      "nb-nav-class2": nbNavClass2,
      "main-content-class2": mainContentClass2
    }));
    $(".util_windows").append(require('hbs!templates_dir/register_user_dialog')());
    $(".util_windows").append(require('hbs!templates_dir/login_user_dialog')());

    /* Start of Navbar event handlers: Attach even handlers after adding the elements to the dom */

    // Close the nb-nav if the user clicks outside of it
    $(window).click(function(event) {
      if (!event.target.matches('.nb-nav__btn') && !$(event.target).parents('.nb-nav__ul').length) {
        nb_nav__ul_close();
      }
    });

    $(".nb-nav__menu-btn").click(function() {
      if (is_nb_nav__ul_open()) {
        nb_nav__ul_close();
      } else {
        nb_nav__ul_open();
      }
    });

    // Toggle dropdown within the menu
    $(".nb-nav__li--dropdown").click(function(e) {
      $(".nb-nav__li--dropdown__icon").toggleClass("nb-nav__li--dropdown--open__icon");
      $(this).children("ul").slideToggle(300); // 0.3 seconds
    });
    nb_nav__ul_close();

    /* End of Navbar event handlers */

    /*
     Todo: k>>> The following 7 lines of code execute after a successful login. It was copied from init.pdfviewer.js. 
     I don't fully understand it. 
     */
    $.concierge.addListeners(Pers, { // Pers used arbitrarily because the copied code had it.
      successful_login: function (evt) {
        Auth.set_cookie('ckey', evt.value.ckey);
        document.location = document.location.protocol + '//' + document.location.host + document.location.pathname;
        $.I('Welcome !');
      },
    }, 'globalPersObject');

    //get data:
    var payload_objects = { types: ['ensembles', 'folders', 'files', 'sections'] };
    if ('id_ensemble' in Pers.params) {
      payload_objects['payload'] = { id_ensemble: Pers.params.id_ensemble };
    }

    Pers.call('getObjects', payload_objects, Pers.createStore);
  };

  Pers.createStore = function (payload) {
    Pers.store = new Models.Store();
    Pers.store.create(payload, {
      ensemble:    { pFieldName: 'ensembles' },
      section:    { pFieldName: 'sections', references: { id_ensemble: 'ensemble' } },
      file:    { pFieldName: 'files', references: { id_ensemble: 'ensemble', id_folder: 'folder' } },
      folder: { pFieldName: 'folders', references: { id_ensemble: 'ensemble', id_parent: 'folder' } },
      comment:{ references: { id_location: 'location' } },
      location:{ references: { id_ensemble: 'ensemble', id_source: 'file' } },
      link: { pFieldName: 'links' },
      file_stats:{ references: { id: 'file' } },
      mark: {},
      draft: {},
      question: { references: { location_id: 'location' } },
      seen:{ references: { id_location: 'location' } },
      basecomment:{ references: { id_location: 'location' } },
      replyrating:{ references: { comment_id: 'comment' } },
    });
    var cb2 = function (P2) {
      var m = Pers.store;
      m.set('location', P2['locations']);
      m.set('comment', P2['comments']);
      m.set('basecomment', P2['basecomments']);
      m.set('question', P2['questions']);
    };

    Files.set_model(Pers.store);
    $.concierge.trigger({ type:'admin_init', value: 0 });

  };

  function nb_nav__ul_close() {
    $(".nb-nav__icon-bar").removeClass("nb-nav__icon-bar--open");
    $(".nb-nav--guest__icon-bar").removeClass("nb-nav--guest__icon-bar--open");
    $(".nb-nav__ul").removeClass('nb-nav__ul--open');
    $(".nb-nav__li--dropdown__icon").removeClass("nb-nav__li--dropdown--open__icon");
    // $(".nb-nav__ul2").slideUp();
    $(".nb-nav__ul2").hide();
  }

  function nb_nav__ul_open() {
    $(".nb-nav__icon-bar").addClass("nb-nav__icon-bar--open");
    $(".nb-nav--guest__icon-bar").addClass("nb-nav--guest__icon-bar--open");
    $(".nb-nav__ul").addClass('nb-nav__ul--open');
  }

  function is_nb_nav__ul_open(){
    return $(".nb-nav__ul").hasClass('nb-nav__ul--open');
  }

});
