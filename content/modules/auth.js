/**
 * auth.js: Convenience fcts for AUTH manipulation
 * It requires the following modules:
 *		Module
 *		NB
 * see: http://www.elated.com/articles/javascript-and-cookies
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */


try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.auth", 0.1);
}
catch (e){
    alert("[auth] Init Error: "+e);
}



NB.auth.set_cookie = function( name, value, expires_year, expires_month, expires_day, path, domain, secure ){
    var cookie_string = name + "=" + escape ( value );
    
    if ( expires_year )  {
	var expires = new Date ( expires_year, expires_month, expires_day );
	cookie_string += "; expires=" + expires.toGMTString();
    }

    if ( path ){
	cookie_string += "; path=" + escape ( path );
    }

    if ( domain ){
	cookie_string += "; domain=" + escape ( domain );
    }
    if ( secure ){
	cookie_string += "; secure";
    }
    document.cookie = cookie_string;
};

NB.auth.delete_cookie =function( cookie_name ){
    document.cookie = cookie_name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"; 
};

NB.auth.get_cookie = function ( cookie_name ){
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
    if ( results ){
	return ( unescape ( results[2] ) );
    }
    else{
	return null;
    }
};
