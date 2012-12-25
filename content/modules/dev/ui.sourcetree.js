/* View Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
    _init: function() {
        var self = this;
        $.ui.view.prototype._init.call(this);
        self.element.addClass("NB-pdf-sourceTreeView");
    },
    
    update: function(action, payload, items_fieldname){
        var self = this;
        $.L("[sourcetree] updating:, ", action, payload, items_fieldname);
        var model = payload.model;
        var diff = payload.diff;
        var i=0;
        var s="";
        var a;
        var items;
        if (model.type === "ensemble"){
        if (action === "create"){
            items = model.getItems();
            for (i in items){
            a = items[i];
            s += "<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div  class='branchname'>"+a.name+"</div><div class='leaves'/></div>";
            }
            self.element.html(s);
        }
        else if(action === "add"){
            items = diff[items_fieldname];
            for (i=0;i<items.length;i++){
            a = items[i];
            s += "<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div  class='branchname'>"+a.name+"</div><div class='leaves'/></div>";
            }
            self.element.append(s);
        }
        else if(action === "delete"){
            items= diff[items_fieldname];
            for (i=0;i<items.length;i++){
            a = items[i];
            $("#ensemble_"+a.id+"_"+this.id).remove();
            } 
        }
        else if(action === "update"){
            items= diff[items_fieldname];
            for (i=0;i<items.length;i++){
            a = items[i];
            $("#ensemble_"+a.id+"_"+this.id).html("<div class='branch' id_channel='"+a.id+"'    id='ensemble_"+a.id+"_"+this.id+"'><div  class='branchname'>"+a.name+"</div><div class='leaves'/></div>");
            } 
        }
        }
        else if (model.type === "source"){
        if (action === "create" || action === "add"){
            items = model.getItems();
            for (i in items){
            a = items[i];
            s = "<div class='leaf' id='source_" + a.id_source+"_"+this.id+"' page='1' numpages='"+a.numpages+"' numx='"+a.numx+"' numy='"+a.numy+"' id_source='"+a.id_source+"'   >"+a.title+"</div>";
            $("#ensemble_"+a.id_ensemble+"_"+this.id+">.leaves").append(s);
            }
            $("div.leaf", self.element).click(function(evt){
            $.concierge.trigger({
                type: "openDocument",
                uiEvent:evt
            });
            });

        }
        else if(action === "delete"){
            items= diff[items_fieldname];
            for (i=0;i<items.length;i++){
            a = items[i];
            $("#source_"+a.id+"_"+this.id).remove();
            } 
        }
        else if(action === "update"){
            items= diff[items_fieldname];
            for (i=0;i<items.length;i++){
            a = items[i];
            $("#source_"+a.id+"_"+this.id).html("<div class='leaf' id='source_" + a.id_source+"_"+this.id+"' page='1' numpages='"+a.numpages+"' numx='"+a.numx+"' numy='"+a.numy+"' id_source='"+a.id_source+"'>"+a.title+"</div>");
            } 
        }
        }
    }
    });
    $.widget("ui.sourcetree",V_OBJ );
    $.ui.sourcetree.defaults = $.extend({}, {});
    $.extend($.ui.sourcetree, {
    defaults: {provides: ["documentList"]},
          getter:$.ui.view.getter});
})(jQuery);
