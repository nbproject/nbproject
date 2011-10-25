/*
 * homepage.js
 * This module defines the namespace NB.homepage
 * It requires the following modules:
 *		Module
 *		NB
 *		mvc
 *		jquery
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.mvc", 0.1);
    Module.createNamespace("NB.homepage", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.homepage.Homepage= function(params){
    //params: v: value, o: oldvalue, c: callback, i: callback on init if true
    var self=this;
    this.P = {
	f_call: {}, 
	container: {c: function(){NB.homepage.__updateContainer(self);}}, 
	logger: {}
    }
    for (p in this.P){
	if (p in params){
	    if ("v" in this.P[p]){ //store old value
		this.P.o = this.P[p].v;
	    }
	    this.P[p].v = params[p];
	    if (("c" in this.P[p])&&("i" in this.P[p])&&(this.P[p].i)){
		this.P[p].c();
	    }

	}
    }
    /*
    this.$main		= $("<div class='homepage'><table>\
<tr><td colspan='2' class='menubar'></td></tr>\
<tr><td rowspan='3' class='explorer'></td>  <td class='feed'></td></tr>\
<tr><td class='qotd'></td></tr>\
<tr><td class='user-stats'></td></tr>\
</table></div>");
    */
   
    this.$main		= $("<div class='homepage'><table class='homepage-layout'>\
<tr><td class='user-stats'></td></tr>\
<tr><td class='feed'><p>Open a document by clicking where it appears on the tree on the left.</p><p>Once you've opened a document, annotate it by <b>double-clicking</b> anywhere on the page</p> </td></tr>\
<tr><td class='qotd'>You're currently using the new NB Layout. The <a href='.?t=p7'>Old NB Layout</a> is still available, albeit deprecated</td></tr>\
</table></div>");
   


    this.built		= false;
    this.explorer	= null;
}; 

NB.homepage.Homepage.prototype.setParams = function(params){
    for (p in this.P){
	if (p in params){
	    if ("v" in this.P[p]){ //store old value
		this.P.o = this.P[p].v;
	    }
	    this.P[p].v = params[p];
	    if ("c" in this.P[p]){
		this.P[p].c();
	    }
	}
    }
};

NB.homepage.Homepage.prototype.getParams = function(params){
    return this.P
};

NB.homepage.Homepage.prototype.setContainer = function(o){
    //equivalent to setParams({container: o})
    this.setParams({container: o});
}

NB.homepage.__updateContainer = function(that){    
    if (that.built){
	that.P.container.o.removeChild(that.$main[0]);
    }
    else{//build !
	that.__build();
    }
    that.P.container.v.appendChild(that.$main[0]);
};

NB.homepage.Homepage.prototype.__build = function(){ 
    this.__build_explorer();
    this.__build_notes();
};


NB.homepage.Homepage.prototype.__build_explorer = function(){    
    if (this.explorer != null){
	$(this.explorer.container).addClass("homepanel");
	this.$main.find("td.explorer").append(this.explorer.container);
    }
    //    console.debug(this.explorer);
}


NB.homepage.Homepage.prototype.__build_notes = function(){    
    var self = this;
    this.P.f_call.v("get_user_stats",{}, function(payload){NB.homepage.__on_user_stats(self, payload);});
    this.$main.find("td.user-stats").html("<div class=\"user-stats\"/>");
};



NB.homepage.__on_user_stats = function(that, payload){    
    var div = that.$main.find("div.user-stats");
    var t1 = $("<table class='stats-notes'>\
<tr><th rowspan='2'><button action='refresh'>Refresh</button></th><th rowspan='2'>Private Notes</th><th colspan='2'>Assignments<br/></th><th rowspan='2'>Open Comments</th><th colspan='1'>Feedback</th></tr>\
<tr><td>Written</td><td>Published</td><td>Faculty Replies</td></tr></table>");
    /*
    var t1 = $("<table class='stats-notes'>\
<tr><th rowspan='2'><button action='refresh'>Refresh</button></th><th rowspan='2'>Private Notes</th><th colspan='2'>Assignments<br/></th><th rowspan='2'>Open Comments</th><th colspan='3'>Feedback</th></tr>\
<tr><td>Written</td><td>Published</td><td>Faculty Replies</td><td>User Comments</td><td>Comments Authored</td></tr></table>");
    */
    var f_refresh = function(evt){
	that.__build_notes();
    };

    t1.find("button[action=refresh]").click(f_refresh);
    var i;
    var p;
    for (i=0;i<payload.length;i++){
	p = payload[i];

	/*
	t1.append("<tr><td class='ensemble-name'>"+p.ensemble+"</td><td class='numstat'>"+p.num_private+"</td><td class='numstat'>"+(p.num_assignment+p.num_published)+"</td><td class='numstat'>"+p.num_published+"</td><td class='numstat'>"+p.num_opencomment+"</td><td class='numstat'>"+p.num_fac_reply_assignment+"</td><td class='numstat'>"+0+"</td><td class='numstat'>"+0+"</td></tr>");
	*/

	
	t1.append("<tr><td class='ensemble-name'>"+p.ensemble+"</td><td class='numstat'>"+p.num_private+"</td><td class='numstat'>"+(p.num_assignment+p.num_published)+"</td><td class='numstat'>"+p.num_published+"</td><td class='numstat'>"+p.num_opencomment+"</td><td class='numstat'>"+p.num_fac_reply_assignment+"</td></tr>");
	
    }
    div.html(t1);
};

NB.homepage.Homepage.prototype.setExplorer = function(explorer){
    this.explorer = explorer;
};
