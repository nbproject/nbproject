/*
 * pers.js: common fct for perspective-based views
 * This module defines the namespace NB.pers
 * It requires the following modules:
 *        Module
 *        NB
 *        NB.auth
 *        jquery
 *
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
    Module.require("NB.conf", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.connection_id = 0;
NB.pers.first_connection = true;
NB.pers.connection_T = 1000;  // in msec

$(document).ready(function(){
    NB.pers.params = NB.dom.getParams();
    //if email and password provided by server, set them as cookies for auto-login
    //so that we're authenticated for subsequent function calls
    var identity = NB.auth.get_cookie("invite_key");
    if (identity !== null){
        NB.conf.identity = identity;
    }
    NB.pers.init();
    });

NB.pers.call = function(fctname, dict, callback, nowait){
    if (NB.conf.identity === ""){
    NB.conf.identity = prompt("Please enter your invite key...");
    }
    if ((!NB.pers.first_connection) && NB.pers.connection_id === 0) {
    // we haven't received a reply yet so put this function to wait for a while
    NB.debug("waiting until we get a connection id...")
    window.setTimeout(function(){
        NB.pers.call(fctname, dict, callback, nowait);
        }, NB.pers.connection_T);
    return;
    }
    NB.pers.first_connection = false;
    var cb = function(x){
    if ("CID" in x.status){
        NB.pers.connection_id = x.status.CID;
    }
    if (x.status.errno){
        //just display that there was an error for now
        NB.debug(x.status.msg);
        return;
    }
    //     console.log("cb w/ x=", x);
    callback(x.payload);
    };
    $.post(NB.conf.servers.rpc+"/pdf3/rpc?invite_key=" + NB.conf.identity,{"cid": NB.pers.connection_id, "f": fctname, "a": JSON.stringify(dict)}, cb, "json");
};

NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    NB.auth.delete_cookie("invite_key");
    delete(NB.conf.identity);
    document.location ="http://"+document.location.host;
};

