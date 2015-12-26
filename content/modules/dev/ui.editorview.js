/* editorview Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true NB$:true*/
/*global console:false*/

(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var FILETYPES = {TYPE_PDF: 1, TYPE_YOUTUBE: 2, TYPE_HTML5VIDEO: 3, TYPE_HTML5: 4};
    var V_OBJ = $.extend({},$.ui.view.prototype,{
            _create: function() {
                $.ui.view.prototype._create.call(this);
                var self = this;
                var O        = self.options;
                self._allowStaffOnly = O.allowStaffOnly;
                self._allowAnonymous = O.allowAnonymous;
            }, 
            _defaultHandler: function(evt){
                var self        = this;
                var model        = self._model;
                var me            = $.concierge.get_component("get_userinfo")();
                var guest_msg    = "<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to post a reply...</span>";
                var id_item, draft, drafts;
                console.log("Editor Event: "+evt.type);
                switch (evt.type){
                case "new_thread":
                    if (me.guest === 1){
                        $.I("<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
                        return;
                    }

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    //TODO: if existting draft, sync its content w/ its model
                    //now create new draft: 
                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = false;
                    self._inReplyTo        = 0 ;
                    self._selection        = evt.value.selection;
                    self._html5range    = evt.value.html5range; 
                    self._sel        = null;
                    self._note        = null;
                    model.add("draft", drafts);
                    self._render(id_item, evt.value.suppressFocus);
                    break;
                case "reply_thread": 
                    if (me.guest === 1){
                        $.I("<span>You need to <a href='javascript:"+$str+".concierge.get_component(\"register_user_menu\")()'>register</a>  or  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login</a> in order to write annotations...</span>", true, 10000);
                        return;
                    }

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = false;
                    self._inReplyTo        = evt.value;
                    self._selection        = null;
                    self._sel        = null;
                    self._note        = model.o.comment[evt.value];
                    model.add("draft", drafts);
                    self._render(id_item);    
                    break;
                case "edit_thread": 

                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length > 0) {
                            $.I("You have an active comment being authored right now. If you want to create a new one, please either save or cancel this draft.");
                            return;
                        } else {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }

                    id_item        = (new Date()).getTime();
                    draft        = {};
                    draft[id_item]        = id_item;
                    drafts            = {};
                    drafts[id_item]        = draft;
                    self._doEdit        = true;
                    self._inReplyTo        = 0 ;
                    self._selection        = null;
                    self._sel        = null;
                    self._note        = model.o.comment[evt.value];
                    model.add("draft", drafts);
                    self._render(id_item);    
                    break;
                case "focus_thread":
                    // We assume the thread is already rendered, we simply focus
                    $("textarea", self.element).focus();
                    break;
                case "discard_if_empty":
                    // only allow one current editor if draft is not empty
                    if (self.element.children().length){
                        if ($("textarea", self.element).val().length === 0) {
                            $("button[action=discard]", self.element).click(); // HACK: get f_discard to work from our scope.
                        }
                    }
                    break;
                }
            },
            _render: function(id_item, suppress_focus){
                var self        = this;
                var model        = self._model;
                self.element.trigger("restore");
                //Various ways to create a selection
                if (self._selection){ //editor connected to a location
                    self._sel = self._selection.clone();
                }
                else if (self._inReplyTo){ //
            
                }
    
                //TODO: maybe other case to see if we should create selection from draft

                //Now construct the editor. 
                var timeout_save_button;
                var timeout_func = function(self) { $("button[action=save]", self.element).removeAttr("disabled"); };

                var f_cleanup = function(){
                    window.clearTimeout(timeout_save_button);
                    self.element.trigger("before_cleanup", true);
                    self.element.trigger("minimize");
                    self.element.empty();
                    model.remove("draft", id_item);
                    if (self._sel){
                        self._sel.remove();
                    }            
                };
                var staffoption    = self._allowStaffOnly ? "<option value='2'>Instructors and TAs</option>" : " ";
                var signoption    = self._allowAnonymous ? "<span id='signoption' title=\"check to keep this comment anonymous to other students\"><input type='checkbox' id='checkbox_sign' value='anonymous'/><label for='checkbox_sign'>Anonymous to students</label></div>": " ";
                var questionoption = self._doEdit ? " " : "<span><input type='checkbox' id='checkbox_question' value='question'/><label for='checkbox_question'>Reply Requested</label></span><br/> ";
                var checkbox_options = questionoption+signoption;
                var header    = self._inReplyTo ? "Re: "+$.E($.ellipsis(self._note.body, 100)) : "New note...";

                var contents = $([
                                  "<div class='editor-header'>",header,"</div><div class='notebox'><div class='notebox-body'><div><a class='ui-view-tab-close ui-corner-all ui-view-semiopaque' role='button' href='#'><span class='ui-icon ui-icon-close'></span></a></div><textarea/><br/></div><div class='editor-footer'><table class='editorcontrols'><tr><td class='group'><label for='share_to'>Shared&nbsp;with:&nbsp;</label><select id='share_to' name='vis_", id_item, "'><option value='3'>The entire class</option>", staffoption, 
                                  "<option value='1'>Myself only</option></select><br/>"+checkbox_options+"</td><td class='save-cancel'><button action='save' >Submit</button><button action='discard' >Cancel</button></td></tr><tr><td><label for='tag'>Select user to tag</label><select name='tag' id='tag'><option selected='selected'>--Select User--</option></select></td><td><table id='current_tags'></table></td></tr> </table></div></div>"].join(""));
                self.element.append(contents);
                $("a[role='button']", self.element).click(f_cleanup).hover(function(e){$(this).addClass('ui-state-hover').removeClass('ui-view-semiopaque');},function(e){$(this).removeClass('ui-state-hover').addClass('ui-view-semiopaque');} );
                var $textarea = $("textarea", self.element).keypress(function(e){
                        if(e.keyCode === 27 && this.value.length === 0){
                            f_cleanup();
                        }
                    });
                $textarea.css('minHeight', $textarea.height() + self.element.height() - $("div.notebox", self.element).height() - 42);
                var f_sel = function(evt, ui){
                    $.L("sel has moved to", self._sel.width(), "x",  self._sel.height(), "+" ,  self._sel.css("left"), "+", self._sel.css("top"));
                };

                var f_discard = function(evt){
                    f_cleanup();
                    $.concierge.trigger({type:"editor_delete", value: ""});
                };
                var f_on_save = function(payload){
                    model.add("comment", payload["comments"]);
                    model.add("threadmark", payload["threadmarks"]);

                    if ("html5locations" in payload){
                        model.add("html5location", payload["html5locations"]);
                    }

                    //important to add location even when edit or reply since it can change styling (if adding private comment etc...)
                    if ("locations" in payload){
                        model.add("location", payload["locations"]);
                    }
                    else{
                        var id_comment; for (id_comment in payload["comments"]){break;}
                        var id_loc = model.o.comment[id_comment]["ID_location"];
                        if (id_loc in model.o.location){
                            var locs = {};
                            locs[id_loc] = model.o.location[id_loc];
                            model.add("location", locs);
                        }
                    }
                    f_cleanup();
                };
                var f_save = function(evt){
                    $("button[action=save]", self.element).attr("disabled", "disabled");
                    timeout_save_button = window.setTimeout(function() { timeout_func(self); } , 3000);
                    $.concierge.trigger({type: "editor_prepare", value: 0});
                    var msg = {
                        type: $("select[name=vis_"+id_item+"]", self.element).val(),
                        body:  $("textarea", self.element)[0].value,            
                        signed: self._allowAnonymous ? $("input[value=anonymous]:not(:checked)", self.element).length : 1,
                        marks: {}
                    };
                    
                    
                    if ($("input[value=question]:checked", self.element).length){
                        msg.marks.question = true;
                    }
                    var component_name;
                    if (!(self._note)){ //new note, local or global
                        var file = model.o.file[self._file], s_inv, fudge, drawingarea, s_inv_w, s_inv_h;
                        msg.id_ensemble =file.ID_ensemble;
                        msg.id_source=self._file;
                        switch (file.filetype){
                        case FILETYPES.TYPE_PDF: 
                            s_inv =        100*$.concierge.get_constant("RESOLUTION_COORDINATES") / ($.concierge.get_constant("res")*$.concierge.get_state("scale")+0.0);
                            fudge = (file.rotation === 90 || file.rotation === 270 ? file.h : file.w)/612.0;
                            s_inv = s_inv/fudge;
                            msg.top = self._sel ? s_inv*parseInt(self._sel.css("top"), 10):0;
                            msg.left= self._sel ? s_inv*parseInt(self._sel.css("left"), 10):0;
                            msg.w =  self._sel ? s_inv*self._sel.width():0;
                            msg.h =  self._sel ? s_inv*self._sel.height():0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= self._sel ? self._sel.parent().attr("page"):0;
                            break;
                        case FILETYPES.TYPE_HTML5: 
                            msg.top = self._html5range.apparent_height;
                            msg.left= 0;
                            msg.w = 0;
                            msg.h = 0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= 1;
                            delete self._html5range.apparent_height;
                            msg.html5range = self._html5range;
                            break;
                        case FILETYPES.TYPE_HTML5VIDEO:
                            throw "editorview: HTML5VIDEO not implemented";
                        case FILETYPES.TYPE_YOUTUBE:
                            drawingarea = self._sel.parent();
			    var durationBox = drawingarea.parent().parent().find("#durationInput")[0];
                            s_inv_w = 1000.0/drawingarea.width();
                            s_inv_h = 1000.0/drawingarea.height();
                            msg.top = self._sel ? s_inv_h*parseInt(self._sel.css("top"), 10):0;
                            msg.left= self._sel ? s_inv_w*parseInt(self._sel.css("left"), 10):0;
                            msg.w =  self._sel ? s_inv_w*self._sel.width():0;
                            msg.h =  self._sel ? s_inv_h*self._sel.height():0;
                            msg.x0= 0;
                            msg.y0= 0;
                            msg.page= self._sel ? drawingarea.attr("page"):0;
			    msg.duration = self._sel ? parseInt(durationBox.value):0;
                            break;
                        }
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
                    // Make annotation box resizable
                    self._sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").resizable().appendTo(p).draggable({drag: f_sel, containment: 'parent' });
                    //animate transition so user understands that the editor is connected to the selection
                    self._sel.effect("transfer",{to: self.element} , 500);
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

                if (suppress_focus !== true || typeof suppress_focus === 'undefined') {
                    $("textarea", self.element).focus();
                }
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
            focus_thread: null,
            discard_if_empty: null
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
