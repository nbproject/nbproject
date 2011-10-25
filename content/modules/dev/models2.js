/**
 * models.js: Useful models for documents, annotations etc...
 * This module defines the namespace NB.models
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/


try{    
    Module.require("NB", 0.1);
    Module.require("NB.mvc", 0.1);
    Module.createNamespace("NB.models", 0.1);
}
catch (e){
    alert("[auth] Init Error: "+e);
}




/*
 * Collections of Tables relevant to document management
 */
NB.models.Store = function(){
    this.superclass();
    this.o = {}; //objects
    this.indexes = {}; //existing indexes
    this.schema =null;
}; 
NB.models.Store.prototype = new NB.mvc.model();
NB.models.Store.prototype.constructor = NB.models.Store;
NB.models.Store.prototype.superclass = NB.mvc.model;
NB.models.Store.prototype.create = function(payload, schema){
    /*
     * schema: null (default behavior) or dictionary {String type_name: Object tabledef}
     * where: 
     *  - type_name is the name of the table to be created in Store
     *  - tabledef is either null (default behavior) or a dictionary that can contain the following (all optional): 
     *		- pFieldName	name of the correponding field in payload
     *		- obj_type	contructor function to apply 
     *				if not specified, the created object will just be a javascript Object, lazily copied from payload
     *		- references	dictionary: {String fieldname: String target_tablename}
     * the code can add the __ref field to schema, in order to keep track of indexes that aren't references to other tables. 
     */
    var self=this;
    var tabledef, pFieldName, obs;
    if (schema==undefined){
	schema = {};
	//make up a default schema: just use all the fields from payload
	for (var k in payload){
	    schema[k] = null;
	}
    }
    this.schema = schema;
    for (var type_name in schema){
	if  (type_name.substring(0,2)=="__"){
	    throw new Error("table names can't start w/ '__' , tablename="+type_name); 
	}
	tabledef = schema[type_name];	
	if (tabledef===null){
	    tabledef = {pFieldName: type_name};
	}
	pFieldName = tabledef.pFieldName;
	if (pFieldName in payload){
	    /*
	     * this can cover scenarios like: 
	     * this.ensembles = payload.channels
	     * OR
	     * this.Ensembles = {123: new Ensemble(payload.channels[123], ...}
	     */
	    if ("obj_type" in tabledef){//need to apply constructor
		for (id in payload[pFieldName]){
		    this.o[type_name][id] = new tabledef.obj_type(payload[pFieldName][id]);
		}
	    }
	    else{//just lazy copy
		this.o[type_name] =  payload[pFieldName];
	    }
	    
	}
	else{ //just create an empty table
	    if (!(type_name in this.o)){
		this.o[type_name]={};
	    }
	}
	for (var i in this.observers){
	    obs = self.observers[i];
	    if (type_name in obs.p){
		obs.o.update("create", {model: self, diff: this.o[type_name]}, type_name);
	    }
	}
    }
};

NB.models.Store.prototype.add = function(type_name, objs){
    //PRE: Schema already defined. 
    var self=this;
    var is_update;
    if (type_name in self.schema){
	//list of existing indexes: 
	var current_indexes = {};
	var tabledef = self.schema[type_name];
	var ref, index, v_new, v_old ;
	if ("references" in tabledef){
	    for (var i in tabledef.references){
		ref =  tabledef.references[i];
		if (ref in self.indexes && type_name in self.indexes[ref]){
		    current_indexes[i] =  self.indexes[ref][type_name];
		}
	    }
	}
	if ("__ref" in tabledef){
	    for (var i in tabledef.__ref){
		ref =  tabledef.__ref[i];
		if (ref in self.indexes && type_name in self.indexes[ref]){
		    current_indexes[i] =  self.indexes[ref][type_name];
		}
	    } 
	}
	for (var pk in objs){
	    is_update = pk in this.o[type_name];    
	    //now, update existing indexes if any
	    if (is_update){
		for (var fieldname in  current_indexes){
		    index = current_indexes[fieldname];
		    v_new = objs[pk][fieldname];
		    v_old = this.o[type_name][pk][fieldname];
		    //if the foreign key has changed, propagate the change: 
		    if (v_new != v_old){
			delete(index[v_old][pk]);
			if  (!(v_new in index)){
			    index[v_new] = {};
			}
			index[v_new][pk]=null;
		    }
		}
	    }
	    else{
		for (var fieldname in  current_indexes){
		    var fk = objs[pk][fieldname];
		    if (!(fk in current_indexes[fieldname])){
			current_indexes[fieldname][fk]={};
		    }
		    current_indexes[fieldname][fk][pk] = null;
		}
	    }
	    this.o[type_name][pk]=objs[pk];
	}
	var obs;
	for (var i in this.observers){
	    obs = self.observers[i];
	    if (type_name in obs.p){
		obs.o.update("add", {diff: objs}, type_name);
	    }
	}
    }
    else{
	console.error(type_name, " not found in schema: ", self.schema);
    }
};

