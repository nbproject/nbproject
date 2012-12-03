/**
 * mvc.js: Generic definitions for models and views
 * It requires the following modules:
 *		Module
 *		NB
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */


try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.mvc", 0.1);
}
catch (e){
    alert("[auth] Init Error: "+e);
}


NB.mvc.model = function(){
    this.observers = []; 
    this.logger = null;
};
NB.mvc.model.prototype.register = function(obs, propList){
    this.observers.push({o:obs, p:propList||{}});
    //by default, relay the logger if the model has one and the view doesn't
    if ((obs.logger === null )  && (this.logger !== null)){
	obs.setLogger(this.logger);
    }
    if (propList){
	//transmit current state to observer, if we know what to transmit
        obs.update("create", {model: this}, propList);
    }
};
NB.mvc.model.prototype.unregister = function(obs){
    var i;
    for (i in this.observers){
	if (this.observers[i] == obs){
	    delete this.observers[i];
	    return;
	}
    }
};

NB.mvc.model.prototype.setLogger = function(logger){
    this.logger = logger;
};

NB.mvc.model.prototype.info = function(msg){
    if (this.logger !== null){
	this.logger.info(msg);
    }
};


NB.mvc.model.prototype.warning = function(msg){
    if (this.logger !== null){
	this.logger.warning(msg);
    }
};


NB.mvc.model.prototype.error = function(msg){
    if (this.logger !== null){
	this.logger.error(msg);
    }
};

//NB.mvc.model.prototype.modify = function(){alert("[NB.mvc.model.prototype.modify] I'm virtual");};


NB.mvc.view = function(){
    this.id = (new Date()).getTime(); //this will generate a default id for the view
    this.logger = null;
};


NB.mvc.view.prototype.setLogger = function(logger){
    this.logger = logger;
};

NB.mvc.view.prototype.info = function(msg){
    if (this.logger !== null){
	this.logger.info(msg);
    }
};


NB.mvc.view.prototype.warning = function(msg){
    if (this.logger !== null){
	this.logger.warning(msg);
    }
};


NB.mvc.view.prototype.error = function(msg){
    if (this.logger !== null){
	this.logger.error(msg);
    }
};


//NB.mvc.view.prototype.update = function(){alert("[NB.mvc.view.prototype.update] I'm virtual");};



/** 
 * COLLECTION: Collection of objects that have an unique "id" field
 * note: the current implemetation can return undefinied items if they have been deleted
 */
NB.mvc.collection = function(type){
    this.superclass();
    this.items = {};//indexed by item.id
    this.type = type; //sometimes useful to specify a collection of what...
}; 
NB.mvc.collection.prototype = new NB.mvc.model();
NB.mvc.collection.prototype.constructor = NB.mvc.collection;
NB.mvc.collection.prototype.superclass = NB.mvc.model;
NB.mvc.collection.prototype.modify = function(action, payload, items_fieldname){
    var i;
    var items = payload[items_fieldname];
    if (action == "create"){	
	for (i=0;i<items.length;i++){
	    this.items[items[i].id] = items[i];
	}
    }
    else if (action == "add" || action == "update"){
	for (i=0;i<items.length;i++){
	    this.items[items[i].id] = items[i];
	}
    }
    else if (action == "delete"){
	for (i=0;i<items.length;i++){
	    delete this.items[items[i].id];
	}
    }
    else{
	alert("[NB.mvc.collection.modify] unknown action: " + action);
	return;
    }
    for (i in this.observers){
	this.observers[i].o.update(action, {"model": this, "diff": payload}, items_fieldname);
    }
};

NB.mvc.collection.prototype.getItems = function(){
    return this.items;
};

NB.mvc.collection.prototype.get = function(id){
    return this.items[id];
};



