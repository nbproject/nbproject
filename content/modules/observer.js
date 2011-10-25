/**
 * observer.js: 
 *	web observer pattern. In conjuction with the proper code on the server (cf below), 
 *	it provides a way for the HTTP server to notify the browser. 
 *	The typical use is as follows: 
 *	-In the client code (javascript):
 *		NB.observer.register(MODEL_URL, CB_DICT);
 *		where:
 *		- MODEL_URL is a string chosen by convention, and that HTTP server should treat 
 *			approprately
 *		- CB_DICT is a dictionary of {event_type: callbacks_fct}
 *		Note: If you call NB.observer.register several times with the same MODEL_URL, 
 *		it will simply add the callbacks. 
 *	-In the server code, MODEL_URL should direct towards a module that has the 2 functions: 
 *		-register
 *		-keepalive
 *		Note: For basic functionality, responder.py does the job !
 * 
 * This module defines the namespace NB.observer
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.rpc
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.rpc", 0.1);
    Module.createNamespace("NB.observer", 0.1);
}
catch (e){
    alert("[observer] Init Error: "+e);
}


/*
 * Maps the model urls to the following bookkeeping struct
 * - updatefct update function
 *
 */
NB.observer.__models = {};
NB.observer.latestReplyTime = false;
NB.observer.watchDog_T = 5*60*1000;  // 5 minutes in msec
//NB.observer.watchDog_T = 11000; 



NB.observer.__keepalive_cb = function(args){
    /* args should be a structure that contains: 
       - payload
       - httpRequest
       - extra, which should contain 
		- a model_url field (string)
		- a connection_id field
    */

    //    NB.debug("[NB.observer.__keepalive_cb] called");
    //get the model url: 
    var model_url = args.extra.model_url;
    NB.observer.latestReplyTime =  (new Date()).getTime();

    //send back request so we can be notified in the future
    NB.rpc.rpc_json(model_url, "keepalive",[{}],NB.observer.__keepalive_cb, args.extra, args.httpRequest);

    var event = args.payload;
    //NB.debug("[keepalive_cb] got a " + event.type);
    var s = NB.observer.__models[model_url];		// get the right bookkeeping struct
    var i;
    if (event.type in s){
	for (i in s[event.type]){
	    s[event.type][i](event);			//calls the right callback, if there's one
	}
    } 
};

NB.observer.__register_cb = function(args){
 /* args should be a structure that contains: 
       - payload, which here should justy be a connection_id field
       - httpRequest
       - extra, which should contain 
		- A model_url field (string)
    */
    if (args.status.errno){
	//just display that there was an error for now
	NB.debug(args.status.msg);
	return;
    }

    if ("connection_id" in args.payload){
	    var model_url = args.extra.model_url;
	    var connection_id = args.payload.connection_id;
	    args.extra.connection_id = connection_id;


	    //SACHA FIXME For the next line: For now, we assume the simplifying assumtion that we've called observer.register with a single model_url, hence, there's only one connection_id per page, this is so that rpc calls can relay connection id to server if it exists Cf also rpc.js: rpc_json()
	    document.documentElement.setAttribute("connection_id",  connection_id);

	    //NB.debug("[NB.observer.__register_cb] Registered observer  for connection  " + connection_id );
	    NB.rpc.rpc_json(model_url, "keepalive",[{"connection_id": connection_id}],NB.observer.__keepalive_cb, args.extra);
    }
    else{
	NB.debug("[NB.observer.__register_cb] ERROR: missing connection_id");
    }
};

NB.observer.register = function(model_url,   cb_dict){    
    var evt_type, m;
    if (model_url in  NB.observer.__models){  //simply add to the callbacks
	m = NB.observer.__models[model_url];
	for (evt_type in cb_dict){
	    if (evt_type in m){ // just append
		m[evt_type].push(cb_dict[evt_type]);
	    }
	    else{ //create an entry
		m[evt_type] = [cb_dict[evt_type]];
	    }
	}
    }
    else{ //create a new model entry, and let server know about it
	m = {};
	m_remote = {};
	for (evt_type in cb_dict){
	    m[evt_type] = [cb_dict[evt_type]];
	    m_remote[evt_type]= true;
	}
	NB.observer.__models[model_url] =m;
	NB.rpc.rpc_json(model_url, "register",[m_remote], NB.observer.__register_cb, {"model_url": model_url});
    }
};



/**
 * Needed to pull more data out of the model
 ***/
NB.observer.get = function(updatefct){
    NB.debug("unimplemented yet !");
};


NB.observer.showConnections = function(model_url, cb){
    NB.rpc.rpc_json(model_url, "showConnections",[{}],cb);

};


/**
 * Watchdog to contact server, if session was interrupted for too long
 **/
NB.observer.watchDog = function(){
    var now = (new Date()).getTime();
    
    if (NB.observer.latestReplyTime && now-NB.observer.latestReplyTime>NB.observer.watchDog_T){
	//it's been too long since a reply from the server... let's reconnect. 	
	for (var model_url in NB.observer.__models){
	    NB.rpc.rpc_json(model_url, "register",[{}],NB.observer.__register_cb, {"model_url": model_url});
	    
	}
    }
}
setInterval(NB.observer.watchDog,NB.observer.watchDog_T );

    
