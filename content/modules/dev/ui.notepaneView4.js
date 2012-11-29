/* Notepanes plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
 *
 *
 * FEATURES PROVIDED: 
 *  - ensembleList
 *  - fileList
 *
 *
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/
(function($) {
    var __VISIBILITY={1:"Myself", 2:"Staff", 3:"Class"};
    var sort2 =  function(a,b){
	return parseInt(a.getAttribute("id_item")) > parseInt(b.getAttribute("id_item")) ? 1 : -1 
    };   
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		self.repaint();
		self.element.addClass("notepaneView");
		self.files_loaded = {}; 
		self.notecontrols = $("#notecontrols-template").clone().removeAttr("id");
		self._setData("lastExpandedLocation", false);
		self._setData("editors", {});
	    },
	    _after_update: function(elt_id){
		let self = this;
		let elt = (elt_id === undefined) ? self.element : $("#"+elt_id);
		let collection = (elt_id === undefined) ?  window.exhibit._collectionMap.collection_notepane_loc :  window.exhibit._collectionMap.collection_notepane_loc0;
		let id_menu  = "contextmenu_notepane";
		let model = self._getData('model');
		let f = model.o.file[ $.concierge.get_state("file")];
		let locations = model.o.location;
		let comments = model.o.comment;
		let gradees = model.o.gradee;
		let seen = model.o.seen;
		let marks = model.o.mark;
		let f_click = function(event){
		    let t = event.currentTarget;
		    let id_item = t.getAttribute("id_item");
		    $.concierge.trigger({type:"note_click", value: id_item});		   
		};
		let f_lens_expand = function(id_item, $t, $p){
		    if ($t == undefined){
			$t = $("div.location-lens[id_item="+id_item+"]>div.location-header");
			$p = $t.parent();
		    }
		    $t.children("div.ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
		    $p.children("div.shortbody").hide();
		    $("div.note-lens", $p).each(function(){
			    let id = this.getAttribute("id_item");
			    let c  = comments[id];
			    let section_msg = (("id_author" in c) && (c.id_author in gradees)) ? "<span class='my-student' title='This student is in my section'>in my section</span> ":" ";
			    let answerplease_msg = (c.n_answerplease>0) ? "<span class='note-indicator "+(((id in marks) && (marks[id].answerplease==1))? "marked1":"")+"'><span>"+c.n_answerplease+"</span><img src='/content/data/icons/png/question_16.png'/></span>" : "";
			    let approve_msg = (c.n_approve>0) ? "<span class='note-indicator "+(((id in marks) && (marks[id].approve==1))? "marked1":"")+"'><span>"+c.n_approve+"</span><img src='/content/data/icons/png/approve_16.png'/></span>" : "";
			    let staff_ok = (c.p == 1) ? " <img src='/content/data/icons/png/approved.png' title='This has been approved by the staff as an authoritative answer'/> ":" ";
			    let favorite_msg = (c.n_favorite>0) ? "<span class='note-indicator "+(((id in marks) && (marks[id].favorite==1))? "marked1":"")+"'><span>"+c.n_favorite+"</span><img src='/content/data/icons/png/favorite_16.png'/></span>" : "";
			    this.innerHTML = "<span class='created'>"+c.created+"</span><span ID='author_email' class='email"+c.signed+" admin"+c.admin+"'>"+c.email+"</span> "+"<br/><a class='optionmenu floatright' href='javascript:void(0)'>options...</a><img src='/content/data/icons/png/type"+c.id_type+"_16.png'/>"+c.vis+section_msg+answerplease_msg+  approve_msg +   favorite_msg +    staff_ok+ "<br/><span class='body'>"+c.body.replace(/\n/g, "<br/>")+"</span><br/>";
			    $("a.optionmenu", this).contextMenu({menu:id_menu, leftButton:true }, f_context) ;
			});
		    $p.children("div.notes-container").show();
		};
		let f_click_header = function(event){
		    let t = event.currentTarget
		    let p = t.parentNode;
		    let $t = $(t);
		    let $p = $(p);
		    let id_item = p.getAttribute("id_item");
		    let l = locations[id_item];
		    if (("expanded" in l) && (l.expanded)){
			l.expanded = false;
			$t.children("div.ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
			$p.children("div.shortbody").show();
			$p.children("div.notes-container").hide();
		    }
		    else{
			l.expanded = true;
			self._setData("lastExpandedLocation", id_item);
			f_lens_expand(id_item, $t, $p);
		    }
		};
		let f_hover = function(event){
		    let id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_hover", value: id_item});
		};
		let f_out = function(event){
		    let id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_out", value: id_item});
		};

		let f_on_option = function(p){
		    model.add_batch({location: p.locations, mark: p.marks, comment: p.comments});
		    $.I("This note has been marked...");
		};
		let f_on_delete = function(p){
		    $.I("Note "+p.id_comment+" has been deleted");
		    model.remove("comment", p.id_comment);
		};
		let f_context =  function(action, el, pos){		    
		    switch (action){
		    case "reply": 
		    self.editorFactory(el);
		    break;
		    case "edit":
		    self.editorFactory(el,true);
		    break;
		    case "delete": 
		    $.concierge.get_component("note_deleter")({id_comment: $(el).closest("div.note-lens").attr("id_item")}, f_on_delete);
		    break;
		    default: 
		    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: action}, f_on_option);
		    }
		};
		let f_overlens=function(event){
		    let t = event.currentTarget;
		    let id_item = t.getAttribute("id_item");
		    let cm =  $("#"+id_menu);
		    if (cm.is(":visible")){ //don't update menu if already visible
			return;
		    }
		    $("li.edit, li.delete", cm).addClass("disabled");
		    let menus = [];
		    if (comments[id_item].email=="Me" && t.nextSibling==null){
			menus.push("li.edit");
			if ( t.nextSibling==null){
			    menus.push("li.delete");
			}
		    }
		    if (!(id_item in seen)){
			seen[id_item] = true;
			$.concierge.logRemote("seen", id_item); //regular update would be too slow
		    }
		    $(menus.join(","), cm).removeClass("disabled");
		    //now checkboxes:
		    $("input", cm).removeAttr("checked");
		    let actions = ["answerplease", "approve", "reject", "favorite", "hide"];		    
		    for (let i in actions){
			let action = actions[i];
			if ((id_item in marks) && (marks[id_item][action]==1)){
			    $("li."+action+ " input", cm)[0].setAttribute("checked", "checked");
			}
		    }
		    if (!(id_item in seen)){
			seen[id_item] = true;
			$.concierge.logRemote("seen", id_item); //regular update would be too slow
		    }
		};
		$("div.location-lens", elt).click(f_click).mouseenter(f_hover).mouseleave(f_out).each(function(i){
			let l = $("div.note-lens", this);
			let p = l.parent();
			l.remove().sort(sort2).appendTo(p).mouseover(f_overlens).contextMenu({"menu":id_menu }, f_context);
		    }).children("div.location-header").click(f_click_header);
		for (let i in collection._restrictedItems._hash){
		    let id_location = i.substring(9);//9=length("location_")
		    if (locations[id_location].expanded){ 
			//SACHA FIXME: Figure out why need to fake 2 clicks instead of one ! 
			f_lens_expand(id_location);
		    }
		}
		
		let lel = self._getData("lastExpandedLocation");
		if (lel){
		    let e = $("div.location-lens[id_item="+lel+"]");
		    if (e.length>0){
			e[0].scrollIntoView();
		    }
		}
		//restore editors if not there: 
		let editors =  self._getData("editors");
		let id_source =  $.concierge.get_state("file");
		let page =  $.concierge.get_state("page");
		if ((id_source in editors) && (page in editors[id_source])){
		    for (let id_comment in editors[id_source][page]){			
			// $.L("time to regenerate editor for comment "+id_comment);
			let note = $("div.note-lens[id_item="+id_comment+"]", self.element).append( editors[id_source][page][id_comment][0]);
			if ("doEdit" in  editors[id_source][page][id_comment][1]){
			    $("span.body",note).hide();
			}
		    }
		}
	    },
	    _defaultHandler: function(evt){
		let self = this;
		switch (evt.type){
		case "page":
		    self.element.fadeOut(300, function(){self.element.fadeIn(500);});
		    let facet = window.exhibit._collectionMap["collection_notepane_loc"]._facets[1];
		    facet._filter(evt.value, "", true);
		    break;
		case "file": 
		    self.element.parent().parent().viewport("smoothSelect", self.element.attr("id")+"-outer");
		    let cmaps = window.exhibit._collectionMap;
		    cmaps.collection_notepane_loc._facets[0]._filter(evt.value, "", true, true); //don't update anything for now (the page event will)
		    cmaps.collection_notepane_loc0._facets[0]._filter(evt.value, "", true);
		    break;
		case "note_hover":
		    $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("selected");
		    break;
		case "note_out": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("selected");		
		    break;
		case "sel_click": 
		    let e = $("div.location-lens[id_item="+evt.value+"]",self.element);
		    if (e.length>0){
			e[0].scrollIntoView();
		    }
		    break;
		}
	    }, 
	    addEditor: function($ed, ed_args){
		let self=this;
		let editors = self._getData("editors");
		let id_source =  $.concierge.get_state("file");
		let page =  $.concierge.get_state("page");
		if (!(id_source in editors)){
		    editors[id_source]={};		    
		}
		if (!(page in editors[id_source])){
		    editors[id_source][page]={};
		}
		editors[id_source][page][ed_args.id_comment]=[$ed, ed_args];
	    },
	    editorFactory: function(el, doEdit){
		//open editor
		let self=this;
		let body  = $("span.body",el);
		let contents = doEdit ? body.text():"";
		let $el = $(el);
		let $note =  $el.closest("div.note-lens");
		let id_comment = $note.attr("id_item");
		let id_item =  (new Date()).getTime();
		let id_source =  $.concierge.get_state("file");
		let $editor = $("<div/>");
		//		$el.append($editor);
		$note.append($editor);

		let ed_args = {note:  self._getData("model").o.comment[id_comment],id_comment: id_comment};
		if (doEdit){
		    body.hide();
		    ed_args.doEdit = true;
		}
		$editor.editor(ed_args);
		self.addEditor($editor, ed_args);
		$editor.bind("before_cleanup", function(){
  			if (doEdit){
			    body.show();
			}
			delete  self._getData("editors")[id_source][$.concierge.get_state("page")][id_comment];
		    });
	    }, 
	    set_model: function(model){
		var self=this;
		this._setData("model", model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		
		$.concierge.get_component("addExhibitListener")({
			id_collection: "collection_notepane_loc", 
			    event_type: "onItemsChanged"}, function(){
			$.L("notes changed");
			self._after_update();
		    });
		$.concierge.get_component("addExhibitListener")({
			id_collection: "collection_notepane_loc0", 
			    event_type: "onItemsChanged"}, function(){
			$.L("global notes changed");
			$("span.global_comments_cnt").text(exhibit._collectionMap.collection_notepane_loc0.countRestrictedItems());
			self._after_update("global_comment_dialog");
		    });
	    },
	    update: function(action, payload, props){
		var self = this;
		$.L("[notepaneview] TODO updating:, ", action, payload, props);
	    }
	});
    $.widget("ui.notepaneView",V_OBJ );
    $.ui.notepaneView.defaults = $.extend({}, {});
    $.extend($.ui.notepaneView, {
	    defaults: {
		provides: ["notepane"], 
		    listens: {
		    file:null, 
			page:null, 
			note_hover: null,
			note_out: null, 
			new_notes: null, 
			notes_loaded_for_file: null,
			sel_click: null
			
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
