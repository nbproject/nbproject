/* Perspective Plugin
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
	_protect: function($sep){
	    /*
	     * embeds each viewport, vp1 and vp2 (or whatever is used in the persective) in a protection "cage" div (i.e position=relative), itself embedded in a widget
	     * This way, embedded views can use regular coordinates, width=100% etc... without interfering with other views. 
	     */

	    var self = this;
	    if ($sep.length===0){
		return;
	    }	
	    if ($sep.length!=1){
		alert("there are "+ $sep.length +" separators in here !"); 
		$.D("there are ", $sep.length ," separators: ",$sep); 
		return;
	    }
	    var $p = $sep.parent();
	    var $vp1 = $sep.prev();
	    var $vp2 = $sep.next();
	    var $sibs =  $sep.siblings();
	    $sibs.not("div.pers-protection").wrap("<div class='pers-widget'><div class='pers-protection'/></div>");
	    $sibs.filter("div.pers-protection").wrap("<div class='pers-widget'></div>");
	    var size1, margin, css_parms ; //size1: desired size of vp1
	    if ($sep.attr("orientation")=="vertical"){
		size1 = $vp1.width();
		
		if ($sep.attr("end")){
		    size1 = $p.width()-parseInt($sep.attr("end"))-self.SEP_TOTAL_SIZE;
		}
		css_parms = {height:  $p.height()+"px", width: size1+"px"};
		$sep.prev().css(css_parms);
		margin = self.SEP_TOTAL_SIZE + Number(size1);
		$sep.next().css({
			"margin-left": margin + "px",
			    "height":  $p.height()+"px",
			    "width":  $p.width()-margin,
			    });
		$sep.css({
			"left": size1+"px", 
			    "height": $p.height()+"px",
			    "width":self.SEP_INSIDE_SIZE+"px",
			    "cursor":"col-resize", 
			    "border-left":"thin solid #FEFCFB"
			    });
	    }
	    else{
		size1 = $vp1.height();
		if ($sep.attr("end")){
		    size1 = $p.height()-parseInt($sep.attr("end"))-self.SEP_TOTAL_SIZE;
		}
		css_parms = {width:  $p.width()+"px", height: size1+"px" };
		$sep.prev().css(css_parms);
		margin = self.SEP_TOTAL_SIZE + Number(size1);
		$sep.next().css({
			"margin-top": margin + "px",
			    "width":  $p.width()+"px",
			    "height":   $p.height()-margin,
			    });
		$sep.css({
			"top":size1+"px",
			    "width": $p.width()+"px",
			    "height":self.SEP_INSIDE_SIZE+"px",
			    "cursor":"ns-resize", 
			    "border-bottom":"thin solid #FEFCFB",
			    });
		
	    }
	    //	    $vp2.css("overflow", $vp2.css("overflow") || $vp2[0].style.overflow || "auto");
	    self._protect($vp1.children("div.separator").add($vp2.children("div.separator")));
	},
	_adjust: function($SEPS){
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
		var size1, margin ;
		if ($sep.attr("orientation")=="vertical"){
		    size1 = $prev.css({
			    "height":  $p.height()+"px"
			}).width();
		    if ($sep.attr("end")){
			size1 = $p.width()-parseInt($sep.attr("end"))-self.SEP_TOTAL_SIZE;
		    }
		    margin = self.SEP_TOTAL_SIZE + Number(size1);
		    $prev.css({
			    width:  size1+"px",
				height:  $p.height()+"px",
				
			});
		    $next.css({
			    "margin-left": margin + "px",
				height:  $p.height()+"px",
				width:  $p.width()-margin
				});
		    /*
		      $sep.css({
		      "left": $prev.css("width"), 
		      "height": $p.height()+"px",
		      "width":self.SEP_INSIDE_SIZE+"px",
		      });	
		    */
		    $sep.css({
			    "left": size1+"px", 
				"height": $p.height()+"px",
				"width":self.SEP_INSIDE_SIZE+"px",
				});	

		}
		else{
		    size1 = $prev.css({
			    "width":  $p.width()+"px",
			}).height();
		    if ($sep.attr("end")){
			size1 = $p.height()-parseInt($sep.attr("end"))-self.SEP_TOTAL_SIZE;
		    }
		    margin = self.SEP_TOTAL_SIZE + Number(size1);
		    $prev.css({
			    height:  size1+"px",
				width:  $p.width()+"px",
				
			});
		    $next.css({
			    "margin-top": margin + "px",
				"width":  $p.width()+"px",
				"height":   $p.height()-margin,
				});
		    $sep.css({
			    "top": size1+"px", 
				"width": $p.width()+"px",
				"height":self.SEP_INSIDE_SIZE+"px",
				});
		}
		/*
		//find id of affected elements: 

		let affected = {};
		$(">div.pers-protection>div.viewport", $prev.add($next) ).each(function(i, elt){affected[elt.id]=null;});
		self.element.trigger("resize_perspective", [affected]);
		*/
		//		self.element.trigger("resize_perspective", [{viewports:{$prev[0].id: null, $next[0].id: null}}]);
		//		$(">div.pers-protection>div.viewport>div.outerview", $prev.add($next)).each(self._adjust_outerview_height);
		
	    };
	    $SEPS.each(f_adjust); 
	    self._adjust($(">div.pers-protection>div.separator",$SEPS.prev().add($SEPS.next())));
	},
	_adjust_outerview_height: function(i, elt){
	    let $elt=$(elt);
	    let $p = $elt.parent();
	    $elt.height($p.height()-$p.children("ul").height());
	},
	_init: function() {
	    var self = this;
	    var init = true;
	    // initialization from scratch
	    if (init) {
		self.element.addClass("perspective");
		self._protect(self.element.children("div.separator"));
		//		self._adjust(self.element.children("div.separator"));
		$("div.separator[orientation=vertical]").draggable({
			"axis": "x", 
			    "stop": function(event, ui){
			    var left = parseInt(this.style.left);
			    var $elt = $(this);
			    var $prev = $elt.prev();
			    var $next = $elt.next(); 
			    $prev.css("width", left);
			    $next.css({
				    "margin-left": (left+self.SEP_TOTAL_SIZE)+"px", 
					"width": ($elt.parent().width()-self.SEP_TOTAL_SIZE-left) + "px"
					});
			    self._adjust($(">div.pers-protection>div.separator",$prev.add($next)));
			    self.element.trigger("resize_perspective", ["x"]);

			}
		    });
		$("div.separator[orientation=horizontal]").draggable({
			"axis": "y", 
			    "stop": function(event, ui){
			    var top = parseInt(this.style.top);
			    var $elt = $(this);
			    var $prev = $elt.prev();
			    var $next = $elt.next(); 
			    $prev.css("height", top);
			    $next.css({
				    "margin-top": (top+self.SEP_TOTAL_SIZE)+"px", 
					"height": ($elt.parent().height()-self.SEP_TOTAL_SIZE-top) + "px"
					});
			    self._adjust($(">div.pers-protection>div.separator",$prev.add($next)));
			    self.element.trigger("resize_perspective", ["y"]);
			}
		    });
		window.addEventListener("resize",function(evt){
		    //			$.D("window resize");
			self._adjust(self.element.children("div.separator"));
			self.element.trigger("resize_perspective", ["xy"]);

		    }, false);
	    }
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
		constraints:{}
	    }
	});
})(jQuery);
