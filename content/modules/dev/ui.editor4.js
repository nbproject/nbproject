/* Editor Plugin
 * Depends:
 *    ui.core.js

Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

(function($) {
    /*
     * The editor object
     * PRE: 
     *    Has an ancestor that's a view for which set_model has been called 
     *  ...so we can get the model.
     */
    var V_OBJ = {
    _init: function() {
        var self        = this;
        var O        = self.options;
        var id_item        = (new Date()).getTime();
        self.element[0].id    = id_item;
        var sel        = null;
        var id_source    = O.id_source || $.concierge.get_state("file");
        var model        = O.model;
        var draft        = {}; //SACHA TODO: only create this if there's no current draft...
        draft[id_item]    = {widget: this};
        model.add("draft", draft);

        //Various ways to create a selection
        if (O.selection){ //editor connected to a location
        var h = O.selection;
            sel = h.clone();
        h.hide();
        }
        else if (self.options.doReply){ //

        }
        //TODO: maybe other case to see if we should create selection from draft

        //Now construct the editor. 
        var answerplease_opt = " ";
        if(O.doEdit && O.note.ID in model.o.mark){
        var mark = model.o.mark[O.note.ID];
        if (mark.answerplease == 1){
            answerplease_opt = " checked='checked' ";
        }
        }
        var staffoption    = O.allowStaffOnly ? " <td>Instructors and TAs</td></tr><tr><td><input type='radio' name='vis_"+id_item+"' value='1'/></td> " : " ";
        var signoption    = O.allowAnonymous ? "<tr><td><input type='checkbox' value='signed'/></td><td>Sign</td></tr>": " ";
        var header        = O.inReplyTo ? "<div class='editor-header'>Re: "+$.E($.ellipsis(model.o.comment[O.inReplyTo].body, 20))+"</div>" : " ";
        var contents = $([
                  "<div class='notebox-body'>", 
                  header,
                  "<textarea   rows='7' cols='40'/><br/></div> <div class='editor-footer'><table class='editorcontrols'><tr><td class='tablecontrols'><table><tr> <td><input type='radio' checked='checked' name='vis_", 
                  id_item, 
                  "' value='3' /></td><td>The entire class</td></tr><tr><td><input type='radio' name='vis_", 
                  id_item, "' value='2'/></td>      ", 
                  staffoption, 
                  "<td>Myself only</td></tr></table></td><td class='tablecontrols'><table><tr><td><input type='checkbox' ", 
                  answerplease_opt, 
                  " value='answerplease'/></td><td><span class='editor-answerplease'>Reply Requested</span></td></tr>", 
                  signoption, 
                  "</table></td></tr></table> <table class='editorcontrols'> <tr><td> <button action='discard' >Discard</button></td><td><button action='save' >Save</button></td></tr> </table></div>"].join(""));
        self.element.append(contents);
        //TODO: Position the editor so that it's visible on-screen. 

        var f_sel = function(evt, ui){
        self.element.css({top: (parseInt(sel.css("top"))+sel.height())+"px", left:  sel.css("left")});
        }
        var f_cleanup = function(){
        self.element.trigger("before_cleanup", true);
        self.element.remove();
        model.remove("draft", id_item);
        if (sel){
            sel.remove();
        }
        }
        var f_discard = function(evt){
        f_cleanup();
        };
        var f_on_save = function(payload){
        model.add("comment", payload["comments"]);
        model.add("mark", payload["marks"]);
        if (!(O.note)){ //not an edit: store location
            model.add("location", payload["locations"]);
            }
        //$.concierge.trigger({type:"new_notes",value:id_item} );
        f_cleanup();
        };
        var f_save = function(evt){
        var id_ensemble = model.o.file[id_source].ID_ensemble;
        var msg = {
            type: $("input[name=vis_"+id_item+"]:checked", self.element)[0].value,
            body:  $("textarea", self.element)[0].value,
            id_ensemble: id_ensemble, 
            signed: O.allowAnonymous ? $("input[value=signed]:checked", self.element).length : 1,
            marks: {
            answerplease: $("input[value=answerplease]:checked", self.element).length ? "answerplease": ""
            }
        };
        var component_name;
        if (!(O.note)){ //new note, local or global
            var s_inv =        100*$.concierge.get_constant("RESOLUTION_COORDINATES") / ($.concierge.get_constant("res")*$.concierge.get_state("scale")+0.0);
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
            msg.id_location = O.note.ID_location;
            if  (O.doEdit){
            msg.id_comment = O.note.ID;
            component_name =  "note_editor";
            }
            else{
            msg.id_parent = O.note.ID;
            component_name =  "note_creator";
            }
        }
        $.concierge.get_component(component_name)(msg, f_on_save);
        };
        $("button[action=save]",self.element).click(f_save);
        $("button[action=discard]",self.element).click(f_discard);
        if (sel){
        var p = O.selection.parent();
        sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").appendTo(p).draggable({drag: f_sel, containment: 'parent' });
        var y0 = parseInt(sel.css("top"))+sel.height();
        self.element.addClass("floating-editor").mousedown(function(evt){evt.stopPropagation()}).css({"top":y0+"px", "left": sel.css("left")});
        }        
        self.element.addClass("editor")

        //if editing: fill in w/ exising values. 
        if (O.doEdit){
        $("textarea", self.element)[0].value = O.note.body;
        $("input[name=vis_"+id_item+"]:checked", self.element).removeAttr("checked");
        $("input[name=vis_"+id_item+"][value="+O.note.id_type+"]", self.element).attr("checked", "checked");
        if (!(O.note.signed)){
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
            selection: null, 
            doReply: false, 
            model: null, 
            allowAnonymous: false, 
            allowStaffOnly: false
            },
         getter: "",
                 });
    
})(jQuery);
