/* Editor Plugin
 * Depends:
 *	ui.core.js

Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    /*
     * The editor object
     * PRE: 
     *	Has an ancestor that's a view for which set_model has been called 
     *  ...so we can get the model.
     */
    var V_OBJ = {
	_init: function() {
	    var self = this;
	    let id_item = (new Date()).getTime();
	    self.element[0].id = id_item;
	    let sel = null;
	    let id_source =  self.options.id_source || $.concierge.get_state("file");
	    let closestView =  self.element.closest(".view"); 
	    //SACHA FIXME:  HACK to find a parent view even when there's none
	    let parentView;
	    if (closestView.length>0){
		parentView =  $.concierge.views[closestView[0].id];
	    }
	    else{
		//pick up the 1st view that has a model
		for (let i in  $.concierge.views){
		    if (!($.concierge.views[i]._getData('model') === undefined)){
			parentView = $.concierge.views[i];
			break;
		    }
		}
	    }
	    //	    let parentView = $.concierge.views[ self.element.closest(".view")[0].id];
	    
	    let model = parentView._getData('model');
	    if (self.options.selection){//editor connected to a location
		let h = self.options.selection;
	        sel = h.clone();
		h.hide();
	    }
	    let answerplease_opt = " ";
	    if(self.options.doEdit && self.options.note.ID in model.o.mark){
		let mark = model.o.mark[self.options.note.ID];
		if (mark.answerplease == 1){
		    answerplease_opt = " checked='checked' ";
		}
	    }

	    let contents = $("<div class='notebox-body'><textarea   rows='7' cols='25'/><br/></div> <div class='editor-footer'><table class='editorcontrols'><tr><td class='tablecontrols'><table><tr> <td><input type='radio' checked='checked' name='vis_"+id_item+"' value='3' /></td>               <td>Class</td></tr><tr><td><input type='radio' name='vis_"+id_item+"' value='2'/></td>       <td>Staff</td></tr><tr><td><input type='radio' name='vis_"+id_item+"' value='1'/></td> <td>Myself</td></tr></table></td><td class='tablecontrols'><table><tr><td><input type='checkbox' "+answerplease_opt+" value='answerplease'/></td><td><span class='editor-answerplease'>Reply Requested</span></td></tr><tr><td><input type='checkbox' value='signed'/></td><td>Sign</td></tr></table></td></tr></table> <table class='editorcontrols'> <tr><td> <div class='button' action='discard' >Discard</div></td><td><div class='button' action='save' >Save</div></td></tr> </table></div>");
	    self.element.append(contents);
	    let f_sel = function(evt, ui){
		self.element.css({top: (parseInt(sel.css("top"))+sel.height())+"px", left:  sel.css("left")});
	    }
	    let f_cleanup = function(){
		self.element.trigger("before_cleanup", true);
		self.element.remove();
		if (sel){
		    sel.remove();
		}
	    }
	    let f_discard = function(evt){
		f_cleanup();
	    };
	    let f_on_save = function(payload){
		model.add("comment", payload["comments"]);
		model.add("mark", payload["marks"]);
		if (!(self.options.note)){ //not an edit: store location
			model.add("location", payload["locations"]);
		    }
		$.concierge.trigger({type:"new_notes",value:id_item} );
		f_cleanup();
	    };
	    let f_save = function(evt){
		let id_ensemble = model.o.file[id_source].ID_ensemble;
		let msg = {
		    type: $("input[name=vis_"+id_item+"]:checked", self.element)[0].value,
		    body:  $("textarea", self.element)[0].value,
		    id_ensemble: id_ensemble, 
		    signed: $("input[value=signed]:checked", self.element).length,
		    marks: {
			answerplease: $("input[value=answerplease]:checked", self.element).length ? "answerplease": ""
		    }
		};
		let component_name;
		if (!(self.options.note)){ //new note, local or global
		    let resolution = parentView._getData("resolution");
		    let s_inv = 	   100*$.concierge.get_constant("RESOLUTION_COORDINATES") / (resolution* $.concierge.get_state("zoom") * $.concierge.get_constant("scale"));
		    msg.top = sel ? s_inv*parseInt(sel.css("top")):0;
		    msg.left= sel ? s_inv*parseInt(sel.css("left")):0;
		    msg.w =  sel ? s_inv*sel.width():0;
		    msg.h =  sel ? s_inv*sel.height():0;
		    msg.x0= 0;
		    msg.y0= 0;
		    msg.page= sel ? self.element.parent().attr("page"):0;
		    msg.id_source=id_source;
		    component_name =  "note_creator";
		}
		else{ //reply or edit
		    msg.id_location = self.options.note.ID_location;
		    if  (self.options.doEdit){
			msg.id_comment = self.options.note.ID;
			component_name =  "note_editor";
		    }
		    else{
			msg.id_parent = self.options.note.ID;
			component_name =  "note_creator";
		    }
		}
		$.concierge.get_component(component_name)(msg, f_on_save);
	    };
	    $("div.button[action=save]",self.element).click(f_save);
	    $("div.button[action=discard]",self.element).click(f_discard);
	    if (sel){
		let p = self.options.selection.parent();
		sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").appendTo(p).draggable({drag: f_sel, containment: 'parent' });
		let y0 = parseInt(sel.css("top"))+sel.height();
		self.element.addClass("floating-editor").mousedown(function(evt){evt.stopPropagation()}).css({"top":y0+"px", "left": sel.css("left")});
	    }	    
	    self.element.addClass("editor")

	    //if editing: fill in w/ exising values. 
	    if (self.options.doEdit){
		$("textarea", self.element)[0].value = self.options.note.body;
		$("input[name=vis_"+id_item+"]:checked", self.element).removeAttr("checked");
		$("input[name=vis_"+id_item+"][value="+self.options.note.id_type+"]", self.element).attr("checked", "checked");
		if (!(self.options.note.signed)){
		    $("input[value=signed]", self.element).removeAttr("checked");
		}
	    }

	    $("textarea", self.element).focus();
	}
    };
    $.widget("ui.editor",V_OBJ );
    
    $.extend($.ui.editor, {
    version: '1.7.2',
		 defaults: {
		id_source: null, 
		    note: null, 
		    doEdit: false, 
		    selection: null},
		 getter: "",
			     });
    
})(jQuery);
