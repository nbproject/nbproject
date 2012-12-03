/**
 * models.js: Useful models for documents, annotations etc...
 * This module defines the namespace NB.models
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
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
NB.models.Store = function(doExhibit, exhibit_types){
    this.superclass();
    this.o = {}; //objects
    this.indexes = {}; //existing indexes
    this.future_indexes={t:{}, o:{}}; //indexes to build when data arrives
    this.db = doExhibit ? new Exhibit.Database.create(): false;
    this.db_props =null;
    if (doExhibit && (exhibit_types !== undefined)){
	this.db.loadTypes(exhibit_types, "localhost");
    }
}; 
NB.models.Store.prototype = new NB.mvc.model();
NB.models.Store.prototype.constructor = NB.models.Store;
NB.models.Store.prototype.superclass = NB.mvc.model;
NB.models.Store.prototype.create = function(payload, propsList){
    /*
     * propsList: name->props = {fieldName, [obj_type]} or 
     * where: 
     *  - name is the name of the property to be created in Store
     *  - props can be:
     *		- null: then we apply default behavior
     *		- {fieldName, [obj_type]}: 
     *			- fieldName is the name of the correponding field in payload
     *			- obj_type is an object type, so that the correponding constructor can be called
     */
    var self=this;
    var props, fieldName;
    this.db_props = propsList;
    for (let name in propsList){
	props = propsList[name];	
	if (props===null){
	    props = {fieldName: name};
	}
	fieldName = props.fieldName;
	if (fieldName in payload){
	    /*
	     * this can cover scenarios like: 
	     * this.ensembles = payload.channels
	     * OR
	     * this.Ensembles = {123: new Ensemble(payload.channels[123], ...}
	     */
	    if ("obj_type" in props){//need to apply constructor
		for (id in payload[fieldName]){
		    this.o[propName][id] = new props.obj_type(payload[fieldName][id]);
		}
	    }
	    else{//just lazy copy
		this.o[name] =  payload[fieldName];
		this.__db_add(name,payload[fieldName]);
	    }
	    self.indexes[name]={};
	    //see if it's time to build an index: 
	    if (name in self.future_indexes.t){
		//SACHA TODO
		console.log("TODO: Add index");
	    }
	    else if (name in self.future_indexes.o){
		//SACHA TODO
		console.log("TODO: Add index");
	    }
	}

	if(this.db && "exhibit_properties" in props){
	    let P = {};
	    for (let k in props.exhibit_properties){
		P[props.exhibit_properties[k].field]=props.exhibit_properties[k].props;
	    }
	    this.db.loadProperties(P, "localhost");
	}
    }
    for (let i in this.observers){
	this.observers[i].o.update("create", {"model": this, "diff": payload}, propsList);
    }
};

NB.models.Store.prototype.add = function(type_name, o, noexhibit){
    var self=this;
    if (type_name in self.db_props){
	if (!(type_name in this.o)){
	    this.o[type_name]={};
	}
	for (let i in o){
	    this.o[type_name][i]=o[i];
	}
	//SACHA: TODO update indexes if any
	if (noexhibit == undefined){
	    self.__db_add(type_name, o);
	}
    }
    else{
	console.error(type_name, " not found in db_props: ", self.db_props);
    }

};


NB.models.Store.prototype.add_batch = function(payload){
    var self=this;
    for (let type_name in payload){
	o = payload[type_name];
	if (type_name in self.db_props){
	    if (!(type_name in this.o)){
		this.o[type_name]={};
	    }
	    for (let i in o){
		this.o[type_name][i]=o[i];
	    }
	    //SACHA: TODO update indexes if any
	}
	else{
	    console.error(type_name, " not found in db_props: ", self.db_props);
	}
    }
    self.__db_add_batch(payload);
};




NB.models.Store.prototype.remove = function(name, id){
    if ((name in this.o) && (id in this.o[name])){
	delete(this.o[name][id]);
	if (this.db){
	    this.db.removeItem(name+"_"+id);
	}
    }
};

/*
NB.models.Store.prototype.__db_add = function(type_name, o){
    let editList={};
    let props = {};
    if(this.db_props && type_name in this.db_props && "exhibit_properties" in this.db_props[type_name]){
	props = this.db_props[type_name].exhibit_properties;
    }
    if (this.db){
	let a=[];
	let type_str = type_name+"_";
	let id, obj;
	for (let key in o){
	    obj = o[key];
	    id = type_str+obj.ID;
	    if (id in this.db._spo){
		editList[id] = obj;
	    }
	    else{
		obj.id=id;
		obj.type = type_name;
		if (!("label" in obj)){
		    obj.label = obj.id;
		}
		for (let p in props){
		    if ((p in obj) && ("type" in props[p])){
			obj[props[p].field] = props[p].type+"_"+ obj[p];
		    }
		}
		a.push(obj);
	    }
	}
	if (a.length){			// add new itens if any
	    this.db.loadItems(a, "localhost");
	}
	for (let i in editList){	// edit items if any
	    obj = editList[i];
	    for (let j in obj){
		if (j!="ID"){
		    this.db.editItem(i, j, obj[j]);
		}
	    }
	}
    }
};
*/

