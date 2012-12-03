/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		jquery
 *
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 *
 */

try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[pers] Init Error: "+e);
}

$(document).ready(function(){
	$("#viewport1, #viewport2").viewport();
    });
