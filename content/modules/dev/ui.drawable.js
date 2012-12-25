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
            /*
              var o = this.options;
              if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
              return false;

              //Quit if we're not on a valid handle
              this.handle = this._getHandle(event);
              if (!this.handle)
              return false;
            */
            return true;
        },

            _mouseStart: function(event) {

            //        var o = this.options;
            //Call plugins and callbacks
            //        this._trigger("start", event);
            //this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
            //        $.L("mousestart");
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
            //        $.L("mousedrag");
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
            //        $.L("mousestop");
                        this.editorFactory2();

                    //            this.editorFactory();
            return false;
        }, 
                    
            editorFactory2: function(){
            //            var self=this;
            var h = this._getData("helper");
            var $editor = $("<div/>");
            this.element.append($editor);
            $editor.editor({selection: h});
        },        
            editorFactory: function(){
            //open editor
            var self=this;
            var id_item =  (new Date()).getTime();
            var id_source =  $.concierge.get_state("file");
            var h = this._getData("helper");
            var sel = h.clone();
            var parentView = $.concierge.views[ self.element.closest(".view")[0].id];

            h.hide();
            var editor = $("<div  id_item='"+id_item+"' class='editor'  onmousedown='event.stopPropagation();'> <div class='notebox-body'><textarea   rows='7' cols='25'/><br/></div> <div class='editor-footer'><table class='editorcontrols'><tr><td class='tablecontrols'><table><tr> <td><input type='radio' checked='checked' name='vis_"+id_item+"' value='OpenComment' /></td>               <td>Class</td></tr><tr><td><input type='radio' name='vis_"+id_item+"' value='Assignment'/></td>       <td>Staff</td></tr><tr><td><input type='radio' name='vis_"+id_item+"' value='PrivateNote'/></td> <td>Myself</td></tr></table></td><td class='tablecontrols'><table><tr><td><input type='checkbox' checked='checked' value='signed'/></td><td>Sign</td></tr><tr><td><input type='checkbox' value='global'/></td><td>Whole Document</td></tr></table></td></tr></table> <table class='editorcontrols'> <tr><td> <div class='button' action='discard' >Discard</div></td><td><div class='button' action='save' >Save</div></td></tr> </table></div> </div>");
            var f_sel = function(evt, ui){
            //        var id_item = this.getAttribute("id_item");           
            editor.css({top: (parseInt(sel.css("top"))+sel.height())+"px", left:  sel.css("left")});
            }
            var f_cleanup = function(){
            editor.remove();
            sel.remove();
            }
            var f_discard = function(evt){
            f_cleanup();
            };
            var f_on_save = function(payload){
            parentView._getData('model').add("comment", payload["comments"]);
            parentView._getData('model').add("location", payload["locations"]);
            $.concierge.trigger({type:"new_notes",value:id_item} );
            f_cleanup();
            };
            var f_save = function(evt){
            var resolution = parentView._getData("resolution");
            var id_ensemble = parentView._getData("model").o.file[id_source].ID_ensemble;
            var s_inv =        100*$.concierge.get_constant("RESOLUTION_COORDINATES") / (resolution* $.concierge.get_state("zoom") * $.concierge.get_constant("scale"));
            var msg = {
                type: $("input[name=vis_"+id_item+"]:checked", editor)[0].value,
                body:  $("textarea", editor)[0].value,
                top: s_inv*parseInt(sel.css("top")),
                left:  s_inv*parseInt(sel.css("left")),
                w:  s_inv*sel.width(),
                h:  s_inv*sel.height(),
                x0: 0, 
                y0: 0,
                page: editor.parent().attr("page"),
                id_source:id_source,
                id_ensemble: id_ensemble
            };
            $.concierge.get_component("note_creator")(msg, f_on_save);
            };
            $("div.button[action=save]",editor).click(f_save);
            $("div.button[action=discard]",editor).click(f_discard);

            sel.addClass("ui-drawable-selection").removeClass("ui-drawable-helper").appendTo(this.element).draggable({drag: f_sel, containment: 'parent' });
            var y0 = parseInt(sel.css("top"))+sel.height();
            this.element.append(editor.css({"top":y0+"px", "left": sel.css("left")}));
            $("textarea", editor).focus();
        }


        }
        ));

    $.extend($.ui.drawable, {
        version: "1.7.2",
        eventPrefix: "drag",
        defaults: {
        distance: 1
            }
    });

})(jQuery);
