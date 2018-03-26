/* Concierge Plugin v.1
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
/*global jQuery:true console:true*/
var NB$;

define(function(require) {
  NB$ = require('jquery');

  var Concierge = function () {
    var self = this;
    this.providers = {};
    this.listeners = {} ;
    this.transitions = {};
    this.state = { a:{}, o:{} };//a: active state, o: stored states
    this.factories = {};
    this.features = {};
    this.views = {};
    this.constants = {};
    this.components = {};
    this.allowed_repeat_event = {};
    this.keydown_block = true;
    this.historyHelper = {
      ptr: null,
      log: {},
      fct: null,
      T: null,
      latestentrytime:(new Date()).getTime(),
      T_idle: 120000,
      latesteventtime: false,
      timeout: 0,
    };
    this.activeView = null;
    /*
    this.keydown = function(event){
        if (self.activeView !== null){
        return self.activeView._keydown(event);
        }
    };
    */

    //keypress is better in mozilla, since we get repeated strokes, but doesn't work in other browsers
    var f_key_cb = function (event) {
      if (document.activeElement !== document.body && document.activeElement.tagName !== 'A') {
        return true; //a "non-anchor" focusable element has the focus: let's not interfere
      }

      if ('activeView' in self && self.activeView !== null) {
        return self.activeView._keydown(event);
      }      else {
        return !(self.keydown_block); // do NOT propagate by default.
      }
    };

    if (NB$.browser !== undefined) {
      if (NB$.browser.mozilla) {
        NB$(document.documentElement).keypress(f_key_cb);
      } else {
        NB$(document.documentElement).keydown(f_key_cb);
      }
    }
  };

  Concierge.prototype.allowRepeatedEvents = function (list) {
    for (var i in list) {
      this.allowed_repeat_event[list[i]] = true;
    }
  };

  Concierge.prototype.addListeners = function (view, o, _id) {
    /*
     * pre: view is a object that has a:
     *  - _defaultHandler method, or that passed a specific listener function. See step??.js for an example where ui.perspective?.js is used as a view,
     *     although perspectives don't have a _defaultHandler method
     *  - an id that can be retrieved by  element[0].id that is passed explicitely as a third optional parameter
     * In any case it DOESN'T need to be a class derived from ui.view
    */
    var id = _id === undefined ? view.element[0].id : _id;
    var x = this.listeners;
    for (var i in o) {
      if (!(i in x)) {
        x[i] = {};
      }

      x[i][id] = { l:view, cb:o[i] };
    }
  };

  Concierge.prototype.setConstants = function (o) {
    this.constants = o;
  };

  Concierge.prototype.addConstants = function (o) {
    for (var k in o) {
      this.constants[k] = o[k];
    }
  };

  Concierge.prototype.addComponents = function (o) {
    for (var k in o) {
      this.components[k] = o[k];
    }
  };

  Concierge.prototype.get_component = function (key) {
    //return an component
    return this.components[key];
  };

  Concierge.prototype.__updateIdleStatus = function () {
    var now = (new Date()).getTime();
    if (this.historyHelper.latesteventtime && (now - this.historyHelper.latesteventtime > this.historyHelper.T_idle)) {
      this.logHistory('idle', this.historyHelper.latesteventtime);
    }

    this.historyHelper.latesteventtime = now;
  };

  Concierge.prototype.setHistoryHelper = function (fct, T, cb, timeout) {
    //cb and timeout are optional
    var self = this;
    self.historyHelper.T = T;
    if (timeout) {
      self.historyHelper.timeout = timeout;
    }

    var f = function () {
      var now = (new Date()).getTime();
      var delta = now - self.historyHelper.latestentrytime;
      if ((self.historyHelper.latestentrytime && delta < T) ||
        (self.historyHelper.timeout && delta > self.historyHelper.timeout)) {
        //there have been some events or a timeout
        fct(self.historyHelper.log, cb || function () {});

        self.historyHelper.log = {};
      }

    };

    NB$(window).unload(function () {
      var auth_str = Conf.userinfo.guest ? 'guest=1' : 'ckey=' + Conf.userinfo.ckey;
      server_name = Conf.servers.rpc + '/pdf4/rpc?' + auth_str; //'/pdf4/rpc';
      data = self.historyHelper.log;
      formData = {f: "log_history", cid: Pers.connection_id, a: JSON.stringify(data)}
      formData = JSON.stringify(formData)
      formData = new Blob([formData], {type : 'application/json; charset=UTF-8'})
      navigator.sendBeacon(server_name, formData);
      f();
    });

    setInterval(f, T);
  };

  Concierge.prototype.logHistory = function (name, id) {
    var now = (new Date()).getTime();
    
    if (!(name in this.historyHelper.log)) {
      this.historyHelper.log[name] = {};
    }

    this.historyHelper.log[name][id] = now;
    this.historyHelper.latestentrytime = now;
  };

  Concierge.prototype.addProviders =  function (id, o) {
    var i;
    var x = this.providers;
    for (i in o) {
      if (!(o[i] in x)) {
        x[o[i]] = {};
      }

      x[o[i]][id] = true;
    }
  };

  Concierge.prototype.get_state = function (key) {
    return this.state.a[key];
  };

  Concierge.prototype.get_previous_state = function (key) {
    //return an previous state variable.
    return this.state.p[key];
  };

  Concierge.prototype.get_constant = function (key) {
    //return an constant
    return this.constants[key];
  };

  Concierge.prototype.setTransitions = function (id, o) {
    this.transitions[id] = o;
  };

  Concierge.prototype.addFactory = function (prop_type, feature, factory) {
    if (!(prop_type in this.factories)) {
      this.factories[prop_type] = {};
    }

    if (!(feature in this.features)) {
      this.features[feature] = {};
    }

    this.factories[prop_type][feature] = factory;
  };

  Concierge.prototype.trigger = function (evt, view) {
    /*
     * view is optional and used for transitions.
     */

    //        NB$.L("---- event trigger: "+ evt.type +" (val="+evt.value+")");
    this.__updateIdleStatus();
    var O = this.state.o;
    var A = this.state.a;

    //set active state:
    //    if ((evt.value !== A[evt.type]) || (evt.type in this.allowed_repeat_event)){
    A[evt.type] = evt.value;
    if (evt.type in this.listeners) {
      var x = this.listeners[evt.type];
      for (var i in x) {
        if (x[i].cb === null) {//shorthand for views
          //            NB$.L("calling default evthandler for ", i);
          x[i].l._defaultHandler(evt);
        }        else {
          x[i].cb(evt);
        }
      }
    }
    /*
        }
  else {
    NB$.L("[view] not propagating event resulting in same state: "+evt.type+", val="+evt.value);
  }
    */

    //do views need to be created ? If so, create them now.
    if (evt.type in this.factories) {
      for (var feature in  this.factories[evt.type]) {
        if (!(evt.value in this.features[feature])) {
          this.features[feature][evt.value] = null;
          this.factories[evt.type][feature](evt.value);
        }
      }
    }
  };

  NB$.concierge = new Concierge(); //singleton pattern
  var popup = NB$("<div class='ui-view-popup'/>");

  NB$.L = function () {
    if (window.console) {
      var args = Array.prototype.slice.call(arguments);
      args.forEach(function (arg) {
        console.log(arg);
      });
    }
  };

  NB$.I = function (msg, do_html, time_ms) {
    if (time_ms === undefined) {
      time_ms = 5000;
    }

    if (do_html === undefined) {
      do_html = false;
    }

    var display_fct = do_html ? 'html' : 'text';
    NB$('body').append(popup);

    popup[display_fct](msg).stop(true).hide().fadeIn(400).delay(time_ms).fadeOut(400, function () {NB$(this).remove();});

  };

  NB$.E = function (s) {
    if(NB$.isHtmlComment(s)) {
      // Note that there's no need to escape HTML comments partly because unsafe comment would have already
      // been escaped by TinyMCE but mostly because if we escape such comments, they will show up as
      // something different from what was created in the WYSIWYG editor.
      return NB$.removeHtmlMarker(s);
    } else {
      return s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'None';
    }
  };

  NB$.truncateURL = function (str) {
    // Wrap the entire content in a div because if you have html with text at the end (without an enclosing tag),
    // jQuery would ignore it. We don't want that to happen here.
    var $htmlStr = NB$("<div class='temp-nb-wrapper'>" + str + "</div>");
    NB$($htmlStr).find('a').each(function() {
      if(NB$(this).html().length >= 23){
        NB$(this).html(NB$(this).html().slice(0, 20) + "...");
      }
    });
    return NB$($htmlStr, "div.temp-nb-wrapper").first().html();
  }

  /***********************************************************************
  * Start of functions required to identify and process HTML comments
  ************************************************************************
  * The following 3 functions are required to process HTML comments created with TinyMCE WYSIWYG editor.
  * These 3 functions are all related so if you make a change to any of them, you need to change the
  * other 2.
  */

  NB$.addHtmlMarker = function (s) {
    return "<div class='nb-html-comment'>" + s + "</div>";
  }

  NB$.isHtmlComment = function (s) {
    if(!s) {
      return false;
    }
    return s.startsWith("<div class='nb-html-comment'>") && s.endsWith("</div>");
  }

  NB$.removeHtmlMarker = function (s) {
    return s.substring(29, s.length - 6);
  }

  /***********************************************************************
  * End of functions required to identify and process HTML comments
  ************************************************************************
  */

  NB$.ellipsis = function (s, n) {
    var l = s.length;
    return (l > n) ? s.substring(0, n) + '...' : s;
  };

  NB$.pluralize = function (n, plural, singular) {
    if (n === 1) {
      return singular || '';
    }

    return plural || 's';
  };

});
