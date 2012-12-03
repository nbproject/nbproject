/* Thumbnails plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
 *
 * FEATURES PROVIDED: 
 *  - ensembleList
 *  - fileList
 *  - ensemble
 *  - file
 *
 *
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
(function($) {
    var ZOOMIN_FACTOR = 1.2;
    var ZOOMOUT_FACTOR = 1.0/ZOOMIN_FACTOR;
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		var VIEWID = self.element.attr("id");
		let controls = $("<div class='panel controls'><table><tr class='control-row'><td><div class='button' action='page' direction='previous' title='Go to previous page'><img class='buttonimg' src='/data/icons/png/go_previous_24.png'/></div></td><td colspan='2'><span class='indicator'><span class='currentpage'>5</span>/<span class='numpages'>5</span></span></td><td><div class='button' action='page' direction='next' title='Go to next page'><img class='buttonimg' src='/data/icons/png/go_next_24.png'/></div></td></tr><tr class='control-row'><td><div class='button' action='zoom' direction='out' title='Zoom out'><img class='buttonimg' src='/data/icons/png/zoomout_24.png'/></div></td><td colspan='2'> <span class='indicator zoomlevel'>100%</span></td><td> <div class='button' direction='in' action='zoom' title='Zoom in'><img class='buttonimg' src='/data/icons/png/zoomin_24.png'/></div></td></tr><tr class='control-row'><td><div class='button' action='visibility' status='on' title='Toggle notes visibility'><img class='buttonimg' /></div></td><td><div class='button' action='global_editor' title='Add a comment on the whole file'><img class='buttonimg' src='/data/icons/png/pen_24.png'/></div></td><td><div class='button' action='download' title='Download this PDF'><img class='buttonimg' src='/data/icons/png/save_24.png'/></div></td></tr></table></div> ");
		self.element.addClass("thumbnailView").html(controls);
		$(".button[action=zoom]", controls).click(function(evt){
		    let direction  = evt.currentTarget.getAttribute("direction");
		    $.L(direction);
		    let v = parseFloat($.concierge.get_state("zoom"));
		    if (direction == "out"){
			v*=ZOOMOUT_FACTOR;
		    }
		    else if (direction == "in"){
			v*=ZOOMIN_FACTOR;
		    }
		    $.concierge.trigger({type: "zoom", value:v});
		});
		$(".button[action=page]", controls).click(function(evt){
		    let direction  = evt.currentTarget.getAttribute("direction");
		    $.L(direction);
		    let p = parseInt($.concierge.get_state("page"));
		    let numpages = self._getData('model').o.file[ $.concierge.get_state("file")].numpages;
		    if (direction == "previous" && p>1){
			p--; 
		    }
		    else if (direction == "next" && p<numpages){
			p++;
		    }
		    $.concierge.trigger({type: "page", value:p});
		});
		$(".button[action=global_editor]", controls).click(function(evt){
		    $.concierge.trigger({type: "global_editor", value: true});
		});
		$(".button[action=visibility]", controls).click(function(evt){
		    let v = $.concierge.get_state("visibility");
		    $.concierge.trigger({type: "visibility", value:(!(v))});
		});
		$(".button[action=download]", controls).click(function(evt){
		    window.open("/pdf/repository/"+$.concierge.get_state("file"));
		});
		let thumbnails = $("<ol class='panel thumbnails'/>");
		self.element.append(thumbnails);
	    },
	    _defaultHandler: function(evt){
		var self = this;
		switch (evt.type){
		    case"page":
		    $("div.thumbnail-contents.selected", self.element).removeClass("selected");
		    let elt = $("div.thumbnail-contents[id_item="+evt.value+"]", self.element).addClass("selected");
		    let thumbnails =  self.element.children("ol");
		    let D =  elt.offset().top - thumbnails.offset().top;
		    let D2 =  thumbnails.height()-elt.height();
		    if (D<0){ //scroll to top
			thumbnails.animate({scrollTop: '+=' + (D-30) + 'px'}, 300);
		    }
		    else if  ( D > D2){ //scroll to bottom
			thumbnails.animate({scrollTop: '+=' + (D-D2+50) + 'px'}, 300);
		    }
		    $('span.currentpage', this.element).text(evt.value);
		    //SACHA TODO: grey out controls when they reach a boundary, and reactivate them when no more boundary
		    break;
		    case "file": 
		    self.__update_file();
		    self.element.parent().parent().viewport("smoothSelect", self.element.attr("id")+"-outer");
		    break;
		case "zoom": 
		    let v = Math.floor(parseFloat($.concierge.get_state("zoom"))*100);
		    $(".zoomlevel", self.element).text(v+"%");
		    break;
		case "visibility":
		    let filename = evt.value ? "note_24.png" : "note_blurred_24.png";
		    $("div.button[action=visibility]>img.buttonimg", self.element).attr("src","/data/icons/png/"+filename);
		    break;
		}
	    }, 
	    set_model: function(model){
		this._setData('model', model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    },
	    _update: function(){
		let outerview = this.element.parent();
		let hidden = false;
		//needs to remove hiding for a moment, so we have meaningful dimensions. 
		if (outerview.hasClass("ui-tabs-hide")){
		    hidden = true;
		    outerview.removeClass("ui-tabs-hide");
		}
		let thumbnails = $("ol.thumbnails", this.element);
		let controls =  $("div.controls", this.element);
		let y0 = thumbnails.offset().top +parseInt(thumbnails.css("margin-top")) - this.element.offset().top;
		thumbnails.height(this.element.height() - y0);
		if (hidden){
		    outerview.addClass("ui-tabs-hide");
		}
	    },
	    __update_file: function(){
		var self = this;
		let current_file = $.concierge.get_state("file");
		let $w = $("ol.thumbnails", self.element);
		let s = "";
		let model = this._getData('model');
		let numpages = model.o.file[current_file].numpages;
		for (let i =1;i<=numpages;i++){
		    s += "<li class='thumbnail' ><div class='thumbnail-contents' id_item='" + i+"' ><img src='/pdf/cache2/72/20/"+current_file+"?page="+i+"'/></div></li>";
		}
		$w.html(s);
		$("div.thumbnail-contents", $w).click(function(evt){
			let id_item =  this.getAttribute("id_item");
			if (!(id_item == $.concierge.get_state("page"))){
			    $.concierge.trigger({type:"page", value: id_item});
			}
		    });
		//update page indicator: 
		$('span.numpages', this.element).text(numpages);
	    },
	    update: function(action, payload, props){
		var self = this;
	    }
	});
    $.widget("ui.thumbnailView",V_OBJ );
    $.ui.thumbnailView.defaults = $.extend({}, {});
    $.extend($.ui.thumbnailView, {
	    defaults: {
		provides: ["thumbnails"], 
		    listens: {
		    file:null, 
		    page:null, 
			     zoom: null, 
			     visibility: null
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
