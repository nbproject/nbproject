/* Mods framework: loads js and css (or anything else) dynamically. 
 * Depends:
 *	jquery
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 1-- To declare what files modules depend on: 
 $.mods.declare({ 
 my_module_1: {
 files: {
 "hello.js": "js", 
 "../utils.js": "js", 
 "hello.css": "css"
 }
 }
 my_module_2: {...}
 });

 (note: you don't have to declare all modules at the same time)

 2-- To run a block of code only when a bundle (i.e. a group of modules) is loaded: 
 $.mods.load(["my_module_1", "my_module_2], function(){
 //your code here
 });

 Note: for convenience, if your bundle is only 1 module, you don't have to use the array syntax, so you can type: $.mods.load("my_module",cb);
*/
//var MOD_DATA;
(function($) {
    if ("mods" in $){
	return; //must have loaded this file several times. 
    }

    
    var Mods = function(){  
	this.FILE_TYPES = {
	    js:	{tag: "script", attrs: "type='text/javascript'", infile_tag:"script", infile_attr:"src"}, 
	    js17:	{tag: "script", attrs: "type='application/javascript;version=1.7'",infile_tag:"script", infile_attr:"src" }, 
	    css:	{tag: "style", attrs: "type='text/css'",infile_tag:"link", infile_attr:"href"}
	};
	this.modules	= {}; /* a module entry: 
				 - deps: missing dependencies (integer, required)
				 - files: (dict of files)
				 - ready: boolean
			      */
	this.files		= {};/* a file entry: 
					- loaded (boolean, required)
					- loading (boolean, required)
					- prefix (string: optional)
					- type (string - one of FILE_TYPES)
				     */
	this.deps	= {}  /* mapping filename -> {id_bundle: null} */
	this.bundles	= {}; /* mapping id_bundle -> {modules: Array of modules, cb: callback_function} */		       
	this.prefix	= "";

    }; 
    Mods.prototype._fetch = function(f, j, T, id_bundle){
	var self = this;
	$.ajax({
		//		url: (f.prefix || this.prefix) + j, 
		url:  this.prefix + j, 
		    ifModified: true, 
		    datatype: "text",
		    success: function(data){self.onsuccess(j,T,  data);}, 
		    error: function(xhr, status, e){alert("TODO: load error for "+id_bundle+": "+status);}
		
	    });
    };
    Mods.prototype.onsuccess = function(filename,type,  data){
	//MOD_DATA = data;
	//	console.log("[enter success] ", filename);
	var f = this.files[filename];
	f.loading	= false;
	f.loaded	= true;
	/*
	try{  
	    $("head").append("<"+this.FILE_TYPES[type].tag+" "+this.FILE_TYPES[type].attrs+"><![CDATA[\n"+data+"\n]]></"+this.FILE_TYPES[type].tag+">");
	}
	catch (e){
	    alert("[mods] script insert error "+e);
	}
	*/
	$("head").append("<"+this.FILE_TYPES[type].tag+" "+this.FILE_TYPES[type].attrs+"><![CDATA[\n"+data+"\n]]></"+this.FILE_TYPES[type].tag+">");

	/*
	  find if this success triggers any callback, (i.e. Is there any missing dependency that has just been met ? )
	*/	
	for (var id_bundle in this.deps[filename]){
	    var cb_ready = true;
	    var modules = this.bundles[id_bundle].modules;
	    for (var i in modules){
		var name = modules[i];
		var M =  this.modules[name];
		//console.log("success for ", filename, " deps:", M.deps);

		if (filename in M.files){
		    M.deps--;
		    if (M.deps == 0){
			M.ready = true;
		    }
		    else{
			cb_ready = false;
		    }
		}
	    }
	    if (cb_ready){ 
		this._cb_ready(id_bundle, filename);
	    }
	}
	console.log("[exit  success] ", filename);
    };
    Mods.prototype._cb_ready = function(id_bundle, filename){
	//all the modules for this bundle are loaded: run the cb and get rid of that bundle !
	this.bundles[id_bundle].cb();
	//clean up: 
	var M;
	for (var i in this.bundles[id_bundle].modules){
	    M =  this.modules[this.bundles[id_bundle].modules[i]];
	    for (var j in M.files){
		delete(this.deps[j][id_bundle]);
	    }
	}
	delete(this.bundles[id_bundle]);
    };
    Mods.prototype.load = function(names, cb){
	var self = this;
	if (typeof(names)=="string"){
	    names = [names];
	}
	var id_bundle = Math.random();
	this.bundles[id_bundle] = {modules: names, cb: cb};
	var cb_ready = true;
	var name;
	for (var i in names){
	    name = names[i];
	    if (!(name in this.modules)){
		throw new Error(name+ " wasn't defined as a module: don't know its dependencies !");
	    }
	    if (!(this.modules[name].ready)){
		cb_ready = false;
		//now figure out why module not ready and do stg about it :) 
		var m = this.modules[name];
		for (var j in m.files){
		    if (!(id_bundle in this.deps[j])){
			this.deps[j][id_bundle]=null
			    }			    
		    if (!(j in this.files)){
			throw new Error(j + "isn't in the list of files, but it was required by " +name );
		    }
		    var f  = this.files[j];
		    if ((!(f.loaded)) && (!(f.loading))){ // we found stg we can do
			f.loading = true;
			this._fetch(f, j, f.type, id_bundle);
		    }   
		}
	    }
	}
	if (cb_ready){
	    this._cb_ready(id_bundle);
	}
    }; 
    Mods.prototype.declare = function(o){
	var reqs;
	for (var i in o){
	    if (i in this.modules){
		return; // no need to redeclare a module ! 
	    }
	    this.modules[i] = {deps: 0};
	    reqs = o[i];
	    this.modules[i].files = reqs.files;		
	    for (var j in reqs.files){
		var type = reqs.files[j];
		if (!(j in this.files)){
		    this.files[j] = {loading: false, loaded: false, type:type };
		    this.modules[i].deps++;
		} 
		else if (!(this.files[j].loaded)){
		    this.modules[i].deps++;
		}
		if (!(j in this.deps)){
		    this.deps[j]={};
		}
		//however, if file is already imported as a file from the header, mark it as loaded and dont coun't it as a dep: 
		var rec		= this.FILE_TYPES[type];
		var files	= $(rec.infile_tag);
		
		for (var k=0;k<files.length;k++){
		    var f = files[k];
		    if (f.getAttribute(rec.infile_attr) == j){
			this.files[j].loaded = true;
			this.modules[i].deps--;
			break;
		    }
		}
	    }
	    this.modules[i].ready = (this.modules[i].deps == 0);
	}
    };
    $.mods = new Mods(); //singleton pattern
})(jQuery);
