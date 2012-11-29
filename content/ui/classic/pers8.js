/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.pdf
 *		jquery
 *
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
 */

try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

/*
$(document).ready(function(){
	//if email and password provided by server (example. when we just accepted an invite), set them as cookies for auto-login
	//so that we're authenticated for subsequent function calls
	if ($("#user_settings").attr("email") != ""){
	    NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	    NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
	}

    });

*/
