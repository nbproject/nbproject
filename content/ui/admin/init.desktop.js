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
/*global NB$:true NB:true*/

(function (GLOB) {
  if ('NB$' in window) {
    var $ = NB$;
  }

  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  GLOB.pers.init = function () {
    //GLOB.pers.admin=true;
    //Extra menus:
    if (!(GLOB.conf.userinfo.guest)) {
      $('#menu_settings').after("<li><a href='javascript:" + $str + ".concierge.get_component(\"add_ensemble_menu\")()'>Create a new class.</a></li>");
    }

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory('admin_init', 'admin_viewer', function (id) {
      var pers_id        = 'pers_' + id;
      var $vp        = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo('body');
      var $pers        = $("<div id='" + pers_id + "'/>").appendTo($vp);
      var treeview    =  {
        priority: 1,
        min_width: 200,
        desired_width: 25,
        content: function ($div) {
          $div.treeView({ admin: GLOB.pers.admin });
          $div.treeView('set_model', GLOB.pers.store);

          //default behavior: select the "home" screen.
          $.concierge.trigger({ type:'ensemble', value: 0 });
        },
      };
      var filesview    =  {
        priority: 1,
        min_width: 1000,
        desired_width: 85,
        content: function ($div) {
          $div.filesView({ img_server: GLOB.conf.servers.img,  admin: GLOB.pers.admin });
          $div.filesView('set_model', GLOB.pers.store);
        },
      };
      $pers.perspective({
        height: function () {return $vp.height() - $pers.offset().top;},

        listens: {
          rate_reply: function (evt) {
            $.concierge.get_component('rate_reply')(evt.value, function (P) {
              GLOB.pers.store.add('replyrating', P['replyrating']);
              $.I('Thanks for your feedback !');
            });
          },

          successful_login: function (evt) {
            GLOB.auth.set_cookie('ckey', evt.value.ckey);
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
              GLOB.pers.store.add('file_stats', P2['file_stats']);
              $.L('stats loaded !');
            });
          },
        },
        views: {
    v1:{ data: treeview },
            v2:{ data: filesview }, orientation: 'vertical', },
      });
    });

    //get data:
    var payload_objects = { types: ['ensembles', 'folders', 'files', 'sections'] };
    if ('id_ensemble' in GLOB.pers.params) {
      payload_objects['payload'] = { id_ensemble: GLOB.pers.params.id_ensemble };
    }

    GLOB.pers.call('getObjects', payload_objects, GLOB.pers.createStore);
    $.concierge.addComponents({
      add_file_menu: function (P, cb) {GLOB.files.addFile(P.id_ensemble, P.id_folder);},

      source_id_getter: function (P, cb) {GLOB.pers.call('request_source_id', P, cb);},

      add_folder_menu: function (P, cb) {GLOB.files.addFolder(P.id_ensemble, P.id_folder);},

      add_folder: function (P, cb) {GLOB.pers.call('add_folder', P, cb);},

      rename_file_menu: function (P, cb) {GLOB.files.rename_file(P.id, P.item_type);},

      rename_file: function (P, cb) {GLOB.pers.call('rename_file', P, cb);},

      delete_file_menu: function (P, cb) {GLOB.files.delete_file(P.id, P.item_type);},

      delete_file: function (P, cb) {GLOB.pers.call('delete_file', P, cb);},

      move_file_menu: function (P, cb) {GLOB.files.move_file(P.id, P.item_type);},

      move_file: function (P, cb) {GLOB.pers.call('move_file', P, cb);},

      duplicate_file_menu: function (P, cb) {GLOB.files.duplicate_file(P.id, P.item_type);},

      update_file_menu: function (P, cb) {GLOB.files.update_file(P.id);},

      add_ensemble_menu: function (P, cb) {GLOB.files.addEnsemble();},

      add_ensemble: function (P, cb) {GLOB.pers.call('add_ensemble', P, cb);},

      invite_users_menu: function (P, cb) {GLOB.files.inviteUsers(P.id_ensemble);},

      invite_users: function (P, cb) {GLOB.pers.call('sendInvites', P, cb);},

      assignment_file_menu: function (P, cb) {GLOB.files.edit_assignment(P.id);},

      edit_assignment: function (P, cb) {GLOB.pers.call('edit_assignment', P, cb);},

      get_top_comments_from_locations: function (P, cb) {
        GLOB.pers.call('get_top_comments_from_locations', P, cb);
      },

      copy_file: function (P, cb) {
        GLOB.pers.call('copy_file', {
          source_id: P.source_id,
          target_name: P.target_name,
          target_id: P.target_id,
          target_type: P.target_type,
        }, cb);
      },

      bulk_import_annotations: function (P, cb) {
        GLOB.pers.call('bulk_import_annotations', {
          locs_array: P.locs_array,
          from_source_id: P.from_source_id,
          to_source_id: P.to_source_id,
          import_type: P.import_type,
        }, cb);
      },
    });

    $.concierge.addComponents({
      notes_loader:    function (P, cb) {GLOB.pers.call('getNotes', P, cb);},

      note_creator:    function (P, cb) {GLOB.pers.call('saveNote', P, cb);},

      note_editor:    function (P, cb) {GLOB.pers.call('editNote', P, cb);},
    });
  };

  GLOB.pers.createStore = function (payload) {
    GLOB.pers.store = new GLOB.models.Store();
    GLOB.pers.store.create(payload, {
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
      var m = GLOB.pers.store;
      m.set('location', P2['locations']);
      m.set('comment', P2['comments']);
      m.set('basecomment', P2['basecomments']);
      m.set('question', P2['questions']);
    };

    $.concierge.setHistoryHelper(function (_payload, cb) {
      _payload['__return'] = { type:'newPending', a:{} };
      GLOB.pers.call('log_history', _payload, cb);
    }, 120000, cb2, 600000);

    GLOB.files.set_model(GLOB.pers.store);
    $.concierge.trigger({ type:'admin_init', value: 0 });

    //get more stats (pending stuff)
    GLOB.pers.call('getPending', {}, function (P) {
      GLOB.pers.store.add('location', P['locations']);
      GLOB.pers.store.add('comment', P['comments']);
      GLOB.pers.store.add('basecomment', P['basecomments']);
      GLOB.pers.store.add('question', P['questions']);
    });

  };

})(NB);

