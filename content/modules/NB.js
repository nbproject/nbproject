/**
 * NB.js: Main module file
 *
 * This is a module of useful functions that are
 * compatible with JSAN-type modules.
 * It gathers functions that are useful at the window level
 * This module defines the namespace NB
 * It requires the follwing modules:
 *	Module
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{
    Module.createNamespace("NB", 0.1);
}
catch (e){
    alert("[NB] Init Error - Details: "+e);
}

NB.DEBUG_LEVEL = 0;

/*
 * won't output anything if firebug not installed
 */
NB.debug = function(msg, l) {
    var level = 0;
    if (l!==undefined){
	level = l;
    }
    if ((level <= NB.DEBUG_LEVEL) && (window.console !== undefined)){
	console.debug("[NB] "+msg);
    }
};

NB.banner = function(msg){

};

NB.len = function(o){
    var i = 0;
    for (i in o){
	i++;
    }
    return i;
};



