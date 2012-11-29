/**
 * screen.js: Utilities for screen appearence. 
 *
 * This module defines the namespace NB.screen
 * It requires the following modules:
 *		Module
 *		NB
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */


try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.screen", 0.1);
}
catch (e){
    alert("[screen] Init Error: "+e);
}

NB.screen.__width = 800;
NB.screen.__height= 480;

NB.screen.getWidth = function(){
    return NB.screen.__width;
}


NB.screen.getHeight = function(){
    return NB.screen.__height;
}



/* This is useful for SVG drawing because we use the convention that 
 * the SVG viewbox is "0 0 aspectratio 1"
 */
NB.screen.getAspectRatio = function(){
    return NB.screen.width / NB.screen.height;
};

