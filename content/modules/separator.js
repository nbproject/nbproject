/*
  A convenient separator widget, to add between 2 divs in order to resize them
  Requires: 
  jquery, jquery-ui


Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

Complete  Example (change location of jquery, jquery-ui and jquery-ui stylesheet if necessary): 

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Viewports</title>
    <script src="/modules/jquery/jquery.js" type="text/javascript"></script>
    <script src="/modules/jquery/ui/jquery.ui.all.js" type="text/javascript"></script>
    <link rel="stylesheet" href="/modules/jquery/themes/default/ui.all.css" type="text/css" />
    <script type="application/javascript;version=1.7" src="/modules/separator.js.min"/>
    <style>
html, body, #main-panel{
 padding:0px;
 margin: 0px;
 width: 100%;
 height: 100%;
 overflow: hidden;
 background-color: #CCCCCC;
}
#vp1{
 width: 150px; 
 background-color: #FFAAAA;
}
#vp2-1{
 height: 400px;
 background-color: #AAFFAA;
}
#vp2-1-1{
 width: 600px;
 background-color: #AAAAFF;
}
#vp2-2{
 background-color: #FFFFAA;
 height: 200px;
}


</style>
  </head> 
  <body>
    <div id="main-panel" class="separable">
      <div id="vp1" flex="1">Viewport 1</div>
      <div class="vseparator"/>
      <div id="vp2" flex="1">
	<div id="vp2-1" flex="2">
	  <div id="vp2-1-1" flex="1">Viewport 2-1-1</div>
	  <div class="vseparator"/>
	  <div id="vp2-1-2" flex="1">Viewport 2-1-2</div>
	</div>
	<div class="hseparator"/>
	<div id="vp2-2" flex="1">Viewport 2-2</div>
      </div>
    </div>
  </body>
</html>
	

*/
$(document).ready(function(){
	var SEP_TOTAL_SIZE = 7;
	var SEP_INSIDE_SIZE = 6;


	function expand(q){
	    //SACHA FIXME: Temporary hack for tab views
	    var p = q.parents("[flex]");
	    var w0 = p.width() - SEP_INSIDE_SIZE;
	    var h0 = p.height() - $(" .ui-tabs-nav").height() - SEP_INSIDE_SIZE;
	    
	    var w = w0 - parseInt(0+q.css("margin-left")) - parseInt(0+q.css("margin-right")) -  parseInt(0+q.css("border-left"))  -  parseInt(0+q.css("border-right")) -  parseInt(0+q.css("padding-left"))  -  parseInt(0+q.css("padding-right")) ;
	    var h = h0 - parseInt(0+q.css("margin-top")) - parseInt(0+q.css("margin-bottom")) -  parseInt(0+q.css("border-top"))  -  parseInt(0+q.css("border-bottom")) -  parseInt(0+q.css("padding-top"))  -  parseInt(0+q.css("padding-bottom")) ;
	    q.css({"width":  w+"px", "height": h+"px"});
	    //	    q.find("> .expandable").each(function(){expand($(this));});
	}

	function v_fct(event, ui, self){
	    $(self).prev().css("width", self.style.left);
	    $(self).next().css({
		    "margin-left": (parseInt(self.style.left)+SEP_TOTAL_SIZE)+"px", 
			"width": ($(self).parent().width()-SEP_TOTAL_SIZE-parseInt(self.style.left)) + "px"
			});
	    $(self).siblings().each(function(){
		    propagateSize($(this));
		    var toResize = $(this).find(" .expandable");
		    toResize.each(function(){expand($(this));});
		});
	}

	function h_fct(event, ui, self){
	    $(self).prev().css("height", self.style.top);
	    $(self).next().css({
		    "margin-top":(parseInt(self.style.top)+SEP_TOTAL_SIZE) +"px", 
			"height": ($(self).parent().height()-SEP_TOTAL_SIZE-parseInt(self.style.top)) + "px"
			});
	    $(self).siblings().each(function(){
		    propagateSize($(this));
		    var toResize = $(this).find(" .expandable");
		    toResize.each(function(){expand($(this));});
		});
	}


	$(".vseparator").each(function(i){
		var overflow;
		overflow =  $(this).prev()[0].style.overflow || "auto";
		var size1 = $(this).prev().css({
			"position": "absolute",
			"height":  $(this).parent().height()+"px",
			"overflow": overflow, 
			"min-width": "32px",
			"min-height": "32px",
		    }).width();
		
		var margin = SEP_TOTAL_SIZE + Number(size1);
		
		overflow =  $(this).next()[0].style.overflow || "auto";

		$(this).next().css({
			"position": "absolute",
			    "margin-left": margin + "px",
			    "height":  $(this).parent().height()+"px",
			    "width":  $(this).parent().width()-margin,
			    "overflow": overflow, 
			    "min-width": "32px",
			    "min-height": "32px",
			    });
		

		$(this).css({
			"left": $(this).prev().css("width"), 
			    "height": $(this).parent().height()+"px",
			    "position": "absolute",
			    "width":SEP_INSIDE_SIZE+"px",
			    "cursor":"w-resize", 
			    "background-color":"#EFEBE7",
			    "border-left":"thin solid #FEFCFB", 
			    "z-index": "10"
			    });
	    }).draggable({
		    "axis": "x", 
			"drag": function(event, ui){
			//			v_fct(event, ui, this);
		    }, 
			"stop": function(event, ui){
			    v_fct(event, ui, this);
		    }
		    
		});



	$(".hseparator").each(function(i){
		var size1 = $(this).prev().css({
			"position": "absolute",
			"width":  $(this).parent().width()+"px"
		    }).height();

		var margin = SEP_TOTAL_SIZE + Number(size1);
		$(this).next().css({
			"position": "absolute",
			    "margin-top": margin + "px",
			    "width":  $(this).parent().width()+"px",
			    "height":   $(this).parent().height()-margin
			    });
		

		$(this).css({
			"top": $(this).prev().css("height"), 
			    "width": $(this).parent().width()+"px",
			    "position": "absolute",
			    "height":SEP_INSIDE_SIZE+"px",
			    "cursor":"n-resize", 
			    "background-color":"#EFEBE7",
			    "border-bottom":"thin solid #FEFCFB",
			    "z-index": "10"
			    });
	
	     
	    }).draggable({
		    "axis": "y", 
			"drag": function(event, ui){
			//h_fct(event, ui, this);
		    }, 
			"stop":  function(event, ui){
			    	h_fct(event, ui, this);
		    }
		});
	window.addEventListener("resize",function(evt){
		$(".separable").each(function(){
			propagateSize(this);
			var toResize = $(this).find(" .expandable");
			toResize.each(function(){expand($(this));});
		    })
	    }, false);

	function propagateSize(src){
	    // PRE: src has already been adjusted to the correct size
	    //	    console.log("propagating size of "+ $(src).attr("id"));
	    var sep,c, F, p,w0, w1,h0, h1, f, prev, next,x ; 
	    sep = $(src).find("> .vseparator");
	    if (sep.length > 1){
		alert("can't have more that 1 separator for now!");
		return;
	    }
	    if (sep.length == 1){
		w0 = SEP_TOTAL_SIZE; //old 
		c = sep.parent().children();
		F = 0; //sum of flex
		p = 0; //one part 
		w1 = sep.parent().width(); // new size
		h1 = sep.parent().height(); // new size
		c.each(function(){
			w0 += $(this).width();
		    });			
		c.height(h1);
		sep.siblings().each(function(){
			F += Number($(this).attr("flex"));
		    });
		p = (w1-w0)/F;   	    

		//adjust viewport 1
		prev = sep.prev();
		f = Number(prev.attr("flex"));
		x =  Math.max(Math.floor($(prev).width() + f*p),parseInt($(prev).css("min-width")));
		$(prev).width(x);			

		//adjust separator
		sep.css("left", x+"px");

		//adjust viewport 2
		next = sep.next();
		f = Number(next.attr("flex"));
		next.css({
			"margin-left": (x+SEP_TOTAL_SIZE)+"px", 
			    "width":  (w1-x-SEP_TOTAL_SIZE) + "px"
			    });
		propagateSize(prev);
		propagateSize(next)
		return; //don't need to look for other sep type since we already found one
	    }


	    sep = $(src).find("> .hseparator");
	    if (sep.length > 1){
		alert("can't have more that 1 separator for now!");
		return;
	    }
	    if (sep.length == 1){
		h0 = SEP_TOTAL_SIZE; //old 
		c = sep.parent().children();
		F = 0; //sum of flex
		p = 0; //one part 
		w1 = $(sep).parent().width(); // new size
		h1 = $(sep).parent().height(); // new size
		c.each(function(){
			h0 += $(this).height();
		    });			
		c.width(w1);
		sep.siblings().each(function(){
			F += Number($(this).attr("flex"));
		    });
		p = (h1-h0)/F;  

		//adjust viewport 1
		prev = sep.prev();
		f = Number(prev.attr("flex"));
		//		x =  Math.floor($(prev).height() + f*p);
		x =  Math.max(Math.floor($(prev).height() + f*p),parseInt($(prev).css("min-height")));
		$(prev).height(x);			

		//adjust separator
		sep.css("top", x+"px");

		//adjust viewport 2
		next = sep.next();
		f = Number(next.attr("flex"));
		next.css({
			"margin-top": (x+SEP_TOTAL_SIZE)+"px", 
			    "height":  (h1-x-SEP_TOTAL_SIZE) + "px"

			    });
		propagateSize(prev);
		propagateSize(next)
		
	    }
	}
	




	//	console.log("separator ready");
    });
