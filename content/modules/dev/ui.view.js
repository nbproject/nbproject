/* View Plugin
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
	this.providers = {};
	this.listeners={};
	this.transitions={};
	this.state = {a:{}, o:{}, hr:{}};//a: active state, o: stored states, hr: hierarchy refresh 
	this.factories={};
	this.features={};
	this.views={};
	this.hierarchy=null;
	this.rev_hierarchy = {};
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

    };    
    Concierge.prototype.allowRepeatedEvents = function(list){
	for (let i in list){
	    this.allowed_repeat_event[list[i]]=true;
	}
    };
    Concierge.prototype.addListeners = function(view, o){
	/*
	  pre: view is a object that has a _defaultHandler method, or that passed a specific listener function. In any case it DOESN'T need to be a class derived from ui.view
	*/
	var id = view.element[0].id;
	var x = this.listeners;
	for (let i in o){
	    if (!(i in x)){
		x[i]={};
	    }
	    x[i][id]={l:view, cb:o[i]};
	}
    };
    Concierge.prototype.setHierarchy = function(h){
	this.hierarchy = h;
	for (let k in h){
	    this.rev_hierarchy[k]=null;
	    for (let prop in h[k]){
		this.rev_hierarchy[prop] = k;
	    }
	}
    };
    Concierge.prototype.setConstants = function(o){
	this.constants = o;
    };
    Concierge.prototype.addConstants = function(o){
	for (let k in o){
	    this.constants[k]=o[k];
	}
    };
    Concierge.prototype.addComponents = function(o){
	for (let k in o){
	    this.components[k]=o[k];
	}
    };
    Concierge.prototype.get_component = function(key){
	//return an component
	return this.components[key];
    };

    Concierge.prototype.__updateIdleStatus = function(){
	let now = (new Date()).getTime();
	if (this.remoteLogger.latesteventtime &&(now-this.remoteLogger.latesteventtime>this.remoteLogger.T_idle)){
	    this.logRemote("idle", this.remoteLogger.latesteventtime);
	}
	this.remoteLogger.latesteventtime = now;
    };

    Concierge.prototype.setRemoteLogger = function(fct, T){
	var self=this;
	self.remoteLogger.T = T;
	let f = function(){
	    let now = (new Date()).getTime();
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
	let now = (new Date()).getTime();
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
	//return an active state variable
	let s = this.state.a[key];
	if (s===undefined && key in this.rev_hierarchy && (!(this.rev_hierarchy[key] === null)) ){
	    // return default value if not initialized
	    s=this.hierarchy[this.rev_hierarchy[key]][key]; 
	}
	return s;
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
	//	$.D("---- event trigger: "+ evt.type +" (val="+evt.value+")");
	this.__updateIdleStatus();
	let RH = this.rev_hierarchy;
	let H = this.hierarchy;
	let O = this.state.o;
	let A = this.state.a;
	let HR = this.state.hr;

	//	let P = this.state.p;
	if ((H != null) &&  (evt.type in RH)){
	    if (RH[evt.type] == null){//container
		if (!(evt.type in O)){
		    O[evt.type] = {};
		}
		if (!(evt.value in  O[evt.type])){
		    O[evt.type][evt.value]={}; //container for props
		    //initialization: 
		    for (let prop in H[evt.type]){
			O[evt.type][evt.value][prop] = H[evt.type][prop];
			//		    A[evt.type] = evt.value; // there'll be a trigger after but this may be needed for constructors
		    }
		}
	    
	    }
	    else{
		//memorize that property into its container
		let p_type = RH[evt.type];
		let p_id   = A[p_type];
		O[p_type][p_id][evt.type]=evt.value;
	    }
	}

	if ((H != null) &&  (evt.type in H)){
	    //Hierarchy refresh is used to force a event to propagate vent if it has the same value as the current state
	    //This is because there's a been a refresh in the hierarchy, so it's 
	    //Example: important to propagate the event "page=1" event if the current state of page is 1, because there's recently been 
	    //		a change of file. 
	    for (let prop in H[evt.type]){
		HR[prop]=true; 
	    }
	}

	//set active state: 
	if ((evt.value != A[evt.type]) || HR[evt.type] || (evt.type in this.allowed_repeat_event)){
	    HR[evt.type] = false;
	    A[evt.type] = evt.value;
	    if (evt.type in this.listeners){
		let x = this.listeners[evt.type];
		for (let i in x){
		    if (x[i].cb===null){//shorthand for views
			//		    $.D("calling default evthandler for ", i);
			x[i].l._defaultHandler(evt);
		    }
		    else{
			x[i].cb(evt);
		    }
		}
	    }
	}
	else {
	    $.D("[view] not propagating event that will result in same state: "+evt.type+", val="+evt.value);
	}
	
	//	$.D("[concierge.trigger] view=",view, ", evt=", evt);
	//do views need to be created ? If so, create them now. 
	if (evt.type in this.factories){
	    for (let feature in  this.factories[evt.type]){
		if (!(evt.value in this.features[feature])){
		    this.features[feature][evt.value]=null;
		    this.factories[evt.type][feature](evt.value);
		}
	    }
	}
	if (view){
	    let id = view.element.attr("id");
	    if ((id in this.transitions) && (evt.type in this.transitions[id])){
		let dest = this.transitions[id][evt.type];
		if (dest in this.providers){
		    view.element.parent().siblings("div.ui-widget-content").each(function(){
			    if (this.id.substring(0,this.id.indexOf("-outer")) in $.concierge.providers[dest]){
				$(this.parentNode).viewport("smoothSelect", this.id)
				    $.D('REAL transition to:' ,this.id);
				return false;
			    }
			    return true;
			});
		}
	    }
	}
	//restore active leaf properties, if any
	if ((H != null) &&  (evt.type in RH) && (RH[evt.type] == null)){
	    for (let i in O[evt.type][evt.value]){
		let new_event = {type: i, value:O[evt.type][evt.value][i]}; 
		$.concierge.trigger(new_event);
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

		    //register for perspective events: 
		    self.element.closest("div.perspective").bind("resize_perspective", function(evt,directions){
			    self.repaint();
			});
		}
		else{
		    $.D("HEADLESS !!!!!", this.element[0].id);
		}
		$.D("setting view ", this.element[0].id, " to " , this);
		$.concierge.views[this.element[0].id]=this;
	    }
	}, 
	_bring_to_front: function(){
	    //PRE: not a headless view
	    let outerview =  this.element.parent();    
	    if (outerview.is(":hidden")){
		outerview.parent().viewport("select", outerview[0].id);
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
	    let self = this;
	    let outerview = self.element.parent("div.outerview");
	    let vp = outerview.parent("div.viewport");
	    if(outerview.length && vp.length){
		//make sure we get offset of a visible component: 
		let y0 = vp.children(".outerview:visible").offset().top - vp.offset().top;
		outerview.height(vp.height()-y0);
		self._update();
	    }
	},
	_update: function(){
	    $.D("[View]: default update... override me for ", this.element);
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
	    let self = this;
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
    let playing = false;
    let popup = $("<div class='ui-view-popup'/>");
    $.D = function(){
	if (window.console){
	    console.debug(arguments);
	}
    };
    $.I = function(msg){
	if (playing){
	    popup.stop(true, false);
	}
	else{
	    this.playing = true;
	}
	$("body").append(popup);
	
	popup.text(msg).fadeTo("normal", 0.7, function(){$(this).fadeTo(5000, 0.7, function(){$(this).fadeTo("normal", 0, function(){playing = false;});});});
    };
})(jQuery);
