/*
 * pers.js: common fct for perspective-based views
 * This module defines the namespace NB.pers
 * It requires the following modules:
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
(function (GLOB) {
  //require auth
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

  GLOB.pers = {
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

  GLOB.pers.connection_id = 0;
  GLOB.pers.first_connection = true;
  GLOB.pers.connection_T = 1000;  // in msec
  var server_info =  GLOB.pers.currentScript.src.match(/([^:]*):\/\/([^\/]*)/);
  GLOB.pers.server_url = server_info[1] + '://' + server_info[2];
  GLOB.pers.call = function (fctname, dict, callback, errback) {
    if ((!GLOB.pers.first_connection) && GLOB.pers.connection_id === 0) {
      // we haven't received a reply yet so put this function to wait for a while
      $.L('waiting until we get a connection id...');
      window.setTimeout(function () {
        GLOB.pers.call(fctname, dict, callback, errback);
      }, GLOB.pers.connection_T);
      return;
    }

    GLOB.pers.first_connection = false;
    var cb = function (x) {
      if ('CID' in x.status) {
        GLOB.pers.connection_id = x.status.CID;
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

    var auth_str = GLOB.conf.userinfo.guest ? 'guest=1' : 'ckey=' + GLOB.conf.userinfo.ckey;
    $.post(GLOB.conf.servers.rpc + '/pdf4/rpc?' + auth_str, { cid: GLOB.pers.connection_id, f: fctname, a: JSON.stringify(dict) }, cb, 'json');
  };

  GLOB.pers.__configure_user_menu = function (init_ui) {
    var uinfo = GLOB.conf.userinfo = JSON.parse(unescape(GLOB.auth.get_cookie('userinfo'))) || { guest: true };
    var nbhostname = GLOB.pers.server_url;
    var $login_contents;
    if (uinfo.guest) {
      $login_contents = $("<ul class='nb-dropdown-menu'><li><span id='login-name'>Guest</span><ul><li><a class='link-style nb-login'>Log in</a</li><li><span class='link-style nb-register'>Register</span></li><li><a class='link-style nb-logout'>Log out</a></li></ul></li></ul>");
    } else {
      var screenname = uinfo.firstname === null ? $.E(uinfo.email) : $.E(uinfo.firstname) + ' ' + $.E(uinfo.lastname);
      $login_contents = $("<ul class='nb-dropdown-menu'><li><a class='link-style' id='login-name' title='" + $.E(uinfo.email) + "'>" + screenname + "</a><ul><li id='menu_settings'><a target='_blank' href='" + nbhostname + "/settings'>Settings</a></li><li id='menu_logout'><a class='link-style nb-logout'>Log out</a></li></ul></li></ul>");
    }

    $('.nb-logout', $login_contents).click($.concierge.get_component('logout'));
    $('.nb-login', $login_contents).click($.concierge.get_component('login_user_menu'));
    $('.nb-register', $login_contents).click($.concierge.get_component('register_user_menu'));
    if (init_ui) {
      $('#login-window').remove();
      var $login_window = $("<div id='login-window'/>");
      $login_contents.append($("<li><a href='#'>Help</a><ul><li><a href='" + nbhostname + "/tutorial'>Tutorial</a></li><li><a href='" + nbhostname + "/faq'>FAQ</a></li><li><a href='" + nbhostname + "/contact'>Contact Us</a></li><li><a href='" + nbhostname + "/disclaimer'>Disclaimer</a></li></ul></li>"));
      $login_window.append($login_contents);
      $('body').append($login_window);
    }

    GLOB.pers.params = GLOB.dom.getParams();
  };

  GLOB.pers.add_css = function (url) {
    var o = document.createElement('link');
    o.type = 'text/css';
    o.href = url;
    o.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(o);
  };

  GLOB.pers.preinit = function (init_ui) {
    if (init_ui === undefined) {
      init_ui = true;
    }

    $.concierge.addComponents(GLOB.pers.__components);
    GLOB.pers.__configure_user_menu(init_ui);
    if ('init' in GLOB.pers) {
      GLOB.pers.init();
    }
  };

  /* stuff that can be used in various views */
  GLOB.pers.__components = {
    logout: function (p, cb) {
      GLOB.auth.delete_cookie('userinfo');
      GLOB.auth.delete_cookie('ckey');
      if (GLOB.pers.embedded) {
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
                    ckey: GLOB.conf.userinfo.ckey, };
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
      var nbhostname = GLOB.pers.server_url;
      var $util_window = $.concierge.get_component('get_util_window')();
      $('#register_user_dialog, #login_user_dialog').remove();

      $util_window.append("<div id='register_user_dialog'>   <div id='reg_welcome'>Welcome to NB !</div><div id='reg_benefits'>Registering only takes a few seconds and lets you annotate online PDFs...</div>  <table> <tr><td>Firstname</td><td><input type='text' id='register_user_firstname' /></td></tr> <tr><td>Lastname</td><td><input type='text' id='register_user_lastname' /></td></tr> <tr style='display: none;'><td>Pseudonym</td><td><input type='text' id='register_user_pseudonym' /></td></tr><tr><td>Email</td><td><input type='text' id='register_user_email' /></td></tr><tr><td>Password</td><td><input type='password' id='register_user_password1' /></td></tr><tr><td>Confirm Password</td><td><input type='password' id='register_user_password2' /></td></tr>  <tr><td><span>Or use</span> </td><td><button title='Register using your Google account' onclick='if(" + $str + "('#termsandconditions:checked').length){document.location='" + nbhostname + '/openid/login?next=' + (document.location.pathname === '/login' ? '/' : document.location.pathname) + "';}else{alert('In order to register with your Google account, please agree with NB Terms and Conditions by checking the checkbox below');}'><img style='vertical-align: middle;' src='/content/data/icons/png/1345558452_social_google_box.png' alt='your Google account'/></button><button  title='Register using your Facebook account' onclick='if(" + $str + "('#termsandconditions:checked').length){document.location='/openid/login?next=" + (document.location.pathname === '/login' ? '/' : document.location.pathname) + "';}else{alert('In order to register with your Facebook account, please agree with NB Terms and Conditions by checking the checkbox below');}'><img style='vertical-align: middle;' src='" + nbhostname + "/content/data/icons/png/1345558472_social_facebook_box_blue.png' alt='your Facebook account'/></button> </td></tr> </table> <div>     <input type='checkbox' id='termsandconditions' />      <label for='termsandconditions'>I agree with <a target='_blank' href='" + nbhostname + "/terms_public_site'>NB Terms and Conditions</a></label></div>  <div class='form_errors'></div> </div>").append($.concierge.get_component('get_login_dialog_markup')());

      $('#login_user_password').keypress(function (e) {if (e.keyCode === 13 && this.value.length > 0) {
        $.L('using shortcut');
        $('#login_user_dialog').parent().find("button:contains('Ok')").click();
      }});

      $.L('login_user_menu');
      $('#login_user_dialog').dialog({
        title: 'Log in...',
        width: 390,
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
              email: $('#login_user_email')[0].value,
              password: $('#login_user_password')[0].value,
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
      var $util_window = $('div.util_windows');

      if ($util_window.length === 0) {
        $util_window = $("<div class='util_windows' style='display:none'/>");
      }

      $('body').append($util_window);
      return $util_window;
    },

    register_user: function (P, cb, eb) {
      GLOB.pers.call('register_user', P, cb, eb);
    },

    advanced_filter: function (P, cb, eb) {
      GLOB.pers.call('advanced_filter', P, cb, eb);
    },

    login_user: function (P, cb) {
      GLOB.pers.call('login_user', P, cb);
    },

    get_userinfo: function (P, cb) {
      return GLOB.conf.userinfo;
    },

    mini_splashscreen: function (P, cb) {
      var widget;
      var nbhostname  = GLOB.pers.server_url;
      if (GLOB.conf.userinfo.guest) { //splashscreen for non-registered user
        widget =  "<div class='minisplashscreen ui-corner-all'>  <div id='splash-welcome'>Welcome to NB !</div><div id='nb-def'>...a forum on top of every PDF.</div> <ul id='splash-list-instructions'> <li>Use your mouse or the <span class='ui-icon ui-icon-circle-triangle-w'></span> and <span class='ui-icon ui-icon-circle-triangle-e'></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class='ui-icon ui-icon-circle-triangle-n'></span> and  <span class='ui-icon ui-icon-circle-triangle-s'></span> keys to scroll up and down the document.</li> <li>New user ? <a class='link-style nb-register'>Register</a> now to be able to post comments...</li> <li>Existing user ? <a class='link-style nb-login'>Log in</a> now...</li> </ul>  <a target='_blank' href='" + nbhostname + "/help'>More help...</a>  </div>       ";
      }      else { //splashscreen for registered user
        widget = "<div class='minisplashscreen ui-corner-all'>  <div id='splash-welcome'>Welcome to NB !</div> <ul id='splash-list-instructions'> <li>Use your mouse or the <span class='ui-icon ui-icon-circle-triangle-w'></span> and <span class='ui-icon ui-icon-circle-triangle-e'></span> keys to move from discussion to discussion.</li> <li>Use your mouse or the  <span class='ui-icon ui-icon-circle-triangle-n'></span> and  <span class='ui-icon ui-icon-circle-triangle-s'></span> keys to scroll up and down the document.</li> <li>Drag across any region on the pdf to create a new discussion</li> <li>Right-click on any comment to post a reply</li> </ul>  <a target='_blank' href='" + nbhostname + "/help'>More help...</a>  </div>       ";
      }

      $('.nb-register', widget).click($.concierge.get_component('register_user_menu'));
      $('.nb-login', widget).click($.concierge.get_component('login_user_menu'));
      return widget;
    },

    note_deleter: function (P, cb) {GLOB.pers.call('deleteNote', P, cb);},

    rate_reply: function (P, cb) {GLOB.pers.call('rate_reply', P, cb);},

    mark_thread: function (P, cb) {GLOB.pers.call('markThread', P, cb);},

    get_login_window: function (P, cb) {
      return $('#login-window');
    },

    get_file_stats: function (P, cb) {
      var payload_objects = { types: ['file_stats'] };
      if ('id_ensemble' in P) {
        payload_objects['payload'] = { id_ensemble: P.id_ensemble };
      }

      GLOB.pers.call('getObjects', payload_objects, cb);
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

    get_login_dialog_markup: function (P, cb) {
      var nbhostname = GLOB.pers.server_url;

      return "<div id='login_user_dialog' > <table cellspacing='5px'> <tr><td>Email</td><td><input type='text'  id='login_user_email' ></input></td></tr><tr><td>Password</td><td><input type='password'  id='login_user_password' ></input></td></tr><tr><td/><td><span id='loginbutton_classic'/><a style='padding-left: 10px;  font-size: x-small' href='" + nbhostname + "/password_reminder'>Lost password ?</a></td></tr><tr style='display: none'><td style='font-size: small'>Or use</td><td id='loginbuttons_sso'><button title='Login using your Google account' onclick='document.location='" + nbhostname + '/openid/login?next=' + (document.location.pathname === '/login' ? '/' : document.location.pathname) + "'><img style='vertical-align: middle;' src='" + nbhostname + "/content/data/icons/png/1345558452_social_google_box.png' alt='your Google account'/></button><button style='display: none' title='Login using your Facebook account' onclick='document.location='/facebook/login?next=" + (document.location.pathname === '/login' ? '/' : document.location.pathname) + "'><img style='vertical-align: middle;' src='/content/data/icons/png/1345558472_social_facebook_box_blue.png' alt='your Facebook account'/></button></td></tr></table><div class='form_errors'/></div>";
    },

    get_sec_mult_factor: function () {
      return 100;
    },

    get_metronome_period_s: function () {
      return 0.2;
    },
  };
})(NB);
