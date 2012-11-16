/* docView Plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *

 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		self._bring_to_front();
		self.repaint();
		self.element.html("<div class='util'/><div class='contents'/>");
		self._setData("last_clicked_selection", 0);
		self._setData("h", 100);//sample init
		self._setData("in_page_transition", false);
		self._setData("area_indicator", false);
		self._setData("__pbar_old", 1);


	    },
	    _defaultHandler: function(evt){
		var self = this;
		let id_file = self._getData("file") ;
		if (id_file != $.concierge.get_state("file")){
		    if (!(evt.type=="notes_loaded_for_file" && evt.value==id_file)){
			//this event isn't for us ! 
			return;
		    }
		}
		/*
		 * From now on, we assume the event is directed to this view ! 
		 */ 
		switch (evt.type){
		case "page": 
		$("div.material.selected", self.element).removeClass("selected");
		$("div.material[page="+evt.value+"]", self.element).addClass("selected").drawable();
		self._scroll_to_page();
		break;
		case "file": 
		self._bring_to_front();
		break;
		case "zoom": 
		self._generate_contents();
		self._generate_selections();
		self._scroll_to_page();
		break;
		case "notes_loaded_for_file":
		case "new_notes":
		self._generate_selections();
		break;
		case "note_hover": 
		//		$("div.selection.selected", self.element).removeClass("selected");
		$("div.selection[id_item="+evt.value+"]", self.element).addClass("selected");
		break;
		case "note_out":
		$("div.selection[id_item="+evt.value+"]", self.element).removeClass("selected");
		break;
		case "visibility":
		let fct = evt.value ? "show":"hide";
		$("div.selections, self.element")[fct]();
		break;
		case "global_editor": 
		let $editor = $("<div/>");
		$("div.global-editors", this.element).append($editor);
		$editor.editor();
		break;
		case "sel_click": 
		// is it second time we click on this selection ?
		if (self._getData("last_clicked_selection")==evt.value){
		    // then send to back
		    //console.log("sendign to back");
		    let original = $("div.selection[id_item="+evt.value+"]", self.element);
		    let parent = original.parent();
		    let clone = original.clone(true);
		    original.remove();

		    //		    parent.prepend(clone.removeClass("selected"));
		    parent.prepend(clone);
		    $.concierge.trigger({type:"note_out", value: evt.value});

		    //		    console.log("done");

		    
		}
		self._setData("last_clicked_selection", evt.value);
		break;
		case "note_click": 
		let sel = $("div.selection[id_item="+evt.value+"]", self.element);
		if (!(sel.length==0)){
		    let divOffset = self.element.offset().top;
		    let selOffset = sel.offset().top;
		    self._setData("in_page_transition", true); //prevent page change due to the upcoming scrolling
		    self.element.animate({scrollTop: '+=' + (selOffset-divOffset-50) + 'px'}, 200, function(){
			    setTimeout(function(){self._setData("in_page_transition", false);}, 500); 
			    //add an extra 500ms delay to compensate for animate imprecision, or if user moves scrollwheel right after clicking 
			    // this is to be sure we don't trigger a page change as a result of a note click
			});
		}
		
		break;
		}

	    },
	    select: function(){
		let id = this._getData("file");
		if (id && id != $.concierge.get_state("file")){
		    $.concierge.trigger({type:"file", value:this._getData("file") });
		}
	    }, 
	    set_model: function(model){
		let self=this;
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		//build view: 
		let current_file = $.concierge.get_state("file");
		self._setData('file', current_file); 
		self._setData('model', model);
		self.element.addClass("docView").scroll(function(evt){
			if (self._timerID != null){
			    window.clearTimeout(self._timerID);
			    self._timerID = null;
			}
			if (self._getData("in_page_transition")==false){
			    self._timerID = window.setTimeout(function(){
				    let st = evt.currentTarget.scrollTop;
				    let h = self._getData("h");
				    let pbar = (st==0)? 1 :  Math.ceil(st/h);
				    let prem = h-st%h;
				    let area_indicator = (prem-0.5*evt.currentTarget.clientHeight)>0;
				    let pbar_old = self._getData("__pbar_old");
				    if ( (area_indicator != self._getData("area_indicator")) || (pbar!=pbar_old)){
					let newpage = (area_indicator) ?  pbar: pbar+1;
					self._setData("in_page_transition", true); //prevent animation
					$.L("[scroll listener] triggering 'page' to " + newpage);
					$.concierge.trigger({type: "page", value:newpage});
					self._setData("in_page_transition", false);
				    }
				    self._setData("__pbar_old", pbar);
				    self._setData("area_indicator", area_indicator);
				    
				    
				}, 300);
			    
			}
			else{
			    $.L("in page transition...");
			}
		    });
		
		self._generate_contents();
	    },
	    update: function(action, payload, props){
		var self = this;
		$.L("[thumbnailview] TODO updating:, ", action, payload, props);
	    }, 
	    close: function(){
		let id =  this._getData("file");
		delete $.concierge.features["doc_viewer"][id];
		$.ui.view.prototype.close.call(this);
		$.L("closing docviewer",  id);

	    },
	    _scroll_to_page: function(){
		var self = this;
		let st = self.element[0].scrollTop;
		let pbar = Math.ceil((st+0.01)/self._getData("h"));
		let current_page = $.concierge.get_state("page");
		if ((self._getData("in_page_transition")==false) && (pbar != current_page)){
		    self._setData("in_page_transition", true);
		    let divOffset = self.element.offset().top;
		    let imgOffset = 	$("img.material[page="+current_page+"]", self.element).parent().offset().top;
		    self.element.animate({scrollTop: '+=' + (imgOffset-divOffset) + 'px'}, 500, function(){
			    $.L("scroll2page done");
			    self._setData("in_page_transition", false);
			});
		}
		else{
		    $.L("animation to page "+current_page+" prevented, pbar="+pbar);
		}
			
	    },
	    _generate_selections: function(){
		/* 
		 *  unlike generate_contents, we always regenerate the selections, irrespective 
		 *  of whether they were there previously or not
		 */
		let self = this;
		let contents;
		let id_file = self._getData("file") ;
		// use Exhibit DB to find notes for this file: 
		//	    let collection = window.exhibit._collectionMap.collection_notes;
		let collection = window.exhibit._collectionMap.col_loc;
		let db  = collection._database;
		let facet_file = collection._facets[0];
		let facet_page = collection._facets[1];
		facet_file._filter(id_file, "", true);
		let numpages = db._spo["file_"+id_file].numpages[0];
		let note;
		let t,l,w,h, ID;
		let s = self._getData("resolution")* $.concierge.get_state("zoom") * $.concierge.get_constant("scale") /($.concierge.get_constant("RESOLUTION_COORDINATES")*100);

		for (let p=1;p<=numpages;p++){		    
		    contents="";
		    facet_page._filter(p, "", true);
		    for (let id in collection._restrictedItems._hash){
			note = db._spo[id];
			// SACHA FIXME: Sometimes, we get locatons that aren't in current file (every other zoom for instance), so make sure now:
			// this may have to do to the fact that the collections are used somewhere else ? 
			if (note.id_source[0]==id_file){
			    ID=note.ID[0];
			    t=note.top[0]*s;
			    l=note.left[0]*s;
			    w=note.w[0]*s;
			    h=note.h[0]*s;
			    contents+=("<div class='selection' id_item='"+ID+"' style='top: "+t+"px; left: "+l+"px; width: "+w+"px; height: "+h+"px'/>");
			}
		    }
		    $("div.material[page="+p+"]>div.selections",  self.element).html(contents);
		}
		$("div.material>div.selections>div.selection", self.element).mouseover(function(evt){
			let id_item = evt.currentTarget.getAttribute("id_item");
			$.concierge.trigger({type:"note_hover", value: id_item});
		    }).mouseout(function(evt){
			    let id_item=evt.currentTarget.getAttribute("id_item");
			    $.concierge.trigger({type:"note_out", value: id_item});
			}).click(function(evt){
				let id_item=evt.currentTarget.getAttribute("id_item");
				$.concierge.trigger({type:"sel_click", value: id_item});
			    });
		
	    },
	    _generate_links: function(){
		let self = this;
		let contents;
		let id_file = self._getData("file");
		let m = this._getData("model");
		// use our index to find links for this file: 
		let index = m.indexes["file"]["link"][id_file];
		let links = m.o.link;
		let numpages = m.o.file[id_file].numpages;
		let link;
		let s = self._getData("resolution")* $.concierge.get_state("zoom") * $.concierge.get_constant("scale") /($.concierge.get_constant("RESOLUTION_COORDINATES")*100);
		for (let p=1;p<=numpages;p++){		    
		    contents="";
		    for (let id in index){
			link = links[id];
			if (link.page==p){
			    //SACHA continue here !!!
			    ID=note.ID[0];
			    t=note.top[0]*s;
			    l=note.left[0]*s;
			    w=note.w[0]*s;
			    h=note.h[0]*s;
			    contents+=("<div class='selection' id_item='"+ID+"' style='top: "+t+"px; left: "+l+"px; width: "+w+"px; height: "+h+"px'/>");
			}
		    }
		    $("div.material[page="+p+"]>div.selections",  self.element).html(contents);
		}
		$("div.material>div.selections>div.selection", self.element).mouseover(function(evt){
			let id_item=evt.currentTarget.getAttribute("id_item");
			$.concierge.trigger({type:"note_hover", value: id_item});
 
		    }).mouseout(function(evt){
			    let id_item=evt.currentTarget.getAttribute("id_item");
			    $.concierge.trigger({type:"note_out", value: id_item});
			}).click(function(evt){
				let id_item=evt.currentTarget.getAttribute("id_item");
				$.concierge.trigger({type:"sel_click", value: id_item});
			    });


		
	    }, 
	    _generate_contents: function(){
		/*
		 * either generates or updates contents
		 * we don't systematically generate it so we can keep the editors, drawables etc...
		 */
		let self = this;
		let contents = "<div class='global-editors'><a style='color:#777777;' href='javascript:NB.pers.expandGlobalComments()'><span class='global_comments_cnt'>0</span> global comments</a> <a style='color:#777777; margin-left: 10px;' href='javascript:$.concierge.trigger({type: \"global_editor\", value: true})'>New ...</a></div>";
		let current_file = $.concierge.get_state("file");
		let model = this._getData("model");
		// SACHA TODO: adapt the original resolution to the screen size		
		let res0 = $.concierge.get_constant("res");
		let scale0 = $.concierge.get_constant("scale");
		let width0 = 612; //SACHA: FIXME - should check it's really the case ! 
		let height0 = 792;
		let zoom = $.concierge.get_state("zoom");
		let RESOLUTIONS = $.concierge.get_constant("RESOLUTIONS");
		let res=res0;
		let scale = scale0;
		let candidate_scale = scale;
		let desired_scale = zoom * scale0;
		let resols = [];
		for (scale in RESOLUTIONS[res]){
		    resols.push(parseInt(scale));
		}
		resols.sort(function(a,b){return a-b;});
		candidate_scale = resols[resols.length-1];
		for (let i=resols.length-1;i>-1;i--){
		    if (resols[i]<desired_scale){
			break;
		    }
		    else{
			candidate_scale=resols[i];
		    }
		}
		scale=candidate_scale;
		//		$.L("selected scale: ", scale);
		self._setData("resolution", res0);
		self._setData("scale", scale);
		let w = parseInt(width0*zoom);
		let h = parseInt(height0*zoom);
		self._setData("h", h+15); //SACHA: FIXME: 15pixels correpoding to margins shouldn't be hard-encoded
		let src="";


		if ($(">div.contents>div.material", self.element).length==0){ // material never generated
		    for (let i=1;i<=model.o.file[current_file].numpages;i++){
			src = "/pdf/cache2/"+res+"/"+scale+"/"+current_file+"?page="+i;
			style = "width: "+w+"px;height: "+h+"px";
			contents+="<div class='material'  page='"+i+"' style='"+style+"' ><div class='selections'/><div class='links'/><img class='material' page='"+i+"' src='"+src+"'/></div>";
		    }
		    $("div.contents", self.element).html(contents);
		    $("div.material", self.element).click(function(evt){
			    let numpage = evt.currentTarget.getAttribute("page");
			    if (numpage != $.concierge.get_state("page")){
				self._setData("in_page_transition", true); //prevent animation
				$.concierge.trigger({type: "page", value:evt.currentTarget.getAttribute("page")});
				self._setData("in_page_transition", false);
			    }
			});
		}
		else{ //update existing contents: 
		    $(">div.contents>div.material", self.element).each(function(j){
			    let $this = $(this);
			    let i = $this.attr("page");
			    src = "/pdf/cache2/"+res+"/"+scale+"/"+current_file+"?page="+i;
			    style = "width: "+w+"px;height: "+h+"px";
			    $this.attr("style", style);
			    $this.children("img.material").attr("src", src);
			});
		}
	    }
	});
			 
    $.widget("ui.docView",V_OBJ );
    $.ui.docView.defaults = $.extend({}, {});
    $.extend($.ui.docView, {
	    defaults: {
		img_server: "http://localhost", 
		provides: ["doc"], 
		    listens: {
		    file:null, 
			page:null, 
			zoom: null, 
			notes_loaded_for_file: null, 
			new_notes: null, 
			note_hover: null, 
			note_out: null, 
			visibility: null, 
			global_editor: null, 
			sel_click: null, 
			note_click: null

			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
