/**
 * conf.js
 * Configuration Parameters for NB api 
 * This module defines the namespace NB.conf
 *
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

try{    
    Module.createNamespace("NB.conf", 0.1);
}
catch (e){
    alert("[conf] Init Error: "+e);
}

/*
NB.conf.servers = {
    rpc: "http://nboeit",
    img: "http://nboeit", 
    upload: "http://nboeit", 

};
*/

NB.conf.servers = {
    rpc: "",
    img: "",
    upload: "",

};

/*************************************************************************************
 * Replace "" (right below) with your invite key if you'd live to be automatically authenticated
 ************************************************************************************/
NB.conf.identity = "";
