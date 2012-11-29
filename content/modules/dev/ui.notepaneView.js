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
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		self.repaint();
		self.element.addClass("notepaneView");
		self.files_loaded = {}; 
		//for dummy: 
		//elf.element.html("<img src='/data/icons/png/proto/notepane.png'/>");
	    },
	    _defaultHandler: function(evt){
		let self = this;
		let id_menu  = "contextmenu_notepane";
		let f = self._getData('model').o.file[ $.concierge.get_state("file")];
		let comments = self._getData('model').o.comment;
		let seen = self._getData('model').o.seen;
		let marks = self._getData('model').o.mark;
		let f_click = function(event){
		    let id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_click", value: id_item});
		};
		let f_hover = function(event){
		    let id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_hover", value: id_item});
		};
		let f_out = function(event){
		    let id_item = event.currentTarget.getAttribute("id_item");
		    $.concierge.trigger({type:"note_out", value: id_item});
		};
		let f_after_update = function(){
		    $("div.location-lens:visible", self.element).click(f_click).mouseover(f_hover).mouseout(f_out).each(function(i){
			    let l = $("div.note-lens", this);
			    let p = l.parent();
			    l.remove().sort(sort1).appendTo(p);
			});
		    $("div.note-lens:visible", self.element).mouseover(f_overlens).contextMenu({"menu":id_menu }, f_context) ;
		    $("span.optionmenu").contextMenu({menu:"contextmenu_notepane", leftButton:true }, f_context) ;

		};
		let f_on_option = function(p){
		    let m = self._getData('model')
		    m.add("mark", p.marks);
		    m.add("comment", p.comments);
		    f_after_update();

		    $.I("This note has been marked...");
		};
		let f_on_delete = function(p){
		    $.I("Note "+p.id_comment+" has been deleted");
		    self._getData('model').remove("comment", p.id_comment);
		};
		let f_context =  function(action, el, pos){
		    switch (action){
		    case "reply": 
		    self.editorFactory(el);
		    break;
		    case "edit":
		    self.editorFactory(el,true);
		    break;
		    case "subscribe": 
		    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "subscribe"}, f_on_option);		    
		    break;
		    case "unsubscribe": 
		    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "unsubscribe"}, f_on_option);		    
		    break;
		    case "answerplease": 
		    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "answerplease"}, f_on_option);
		    break;
		    case "answered": 
		    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "answered"}, f_on_option);
		    break;
		    case "delete": 
		    $.concierge.get_component("note_deleter")({id_comment: $(el).closest("div.note-lens").attr("id_item")}, f_on_delete);
		    break;
		    }
		};
		let sort1=function(a,b){
		    return parseInt(a.getAttribute("id_item")) > parseInt(b.getAttribute("id_item")) ? 1 : -1 
		};
		let f_overlens=function(event){
		    let t = event.currentTarget;
		    let id_item = t.getAttribute("id_item");
		    let cm =  $("#"+id_menu);
		    if (cm.is(":visible")){ //don't update menu if already visible
			return;
		    }
		    $("li", cm).addClass("disabled");
		    let menus = ["li.reply"];
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
		    menus.push((id_item in marks && marks[id_item].subscribe==1)?"li.unsubscribe":"li.subscribe", 
			       (id_item in marks && marks[id_item].answerplease==1)?"li.answered":"li.answerplease"
			       );
		    $(menus.join(","), cm).removeClass("disabled");
		    //TODO: hide and star
		};
	
		switch (evt.type){
		case "page":
		let facet = window.exhibit._collectionMap["collection_notepane_loc"]._facets[1];
		facet._filter(evt.value, "", true);
		facet._filter(0, "", false); //include global comments
		f_after_update();
		break;
		case "new_notes":
		f_after_update();
		break;
		case "file": 
		    self.element.parent().parent().viewport("smoothSelect", self.element.attr("id")+"-outer");
		    window.exhibit._collectionMap["collection_notepane_loc"]._facets[0]._filter(evt.value, "", true);
		break;
		case "note_hover":
		    $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("selected");
		    break;
		case "note_out": 
		    $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("selected");		
		    break;
		case "notes_loaded_for_file": 
		// this fixes a race condition between the "page" event the 1st time a file is loaded and when the notes are in the exbihit db
		
		    f_after_update();
		break;
		case "sel_click": 
		    let e = $("div.location-lens[id_item="+evt.value+"]",self.element);
		    if (e.length>0){
			e[0].scrollIntoView();
		    }
		    break;
		    }
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
		$el.append($editor);
		let ed_args = {note:  self._getData("model").o.comment[id_comment]}
		if (doEdit){
		    body.hide();
		    ed_args.doEdit = true;
		}
		$editor.editor(ed_args);
		$editor.bind("before_cleanup", function(){  
			if (doEdit){
			    body.show();
			}
		    });
	    }, 
	    set_model: function(model){
		this._setData("model", model);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
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
