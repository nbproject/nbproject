/*
 * step18.js: Collage Views
 * Requires the following modules:
 *        Module
 *        Auth
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

/*global NB:true NB$:true */

define(function(require) {
  var $               = require('jquery'),
      concierge       = require('concierge'),
      Auth            = require('auth'),
      Conf            = require('conf'),
      Files           = require('files'),
      Models          = require('models'),
      Pers            = require('pers'),
      perspective     = require('perspective'),
      Docview         = require('docview_collage'),
      Notepane        = require('notepane_collage'),
      threadview      = require('threadview'),
      editorview      = require('editorview');

  if ('NB$' in window) {
    var $ = NB$;
  }

  Pers.init = function () {
    if ('q' in Pers.params) {
      Pers.query = Pers.params.q;
    } else {
      Pers.query = 'auth';
    }

    Pers.call('getParams', { name: ['RESOLUTIONS', 'RESOLUTION_COORDINATES'] }, function (p) {
      $.concierge.addConstants(p.value);
    });

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory('collection', 'collection_viewer', function (id) {
      var pers_id        = 'pers_' + id;
      var $vp        = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo('body');
      var $pers        = $("<div id='" + pers_id + "'/>").appendTo($vp);
      var docview        =  {
        priority: 1,
        min_width: 650,
        desired_width: 35,
        content: function ($div) {
          $div.docView({ img_server: Conf.servers.img });
          window.setTimeout(function () {
            $div.docView('set_model', Pers.store);
          }, 5000);
        },
      };
      var notesview    =  {
        priority: 1,
        min_width: 950,
        desired_width: 50,
        min_height: 1000,
        desired_height: 50,
        content: function ($div) {
          $div.notepaneView();
          $div.notepaneView('set_model', Pers.store);
        },
      };
      var threadview    = {
        priority: 1,
        min_width: 950,
        desired_width: 50,
        min_height: 1000,
        desired_height: 50,
        content: function ($div) {
          $div.threadview();
          $div.threadview('set_model', Pers.store);
        },
      };
      var editorview    =  {
        priority: 1,
        min_width: 950,
        desired_width: 50,
        min_height: 1000,
        desired_height: 50,
        transcient: true,
        content: function ($div) {
          /* TODO: this needs to be done at comment creation time since we can have notes spanning several ensembles */
          /*
            var m = Pers.store;
            var ensemble = m.o.ensemble[m.o.file[id].id_ensemble];
            $div.editorview({allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous});
          */

          //temporary fix: restrict all
          $div.editorview({ allowStaffOnly: false, allowAnonymous: false });
          $div.editorview('set_model', Pers.store);
        },
      };
      $pers.perspective({
        height: function () {return $vp.height() - $pers.offset().top;},

        listens: {
          page_peek: function (evt) {
            //need to add 1 value for uniqueness
            var location = Pers.store.o.location[Pers.collection.items[Number(evt.value) - 1]];
            $.concierge.logHistory('page', location.page + '|' + location.id_source + '|' + (new Date()).getTime());
          },

          close_view: function (evt) {
            if (evt.value === this.l.element[0].id) {
              delete($.concierge.features.doc_viewer[id]);
            }

            $.L('closeview: ', evt, this.l.element[0].id);
          },

          successful_login: function (evt) {
            Auth.set_cookie('ckey', evt.value.ckey);
            document.location = 'http://' + document.location.host + document.location.pathname;
            $.I('Welcome !');
          },

        },
        views: {
          v1:{ data: docview },
          v2:{ children: {
            v1:{ data: notesview },
            v2:{ children: { v1: { data: threadview }, v2: { data: editorview }, orientation: 'horizontal' } },  orientation: 'horizontal',
          }, },
          orientation: 'vertical',
        },
      });
    });

    //get data:
    var P2 =  { query: Pers.query };
    if ('id_ensemble' in Pers.params) {
      P2['id_ensemble'] = Pers.params.id_ensemble;
    }

    if ('id_source' in Pers.params) {
      P2['id_source'] = Pers.params.id_source;
    }

    if ('id_author' in Pers.params) {
      P2['id_author'] = Pers.params.id_author;
    }

    if ('unread' in Pers.params) {
      P2['unread'] = Pers.params.unread;
    }

    Pers.call('getMyNotes', P2,  Pers.createStore);
    $.concierge.addConstants({ res: 288, scale: 25 });

    $.concierge.addComponents({
      add_file_menu:        function (P, cb) {Files.addFile(P.id_ensemble, P.id_folder);},

      source_id_getter:    function (P, cb) {Pers.call('request_source_id', P, cb);},

      add_folder_menu:    function (P, cb) {Files.addFolder(P.id_ensemble, P.id_folder);},

      add_folder:        function (P, cb) {Pers.call('add_folder', P, cb);},

      rename_file_menu:    function (P, cb) {Files.rename_file(P.id);},

      rename_file:        function (P, cb) {Pers.call('rename_file', P, cb);},

      delete_file_menu:    function (P, cb) {Files.delete_file(P.id);},

      delete_file:        function (P, cb) {Pers.call('delete_file', P, cb);},

      move_file_menu:        function (P, cb) {Files.move_file(P.id);},

      move_file:        function (P, cb) {Pers.call('move_file', P, cb);},

      update_file_menu:    function (P, cb) {Files.update_file(P.id);},

      add_ensemble:        function (P, cb) {Pers.call('add_ensemble', P, cb);},

      get_sequence:        function (P, cb) {return Pers.sequence;},

      get_collection:        function (P, cb) {return Pers.collection;},
    });

    $.concierge.addComponents({
      notes_loader:    function (P, cb) {Pers.call('getNotes', P, cb);},

      note_creator:    function (P, cb) {Pers.call('saveNote', P, cb);},

      note_editor:    function (P, cb) {Pers.call('editNote', P, cb);},
    });
  };

  Pers.createStore = function (payload) {
    Pers.store = new Models.Store();
    Pers.store.create(payload, {
      ensemble:    { pFieldName: 'ensembles' },
      section:    { pFieldName: 'sections', references: { id_ensemble: 'ensemble' } },
      file:    { pFieldName: 'files', references: { id_ensemble: 'ensemble', id_folder: 'folder' } },
      folder: { pFieldName: 'folders', references: { id_ensemble: 'ensemble', id_parent: 'folder' } },
      comment:{ pFieldName: 'comments', references: { id_location: 'location' } },
      location:{ pFieldName: 'locations', references: { id_ensemble: 'ensemble', id_source: 'file' } },
      link: { pFieldName: 'links' },
      mark: {},
      threadmark: { pFieldName: 'threadmarks', references: { location_id: 'location' } },
      draft: {},
      seen:{ pFieldName: 'seen', references: { id_location: 'location' } },
    });

    //get the section info as well as info whether user is admin:
    Pers.call('getSectionsInfo', { id_ensemble: Pers.store.get('ensemble', {}).first().ID }, function (P3) {
      var m = Pers.store;
      m.add('section', P3['sections']);
      Pers.store.get('ensemble', {}).first().admin = true; //we only get a callback if we're an admin for this ensemble
    });

    Pers.sequence = payload.sequence;

    //generate collection:
    var ids_location = [];
    var ids_location_idx = {};

    var items = Pers.sequence.data;
    var m = Pers.store;
    var c, l, id_comment, id_location;
    for (var i in items) {
      id_comment = items[i];
      id_location = m.o.comment[id_comment].ID_location;
      if (!(id_location in ids_location_idx)) {
        ids_location.push(id_location);
        ids_location_idx[id_location] = ids_location.length - 1;
      }
    }

    Pers.collection = { type: 'location', sequence: Pers.sequence, items: ids_location, index: ids_location_idx };
    $.concierge.setHistoryHelper(function (payload, cb) {Pers.call('log_history', payload, cb);}, 120000);

    $.concierge.trigger({ type:'collection', value: 1 });
    document.title = $.E(Pers.sequence.description);

    //now check if need to move to a given annotation:
    if ('c' in Pers.params) {
      var id =  Pers.params.c;
      c = m.get('comment', { ID: Pers.params.c }).items[id];
      $.concierge.trigger({ type: 'select_thread', value: c.ID_location });
    }
  };
});
