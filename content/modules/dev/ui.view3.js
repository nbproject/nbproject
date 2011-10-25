/* View Plugin v.3
 * Depends:
 *	ui.core.js
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
(function($) {
    var Concierge = function(){
	var self = this;
	this.providers = {};
	this.listeners={};
	this.transitions={};
	this.state = {a:{}, o:{}};//a: active state, o: stored states
	this.factories={};
	this.features={};
	this.views={};
	this.constants = {};
	this.components = {};
	this.allowed_repeat_event={};
	this.remoteLogger = {
	    ptr: null,
	    log: {}, 
	    fct: null, 
	    T: null, 
	    latestentrytime:false, 
	    T_idle: 120000,
	    latesteventtime: false 
	};
	this.activeView = null;
	/*
	this.keydown = function(event){
	    if (self.activeView != null){
		return self.activeView._keydown(event);
	    }
	};
	*/
	$(document).keypress(function(event){
		if (document.activeElement != document.body){
		    return true; //a focusable element has the focus: let's not interfere
		}
		if ("activeView" in self && self.activeView != null){
		    return self.activeView._keydown(event);
		}
		else{
		    return false; // do NOT propagate. 
		}
	    });
    };    
    Concierge.prototype.allowRepeatedEvents = function(list){
	for (var i in list){
	    this.allowed_repeat_event[list[i]]=true;
	}
    };
    Concierge.prototype.addListeners = function(view, o){
	/*
	 * pre: view is a object that has a:  
	 *  - _defaultHandler method, or that passed a specific listener function. 
	 *  - an id that can be retrieved by  element[0].id
	 * In any case it DOESN'T need to be a class derived from ui.view
	*/
	var id = view.element[0].id;
	var x = this.listeners;
	for (var i in o){
	    if (!(i in x)){
		x[i]={};
	    }
	    x[i][id]={l:view, cb:o[i]};
	}
    };
    Concierge.prototype.setConstants = function(o){
	this.constants = o;
    };
    Concierge.prototype.addConstants = function(o){
	for (var k in o){
	    this.constants[k]=o[k];
	}
    };
    Concierge.prototype.addComponents = function(o){
	for (var k in o){
	    this.components[k]=o[k];
	}
    };
    Concierge.prototype.get_component = function(key){
	//return an component
	return this.components[key];
    };

    Concierge.prototype.__updateIdleStatus = function(){
	var now = (new Date()).getTime();
	if (this.remoteLogger.latesteventtime &&(now-this.remoteLogger.latesteventtime>this.remoteLogger.T_idle)){
	    this.logRemote("idle", this.remoteLogger.latesteventtime);
	}
	this.remoteLogger.latesteventtime = now;
    };
    Concierge.prototype.setRemoteLogger = function(fct, T){
	var self=this;
	self.remoteLogger.T = T;
	var f = function(){
	    var now = (new Date()).getTime();
	    if (self.remoteLogger.latestentrytime && now-self.remoteLogger.latestentrytime<T){
		//there have been some events
		fct(self.remoteLogger.log, function(){});
		self.remoteLogger.log={};
	    }
	};
	$(window).unload(function(){
		self.__updateIdleStatus();
		f();
	    });
	setInterval(f, T);
    };
    Concierge.prototype.logRemote = function(name, id){
	var now = (new Date()).getTime();
	if (!(name in this.remoteLogger.log)){
	    this.remoteLogger.log[name]={};
	}
	this.remoteLogger.log[name][id]=now;
	this.remoteLogger.latestentrytime = now;
    }
    Concierge.prototype.addProviders =  function(id, o){
	var i;
	var x = this.providers;
	for (i in o){
	    if (!(o[i] in x)){
		x[o[i]]={};
	    }
	    x[o[i]][id]=true;
	}
    };
    Concierge.prototype.get_state = function(key){
	return this.state.a[key];
    };
    Concierge.prototype.get_previous_state = function(key){
	//return an previous state variable. 
	return this.state.p[key];
    };
    Concierge.prototype.get_constant = function(key){
	//return an constant
	return this.constants[key];
    };
    Concierge.prototype.setTransitions = function(id, o){
	this.transitions[id] = o;
    };
    Concierge.prototype.addFactory=function(prop_type, feature, factory){
	if (!(prop_type in this.factories)){
	    this.factories[prop_type]={};
	}
	if (!(feature in this.features)){
	    this.features[feature]={};
	}
	this.factories[prop_type][feature]=factory;
    };
    Concierge.prototype.trigger = function(evt, view){
	/*
	 * view is optional and used for transitions. 
	 */
		$.D("---- event trigger: "+ evt.type +" (val="+evt.value+")");
	this.__updateIdleStatus();
	var O = this.state.o;
	var A = this.state.a;
	//set active state: 
		//	if ((evt.value != A[evt.type]) || (evt.type in this.allowed_repeat_event)){
	    A[evt.type] = evt.value;
	    if (evt.type in this.listeners){
		var x = this.listeners[evt.type];
		for (var i in x){
		    if (x[i].cb===null){//shorthand for views
			//		    $.D("calling default evthandler for ", i);
			x[i].l._defaultHandler(evt);
		    }
		    else{
			x[i].cb(evt);
		    }
		}
	    }
		/*
			}
	else {
	    $.D("[view] not propagating event resulting in same state: "+evt.type+", val="+evt.value);
	}
		*/
	//do views need to be created ? If so, create them now. 
	if (evt.type in this.factories){
	    for (var feature in  this.factories[evt.type]){
		if (!(evt.value in this.features[feature])){
		    this.features[feature][evt.value]=null;
		    this.factories[evt.type][feature](evt.value);
		}
	    }
	}
    };

    /*
     * The view object
     * options.headless set to false if the view is not meant to be displayed
     */
    var V_OBJ = {
	HEIGHT_MARGIN: 5,
	SERVICE: null,
	_init: function() {
	    var self = this;
	    var init = true;
	    // initialization from scratch
	    if (init) {			
		if (self.options.provides){
		    $.concierge.addProviders(self.element[0].id, self.options.provides);
		}
		if (self.options.listens){
		    $.concierge.addListeners(self, self.options.listens);
		}
		if (self.options.transitions){
		    $.concierge.setTransitions(self.element[0].id, self.options.transitions);
		}
		if (!(self.options.headless)){
		    self.element.addClass("view");

		    //implement a concept of "active view"
		    self.element.mouseenter(function(evt){		
			    $.concierge.activeView = self;
			});

		    //register for perspective events: 
		    self.element.closest("div.perspective").bind("resize_perspective", function(evt,directions){
			    self.repaint();
			});
		    
		}
		// $.D("setting view ", this.element[0].id, " to " , this);
		$.concierge.views[this.element[0].id]=this;
	    }
	}, 
	defaultHandler: function(evt){
	    $.D("[View]: default handler... override me !, evt=", evt);
	},
	beforeMove: function(evt){
	    $.D("[View]: default beforemove... override me !, evt=", evt);
	},
	afterMove: function(evt){
	    $.D("[View]: default aftermmove... override me !, evt=", evt);
	},
	set_model: function(model){
	    this._setData('model', model);
	    //for now, we don't register to receive any particular updates.
	    model.register($.ui.view.prototype.get_adapter.call(this),  {});
	},
	repaint: function(){
	    //PRE: not a headless view
	    var self = this;
	    /*
	    var outerview = self.element.parent("div.outerview");	    
	    var vp = outerview.parent("div.viewport");
	    if(outerview.length && vp.length){
		//make sure we get offset of a visible component: 
		var y0 = vp.children(".outerview:visible").offset().top - vp.offset().top;
		outerview.height(vp.height()-y0);
	    }
	    */
	    self._update();
	},
	_update: function(){
	    this.element.height(this.element.parent().height());
	    this.element.width(this.element.parent().width());
	    this._expand();
	},
	_keydown: function(event){
	    $.D("[view._keydown] override me for ", this.element);
 	}, 
	get_adapter: function(){
	    /* enables a view to be called by the methods of an mvc.model */
	    var self = this;
	    var adapter = {
		update: function(action, payload, items_fieldname){
		    self.update(action, payload, items_fieldname);
		}
	    };
	    return adapter;
	},
	close: function(){
	    var self = this;
	    $.D("[View]: default closer ...override me !");
	    delete $.concierge.views[self.element[0].id];
	},
	provides: function(){
	    var self = this;
	    return self.options.provides || {};
	},
	select: function(){
	    $.D("[view]: selected ", this.element[0].id);
	}, 
	sayHello: function(){
	    $.D("Hello, I'm view ", this.element.id);
	}, 
	update: function(action, payload, items_fieldname){
	    $.D("[view] updating view:, ", action, payload);
	}, 
	keyboard_grabber: function(){
	    return $("input.focusgrabber", this.element);
	},
	_expand: function(){
	    	var $expand	= $(this.options.expand);
		if ($expand.length){
		    var s0		= $expand.offset().top+parseInt($expand.css("margin-top")) - this.element.offset().top;
		    $expand.height(this.element.height() - s0);
		}
	}
    };
    
    $.widget("ui.view",V_OBJ );
    $.extend($.ui.view, {
	    version: '1.7.2',
		defaults: {},
		getter: "get_adapter provides sayHello close",
		service: null, 
		provides: null,
		listens: null, 
		transitions: null,
		});
    $.concierge = new Concierge(); //singleton pattern
    var popup = $("<div class='ui-view-popup'/>");
    $.D = function(){
	if (window.console){
	    console.debug(arguments);
	}
    };
    $.I = function(msg){
	$("body").append(popup);
	popup.text(msg).stop(true).fadeTo("normal", 0.7, function(){$(this).fadeTo(5000, 0.7, function(){$(this).fadeTo("normal", 0);});});
    };
    $.E = function(s){
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
    $.ellipsis = function(s, n){
	var l = s.length;
	return (l>s) ? s.substring(0,n) + "...": s;
    }
})(jQuery);