NB.models.Store.prototype.remove = function(type_name, pkeys){
    /* 
       pkeys can either be 
       - in integer (i.e. the primary key of a single object to remove)
       - dictionary of integer keys (values are disregarded): in this case, we only issue 1 notification to the observers (for performance), once all the objects have been removed. 
     */
    var self = this;
    var ids = {};
    if (typeof(pkeys) == "object"){
	ids = pkeys;
    }
    else{
	ids[pkeys] = null;
    }
    var id = null;
    var objs_deleted = {};
    for (id in ids){
	if ((type_name in this.o) && (id in this.o[type_name])){
	    objs_deleted[id]=this.o[type_name][id];
	    var current_indexes = {};
	    var tabledef = self.schema[type_name];
	    var ref;
	    if ("references" in tabledef){
		for (var i in tabledef.references){
		    ref =  tabledef.references[i];
		    if (ref in self.indexes && type_name in self.indexes[ref]){
			current_indexes[i] =  self.indexes[ref][type_name];
		    }
		}
	    }
	    if ("__ref" in tabledef){
		for (var i in tabledef.__ref){
		    ref =  tabledef.__ref[i];
		    if (ref in self.indexes && type_name in self.indexes[ref]){
			current_indexes[i] =  self.indexes[ref][type_name];
		    }
		} 
	    }
	    
	    for (var fieldname in  current_indexes){
		delete(current_indexes[fieldname][this.o[type_name][id][fieldname]][id]);
	    }
	    delete(this.o[type_name][id]);
	}
	var did_delete = false;
	for (var i in objs_deleted){
	    did_delete = true;
	    break;
	}
	if (did_delete){
	    var obs;
	    for (var i in this.observers){
		obs = self.observers[i];
		if (type_name in obs.p){
		    obs.o.update("remove", {diff: objs_deleted}, type_name);
		}
	    }
	}
    }
};

NB.models.Store.prototype.addIndex = function(table, o, fieldname){
    var self = this;
    // '__..." is a reserved family of tablenames so we can add indexes on fields that aren't references. 
    
    if (table.substring(0,2)!="__" && ((!(table in self.o))||(!(o in self.o)))){
	throw new Error("missing table, args="+table+", "+o ); 
	return;
    }
    
    if (table.substring(0,2)=="__"){
	if (!("__ref" in self.schema[o])){
	    self.schema[o].__ref = {};
	}	
	self.schema[o].__ref[fieldname] = table;
    }

    if (!(table in self.indexes)){
	self.indexes[table]={};
    }
    if (!(o in self.indexes[table])){
	self.indexes[table][o]={};
    }
    var objects =  self.o[o];
    for (var i in objects){
	var key = objects[i][fieldname];
	if (!(key in self.indexes[table][o])){
	    self.indexes[table][o][key] = {};
	}
	self.indexes[table][o][key][i]=null;
    }
};


NB.models.Dict = function(){

}



NB.models.Dict.prototype.is_empty = function(){
    for (var i in this){
	if (this.hasOwnProperty(i)){
	    return false;
	}
    }
    return true;
};

NB.models.Dict.prototype.length = function(){
    var l=0; 
    for (var i in this){
	if (this.hasOwnProperty(i)){
	    l++;
	}
    }
    return l;
};

NB.models.Dict.prototype.sort = function(sortfct){
    //returns an array of sorted objects. 
    var output = [];
     for (var i in this){
	if (this.hasOwnProperty(i)){
	    output.push(this[i]);
	}
    }
    output.sort(sortfct);
    return output;
};

NB.models.Dict.prototype.min = function(attr){
    // returns pk of record which has the min value for attr
    var x = Number.POSITIVE_INFINITY;
    var output = null;
    for (var i in this){
	if (this.hasOwnProperty(i) && this[i][attr]<x){
	    x = this[i][attr];
	    output = i;
	}
    }
    return output;
};


NB.models.Dict.prototype.max = function(attr){
    // returns pk of record which has the max value for attr
    var x = Number.NEGATIVE_INFINITY;
    var output = null;
    for (var i in this){
	if (this.hasOwnProperty(i) && this[i][attr]>x){
	    x = this[i][attr];
	    output = i;
	}
    }
    return output;
};


NB.models.Dict.prototype.first = function(){
    /*caution: this doesn't imply any order: it just picks the 1st record it finds*/
    var output = null;
    for (var i in this){
	if (this.hasOwnProperty(i)){
	    return this[i];
	}
    }
    return null;
};


NB.models.Dict.prototype.as_object = function(){
    var output = {};
    for (var i in this){
	if (this.hasOwnProperty(i)){
	    output[i] = this[i];
	}
    }
    return output;
};


NB.models.__intersect = function(o1, o2){
    if (o1==null) 
	return o2 || {};
    if (o2==null)
	return o1 || {};
    var o = {};
    for (var i in o1){
	if (i in o2)
	    o[i] = null;
    }
    return o
};

NB.models.Store.prototype.get = function(from, where){
    var self = this;
    var o_old = null;
    var o = {};
    var output = new NB.models.Dict();
    var f = this;
    var ref; 
    var references = self.schema[from].references || {};
    var i=null;
    for (i in where){
	ref = i in references ?  references[i] : "__"+i;
	if ( (!(ref in self.indexes)) || (!(from in self.indexes[ref])) ){
	    self.addIndex(ref, from, i);
	}
	o = self.indexes[ref][from][where[i]] || {};
	o = NB.models.__intersect(o_old, o);
	o_old = o;
    }
    if (i==null){ //there was no where clause: return all objects
	o = self.o[from];
    }

    //we now have a list of IDs in o. Just need to attach the objects: 
    
    for (i in o){
	output[i] = self.o[from][i];
    }
    return output;
};
