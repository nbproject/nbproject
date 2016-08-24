/*
 * step16.js:
 * Requires the following modules:
 *        NB
 *        Auth
 *        Pers
 *
 Author
 cf AuthORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true alert:true NB:true*/

define(function(require) {
  var concierge       = require('concierge');
  var Pers            = require('pers');
  var Auth            = require('auth');
  var Conf            = require('conf');
  var Models          = require('models');
  var Perspective     = require('perspective');
  var Docview         = require('docview_pdf');
  var Notepane        = require('notepane_doc');
  var threadview      = require('threadview');
  var editorview      = require('editorview');
  var Handlebars      = require('handlebars');

  if ('NB$' in window) {
    var $ = NB$;
  }

  var $str = 'NB$' in window ? 'NB$' : 'jQuery';

  Pers.init = function () {

    var matches = document.location.pathname.match(/\/(\d*)$/);
    if (matches == null || matches.length !== 2) {
      alert("Can't open file b/c URL pathname doesn't have an integer: " + document.location.pathname);
    }

    Pers.id_source = matches[1];
    Pers.call('getParams', { name: ['RESOLUTIONS', 'RESOLUTION_COORDINATES'], clienttime: (new Date()).getTime() }, function (p) {
      $.concierge.addConstants(p.value);
    });

    $.concierge.addListeners(Pers, {
      successful_login: function (evt) {
        Auth.set_cookie('ckey', evt.value.ckey);
        document.location = document.location.protocol + '//' + document.location.host + document.location.pathname;
        $.I('Welcome !');
      },
    }, 'globalPersObject');

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory('file', 'doc_viewer', function (id) {
      var pers_id = 'pers_' + id;
      var $vp = $(".nb-viewport");
      var $pers = $("<div id='" + pers_id + "'/>").appendTo($vp);
      var docview = {
        priority: 1,
        min_width: 950,
        desired_width: 50,
        content: function ($div) {
          $div.docView({ img_server: Conf.servers.img });
          $div.docView('set_model', Pers.store);
        },
      };
      var notesview = {
        priority: 1,
        min_width: 650,
        desired_width: 35,
        min_height: 1000,
        desired_height: 50,
        content: function ($div) {
          $div.notepaneView();
          $div.notepaneView('set_model', Pers.store);
        },
      };
      var threadview = {
        priority: 1,
        min_width: 650,
        desired_width: 35,
        min_height: 1000,
        desired_height: 50,
        content: function ($div) {
          var opts = {};
          if ('cl' in  Pers.params) {
            opts['commentLabels'] = true;
          }

          $div.threadview(opts);
          $div.threadview('set_model', Pers.store);
        },
      };
      var editorview = {
        priority: 1,
        min_width: 650,
        desired_width: 35,
        min_height: 1500,
        desired_height: 50,
        transcient: true,
        content: function ($div) {
          var m = Pers.store;
          var ensemble = m.o.ensemble[m.o.file[id].id_ensemble];
          $div.editorview({ allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous });
          $div.editorview('set_model', Pers.store);
        },
      };
      $pers.perspective({
        height: function () {return $vp.height() - $pers.offset().top;},

        listens: {
          page_peek: function (evt) {
            //need to add 1 value for uniqueness
            $.concierge.logHistory('page', evt.value + '|' + id + '|' + (new Date()).getTime());
          },

          close_view: function (evt) {
            if (evt.value === this.l.element[0].id) {
              delete($.concierge.features.doc_viewer[id]);
            }

            $.L('closeview: ', evt, this.l.element[0].id);
          },
        },
        views: {
          v1:{ data: docview },
          v2:{
            children: {
              v1:{ data: notesview },
              v2:{ children: { v1: { data: threadview }, v2: { data: editorview }, orientation: 'horizontal' } },  orientation: 'horizontal',
            },
          },
          orientation: 'vertical',
        },
      });
    });

    //get data:
    Pers.call('getGuestFileInfo', { id_source: Pers.id_source }, Pers.createStore, Pers.on_fileinfo_error);
    $.concierge.addConstants({ res: 288, scale: 25, QUESTION: 1, STAR: 2 });
    $.concierge.addComponents({
      set_comment_label: function (P, cb) {
        Pers.call('set_comment_label', P, cb);
      },

      notes_loader: function (P, cb) {Pers.call('getNotes', P, cb);},

      note_creator: function (P, cb) {Pers.call('saveNote', P, cb);},

      note_editor: function (P, cb) {Pers.call('editNote', P, cb);},

      commentlabels_loader: function (P, cb) {Pers.call('getCommentLabels', P, cb);},

      bulk_import_annotations: function (P, cb) {
        Pers.call('bulk_import_annotations', {
          locs_array: P.locs_array,
          from_source_id: P.from_source_id,
          to_source_id: P.to_source_id,
          import_type: P.import_type,
        }, cb);
      },

      set_location_section: function (P, cb) {
        Pers.call('set_location_section', {
          id_location: P.id_location,
          id_section: P.id_section,
        }, cb);
      },

      promote_location_by_copy: function (P, cb) {
        Pers.call('promote_location_by_copy', {
          id_location: P.id_location,
        }, cb);
      },

      delete_thread: function (P, cb) {
        Pers.call('deleteThread', {
          id_location: P.id_location,
        }, cb);
      },
    });
  };

  Pers.createStore = function (payload) {
    Pers.store = new Models.Store();
    Pers.store.create(payload, {
      ensemble: { pFieldName: 'ensembles' },
      section: { pFieldName: 'sections', references: { id_ensemble: 'ensemble' } },
      file: { pFieldName: 'files', references: { id_ensemble: 'ensemble', id_folder: 'folder' } },
      folder: { pFieldName: 'folders', references: { id_ensemble: 'ensemble', id_parent: 'folder' } },
      comment: { references: { id_location: 'location' } },
      location: { references: { id_ensemble: 'ensemble', id_source: 'file' } },
      link: { pFieldName: 'links' },
      mark: {},
      threadmark: { pFieldName: 'threadmarks', references: { location_id: 'location' } },
      draft: {},
      seen: { references: { id_location: 'location' } },
      labelcategory: { references: { ensemble_id: 'ensemble' } },
      commentlabel: { references: { category_id: 'labelcategory' } },
      labelcategorycaption: { references: { category_id: 'labelcategory' } },
      members: {},
      tags: { references: { user_id: 'members', comment_id: 'comment' } },
    });

    var ensembleID = Pers.store.get('ensemble', {}).first().ID;

    Pers.call('getMembers', { id_ensemble: ensembleID }, function (P5) {
      console.log('getMembers callback');

      Pers.store.add('members', P5);
    });

    //get the section info as well as info whether user is admin:
    Pers.call('getSectionsInfo', { id_ensemble: Pers.store.get('ensemble', {}).first().ID }, function (P3) {
      var m = Pers.store;
      m.add('section', P3['sections']);
      Pers.store.get('ensemble', {}).first().admin = true; //we only get a callback if we're an admin for this ensemble
    });

    //here we override the callback so that we can get new notes.
    var cb2 = function (P2) {
      var m = Pers.store;
      m.add('comment', P2['comments']);
      m.add('location', P2['locations']);
      var msg = '';
      var l, c;
      for (var i in P2['comments']) {
        c = m.o.comment[i];
        l = m.o.location[c.ID_location];
        if (c.id_Author !==  $.concierge.get_component('get_userinfo')().id) {    //do nothing if I'm the Author:
          msg += "<a href='javascript:" + $str + '.concierge.trigger({type: "select_thread", value:"' + l.ID + "\"})'>New comment on page " + l.page + '</a><br/>';
        }
      }

      if (msg !== '') {
        $.I(msg, true);
      }
    };

    $.concierge.setHistoryHelper(function (_payload, cb) {
      _payload['__return'] = { type:'newNotesOnFile', a:{ id_source: Pers.id_source } };
      Pers.call('log_history', _payload, cb);
    }, 120000, cb2);

    var matches = document.location.pathname.match(/\/(\d*)$/);
    if (matches == null || matches.length !== 2) {
      alert("Can't open file b/c URL pathname doesn't with an integer: " + document.location.pathname);
    }

    var id_source =  parseInt(Pers.id_source, 10);
    $.concierge.trigger({ type:'file', value: id_source });
    var f = Pers.store.o.file[id_source];
    document.title = $.E(f.title + ' (' + f.numpages + ' pages)');
    $.concierge.get_component('notes_loader')({ file:id_source }, function (P) {
      var m = Pers.store;
      m.add('seen', P['seen']);
      m.add('comment', P['comments']);
      m.add('location', P['locations']);
      m.add('link', P['links']);
      m.add('threadmark', P['threadmarks']);

      //now check if need to move to a given annotation:
      if ('c' in Pers.params) {
        window.setTimeout(function () {
          var id =  Pers.params.c;
          var c = m.get('comment', { ID: id }).items[id];
          if ('reply' in Pers.params) {
            $.concierge.trigger({ type: 'reply_thread', value: c.ID });
          }

          $.concierge.trigger({ type: 'select_thread', value: c.ID_location });

        }, 300);
      }      else if ('p' in Pers.params) {
        window.setTimeout(function () {
          var page = Pers.params.p;
          $.concierge.trigger({ type: 'page', value: page });
        }, 300);
      }      else {
        window.setTimeout(function () {
          $.concierge.trigger({ type: 'page', value: 1 });
        }, 300);
      }

      if ('cl' in  Pers.params) { //load comment labels
        $.concierge.get_component('commentlabels_loader')({ file:id_source }, function (P) {
          m.add('labelcategory', P['labelcategories']);
          m.add('commentlabel', P['commentlabels']);
          m.add('labelcategorycaption', P['labelcategorycaptions']);

        });
      }
    });
  };

  Pers.on_fileinfo_error = function (P) {
    //    console.log("fileinfo error", P);
    $('#login-window').hide();
    var me = $.concierge.get_component('get_userinfo')();
    var name = 'a guest';
    var loginmenu = '';
    if (!(me.guest)) {
      name = (me.firstname !== null && me.lastname !== null) ?  me.firstname + ' ' + me.lastname + ' (' + me.email + ') ' : me.email;
    }    else {
      loginmenu = "Would you like to  <a href='javascript:" + $str + ".concierge.get_component(\"login_user_menu\")()'>login as another NB User</a>, maybe ?";
    }

    $("<div><div id=\"splash-welcome\">Welcome to NB !</div> <br/>You're currently logged in as <b>" + $.E(name) + "</b>, which doesn't grant you sufficient privileges to see this page. <br/><br/>" + loginmenu + '</div>').dialog({ title: 'Access Restricted...', closeOnEscape: false,   open: function (event, ui) { $('.ui-dialog-titlebar-close').hide(); }, width: 600, buttons: { "Take me back to NB's home page": function () {

      Auth.delete_cookie('userinfo');
      Auth.delete_cookie('ckey');
      document.location.pathname = '/logout?next=/';
    },
    }, });
  };
});
