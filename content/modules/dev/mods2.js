/* Mods framework: loads js and css  dynamically. Provide syntactic sugar so we can put group several files under a module 
 *    
 * Depends:
 *	jquery
 *	head.js
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 1-- To declare what files a modules depend on: 
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


 2-- To run a block of code only when a module is loaded: 
 $.mods.ready("my_module_1", function(){
 //your code here
 });
*/
(function($) {
    if ("mods" in $){
	return; //must have loaded this file several times. 
    }
    var Mods = function(){  
	this.modules	= {}; /* a module entry: 
				 - js
				 - css
				 - ready: boolean
			      */

	Mods.prototype.ready = function(module, cb){	    
	    var self = this;
	    if (this.modules[module].ready){ //make sure we call the cb on subsequent calls
		cb();
		return;
	    }
	    var cb2 = function(){
		self.modules[module].ready = true;
		cb();
	    }
	    if ("js" in this.modules[module]){
		var args = [];
		var files = this.modules[module].js;
		for (var i = 0; i<files.length; i++){
		    args.push(files[i]);
		}
		args.push(cb2);
		head.js.apply(null, args);
	    }
	    else{
		this.modules[module].ready = true;
		cb();
	    }	
	}; 
	Mods.prototype.declare = function(o){
	    var reqs;
	    for (var i in o){
		if (i in this.modules){
		    return; // no need to redeclare a module ! 
		}
		this.modules[i] = o[i];
		var j, fn;
		if ("css" in o[i]){
		    for (j in  o[i].css){
			fn = o[i].css[j];
			$("head").append("<link type='text/css'  rel='stylesheet' href='"+fn+"'/>");
		    }
		}
		this.modules[i].ready = false;
	    }
	};
    };
    $.mods = new Mods(); //singleton pattern
})(jQuery);
