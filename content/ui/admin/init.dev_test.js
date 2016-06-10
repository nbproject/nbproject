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
