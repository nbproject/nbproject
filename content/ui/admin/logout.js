/*
 * logout
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.pers", 0.1);

}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.init = function(){
    var nextpage = NB.pers.params.next;
    if (nextpage){
	document.location ="http://"+document.location.host+nextpage;
    }
};
