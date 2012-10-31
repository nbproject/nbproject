/* editorview Plugin
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
	    _create: function() {
		$.ui.view.prototype._create.call(this);
		var self = this;
		var O		= self.options;
		self._allowStaffOnly = O.allowStaffOnly;
		self._allowAnonymous = O.allowAnonymous;
		$.mods.declare({
			editorview1: {js: [], css: ["/content/modules/dev/ui.editorview1.css"]}, 
			    });
		$.mods.ready("editorview1", function(){});
	    },
	    _defaultHandler: function(evt){
		var self		= this;
		var model		= self._model;
		var me			= $.concierge.get_component("get_userinfo")();
		var guest_msg	= "<span>You need to <a href='javascript:$.concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:$.concierge.get_component(\"login_user_menu\")()'>login</a> in order to post a reply...</span>";
		switch (evt.type){
		case "new_thread":
		    if (me.guest == 1){
			$.I("<span>You need to <a href='javascript:$.concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:$.concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
			return;
		    }
		    //TMP FIX: only allow one current editor
		    if (self.element.children().length){
			$.I("Only one editor at a time is allowed for now...");
			return;
		    }			
		    //TODO: delete previous draft if empty
		    //TODO: if existting draft, sync its content w/ its model
		    //now create new draft: 
		    var id_item		= (new Date()).getTime();
		    var draft		= {};
		    draft[id_item]		= id_item;
		    var drafts	        = {};
		    drafts[id_item]		= draft;
		    self._doEdit		= false;
		    self._inReplyTo		= 0 ;
		    self._selection		= evt.value.selection;
		    self._sel		= null;
		    self._note		= null;
		    model.add("draft", drafts);
		    self._render(id_item);	
		    break;
		case "reply_thread": 
		    if (me.guest == 1){
			$.I("<span>You need to <a href='javascript:$.concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:$.concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
			return;
		    }
		    //TMP FIX: only allow one current editor
		    if (self.element.children().length){
			$.I("Only one editor at a time is allowed for now...");
			return;
		    }
		    var id_item		= (new Date()).getTime();
		    var draft		= {};
		    draft[id_item]		= id_item;
		    var drafts	        = {};
		    drafts[id_item]		= draft;
		    self._doEdit		= false;
		    self._inReplyTo		= evt.value;
		    self._selection		= null;
		    self._sel		= null;
		    self._note		= model.o.comment[evt.value];
		    model.add("draft", drafts);
		    self._render(id_item);	
		    break;
		case "edit_thread": 
		    //TMP FIX: only allow one current editor
		    if (self.element.children().length){
			$.I("Only one editor at a time is allowed for now...");
			return;
		    }
		    var id_item		= (new Date()).getTime();
		    var draft		= {};
		    draft[id_item]		= id_item;
		    var drafts	        = {};
		    drafts[id_item]		= draft;
		    self._doEdit		= true;
		    self._inReplyTo		= 0 ;
		    self._selection		= null;
		    self._sel		= null;
		    self._note		= model.o.comment[evt.value];
		    model.add("draft", drafts);
		    self._render(id_item);	
		    break;
		}	
	    },
	    _render: function(id_item){
		var self		= this;
		var model		= self._model;
		self.element.trigger("restore");
		//Various ways to create a selection
		if (self._selection){ //editor connected to a location
		    self._sel = self._selection.clone();
		}
		else if (self._inReplyTo){ //
		    
		}
	
		//TODO: maybe other case to see if we should create selection from draft

		//Now construct the editor. 
		var answerplease_opt = " ";
		if(self._doEdit && self._note.ID in model.o.mark){
		    var mark = model.o.mark[self._note.ID];
		    if (mark.answerplease == 1){
			answerplease_opt = " checked='checked' ";
		    }
		}
		var f_cleanup = function(){
		    self.element.trigger("before_cleanup", true);
		    self.element.trigger("minimize");
		    self.element.empty();
		    model.remove("draft", id_item);
		    if (self._sel){
			self._sel.remove();
		    }		    
		}
		var staffoption	= self._allowStaffOnly ? "<tr><td><input type='radio' name='vis_"+id_item+"' value='2'/></td><td>Instructors and TAs</td></tr>" : " ";
		var signoption	= self._allowAnonymous ? "<span id='signoption' title=\"check to keep this comment anonymous to other students\"><input type='checkbox' id='checkbox_sign' value='anonymous'/><label for='checkbox_sign'>Anonymous to students</label></span>": " ";
		var questionoption = self._doEdit ? " " : "<span><input type='checkbox' id='checkbox_question' value='question'/><label for='checkbox_question'>Reply Requested</label></span> ";
		var checkbox_options = "<div class='editor_checkbox_options'>"+questionoption+signoption+"</div>";
		var header	= self._inReplyTo ? "Re: "+$.E($.ellipsis(self._note.body, 20)) : "New note...";
		//		var body	= self._doEdit ? self._note.body : "";
		var contents = $([
				  "<div class='notebox'><div class='notebox-body'><div><!--<input type='checkbox' id='checkbox_answerplease'", 
				  answerplease_opt, 
				  " value='answerplease'/><label for='checkbox_answerplease'>Question</label>--><a class='ui-view-tab-close ui-corner-all ui-view-semiopaque' role='button' href='#'><span class='ui-icon ui-icon-close'></span></a></div><div class='editor-header'>", 
				  header,
				  "</div><textarea/><br/></div> <div class='editor-footer'><table class='editorcontrols'><tr><td class='tablecontrols'><table><tr> <td><input type='radio' checked='checked' name='vis_", 
				  id_item, 
				  "' value='3' /></td><td>The entire class</td></tr>", staffoption, 
				  "<tr><td><input type='radio' name='vis_"+id_item+"' value='1'/></td><td>Myself only</td></tr></table></td><td>"+checkbox_options+"<button action='save' >Submit</button><button action='discard' >Cancel</button></td></tr> </table></div></div>"].join(""));
		self.element.append(contents);
		$("a[role='button']", self.element).click(f_cleanup).hover(function(e){$(this).addClass('ui-state-hover').removeClass('ui-view-semiopaque');},function(e){$(this).removeClass('ui-state-hover').addClass('ui-view-semiopaque');} );
		var $textarea = $("textarea", self.element).keypress(function(e){
			if(e.keyCode == 27 && this.value.length==0){
			    f_cleanup();
			}
		    }).width(self.element.width()-15);	 
		$textarea.height($textarea.height() + self.element.height() - $("div.notebox", self.element).height()-30);
		var f_sel = function(evt, ui){
		    $.D("sel has moved to", self._sel.width(), "x",  self._sel.height(), "+" ,  self._sel.css("left"), "+", self._sel.css("top"));
		}
		
		var f_discard = function(evt){
		    f_cleanup();
		};
		var f_on_save = function(payload){
		    model.add("comment", payload["comments"]);
		    model.add("threadmark", payload["threadmarks"]);
		    //important to add location even when edit or reply since it can change styling (if adding private comment etc...)
		    if ("locations" in payload){
			model.add("location", payload["locations"]);
		    }
		    else{
			var id_comment; for (id_comment in payload["comments"]){break;}
			id_loc = model.o.comment[id_comment]["ID_location"];
			if (id_loc in model.o.location){
			    var locs = {};
			    locs[id_loc] = model.o.location[id_loc];
			    model.add("location", locs);
			}
		    }
		    f_cleanup();
		};
		var f_save = function(evt){
		    var msg = {
			type: $("input[name=vis_"+id_item+"]:checked", self.element)[0].value,
			body:  $("textarea", self.element)[0].value,			
			signed: self._allowAnonymous ? $("input[value=anonymous]:not(:checked)", self.element).length : 1,
			marks: {}
		    };
		    if ($("input[value=question]:checked", self.element).length){
			msg.marks.question =true;
		    }
		    var component_name;
		    if (!(self._note)){ //new note, local or global
			var s_inv = 	   100*$.concierge.get_constant("RESOLUTION_COORDINATES") / ($.concierge.get_constant("res")*$.concierge.get_state("scale")+0.0);
			var file = model.o.file[self._file];
			var fudge = (file.rotation==90 || file.rotation==270 ? file.h : file.w)/612.0;
			s_inv = s_inv/fudge;
			msg.id_ensemble = model.o.file[self._file].ID_ensemble;
			msg.top = self._sel ? s_inv*parseInt(self._sel.css("top")):0;
			msg.left= self._sel ? s_inv*parseInt(self._sel.css("left")):0;
			msg.w =  self._sel ? s_inv*self._sel.width():0;
			msg.h =  self._sel ? s_inv*self._sel.height():0;
			msg.x0= 0;
			msg.y0= 0;
			msg.page= self._sel ? self._sel.parent().attr("page"):0;
			msg.id_source=self._file;
			component_name =  "note_creator";
		    }
		    else{ //reply or edit
			msg.id_location = self._note.ID_location;
			msg.id_ensemble = model.o.location[msg.id_location].id_ensemble;
			if  (self._doEdit){
			    msg.id_comment = self._note.ID;
			    component_name =  "note_editor";
			}
			else{
			    msg.id_parent = self._note.ID;
			    component_name =  "note_creator";
			}
		    }
		    $.concierge.get_component(component_name)(msg, f_on_save);
		    $.concierge.trigger({type: "editor_saving", value: 0});
		};
		$("button[action=save]",self.element).click(f_save);
		$("button[action=discard]",self.element).click(f_discard);
		if (self._sel){
		    var p = self._selection.parent();
		    self._sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").appendTo(p).draggable({drag: f_sel, containment: 'parent' });
		    //animate transition so user understands that the editor is connected to the selection
		    self._sel.effect("transfer",{to: self.element} , 500);
		    
		    //var y0 = parseInt(self._sel.css("top"))+self._sel.height();
		    //		    self.element.addClass("floating-editor").mousedown(function(evt){evt.stopPropagation()}).css({"top":y0+"px", "left": self._sel.css("left")});
		}	    
		self.element.addClass("editor");

		//if editing: fill in w/ exising values. 
		if (self._doEdit){
		    $("textarea", self.element)[0].value = self._note.body;
		    $("input[name=vis_"+id_item+"]:checked", self.element).removeAttr("checked");
		    $("input[name=vis_"+id_item+"][value="+self._note.type+"]", self.element).attr("checked", "checked");
		    if (self._note.signed){
			$("input[value=anonymous]", self.element).removeAttr("checked");
		    }
		    else{
			$("input[value=anonymous]", self.element).attr("checked", "checked");
		    }
		}		
		$("textarea", self.element).focus();
	    },
	    set_model: function(model){
		var self=this;
		self._model =  model;
		var id_source = $.concierge.get_state("file");
		self._file =  id_source ; 
		// add this to be notified of model events: 
		//model.register($.ui.view.prototype.get_adapter.call(this),  {YOUR_EVENT1: null});
	    },
	    update: function(action, payload, items_fieldname){
	    }
	});
			 
    $.widget("ui.editorview",V_OBJ );
    $.ui.editorview.prototype.options = {
	listens: {
	    new_thread: null, 
	    reply_thread: null, 
	    edit_thread: null,
	},
	id_source: null, 
	note: null, 
	doEdit: false, 
	selection: null, 
	model: null, 
	allowAnonymous: false, 
	allowStaffOnly: false
    };
})(jQuery);