NB.models.Store.prototype.__db_add = function(type_name, o){
    let editList={};
    let props = {};
    if(this.db_props && type_name in this.db_props && "exhibit_properties" in this.db_props[type_name]){
	props = this.db_props[type_name].exhibit_properties;
    }
    if (this.db){
	let a=[];
	let type_str = type_name+"_";
	let id, obj;
	for (let key in o){
	    obj = o[key];
	    id = type_str+obj.ID;
	    if (id in this.db._spo){
		editList[id] = obj;
	    }
	    else{
		obj.id=id;
		obj.type = type_name;
		if (!("label" in obj)){
		    obj.label = obj.id;
		}
		for (let p in props){
		    if ((p in obj) && ("type" in props[p])){
			obj[props[p].field] = props[p].type+"_"+ obj[p];
		    }
		}
		a.push(obj);
	    }
	}
	if (a.length){			// add new itens if any
	    this.db.loadItems(a, "localhost");
	}
	for (let i in editList){	// edit items if any
	    obj = editList[i];	    
	    //	    id =  editList[i][1];
	    for (let j in obj){
		if ((j!="ID") && (obj[j]!=null) && ((!(j in this.db._spo[i])) || (obj[j] != this.db._spo[i][j][0]))){
		    this.db.editItem(i, j, obj[j]);
		}
	    }
	}
    }
};


/*
NB.models.Store.prototype.__db_add = function(type_name, o){
    let a=[];
    let props = {};
    if(this.db_props && type_name in this.db_props && "exhibit_properties" in this.db_props[type_name]){
	props = this.db_props[type_name].exhibit_properties;
    }
    if (this.db){
	let type_str = type_name+"_";
	let id, obj;
	for (let key in o){
	    obj = o[key];
	    id = type_str+obj.ID;
	    obj.id=id;
	    obj.type = type_name;
	    if (!("label" in obj)){
		obj.label = obj.id;
	    }
	    for (let p in props){
		if ((p in obj) && ("type" in props[p])){
		    obj[props[p].field] = props[p].type+"_"+ obj[p];
		}
	    }
	    a.push(obj);
	}
	this.db.loadItems(a, "localhost");
    }
};
*/

NB.models.Store.prototype.__db_add_batch = function(payload){
    let editList={};
    let a=[];
    for (let type_name in payload){
	o = payload[type_name];
	let props = {};
	if(this.db_props && type_name in this.db_props && "exhibit_properties" in this.db_props[type_name]){
	    props = this.db_props[type_name].exhibit_properties;
	}
	if (this.db){
	    let type_str = type_name+"_";
	    let id, obj;
	    for (let key in o){
		obj = o[key];
		id = type_str+obj.ID;
		if (id in this.db._spo){
		    editList[id] = obj;
		}
		else{
		    obj.id=id;
		    obj.type = type_name;
		    if (!("label" in obj)){
			obj.label = obj.id;
		    }
		    for (let p in props){
			if ((p in obj) && ("type" in props[p])){
			    obj[props[p].field] = props[p].type+"_"+ obj[p];
			}
		    }
		    a.push(obj);
		}
	    }
	}
    }
    if (this.db){

	if  (a.length){
	    this.db.loadItems(a, "localhost");
	}

	for (let i in editList){	// edit items if any
	    let obj = editList[i];	    
	    for (let j in obj){
		if ((j!="ID") &&  ((!(j in this.db._spo[i])) || (obj[j] != this.db._spo[i][j][0])) ){
		    this.db.editItem(i, j, obj[j]);
		}
	    }
	}
    }
};

NB.models.Store.prototype.__addFutureIndex = function(tablename, objname, fieldname){

    if (!(tablename in self.future_indexes.t)){
	self.future_indexes.t[tablename]={};
    }
    if (!(objname in self.future_indexes.o)){
	self.future_indexes.o[objname]={};
    }
    self.future_indexes.t[tablename][objname] = fieldname;
    self.future_indexes.o[objname][tablename] = fieldname;

};

NB.models.Store.prototype.addIndex = function(table, o, fieldname){
    var self = this;
    if ((!(table in self.o))||(!(o in self.o))){
	self.__addFutureIndex(table, o, fieldname);
	return;
    }
    if (!(table in self.indexes)){
	self.indexes[table]={};
    }
    if (!(o in self.indexes[table])){
	self.indexes[table][o]={};
    }
    let objects =  self.o[o];
    for (let i in objects){
	let key = objects[i][fieldname];
	if (!(key in self.indexes[table][o])){
	    self.indexes[table][o][key] = {};
	}
	self.indexes[table][o][key][i]=null;
    }
};


