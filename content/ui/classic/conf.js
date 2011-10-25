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
    rpc: "http://localhost:8002",
    img: "http://localhost:8002", 
    upload: "http://localhost:8002", 
};
*/


NB.conf.servers = {
    rpc: "",
    img: "", 
    upload: "", 
};

/*
NB.conf.servers = {
    rpc: "http://localhost:8002",
    img: "http://localhost:8002"
};
*/

/*
NB.conf.servers = {
    rpc: "http://localhost:8002",
    img: "http://nb.csail.mit.edu:8080",
};
*/

/*
NB.conf.servers = {
    rpc: "http://nb.csail.mit.edu:8080",
    img: "http://localhost:8000",
};
*/

/*
NB.conf.servers = {
    rpc: "http://localhost:8080" ,
    img: "http://localhost:8080"
};
*/

/*************************************************************************************
 * Replace "" (right below) with your invite key if you'd live to be automatically authenticated
 ************************************************************************************/
NB.conf.identity = "";
