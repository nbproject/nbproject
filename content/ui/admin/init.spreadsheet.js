/*
 * step19.js: Spreadsheet
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
/*global NB:true NB$:true */

define(function(require) {
  var $               = require('jquery'),
      concierge       = require('concierge'),
      Auth            = require('auth'),
      Conf            = require('conf'),
      Models          = require('models'),
      Pers            = require('pers'),
      perspective     = require('perspective'),
      docview         = require('docview_spreadsheet'),
      notepane        = require('notepane_spreadsheet'),
      threadview      = require('threadview'),
      editorview      = require('editorview'),
      spreadsheetview = require('spreadsheetview');

  if ('NB$' in window) {
    var $ = NB$;
  }

  Pers.init = function () {
    Pers._selectTimerID =  null;
    Pers.grade2litt = { 4: 'A', 3: 'B', 2: 'C', 1: 'D', 0: 'F' };
    Pers.id_author_readahead = null;
    Pers.collection = { items: [], index: {} };
    Pers.call('getParams', { name: ['RESOLUTIONS', 'RESOLUTION_COORDINATES'] }, function (p) {
      $.concierge.addConstants(p.value);
    });

    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory('spreadsheet', 'spreadsheet_viewer', function (id) {
      var pers_id        = 'pers_' + id;
      var $vp        = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo('body');
      var $pers        = $("<div id='" + pers_id + "'/>").appendTo($vp);
      var spreadsheetview = {
        priority: 1,
        min_width: 1000,
        desired_width: 60,
        content: function ($div) {
          $div.spreadsheetview();
          $div.spreadsheetview('set_model', Pers.store);
        },
      };
      var notesview =  {
        priority: 1,
        min_width: 800,
        desired_width:50,
        min_height: 800,
        desired_height: 70,
        content: function ($div) {
          $div.notepaneView();
          $div.notepaneView('set_model', Pers.store);
        },
      };
      var docview    = {
        priority: 1,
        min_width: 800,
        desired_width: 50,
        min_height: 300,
        desired_height: 30,
        content: function ($div) {
          $div.docView({ img_server: Conf.servers.img });
          $div.docView('set_model', Pers.store);
          /*
          window.setTimeout(function(){
                  $div.docView("set_model",Pers.store );
              }, 5000);
          */
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
          $div.editorview({ allowStaffOnly: false, allowAnonymous: false });
          $div.editorview('set_model', Pers.store);
        },
      };
      var self = Pers;
      $pers.perspective({
        height: function () {return $vp.height() - $pers.offset().top;},

        listens: {
          successful_login: function (evt) {
            Auth.set_cookie('ckey', evt.value.ckey);
            document.location = 'http://' + document.location.host + document.location.pathname;
            $.I('Welcome !');
          },

          selection: function (evt) {
            var v = evt.value;
            var sel = v.sel;
            var m = Pers.store;
            var id_source = v.files[sel[1] - 1].id;
            var id_author = v.users[sel[0] - 1].id;
            var L =  m.meta.loadednotes;
            var f_trigger;
            var f_on_data = function (P, _id_author) {
              m.add('seen', P['seen']);
              m.add('comment', P['comments']);
              m.add('location', P['locations']);

              //generate collection:
              var ids_location = [];
              var ids_location_idx = {};
              var id_location;
              var items = P['locations'];
              var i;
              var f_sort = function (o1, o2) {
                var loc1 = m.o.location[o1];
                var loc2 = m.o.location[o2];
                return (loc1.page !== loc2.page) ? (loc1.page - loc2.page) : (loc1.top - loc2.top);
              };

              for (i in items) {
                id_location = items[i].ID;
                ids_location.push(id_location);
              }

              ids_location.sort(f_sort);
              for (i in ids_location) {
                ids_location_idx[ids_location[i]] = Number(i);
              }

              L[id_source][_id_author] = { items: ids_location, index: ids_location_idx };
            };

            if (!(id_source in L)) {
              L[id_source] = {};
            }

            var id_next_author = self.find_next_author(v);
            if (!(id_author + '_' + id_source in m.o.stat)) {
              //no need to call server if there's no note.
              return;
            }

            if (self._selectTimerID !== null) {
              window.clearTimeout(self._selectTimerID);
              self._selectTimerID =  null;
            }

            if (id_author in L[id_source]) {//use cached values
              f_trigger = function () {
                Pers.collection.items = L[id_source][id_author].items;
                Pers.collection.index = L[id_source][id_author].index;
                Pers.collection.meta = { id_user: id_author, id_source: id_source };
                $.concierge.trigger({ type:'collection', value: 1 });
                if (id_next_author !== null && id_author_readahead == null) {
                  id_author_readahead = id_next_author;
                  Pers.call('getMyNotes', { query: 'auth_admin', id_source:id_source, id_author:id_next_author }, function (P3) {
                    //mark readahead available again and load data silently
                    id_author_readahead = null;
                    f_on_data(P3, id_next_author);
                  });
                }
              };

              self._selectTimerID =  window.setTimeout(f_trigger);
            }            else {
              f_trigger = function () {
                var P2 =  { query: 'auth_admin', id_source:id_source, id_author:id_author };
                Pers.call('getMyNotes', P2, function (P) {
                  //var m = Pers.store;
                  f_on_data(P, id_author);
                  Pers.collection.items =     L[id_source][id_author].items;
                  Pers.collection.index =     L[id_source][id_author].index;
                  Pers.collection.meta = { id_user: id_author, id_source: id_source };
                  $.concierge.trigger({ type:'collection', value: 1 });
                  if (id_next_author !== null && id_author_readahead == null) {
                    Pers.call('getMyNotes', { query: 'auth_admin', id_source:id_source, id_author:id_next_author }, function (P3) {
                      //mark readahead available again and load data silently
                      id_author_readahead = null;
                      f_on_data(P3, id_next_author);
                    });
                  }
                });
              };

              self._selectTimerID =  window.setTimeout(f_trigger, 500);
            }
          },
        },
        views: {
        v1:{ data: spreadsheetview },
                v2:{ children: {
            v1:{ children: { v1:{ data:notesview }, v2: { data: editorview }, orientation: 'horizontal' } }, v2:{ data: docview }, orientation: 'horizontal', }, }, orientation: 'vertical', },
      });
    });

    $.concierge.addComponents({
      get_collection:        function (P, cb) {return Pers.collection;},

      set_grade_assignment: function (P, cb) {
        Pers.call('set_grade_assignment', P, cb);
      },

      grade2litt: function (P, cb) {return Pers.grade2litt[P];},

      splash_notepaneview: function (P, cb) {
        return "<div xmlns='http://www.w3.org/1999/xhtml' class='minisplashscreen ui-corner-all'> <div id='splash-welcome'>Welcome... </div><br/><i>Using the keyboard shortcuts below will likely speed up your grading task by a lot...</i><br/> <ul id='splash-list-instructions'> <li>Use the <b>arrow keys</b> to navigate between cells and display the comments for the selected assignment</li><li>Use the <b>&#60;</b> and <b>&#62;</b> keys to move between threads within the selected assignment</li><li>Use the <b>A,B,C,D,F</b> keys to let to assign the corresponding grade to the selected assignment </li></ul> </div>";
      },

      splash_docview: function (P, cb) {
        return "<div xmlns='http://www.w3.org/1999/xhtml' class='minisplashscreen ui-corner-all'> Select an assignment to see a preview of the material here</div>";
      },

      note_creator:    function (P, cb) {Pers.call('saveNote', P, cb);},

      note_editor:    function (P, cb) {Pers.call('editNote', P, cb);},

    });

    //get data:
    var P2 =  {};
    if ('id_ensemble' in Pers.params) {
      P2['id_ensemble'] = Pers.params.id_ensemble;
    }

    Pers.call('get_stats_ensemble', P2,  Pers.createStore);
  };

  Pers.createStore = function (payload) {
    var m = new Models.Store();
    m.meta = { loadednotes:{} };
    Pers.store = m;
    $.concierge.addConstants({ res: 288, scale: 25 });
    m.create(payload, {
      ensemble:    { pFieldName: 'ensembles' },
      file:    { pFieldName: 'files', references: { id_ensemble: 'ensemble', id_folder: 'folder' } },
      folder: { pFieldName: 'folders', references: { id_ensemble: 'ensemble', id_parent: 'folder' } },
      user: { pFieldName: 'users' },
      stat: { pFieldName: 'stats' },
      grade: { pFieldName: 'grades' },
      comment:{ references: { id_location: 'location' } },
      location:{ references: { id_ensemble: 'ensemble', id_source: 'file' } },
      seen:{ references: { id_location: 'location' } },
      mark: {},
      draft: {},
    });

    //    Pers.sequence = payload.sequence;
    $.concierge.setHistoryHelper(function (payload, cb) {Pers.call('log_history', payload, cb);}, 120000);

    $.concierge.trigger({ type:'spreadsheet', value: 1 });

    document.title = $.E(m.get('ensemble', {}).first().name + ' spreadsheet');
  };

  Pers.find_next_author = function (v) {
    var self        = this;
    var sel        = v.sel;
    var m        = self.store;
    var L        = m.meta.loadednotes;
    var id_author    = null;
    var id_author_next  = null;
    var id_source = v.files[sel[1] - 1].id;

    //find next author, if any:
    var nxt        = sel[0];
    while (nxt < v.users.length) {
      id_author    = v.users[nxt].id;
      if (id_author + '_' + id_source in m.o.stat) {
        if (!(id_author in L[id_source])) {
          id_author_next = id_author;
          break;
        }
      }

      nxt++;
    }

    return id_author_next;
  };

});
