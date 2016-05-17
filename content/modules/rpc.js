/**
 * rpc.js: XHR-based rpc
 *
 * This is a module of useful functions that are
 * compatible with JSAN-type modules.
 * It gathers functions that are useful at the window level, for the windows that have a browser
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

(function(GLOB){
    //require: dom
    GLOB.rpc = {};

GLOB.rpc.connection_id = 0;
GLOB.rpc.first_connection = true;
GLOB.rpc.connection_T = 1000;  // in msec

GLOB.rpc.makeCallTree= function(fctname, args){
    var doc =document.implementation.createDocument("", "methodCall", null);
    var mc = doc.documentElement;
    var mn = doc.createElement("methodName");
    mn.appendChild(doc.createTextNode(fctname));
    var params = doc.createElement("params");
    var p, i,v, arg;
    for (i = 0;i<args.length;i++){
	arg = args[i];
	p =  doc.createElement("param");
	v = GLOB.rpc.makeArg(doc, arg);
	p.appendChild(v);
	params.appendChild(p);
    }
    mc.appendChild(mn);
    mc.appendChild(params);
    return doc;
};


GLOB.rpc.makeArg = function(doc, arg){
    var v,x, i;
    v =  doc.createElement("value");
    
    if (typeof arg == "number"){
	if (Math.floor(arg)==arg){
	    x= doc.createElement("int");
	    x.appendChild(doc.createTextNode(arg));
	}
	else{
	    x= doc.createElement("double");
	    x.appendChild(doc.createTextNode(arg));
	}
    }
    else if (typeof arg == "string"){
	x= doc.createElement("string");
	x.appendChild(doc.createTextNode(arg));
    }
    else if (typeof arg == "boolean"){
	x= doc.createElement("boolean");
	x.appendChild(doc.createTextNode(Number(arg))); //xmlrpc recognizes 0 or 1
    }
    else if (typeof arg == "object"){
	if (arg === null){
	    x= doc.createElement("nil");
	}
	
	else if (arg instanceof Array){
	    x =  doc.createElement("array");
	    var data_node =  doc.createElement("data");
	    x.appendChild(data_node);
	    for(i=0;i<arg.length;i++){
		data_node.appendChild(GLOB.rpc.makeArg(doc, arg[i]));
	    } 
	}
	//	else if (arg instanceof Object){
	else {//just copy down all props as if it were a struct
	    x =  doc.createElement("struct");
	    var member_node, name_node;
	    for (prop in arg){
		member_node =  doc.createElement("member");
		name_node =  doc.createElement("name");
		name_node.appendChild(doc.createTextNode(prop));	       
		member_node.appendChild(name_node);
		member_node.appendChild(GLOB.rpc.makeArg(doc, arg[prop]));
		x.appendChild(member_node);
	    }
	}
    }
    else{
	x= doc.createElement("nil");
	throw new Error("ran out of prim types: I don't know how to xml-serialize "+arg);
    }
    v.appendChild(x);
    return v;
};


GLOB.rpc.xml2js = function(v){ //v is a "value" node
    var x, i;
    var retval, child;
    x = GLOB.dom.firstElement(v);
    if (x.tagName=="string" ||x.tagName=="double" ||x.tagName=="int" ){
	if (x.firstChild===null){
	    return null;
	}
	return x.firstChild.nodeValue;
    }
    else if  (x.tagName=="boolean"){
	return (x.firstChild.nodeValue == "1");
    }
    else if  (x.tagName=="nil"){
	return null;
    }
    else if  (x.tagName=="array"){
	retval = [];
	var data_node_children = GLOB.dom.firstElement(x).childNodes;
	for (i=0;i<data_node_children.length;i++){
	    child = data_node_children[i];
	    if  (child.nodeType == 1){ //discard text nodes
		retval.push(GLOB.rpc.xml2js(child));
	    }
	}	
	return retval;
    }
    else if  (x.tagName=="struct"){
	retval = {} ;
	var struct_node_children = x.childNodes;
	var name_node;
	var value_node;
	for (i=0;i<struct_node_children.length;i++){
	    child = struct_node_children[i];
	    if  (child.nodeType == 1){ //discard text nodes
		//now child is a "member" node
		name_node = GLOB.dom.firstElement(child);
		value_node = GLOB.dom.elementItem(child, 1);
		retval[name_node.firstChild.nodeValue] = GLOB.rpc.xml2js(value_node);
	    }
	}
	return retval;
    }
    else{
	GLOB.error("could not deserialize", x);
    }
};


GLOB.rpc.getReply = function(reply){
    var param_node = reply.getElementsByTagName("param").item(0);
    if (param_node === null){
	return {};
    }
    var v = GLOB.dom.firstElement(param_node); //= is the "value" node
    return GLOB.rpc.xml2js(v);
};


GLOB.rpc.rpc_json = function(url, fctname,  args, callback, extra_callback_args) {
    /* About connection ids: 
       we allow the 1st connection to go thought even if its connection_id = 0, since the connection_is will come as a result of that
       If some rpc call are made in between, we put them on a timer, until we get a valid connection id...
    */
    if ((!GLOB.rpc.first_connection) && GLOB.rpc.connection_id == 0) {
	// we haven't received a reply yet so put this function to wait for a while
	GLOB.log("waiting until we get a connection id...")
	window.setTimeout(function(){
		GLOB.rpc.rpc_json(url, fctname, args, callback, extra_callback_args);
	    }, GLOB.rpc.connection_T);
	return;
    }
    GLOB.rpc.first_connection = false;
    var httpRequest = new XMLHttpRequest();
	try{
	    if (httpRequest.overrideMimeType) {
		httpRequest.overrideMimeType('text/xml');
	    }
	    if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	    }
	}
	catch(e){
	    alert(e);
	}
    try{
	httpRequest.open('POST', url , true);
	httpRequest.onreadystatechange = function() { 
	    if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
		    var args_callback = {};
		    //conversion back and forth to array b/c eval doesn't work with a simple dict
		    var reply = eval("["+httpRequest.responseText+"]")[0];
		    //reply should be a dict w/ 2 fields: status and payload
		    args_callback.payload = reply.payload;
		    args_callback.status = reply.status;
		    if ("CID" in reply.status){
			GLOB.rpc.connection_id = reply.status.CID;
		    }
		    args_callback.httpRequest = httpRequest;
		    args_callback.extra = extra_callback_args;
		    callback(args_callback); 
		}
		else{
		    GLOB.error("Remote server error");
		}
	    }
	};
	args.push(GLOB.rpc.connection_id);
	var x = GLOB.rpc.makeCallTree(fctname, args);
	httpRequest.send(x);
    }
    catch(e2){
	alert(e2);
    }
};





/* This is  useful as a standard callback to use for wrappers 
   GLOB.MODULENAME.CALL (ex: GLOB.pdf.call)
*/
GLOB.rpc.__callback = function(args){
    /* args should be a dict that contains
     * - [dict] extra
     *		.cb => the real callback
     * - httpRequest
     * - [dict] payload => what the real callback should get
     * - [dict] status 
     *		.errno: 0 if error
     *		.msg
     */
    //remove hourglass cursor if was there...
    document.body.style.cursor="auto";
    if (args.status.errno){
	//just display that there was an error for now
	GLOB.error(args.status.msg);
	return;
    }
    args.extra.cb(args.payload);
};
})(NB);