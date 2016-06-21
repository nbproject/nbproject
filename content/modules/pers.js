/*
 * pers.js: common fct for perspective-based views
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
define(function(require) {
  var Auth          = require('auth');
  var Dom           = require('dom');
  var Conf          = require('conf');
  var Models        = require('models');
  var concierge     = require('concierge');
  var jquery_ui     = require('jquery_ui');

  var $ = 'NB$' in window ? NB$ : $;

  // it would be great to use document.currentScript, but it only seems to be supported
  // on firefox for now, so we match by filename.
  var scriptname = '_NB.js';
  var nb_script = jQuery("script[src$='" + scriptname + "']");
  if (nb_script.length === 0) {
    alert("Error: Couldn't find  NB script, i.e ending in : " + scriptname);
    return;
  }

  if (nb_script.length > 1) {
    alert('Warning: Found more than one  NB script, i.e ending in : ' + scriptname + 'using the last one: ' + nb_script[nb_script.length - 1]);
  }

  Pers = {
    currentScript: nb_script[nb_script.length - 1],
    embedded: false,
  };
  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  /* trick for browsers that don't support document.activeElement
     adapted from http://ajaxandxml.blogspot.com/2007/11/emulating-activeelement-property-with.html
  */
  if (!('activeElement' in document)) {
    document.activeElement = document.body;
    document.addEventListener('focus', function (evt) {
      document.activeElement = evt.target === document ? document.body : evt.target;
    }, true);

    document.addEventListener('blur', function (evt) {
      document.activeElement = document.body;
    }, true);
  }

  Pers.connection_id = 0;
  Pers.first_connection = true;
  Pers.connection_T = 1000;  // in msec
  var server_info =  Pers.currentScript.src.match(/([^:]*):\/\/([^\/]*)/);
  Pers.server_url = server_info[1] + '://' + server_info[2];
  Pers.call = function (fctname, dict, callback, errback) {
    if ((!Pers.first_connection) && Pers.connection_id === 0) {
      // we haven't received a reply yet so put this function to wait for a while
      $.L('waiting until we get a connection id...');
      window.setTimeout(function () {
        Pers.call(fctname, dict, callback, errback);
      }, Pers.connection_T);
      return;
    }

    Pers.first_connection = false;
    var cb = function (x) {
      if ('CID' in x.status) {
        Pers.connection_id = x.status.CID;
      }

      if (x.status.errno) {
        //just display that there was an error for now
        if (errback !== undefined) {
          errback(x.status, x.payload);
        }

        $.L(x.status.msg);
        return;
      }

      //     console.log("cb w/ x=", x);
      callback(x.payload);
    };

    var auth_str = Conf.userinfo.guest ? 'guest=1' : 'ckey=' + Conf.userinfo.ckey;
    $.post(Conf.servers.rpc + '/pdf4/rpc?' + auth_str, { cid: Pers.connection_id, f: fctname, a: JSON.stringify(dict) }, cb, 'json');
  };

  Pers.__configure_user_menu = function (init_ui) {
    if (init_ui) { // Remove the nav-bar (if previously present) and re-add it.
      $("body").prepend(require('hbs!templates_dir/nav_template')());

      // Set URL of nb homepage in the navbar logo. We cannot simply use "/" because that
      // won't work with embedded scripts and the bookmarklet.
      var cur =  Pers.currentScript;
      var server_info =  cur.src.match(/([^:]*):\/\/([^\/]*)/);
      var server_url = server_info[1] + '://' + server_info[2] + "/";
      $(".nb-nav__logo").attr("href", server_url);

      // Add the dialogs for logging in and registering a new user (they'll be invisble until the right button gets clicked).
      var $util_window = $.concierge.get_component('get_util_window')();
      $util_window.append(require('hbs!templates_dir/register_user_dialog')());
      $util_window.append(require('hbs!templates_dir/login_user_dialog')());

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
          Auth.set_cookie('userinfo', evt.value.userinfo);
          document.location = document.location.protocol + '//' + document.location.host + document.location.pathname;

          // After logging in, remain on the same page so long as you are not on the login, logout or welcome page
          var nextpage = document.location.pathname + document.location.search;
          if(nextpage.lastIndexOf("/login", 0) === 0 || nextpage.lastIndexOf("/logout", 0) === 0 ||
            nextpage.lastIndexOf("/welcome", 0) === 0){
            nextpage = "/";
          }

          if(Pers.params.next){
            nextpage = Pers.params.next;
          }
          document.location = document.location.protocol + '//' + document.location.host + nextpage;
          $.I('Welcome !');
        },
      }, 'globalPersObject');

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
    }
    Pers.set_nav_user();
    Pers.params = Dom.getParams();
  };

  Pers.enable_csrf_protection = function() {
    // This function ensures that the CSRF Token will get set in the header of appropriate Post requests. This
    // would enable us to submit protected Django forms using Ajax.
    // Sources:
    // * Explanation and code: https://docs.djangoproject.com/en/1.9/ref/csrf/#ajax
    // * Blog with further details and example code: https://realpython.com/blog/python/django-and-ajax-form-submissions/

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
  }

  Pers.set_nav_user = function() {
    var userinfo = Conf.userinfo = JSON.parse(unescape(Auth.get_cookie('userinfo'))) || { guest: true };
    var screenname = "Guest";
    var viewportGuestClass = "nb--guest";
    var mainContentClass2 = "content_main--guest";

    if (!Conf.userinfo.guest) {
      screenname = userinfo.firstname === null ? $.E(userinfo.email) : $.E(userinfo.firstname) + ' ' + $.E(userinfo.lastname);
      viewportGuestClass = "";
      mainContentClass2 = "";
    }

    // Remove the defaults
    $(".nb-viewport").removeClass("nb--guest");
    $("#content_main").removeClass("main-content-class2");

    // Add the appropriate name and classes
    $("#login-name").text(screenname);
    $(".nb-viewport").addClass(viewportGuestClass);
    $("#content_main").addClass(mainContentClass2);
  };

  Pers.add_css = function (url) {
    var o = document.createElement('link');
    o.type = 'text/css';
    o.href = url;
    o.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(o);
  };

  Pers.preinit = function (init_ui) {
    // Set user as guest by default
    Conf.userinfo = JSON.parse(unescape(Auth.get_cookie('userinfo'))) || { guest: true };

    if (init_ui === undefined) {
      init_ui = true;
    }

    $.concierge.addComponents(Pers.__components);
    Pers.__configure_user_menu(init_ui);
    if ('init' in Pers) {
      Pers.init();
    }
    Pers.enable_csrf_protection();

    // Set error handler for Ajax calls. Source: http://api.jquery.com/ajaxerror/
    $(document).ajaxError(function(jqXHR, textStatus, errorThrown){
      if(textStatus.status == 403) { // CSRF error
        alert(textStatus.status + ": " + textStatus.statusText);
      } else {
        console.log(textStatus.status + ": " + textStatus.statusText);
      }

    });
  };

  /* stuff that can be used in various views */
  Pers.__components = {
    logout: function (p, cb) {
      Auth.delete_cookie('userinfo');
      Auth.delete_cookie('ckey');
      if (Pers.embedded) {
        document.location.reload();
      }      else {
        document.location.pathname = '/logout';
      }

    },

    location_closestpage:  function (p, cb) {
      /* given a location and id (in payload) returns "closest" location id found on a different page:
       - if "direction" is "down": "closest" is the location at the top-most position of the next page which has a location
       - if "direction" is "up": "closest" is the location at the bottom-most position of the previous page which has a location
    */
      var m = p.model;
      var loc = m.o.location[p.id];
      var me = $.concierge.get_component('get_userinfo')();
      var file = m.o.file[loc.id_source];
      var page = loc.page;
      var f_sort_down = function (o1, o2) {return o1.top - o2.top;};

      var TYPE_STAR = $.concierge.get_constant('STAR');
      var TYPE_QUESTION = $.concierge.get_constant('QUESTION');
      var new_id = null;
      var i, ids;
      var locs;
      if (p.direction === 'down') {
        i = page + 1;
        while (i <= file.numpages) {
          locs = m.get('location', { id_source: loc.id_source, page: i });
          if (p.filters) {
            if (p.filters.me) {
              locs = locs.intersect(m.get('comment', { id_author: me.id }).values('ID_location'));
            }

            if (p.filters.star) {
              locs = locs.intersect(m.get('threadmark', { active: true, type: TYPE_STAR }).values('location_id'));
            }

            if (p.filters.question) {
              locs = locs.intersect(m.get('threadmark', { active: true, type: TYPE_QUESTION }).values('location_id'));
            }
          }

          if (locs.length()) {
            new_id = locs.min('top');
            break;
          }

          i++;
        }
      }      else {
        i = page - 1;
        while (i > 0) {
          locs = m.get('location', { id_source: loc.id_source, page: i });
          if (p.filters) {
            if (p.filters.me) {
              locs = locs.intersect(m.get('comment', { id_author: me.id }).values('ID_location'));
            }

            if (p.filters.star) {
              locs = locs.intersect(m.get('threadmark', { active: true, type: TYPE_STAR }).values('location_id'));
            }

            if (p.filters.question) {
              locs = locs.intersect(m.get('threadmark', { active: true, type: TYPE_QUESTION }).values('location_id'));
            }
          }

          if (locs.length()) {
            new_id = locs.max('top');
            break;
          }

          i--;
        }
      }

      return new_id;
    },

    register_user_menu: function (P, cb) {
      $.L('register_user_menu');
      $('#register_user_dialog').dialog({
        title: 'Register for a new account...',
        width: 400,
        modal: true,
        position: { my: "top", at: "top+80", of: window },
        open: function(event, ui) {
          // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
          $('.ui-widget-overlay').bind('click', function() {
            $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
          });
        },
        buttons: {
          Cancel: function () {
            $(this).find('div.form_errors').empty();
            $(this).dialog('destroy');
          },

          Ok: function () {
            var $dlg = $(this);
            var err = function (msg) {
              $dlg.find('div.form_errors').hide().text(msg).show('fast');
            };

            if ($('#register_user_password1')[0].value !== $('#register_user_password2')[0].value) {
              err("passwords don't match: please retype them");
              return;
            }

            if ($('#register_user_firstname')[0].value.length === 0) {
              err('Please enter your firstname');
              return;
            }

            if ($('#register_user_lastname')[0].value.length === 0) {
              err('Please enter your lastname');
              return;
            }

            if ($('#register_user_email')[0].value.match(/^([^@ ]+)@+([^@ ]+)$/) == null) {
              err('Please enter a valid e-mail address');
              return;
            }

            if ($('#termsandconditions:checked').length === 0) {
              err('You need to accept NB terms and conditions in order to register.');
              return;
            }

            var payload = {
                firstname: $('#register_user_firstname')[0].value,
                    lastname: $('#register_user_lastname')[0].value,
                    email: $('#register_user_email')[0].value,
                    pseudonym: $('#register_user_pseudonym')[0].value,
                password: $('#register_user_password1')[0].value,
                    ckey: Conf.userinfo.ckey, };
            $.concierge.get_component('register_user')(payload, function (p) {
              $.I('Thanks for registering... You should receive a confirmation code by email in less than a minute...');
              $dlg.dialog('destroy');
            }, function (status, p) {

            err(status.msg);});
          },
        },
      });
      $('#register_user_dialog').dialog('open');
    },

    login_user_menu: function (P, cb) {
      $('#login_user_password').keypress(function (e) {if (e.keyCode === 13 && this.value.length > 0) {
        $.L('using shortcut');
        $('#login_user_dialog').parent().find("button:contains('Ok')").click();
      }});

      $.L('login_user_menu');
      $('#login_user_dialog').dialog({
        title: 'Log in...',
        width: 390,
        modal: true,
        position: { my: "top", at: "top+80", of: window },
        open: function(event, ui) {
          // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
          $('.ui-widget-overlay').bind('click', function() {
            $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
          });
        },
        buttons: {
          Cancel: function () {
            $(this).find('div.form_errors').empty();
            $(this).dialog('destroy');
          },

          Ok: function () {
            var $dlg = $(this);
            var err = function (msg) {
              $dlg.find('div.form_errors').hide().text(msg).show('fast');
            };

            var payload = {
              email: $('#login_user_email2')[0].value,
              password: $('#login_user_password2')[0].value,
            };
            $.concierge.get_component('login_user')(payload, function (p) {
              if (p.ckey !== null) {
                $.concierge.trigger({ type:'successful_login', value: p });
                $dlg.find('div.form_errors').empty();
                $dlg.dialog('destroy');
              }              else {
                err("email or password doesn't match. Please try again");
              }
            });
          },
        },
      });
      $('#login_user_dialog').dialog('open');
    },

    get_util_window: function (P, cb) {
      return $('div.util_windows');
    },

    register_user: function (P, cb, eb) {
      Pers.call('register_user', P, cb, eb);
    },

    advanced_filter: function (P, cb, eb) {
      Pers.call('advanced_filter', P, cb, eb);
    },

    login_user: function (P, cb) {
      Pers.call('login_user', P, cb);
    },

    get_userinfo: function (P, cb) {
      return Conf.userinfo;
    },

    mini_splashscreen: function (P, cb) {
      var widget;
      var nbhostname  = Pers.server_url;
      if (Conf.userinfo.guest) { //splashscreen for non-registered user
        widget =  "<div class='minisplashscreen ui-corner-all'>  <div id='splash-welcome'>Welcome to NB !</div><div id='nb-def'>...a forum on top of every PDF.</div> <ul id='splash-list-instructions'> <li>Use your mouse or the <span class='ui-icon ui-icon-circle-triangle-w'></span> and <span class='ui-icon ui-icon-circle-triangle-e'></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class='ui-icon ui-icon-circle-triangle-n'></span> and  <span class='ui-icon ui-icon-circle-triangle-s'></span> keys to scroll up and down the document.</li> <li>New user ? <a class='link-style nb-register'>Register</a> now to be able to post comments...</li> <li>Existing user ? <a class='link-style nb-login'>Log in</a> now...</li> </ul>  <a target='_blank' href='" + nbhostname + "/help'>More help...</a>  </div>       ";
      }      else { //splashscreen for registered user
        widget = "<div class='minisplashscreen ui-corner-all'>  <div id='splash-welcome'>Welcome to NB !</div> <ul id='splash-list-instructions'> <li>Use your mouse or the <span class='ui-icon ui-icon-circle-triangle-w'></span> and <span class='ui-icon ui-icon-circle-triangle-e'></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class='ui-icon ui-icon-circle-triangle-n'></span> and  <span class='ui-icon ui-icon-circle-triangle-s'></span> keys to scroll up and down the document.</li> <li>Drag across any region on the pdf to create a new discussion</li> <li>Right-click on any comment to post a reply</li> </ul>  <a target='_blank' href='" + nbhostname + "/help'>More help...</a>  </div>       ";
      }

      $('.nb-register', widget).click($.concierge.get_component('register_user_menu'));
      $('.nb-login', widget).click($.concierge.get_component('login_user_menu'));
      return widget;
    },

    note_deleter: function (P, cb) {Pers.call('deleteNote', P, cb);},

    rate_reply: function (P, cb) {Pers.call('rate_reply', P, cb);},

    mark_thread: function (P, cb) {Pers.call('markThread', P, cb);},

    get_login_window: function (P, cb) {
      return $('#login-window');
    },

    get_file_stats: function (P, cb) {
      var payload_objects = { types: ['file_stats'] };
      if ('id_ensemble' in P) {
        payload_objects['payload'] = { id_ensemble: P.id_ensemble };
      }

      Pers.call('getObjects', payload_objects, cb);
    },

    in_progress: function (P, cb) {
      var msg = 'Loading in progress...';
      if (P !== undefined && 'msg' in P) {
        msg = P.msg;
      }

      return "<div align='center' class='loadingpane'><img src='content/data/icons/gif/loader1.gif'/><div class='loadingpane-msg'>" + msg + '</div></div>';
    },

    pretty_print_timedelta: function (P, cb) {
      var d = new Date(P.t);
      var now = new Date();
      var delta_s = parseInt((now - d) / 1000, 10);
      var s = '';
      if (delta_s < 3600) {
        s += (parseInt(delta_s / 60, 10) + ' minutes ago');
      }      else if (delta_s < 3600 * 24) {
        s += (parseInt(delta_s / 3600, 10) + ' hours ago');
      }      else {
        s += (parseInt(delta_s / (3600 * 24), 10) + ' days ago');
      }

      return s;
    },

    get_sec_mult_factor: function () {
      return 100;
    },

    get_metronome_period_s: function () {
      return 0.2;
    },

    addEnsembleMenu: function () {
      if(!$("#add_ensemble_dialog").length) {
        var $util_window = $.concierge.get_component('get_util_window')();
        $util_window.append(require('hbs!templates_dir/new_class_dialog'));
      }
      //defaults:
      $('input[name=allow_staffonly][value=1]')[0].checked = 'true';
      $('input[name=allow_anonymous][value=1]')[0].checked = 'true';
      $('input[name=allow_guest][value=0]')[0].checked = 'true';
      $('input[name=allow_download][value=1]')[0].checked = 'true';
      $('input[name=allow_ondemand][value=0]')[0].checked = 'true';
      $('input[name=use_invitekey][value=1]')[0].checked = 'true';
      $('input[name=default_pause][value=0]')[0].checked = 'true';
      $('#add_ensemble_dialog').dialog({
        title: 'Create a new class...',
        width: 540,
        modal: true,
        position: { my: "top", at: "top+80", of: window },
        open: function(event, ui) {
          // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
          $('.ui-widget-overlay').bind('click', function() {
            $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
          });
        },
        buttons: {
          Cancel: function () {
            $(this).dialog('close');
          },

          Ok: function () {
            $.concierge.get_component('add_ensemble')({
              name: $('#add_ensemble_name')[0].value,
              description: $('#add_ensemble_description')[0].value,
              allow_staffonly:$('input[name=allow_staffonly]:checked')[0].value === '1',
              allow_anonymous: $('input[name=allow_anonymous]:checked')[0].value === '1',
              allow_guest: $('input[name=allow_guest]:checked')[0].value === '1',
              default_pause: $('input[name=default_pause]:checked')[0].value === '1',
              allow_download: $('input[name=allow_download]:checked')[0].value === '1',
              allow_ondemand: $('input[name=allow_ondemand]:checked')[0].value === '1',
              use_invitekey: $('input[name=use_invitekey]:checked')[0].value === '1' },
              function (p) {
                Files.model.add('ensemble', p);
                $.I('Class created !');
              });
            $(this).dialog('destroy');
          },
        },
      });
      $('#add_ensemble_dialog').dialog('open');
    }
  };

  return Pers;
});
