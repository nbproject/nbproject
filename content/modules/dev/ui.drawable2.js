/*
 * based on jquery draggable
 *

Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/


(function($) {

    $.widget("ui.drawable", $.extend({}, $.ui.mouse, {
		_init: function() {
		    this._mouseInit();
		    this._setData("model", this.options.model);
		    var helper = $("<div class='ui-drawable-helper'/>");
		    this.element.addClass("ui-drawable").append(helper);
		    this.contextmenu = $("<ul id='PNUP' class='contextMenu'><li class='comment'><a href='#comment'>Comment</a></li><li class='highlight separator'><a href='#highlight'>Highlight</a></li><li class='hide'><a href='#hide'>Hide</a></li><li class='delete separator'><a href='#delete'>Delete</a></li></ul>");
		    this._setData("helper", helper);
		},
						 destroy: function() {
		    if(!this.element.data('drawable')) return;
		    this.element.removeData("drawable").unbind(".drawable").removeClass("ui-drawable");
		    $("div.ui-drawable-helper", this.element).remove();
		    this._mouseDestroy();
		},

		    _mouseCapture: function(event) {
		    return true;
		},

		    _mouseStart: function(event) {
		    //only listen if on current page: 
		    if (this.element.attr("page")!=$.concierge.get_state("page")){
			return false;
		    }
		    var p0={top:  event.pageY, left: event.pageX};
		    var o = this.element.offset();
		    var M0={top: (p0.top-o.top), left: (p0.left-o.left)};
		    this._setData("p0", p0);
		    this._setData("M0", M0);
		    this._getData("helper").show().css({top: M0.top+"px", left: M0.left+"px"});
		    return true;
		},

		    _mouseDrag: function(event, noPropagation) {
		    //		$.L("mousedrag");
		    var p0 = this._getData("p0");
		    var M0 = this._getData("M0");
		    var p={};
		    var w =  event.pageX - p0.left;
		    var h =  event.pageY - p0.top;

		    if (w>=0){
			p.width = w;
		    }
		    else{
			p.left = M0.left+w;
			p.width=-w;
			
		    }
		    if (h>=0){
			p.height = h;
		    }
		    else{
			p.top = M0.top+h;
			p.height=-h;
		    
		    }
		    this._getData("helper").css(p);
		    return false;
		},
		    _mouseStop: function(event) {
		    this.editorFactory2();
		    return false;
		}, 
				    
		    editorFactory2: function(){
		    //		    var self=this;
		    var h = this._getData("helper");
		    var $editor = $("<div/>");
		    this.element.append($editor);
		    $editor.editor({selection: h, model: this._getData("model")});
		}
	    }
	    ));

    $.extend($.ui.drawable, {
	    version: "1.7.2",
		eventPrefix: "drag",
		defaults: {
		distance: 1, 
		    model: null
		    }
	});

})(jQuery);
