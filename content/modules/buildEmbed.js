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

define(['jquery','concierge','auth','conf','dom','docviewHtml','models','pers','perspective','notepane_doc','threadview','editorview'],
       function($,concierge,Auth,Conf,Dom,Html,Models,Pers,Perspective,Notepane,threadview,editorview) {
	   
  if (NB$) {
    $ = NB$;
  }

  var $str        = NB$ ? 'NB$' : 'jQuery';

  var $vp;
  var id_ensemble = null;
  Pers.iframe_id = 'nb_iframe';
  var f_prepare_sidebar = function () {
    //now move stuff here it's supposed to be:
    // $vp = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo('.nb_sidebar');
    $vp = $(".nb-viewport").detach();
    $vp.prependTo('.nb_sidebar');
    Pers.set_nav_user();
    //TODO: get id_ensemble from cookie or localStorage if available.



    // ************************************

    // ***********************************

    $.concierge.addConstants({ res: 288, scale: 25, QUESTION: 1, STAR: 2 });
    $.concierge.addComponents({
      notes_loader:    function (P, cb) {Pers.call('getNotes', P, cb);},

      note_creator:    function (P, cb) {Pers.call('saveNote', P, cb);},

      note_editor:    function (P, cb) {Pers.call('editNote', P, cb);},

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
    Pers.store = new Models.Store();
    Pers.call(
        'getHTML5Info',
        { id_ensemble: id_ensemble, url: document.location.href.replace(document.location.hash, '') },
        function (payload) {
          //TODO: refactor (same as in step16.js:createStore)
          Pers.store.create(payload, {
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

          var ensemble = Pers.store.get('ensemble', {}).first();

          //get the section info as well as info whether user is admin:
          Pers.call('getSectionsInfo', { id_ensemble: ensemble.ID }, function (P3) {
            var m = Pers.store;
            m.add('section', P3['sections']);
            ensemble.admin = true; //we only get a callback if we're an admin for this ensemble
          });

          Pers.call('getMembers', { id_ensemble: ensemble.ID }, function (P5) {
            console.log('getMembers callback');

            Pers.store.add('members', P5);
          });

          //TODO: Take something else than first id_source
          var source = Pers.id_source = Pers.store.get('file').first();
          if (source === null) {
            $("<div class=\"nb-error\"><p>The URL for this page isn't registered on NB. Click this message to close the NB sidebar.</p></div>")
                .appendTo('.nb_sidebar>.nb-viewport').click(function () {
                  $('.nb_sidebar').fadeOut(400);
                });

            return;
          }

          var id_source = Pers.id_source = Pers.store.get('file').first().ID;
          $.concierge.setHistoryHelper(function (_payload, cb) {
            _payload['__return'] = { type:'newNotesOnFile', a:{ id_source: Pers.id_source } };
            Pers.call('log_history', _payload, cb);
          }, 120000,  function (P2) {
            //here we override the callback so that we can get new notes.
            var m = Pers.store;
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
              $div.threadview();
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
              var ensemble = m.o.ensemble[m.o.file[id_source].id_ensemble];
              $div.editorview({ allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous });
              $div.editorview('set_model', Pers.store);
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

            var f = Pers.store.o.file[id_source];
            $.concierge.get_component('notes_loader')({ file:id_source }, function (P) {
              var m = Pers.store;
              var target_comment=null;
              m.add('seen', P['seen']);
              m.add('comment', P['comments']);
              m.add('location', P['locations']);
              m.add('html5location', P['html5locations']);
              m.add('link', P['links']);
              m.add('threadmark', P['threadmarks']);

              //now check if need to move to a given annotation:
              if (location.hash.startsWith('#nb-comment')) {
                  target_comment=parseInt(location.hash.substring(12),10);
                  //failure to parse will yield (falsy) 0 and be ignored
              }
              else if ('c' in Pers.params) {
                  target_comment=Pers.params.c;
              }
              if (target_comment) {
                window.setTimeout(function () {
                  var c = m.get('comment', { ID: target_comment })
                        .items[target_comment];
                  if ('reply' in Pers.params) {
                    $.concierge.trigger({ type: 'reply_thread', value: c.ID });
                  }

                  $.concierge.trigger({ type: 'select_thread', value: c.ID_location });
                }, 300);
              } else if ('p' in Pers.params) {
                window.setTimeout(function () {
                  var page = Pers.params.p;
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
          $(function () {Html.init();});
        },

        function (P) { // Error Callback
          //FIXME: login can break if ckey expires while
          //userinfo guest status still suggests user logged in
          //which confuses the interface
          //see issue #280
          //for now, a hack: if login fails, reset guest status
          Auth.set_cookie('userinfo', JSON.stringify({ guest: true }));
          $('#login_to_nb').remove(); //in case one was already present
          $("<button id='login_to_nb'>Login to NB</button>")
          .appendTo('.nb-widget-header')
          .click(function (evt) {
            //sacha: disable this for now.
            //console.log("opening iframe");
            //$("#"+Pers.iframe_id).removeClass("nb_hidden");
            $.concierge.get_component('login_user_menu')();
          });
        });

  };

  Pers.ckey_from_iframe = null;
  Pers.f_poll_iframe = function () {
    console.log('polling iframe');
    $('#' + Pers.iframe_id)[0].contentWindow.postMessage('confkey', 'http://localhost:8001');
    if (Pers.ckey_from_iframe === null) {
      setTimeout(Pers.f_poll_iframe, 500);
    }    else {
      console.log('got ckey - no more polling', Pers.ckey_from_iframe);
    }
  };

  Pers.init = function () {
    Pers.connection_id = 0;
    Pers.embedded = true;

    //add our CSS
    var cur =  new URL(Pers.currentScript.src);
    var params = (new URL(document.location)).searchParams;
    if (params.has("nb-server")) {
      cur = new URL(params.get("nb-server"), cur);
    }
    Pers.server_url =  cur.protocol+"//" + cur.host;;
    Pers.add_css(Pers.server_url + '/content/compiled/embed_NB.css');
    Pers.add_css(Pers.server_url + '/content/lib/font-awesome/font-awesome-4.6.1/css/font-awesome.min.css');

    //Pers.openid_url=server_url+"/openid/login?next=/embedopenid";
    //sacha: disabled this as well for now.
    Pers.openid_url = '';

    // Make sure concierge won't steal our keys!
    $.concierge.keydown_block = false;

    //register for some events:
    $.concierge.addListeners(Pers, {
      successful_login: function (evt) {
        Auth.set_cookie('ckey', evt.value.ckey);
        Auth.set_cookie('userinfo', evt.value.userinfo);
        Conf.userinfo = JSON.parse(unescape(evt.value.userinfo));
        $.I('Welcome ' + Conf.userinfo.firstname + " " + Conf.userinfo.lastname);
        f_prepare_sidebar();
        Pers.set_nav_user();
      },
    }, 'globalPersObject');

    //tell who to make rpc requests to
    Conf.servers.rpc = Pers.server_url;

    $('body').append("<div class='nb_sidebar nb_inactive'></div><iframe src='" + Pers.openid_url + "' class='nb_iframe nb_hidden' id='" + Pers.iframe_id + "'></iframe>");

    $('#login_to_nb').click(function () {
      $.concierge.get_component('login_user_menu')();
    });

    //if user identified already, let's proceed:
    if (Conf.userinfo) {
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

  $(function () {
    Pers.params = Dom.getParams();
    Pers.preinit();
  });

});
