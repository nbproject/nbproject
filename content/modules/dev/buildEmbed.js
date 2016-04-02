/*
 * buildEmbed.js: build embedded NB
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true $:true NB$:true NB:true alert:true escape:false console:false*/

(function (GLOB) {

  if ('NB$' in window) {
    var $ = NB$;
  }

  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  var $vp;
  var id_ensemble = null;
  GLOB.pers.iframe_id = 'nb_iframe';
  var f_prepare_sidebar = function () {
    //SACHA: TODO. Do a better job that just displaying the user name, and maybe refactor with pers2._authenticate.
    //for now, just update user name and email on hover. :
    var uinfo = GLOB.conf.userinfo;
    if (!uinfo.guest) {
      var screenname = uinfo.firstname === null ? $.E(uinfo.email) : $.E(uinfo.firstname) + ' ' + $.E(uinfo.lastname);
      $('#login-name').text(screenname).attr('title', $.E(uinfo.email));
    }

    //now move stuff here it's supposed to be:
    $vp = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo('.nb_sidebar');
    $('#login-window').appendTo('.nb-widget-header'); // add this here so it's fixed as well
    //TODO: get id_ensemble from cookie or localStorage if available.
    $.concierge.addConstants({ res: 288, scale: 25, QUESTION: 1, STAR: 2 });
    $.concierge.addComponents({
      notes_loader:    function (P, cb) {GLOB.pers.call('getNotes', P, cb);},

      note_creator:    function (P, cb) {GLOB.pers.call('saveNote', P, cb);},

      note_editor:    function (P, cb) {GLOB.pers.call('editNote', P, cb);},

      bulk_import_annotations: function (P, cb) {
        GLOB.pers.call('bulk_import_annotations', {
          locs_array: P.locs_array,
          from_source_id: P.from_source_id,
          to_source_id: P.to_source_id,
          import_type: P.import_type,
        }, cb);
      },

      set_location_section: function (P, cb) {
        GLOB.pers.call('set_location_section', {
          id_location: P.id_location,
          id_section: P.id_section,
        }, cb);
      },

      promote_location_by_copy: function (P, cb) {
        GLOB.pers.call('promote_location_by_copy', {
          id_location: P.id_location,
        }, cb);
      },

      delete_thread: function (P, cb) {
        GLOB.pers.call('deleteThread', {
          id_location: P.id_location,
        }, cb);
      },
    });
    GLOB.pers.store = new GLOB.models.Store();
    GLOB.pers.call(
        'getHTML5Info', { id_ensemble: id_ensemble, url: document.location.href.replace(document.location.hash, '') },
        function (payload) {
          //TODO: refactor (same as in step16.js:createStore)
          GLOB.pers.store.create(payload, {
            ensemble:    { pFieldName: 'ensembles' },
            section:    { pFieldName: 'sections', references: { id_ensemble: 'ensemble' } },
            file:    { pFieldName: 'files', references: { id_ensemble: 'ensemble', id_folder: 'folder' } },
            folder: { pFieldName: 'folders', references: { id_ensemble: 'ensemble', id_parent: 'folder' } },
            comment:{ references: { id_location: 'location' } },
            location:{ references: { id_ensemble: 'ensemble', id_source: 'file' } },
            html5location:{ references: { id_location: 'location' } },
            link: { pFieldName: 'links' },
            mark: {},
            threadmark: { pFieldName: 'threadmarks', references: { location_id: 'location' } },
            draft: {},
            seen:{ references: { id_location: 'location' } },
            members: {},
            tags: { references: { user_id: 'members', comment_id: 'comment' } },
          });

          var ensemble = NB.pers.store.get('ensemble', {}).first();

          //get the section info as well as info whether user is admin:
          GLOB.pers.call('getSectionsInfo', { id_ensemble: ensemble.ID }, function (P3) {
            var m = GLOB.pers.store;
            m.add('section', P3['sections']);
            ensemble.admin = true; //we only get a callback if we're an admin for this ensemble
          });

          GLOB.pers.call('getMembers', { id_ensemble: ensemble.ID }, function (P5) {
            console.log('getMembers callback');

            GLOB.pers.store.add('members', P5);
          });

          //TODO: Take something else than first id_source
          var source = GLOB.pers.id_source = NB.pers.store.get('file').first();
          if (source === null) {
            $("<div class=\"nb-error\"><p>The URL for this page isn't registered on NB. Click this message to close the NB sidebar.</p></div>")
                .appendTo('.nb_sidebar>.nb-viewport').click(function () {
                  $('.nb_sidebar').fadeOut(400);
                });

            return;
          }

          var id_source = GLOB.pers.id_source = NB.pers.store.get('file').first().ID;
          $.concierge.setHistoryHelper(function (_payload, cb) {
            _payload['__return'] = { type:'newNotesOnFile', a:{ id_source: GLOB.pers.id_source } };
            GLOB.pers.call('log_history', _payload, cb);
          }, 120000,  function (P2) {
            //here we override the callback so that we can get new notes.
            var m = GLOB.pers.store;
            m.add('comment', P2['comments']);
            m.add('location', P2['locations']);
            m.add('html5location', P2['html5locations']);
            var msg = '';
            var l, c;
            for (var i in P2['comments']) {
              c = m.o.comment[i];
              l = m.o.location[c.ID_location];
              if (c.id_author !==  $.concierge.get_component('get_userinfo')().id) {    //do nothing if I'm the author:
                msg += "<a href='javascript:" + $str + '.concierge.trigger({type: "select_thread", value:"' + l.ID + "\"})'>New comment on page " + l.page + '</a><br/>';
              }
            }

            if (msg !== '') {
              $.I(msg, true);
            }
          });

          $.concierge.trigger({ type:'file', value: id_source });

          //let's create perspective here:
          var $pers = $("<div id='pers_" + id_source + "'/>").appendTo($vp);

          var notesview = {
            priority: 1,
            min_width: 650,
            desired_width: 35,
            min_height: 1000,
            desired_height: 50,
            content: function ($div) {
              $div.notepaneView();
              $div.notepaneView('set_model', GLOB.pers.store);
            },
          };
          var threadview = {
            priority: 1,
            min_width: 650,
            desired_width: 35,
            min_height: 1000,
            desired_height: 50,
            content: function ($div) {
              $div.threadview();
              $div.threadview('set_model', GLOB.pers.store);
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
              var m = GLOB.pers.store;
              var ensemble = m.o.ensemble[m.o.file[id_source].id_ensemble];
              $div.editorview({ allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous });
              $div.editorview('set_model', GLOB.pers.store);
            },
          };

          //SACHA FIXME: Hack we embed the following into a delay because FF doesn't compute the right window height if we execute this right away
          setTimeout(function () {
            $pers.perspective({
              ext_separator: {
                container: '.nb_sidebar',
                orientation: 'vertical',

              },
              height: function () {
                //3rd term is to account for the fact we have NB embedded as part of widget that has a 'fixed' position
                return $vp.height() - ($pers.offset().top - $vp.offset().top);
              },

              listens: {
                page_peek: function (evt) {
                  //need to add 1 value for uniqueness
                  $.concierge.logHistory('page', evt.value + '|' + id_source + '|' + (new Date()).getTime());
                },

                close_view: function (evt) {
                  if (evt.value === this.l.element[0].id) {
                    delete($.concierge.features.doc_viewer[id_source]);
                  }

                  $.L('closeview: ', evt, this.l.element[0].id);
                },
              },
              views: {
                v1: { data: notesview },
                v2: {
                  children: {
                    v1: { data: threadview },
                    v2: { data: editorview },
                    orientation: 'horizontal',
                  },
                },
                orientation: 'horizontal',
              },
            });

            //end of perspective creation code

            var f = GLOB.pers.store.o.file[id_source];
            $.concierge.get_component('notes_loader')({ file:id_source }, function (P) {
              var m = GLOB.pers.store;
              m.add('seen', P['seen']);
              m.add('comment', P['comments']);
              m.add('location', P['locations']);
              m.add('html5location', P['html5locations']);
              m.add('link', P['links']);
              m.add('threadmark', P['threadmarks']);

              //now check if need to move to a given annotation:
              if ('c' in GLOB.pers.params) {
                window.setTimeout(function () {
                  var id =  GLOB.pers.params.c;
                  var c = m.get('comment', { ID: id }).items[id];
                  if ('reply' in GLOB.pers.params) {
                    $.concierge.trigger({ type: 'reply_thread', value: c.ID });
                  }

                  $.concierge.trigger({ type: 'select_thread', value: c.ID_location });
                }, 300);
              } else if ('p' in GLOB.pers.params) {
                window.setTimeout(function () {
                  var page = GLOB.pers.params.p;
                  $.concierge.trigger({ type: 'page', value: page });
                }, 300);
              } else {
                window.setTimeout(function () {
                  $.concierge.trigger({ type: 'page', value: 1 });
                }, 300);
              }
            });
          }, 1000);

          $('body').addClass('nb-active');
          $(function () {GLOB.html.init();});
        },

        function (P) {
          //FIXME: login can break if ckey expires while
          //userinfo guest status still suggests user logged in
          //which confuses the interface
          //see issue #280
          //for now, a hack: if login fails, reset guest status
          GLOB.auth.set_cookie('userinfo', JSON.stringify({ guest: true }));
          $('#login_to_nb').remove(); //in case one was already present
          $("<button id='login_to_nb'>Login to NB</button>")
          .appendTo('.nb-widget-header')
          .click(function (evt) {
            //sacha: disable this for now.
            //console.log("opening iframe");
            //$("#"+GLOB.pers.iframe_id).removeClass("nb_hidden");
            $.concierge.get_component('login_user_menu')();
          });
        });

  };

  GLOB.pers.ckey_from_iframe = null;
  GLOB.pers.f_poll_iframe = function () {
    console.log('polling iframe');
    $('#' + GLOB.pers.iframe_id)[0].contentWindow.postMessage('confkey', 'http://localhost:8001');
    if (GLOB.pers.ckey_from_iframe === null) {
      setTimeout(GLOB.pers.f_poll_iframe, 500);
    }    else {
      console.log('got ckey - no more polling', GLOB.pers.ckey_from_iframe);
    }
  };

  GLOB.pers.init = function () {
    GLOB.pers.connection_id = 0;
    GLOB.pers.embedded = true;

    //add our CSS
    var cur =  GLOB.pers.currentScript;
    var server_info =  cur.src.match(/([^:]*):\/\/([^\/]*)/);
    var server_url = server_info[1] + '://' + server_info[2];
    GLOB.pers.add_css(server_url + '/content/compiled/embed_NB.css');

    //GLOB.pers.openid_url=server_url+"/openid/login?next=/embedopenid";
    //sacha: disabled this as well for now.
    GLOB.pers.openid_url = '';

    // Make sure concierge won't steal our keys!
    $.concierge.keydown_block = false;

    //register for some events:
    $.concierge.addListeners(GLOB.pers, {
      successful_login: function (evt) {
        GLOB.auth.set_cookie('ckey', evt.value.ckey);
        GLOB.auth.set_cookie('userinfo', JSON.stringify(evt.value));
        GLOB.conf.userinfo = evt.value;
        $.L('Welcome TO NB !');
        $('#splash-welcome').parent().remove();

        f_prepare_sidebar();

      },
    }, 'globalPersObject');

    //tell who to make rpc requests to
    GLOB.conf.servers.rpc = GLOB.pers.server_url;

    $('body').append("<div class='nb_sidebar nb_inactive'></div><iframe src='" + GLOB.pers.openid_url + "' class='nb_iframe nb_hidden' id='" + GLOB.pers.iframe_id + "'></iframe>");

    $('#login_to_nb').click(function () {
      $.concierge.get_component('login_user_menu')();
    });

    //if user identified already, let's proceed:
    if (GLOB.conf.userinfo) {
      //optimization to get this visibile faster
      //if ckey is invalid, sidebar will be erased
      //and replaced by a login button
      f_prepare_sidebar();
    }

    window.addEventListener('message', function (e) {
      console.log('got event: ', e);

      //TODO: clearTimeout
    }, false);

  };

  jQuery(function () {
    GLOB.pers.params = GLOB.dom.getParams();
    GLOB.pers.preinit();
  });

})(NB);
