/*
 * step21.js:
 * Requires the following modules:
 *        Module
 *        NB
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
/*global NB$:true NB:true*/

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
  var files           = require('files');
  var Handlebars      = require('handlebars');

  if ('NB$' in window) {
    var $ = NB$;
  }

  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  Pers.init = function () {

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory('admin_init', 'admin_viewer', function (id) {
      var pers_id        = 'pers_' + id;
      var $vp = $(".nb-viewport");

      // Add breadcrumb
      $(".nb-widget-header").breadcrumb({
        trail: [{name: "Home", rel: "ensemble", id_item: null}],
        admin: Pers.admin});
      $(".nb-widget-header").breadcrumb("set_model", Pers.store);

      var $pers        = $("<div id='" + pers_id + "'/>").appendTo($vp);
      var treeview    =  {
        priority: 1,
        min_width: 200,
        desired_width: 25,
        content: function ($div) {
          $div.treeView({ admin: Pers.admin });
          $div.treeView('set_model', Pers.store);

          //default behavior: select the "home" screen.
          $.concierge.trigger({ type:'ensemble', value: 0 });
        },
      };
      var filesview    =  {
        priority: 1,
        min_width: 1000,
        desired_width: 85,
        content: function ($div) {
          $div.filesView({ img_server: Conf.servers.img,  admin: Pers.admin });
          $div.filesView('set_model', Pers.store);
        },
      };
      $pers.perspective({
        height: function () {return $vp.height() - $pers.offset().top;},

        listens: {
          rate_reply: function (evt) {
            $.concierge.get_component('rate_reply')(evt.value, function (P) {
              Pers.store.add('replyrating', P['replyrating']);
              $.I('Thanks for your feedback !');
            });
          },

          successful_login: function (evt) {
            Auth.set_cookie('ckey', evt.value.ckey);
            document.location = 'http://' + document.location.host + document.location.pathname;
            $.I('Welcome !');
          },

          close_view: function (evt) {
            if (evt.value === this.l.element[0].id) {
              delete($.concierge.features.doc_viewer[id]);
            }

            $.L('closeview: ', evt, this.l.element[0].id);
          },

          ensemble: function (evt) {
            $.L('loading stats for ensemble' + evt.value);
            $.concierge.get_component('get_file_stats')({ id_ensemble: evt.value }, function (P2) {
              Pers.store.add('file_stats', P2['file_stats']);
              $.L('stats loaded !');
            });
            var ensemble_data = Pers.store.o.ensemble;
            // Update breadcrumb
            if(evt.value === null || evt.value === undefined || evt.value === "0" ) { // home
              $(".nb-widget-header").breadcrumb({trail: [
                {name: "Home", rel: "ensemble", id_item: null},
              ]});
            } else {
              $(".nb-widget-header").breadcrumb({trail: [
                {name: "Home", rel: "ensemble", id_item: null},
                {name: ensemble_data[evt.value].name, rel: "ensemble", id_item: evt.value}
              ]});
            }

          },

          folder: function(evt) {
            // Folder data from the server
            var folder_data = Pers.store.o.folder;
            var ensemble_data = Pers.store.o.ensemble;

            // Create trail starting with Home and the ensemble
            var id_ensemble = folder_data[evt.value].id_ensemble;

            var trail = [
              {name: "Home", rel: "ensemble", id_item: null},
              {name: ensemble_data[id_ensemble].name, rel: "ensemble", id_item: id_ensemble}
            ];

            // Loop through fdata to generate list of parent folders
            var cur_folder = evt.value;
            var parent_folders = [cur_folder];
            while(folder_data[cur_folder].id_parent != null) {
              cur_folder = folder_data[cur_folder].id_parent;
              parent_folders.push(cur_folder);
            }

            // Add parents to trail
            while(parent_folders.length>0) {
              var cur_id = parent_folders.pop();
              trail.push({
                name: folder_data[cur_id].name,
                rel: "folder",
                id_item: cur_id
              });
            }

            // Update breadcrumb
            $(".nb-widget-header").breadcrumb({trail: trail});
          },
        },
        views: {
    v1:{ data: treeview },
            v2:{ data: filesview }, orientation: 'vertical', },
      });
    });

    //get data:
    var payload_objects = { types: ['ensembles', 'folders', 'files', 'sections'] };
    if ('id_ensemble' in Pers.params) {
      payload_objects['payload'] = { id_ensemble: Pers.params.id_ensemble };
    }

    Pers.call('getObjects', payload_objects, Pers.createStore);
    $.concierge.addComponents({
      add_file_menu: function (P, cb) {files.addFile(P.id_ensemble, P.id_folder);},

      source_id_getter: function (P, cb) {Pers.call('request_source_id', P, cb);},

      add_folder_menu: function (P, cb) {files.addFolder(P.id_ensemble, P.id_folder);},

      add_folder: function (P, cb) {Pers.call('add_folder', P, cb);},

      rename_file_menu: function (P, cb) {files.rename_file(P.id, P.item_type);},

      rename_file: function (P, cb) {Pers.call('rename_file', P, cb);},

      delete_file_menu: function (P, cb) {files.delete_file(P.id, P.item_type);},

      delete_file: function (P, cb) {Pers.call('delete_file', P, cb);},

      move_file_menu: function (P, cb) {files.move_file(P.id, P.item_type);},

      move_file: function (P, cb) {Pers.call('move_file', P, cb);},

      duplicate_file_menu: function (P, cb) {files.duplicate_file(P.id, P.item_type);},

      update_file_menu: function (P, cb) {files.update_file(P.id);},

      add_ensemble: function (P, cb) {Pers.call('add_ensemble', P, cb);},

      invite_users_menu: function (P, cb) {files.inviteUsers(P.id_ensemble);},

      invite_users: function (P, cb) {Pers.call('sendInvites', P, cb);},

      assignment_file_menu: function (P, cb) {files.edit_assignment(P.id);},

      edit_assignment: function (P, cb) {Pers.call('edit_assignment', P, cb);},

      get_top_comments_from_locations: function (P, cb) {
        Pers.call('get_top_comments_from_locations', P, cb);
      },

      copy_file: function (P, cb) {
        Pers.call('copy_file', {
          source_id: P.source_id,
          target_name: P.target_name,
          target_id: P.target_id,
          target_type: P.target_type,
        }, cb);
      },

      bulk_import_annotations: function (P, cb) {
        Pers.call('bulk_import_annotations', {
          locs_array: P.locs_array,
          from_source_id: P.from_source_id,
          to_source_id: P.to_source_id,
          import_type: P.import_type,
        }, cb);
      },
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

    $.concierge.setHistoryHelper(function (_payload, cb) {
      _payload['__return'] = { type:'newPending', a:{} };
      Pers.call('log_history', _payload, cb);
    }, 120000, cb2, 600000);

    files.set_model(Pers.store);
    $.concierge.trigger({ type:'admin_init', value: 0 });

    //get more stats (pending stuff)
    Pers.call('getPending', {}, function (P) {
      Pers.store.add('location', P['locations']);
      Pers.store.add('comment', P['comments']);
      Pers.store.add('basecomment', P['basecomments']);
      Pers.store.add('question', P['questions']);
    });

  };
});
