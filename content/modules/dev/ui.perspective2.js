/* Perspective Plugin v.2
 * Depends:
 *	ui.core.js
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
(function($) {
    var P_OBJ = {
	SEP_TOTAL_SIZE: 5,
	SEP_INSIDE_SIZE:4, 
	ORIENTATIONS: { 
	    vertical:  {axis: "x", dir:  "left", dim: "width",  dim2:"height", cursor: "col-resize" }, 
	    horizontal:{axis: "y", dir:  "top" , dim: "height", dim2:"width",  cursor: "ns-resize"}
	}, 	
	PREFIX_KEYS: ["v1", "v2"], 
	PREFIXES: {v1: 1, v2: 2},
	_protect: function($sep){
	    /*
	     * embeds each viewpane, vp1 and vp2 in a protection "cage" div (i.e position=relative), itself embedded in a widget
	     * This way, embedded views can use regular coordinates, width=100% etc... without intererferting with other views. 
	     */	    
	    var self = this;
	    if ($sep.length===0){
		return;
	    }	
	    if ($sep.length!=1){
		alert("There are "+ $sep.length +" separators in here... There should be at most 1"); 
		return;
	    }
	    var $p = $sep.parent();
	    var $vp1 = $sep.prev();
	    var $vp2 = $sep.next();
	    var $sibs =  $sep.siblings();
	    $sibs.not("div.pers-protection").wrap("<div class='pers-widget'><div class='pers-protection'/></div>");
	    $sibs.filter("div.pers-protection").wrap("<div class='pers-widget'></div>");
	    self._adjust($sep, true); //don't recurse...
	    self._protect($vp1.children("div.separator"));
	    self._protect($vp2.children("div.separator"));
	},
	_adjust: function($SEPS, dont_recurse){
	    //PRE: containers have been embedded in their protection div and their widgets
	    if ($SEPS.length===0){
		return;
	    }
	    var self = this;
	    var f_adjust = function(i, sep){
		var $sep = $(sep);
		var $p = $sep.parent();
		var $prev = $sep.prev();
		var $next = $sep.next();
		var size1, margin, o_css ; //size1: desired size of prev
		var v = self.ORIENTATIONS[$sep.attr("orientation")];
		size1 = ($sep.attr("end")) ?  $p[v.dim]()-parseInt($sep.attr("end"))-self.SEP_TOTAL_SIZE : $prev[v.dim]();
		margin = self.SEP_TOTAL_SIZE + Number(size1);
		o_css			= {};
		o_css[v.dim2]		= $p[v.dim2]()+"px"
		o_css[v.dim]		= size1+"px";
		$sep.prev().css(o_css);
		o_css			= {};	    
		o_css["margin-"+v.dir]	=  margin + "px";
		o_css[v.dim2]		= $p[v.dim2]()+"px"
		o_css[v.dim]		= ($p[v.dim]()-margin)+"px";
		$sep.next().css(o_css);	    
		o_css			= {};	    
		o_css[v.dir]		= size1 + "px";
		o_css[v.dim2]		= $p[v.dim2]()+"px";
		o_css[v.dim]		= self.SEP_INSIDE_SIZE+"px"
		o_css["cursor"]		= v.cursor;
		o_css["border-"+v.dir]	= "thin solid #FEFCFB";
		$sep.css(o_css);	
	    };
	    $SEPS.each(f_adjust); 
	    if (!(dont_recurse)){
		self._adjust($(">div.pers-protection>div.separator",$SEPS.prev().add($SEPS.next())));
	    }
	},
	_adjust_outerview_height: function(i, elt){
	    var $elt=$(elt);
	    var $p = $elt.parent();
	    $elt.height($p.height()-$p.children("ul").height());
	},
	_f_new_draggable: function(o){
	    var self = this;
	    var v =  self.ORIENTATIONS[o];
	    $("div.separator[orientation="+o+"]").draggable({
		    axis: v.axis, 
			stop: function(event, ui){
			var x = parseInt(this.style[v.dir]);
			var $elt = $(this);
			var $prev = $elt.prev();
			var $next = $elt.next(); 
			$prev.css(v.dim, x);
			var o_css = {};
			o_css["margin-"+v.dir] = (x+self.SEP_TOTAL_SIZE)+"px";
			o_css[v.dim] = ($elt.parent()[v.dim]()-self.SEP_TOTAL_SIZE-x) + "px";
			$next.css(o_css);
			self._adjust($(">div.pers-protection>div.separator",$prev.add($next)));
			self.element.trigger("resize_perspective", [v.axis]);
		    }
		});
	}, 
	_fill_alloc_opts: function(prefix, views){
	    var self = this;
	    var newprefix, id;
	    var elt_id = self.element[0].id+"_";
	    for (var v in self.PREFIXES){
		newprefix = prefix+self.PREFIXES[v];
		id = elt_id + newprefix;
		if ("data" in views[v]){//found a leaf
		    //TODO: Change relative sizes to absolute 
		    self.options._min[id]	=  views[v].data.min;
		    var priority		=  views[v].data.priority;
		    if (priority != 1 && priority != 2){
			throw new Error("priority="+priority+"  but can only be 1 or 2 for now");
		    }
		    self.options._pr2id[priority][id]=null;
		    self.options._priority[id]	=  views[v].data.priority;
		    self.options._desired[id]	=  views[v].data.desired;
		    self.options._frac_desired[id]= views[v].data.desired/views[v].data.min;   
		}
		else{//need to recurse
		    self._fill_alloc_opts(newprefix, views[v].children);
		}
	    }	    
	}, 
	_propagate_allocations: function(prefix, views){
	    var self = this;
	    var newprefix, id;
	    var elt_id = self.element[0].id+"_";
	    var output = 0;
	    for (var v in self.PREFIXES){
		newprefix = prefix+self.PREFIXES[v];
		id = elt_id + newprefix; 
		if (id in self.options._allocated){
		    output+=self.options._allocated[id];
		}
		if ("children" in views[v]){
		    output+= self._propagate_allocations(newprefix, views[v].children);
		   
		}
	    }
	    self.options._allocated[elt_id+prefix] = output;
	    return output;
	}, 
	_compute_leaves_allocations: function(){
	    var self = this;
	    //can we satisfy P1 minimum assignt ? 
	    var available = self.options.width(self.element); 
	    var remaining = available;
	    var P1 = self.options._pr2id[1];
	    var P2 = self.options._pr2id[2];

	    var req = 0;

	    var total_req_frac = 0;
	    var allocated	= 0;
	    for (var v in  P1){
		req+=self.options._min[v];
	    }
	    if (req<available){//every P1 widget will get at least min size
		remaining = available-req;
		for (var v in  P2){ //every P2 widget
		    req+=self.options._min[v];
		}	
		if (req<available) {//the P1 widgets will get some extra space, since P1 and P2 already getting their min
		    remaining = available-req;
		    for (var v in  P1){
			total_req_frac+=self.options._frac_desired[v];
		    }
		    for (var v in  P1){
			self.options._allocated[v] = Math.min(self.options._min[v] + Math.floor(remaining*self.options._frac_desired[v]/total_req_frac),self.options._desired[v]);
			allocated+=self.options._allocated[v];
		    }
		    for (var v in  P2){/// and for now, P2 views get their min
			self.options._allocated[v] = self.options._min[v];
			allocated+=self.options._allocated[v];
		    }
		    //anything left ? 
		    if (allocated < available){
			remaining = available - allocated;
			//now give extra space to P2 widgets (//TODO refactor)
			total_req_frac = 0;
			for (var v in  P2){
			    total_req_frac+=self.options._frac_desired[v];
			}
			for (var v in  P2){
			    allocated-=self.options._allocated[v]; //remove current P2 size i.e. minsize 
			    self.options._allocated[v] = Math.min(self.options._min[v] + Math.floor(remaining*self.options._frac_desired[v]/total_req_frac),self.options._desired[v]);
			    allocated+=self.options._allocated[v];
			}
		    }		    
		}
		else{ //P2 widgets get less than their min
		    req = 0;
		    for (var v in  P2){
			req += self.options._min[v];			
			self.options._allocated[v] = Math.floor(remaining*self.options._min[v]/req);
		    }
		    for (var v in  P1){/// and for now, P2 views get their min
			self.options._allocated[v] = self.options._min[v];
			allocated+=self.options._allocated[v];
		    }
		}		
	    }
	    else{ //P1 widget gets less than min, and P2 are collapsed
		for (var v in  P1){
		    self.options._allocated[v] =  Math.floor(available*self.options._min[v]/req);
		}
		for (var v in  P2){
		    self.options._allocated[v] = 0;
		}
	    }
	}, 
	_create_contents: function(prefix, elt, views){
	    var self = this;
	    var elt_id = self.element[0].id+"_";
	    var did_sep = false;
	    var newprefix, id, $div;
	    var key;
	    for (var i in self.PREFIX_KEYS){
		key = self.PREFIX_KEYS[i]; 	
		newprefix = prefix+self.PREFIXES[key];
		id = elt_id + newprefix;
		if ("data" in views[key]){
		    $div = $("<div id='"+id+"' style='width: "+self.options._allocated[id]+"px; height: 100%'/>");
		    elt.append($div);
		    if ("content" in views[key].data){
			views[key].data.content($div);
		    }
		    else{
			$div.append("No contents for view <i>"+id+"</i>");
		    }
		}
		else{
		    var p = $("<div class='pers-protection'/>");
		    elt.append(p);
		    self._create_contents(newprefix, p, views[key].children);
		    //		    elt.append(p);
		}
		if (!(did_sep )){
		    did_sep = true;
		    elt.append("<div class='separator' orientation='vertical'/>");
		}
	    }
	},
	_resize_contents: function(){
	    var self = this;
	    if (self.options.views){
		self._compute_leaves_allocations();
		self._propagate_allocations("", self.options.views);
		for (var v in self.options._allocated){
		    //		    $("#"+v).css("min-width", self.options._allocated[v]+"px");
		    //resize the view and the  correspoding pers-widget
		    $("#"+v).css("width", self.options._allocated[v]+"px").parent().parent(".pers-widget").css("width", self.options._allocated[v]+"px");

		}
		//		console.log(self.options._allocated);
	    }
	},
	_init: function() {
	    var self = this;
	    self.element.addClass("perspective");//.css({width: self.options.width(self.element), height: self.options.height(self.element)});
	    if (self.options.views){//are we creating any contents ? 
		self._fill_alloc_opts("", self.options.views);
		self._compute_leaves_allocations();
		self._propagate_allocations("", self.options.views);
		self._create_contents("", self.element, self.options.views);
	    }

	    //self.element.addClass("perspective");
	    self._protect(self.element.children("div.separator"));	    
	    for (var o in self.ORIENTATIONS){
		/* here it's necessary to put the loop code into a function so that the 
		   parameter (o) gets copied, because if we inlined the code, the callback 
		   function declared in _f_new_draggable ("stop") would only have the value
		   of the closure variable at the last iteration */
		self._f_new_draggable(o); 
	    }	    	
	    window.addEventListener("resize",function(evt){
		    //		    if (self.element.is(":visible")){
		    //if we're in a viewport, resize the outerview height: 
		    var $vp = self.element.closest("div.viewport");
		    if ($vp.length){
			$vp.viewport("adjust_height");
		    }
		    self._resize_contents();
		    self._adjust(self.element.children("div.separator"));
		    self.element.trigger("resize_perspective", ["xy"]);
		    //	}
		}, false);	    
	},
	update: function(){
	    var self=this;
	    self._adjust(self.element.children("div.separator"));
	    //send update to all registered observers: 
	    self.element.trigger("resize_perspective", ["xy"]);
	}
    };   
    $.widget("ui.perspective",P_OBJ );
    $.extend($.ui.perspective, {
	    version: '1.7.2',
		defaults: {
		width:  function(elt){
return elt.parent().width();}, 
		    height: function(elt){
return elt.parent().height();
}, 
		    orientation: null, 
		    views: null,
		    _min: {}, 
		    _desired: {}, 
		    _frac_desired: {},
		    _allocated: {}, 
		    _priority:{}, 
		    _pr2id:{1:{}, 2:{}}
	    }
	});
})(jQuery);
