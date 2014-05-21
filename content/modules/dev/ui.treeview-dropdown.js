/* treeView Plugin
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
/*global jQuery:true*/
(function($) {
    var V_OBJ = $.extend({}, $.ui.view.prototype, {
            _create: function() {
                $.ui.view.prototype._create.call(this);
                var self    = this;
                self._model    = null;
                self._selection = {};
                self._admin    = self.options.admin;
                //insert both dropdown and tree for now, as siblings
                // self.element.css("overflow-y", "auto").html("<div class='tree'></div><div class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' href='#'></a><ul class='dropdown-menu'></ul></div>");
                self.element.html("<div class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' href='#'></a><ul class='dropdown-menu'></ul></div>");

            },
            _defaultHandler: function(evt){
                var self = this;
                // var tree;
                var dropdown;
                // by default we listen to events directed to everyone
            //     switch (evt.type){
            //         case "ensemble":
            //             tree = $("div.jstree");
            //             if (self._selection.rel !== "ensemble" || self._selection.id_item !== evt.value){
            //                 tree.jstree("deselect_all");
            //                 tree.jstree("select_node", $("li[rel=ensemble][id_item="+evt.value+"]"));
            //             }
            //             if (self._selection.rel !== "ensemble" || self._selection.id_item !== evt.value){
            //                 tree.jstree("deselect_all");
            //                 tree.jstree("select_node", $("li[rel=ensemble][id_item="+evt.value+"]"));
            //             }
            //             break;
            //         case "folder": 
            //              tree = $("div.jstree");
            //             if (self._selection.rel !== "folder" || self._selection.id_item !== evt.value){
            //                 tree.jstree("deselect_all");
            //                 tree.jstree("select_node", $("li[rel=folder][id_item="+evt.value+"]"));
            //             }
            //             break;
            //         case "file":
            //             tree = $("div.jstree");
            //             if (self._selection.rel !== "file" || self._selection.id_item !== evt.value){
            //                 tree.jstree("deselect_all");
            //                 tree.jstree("select_node", $("li[rel=file][id_item="+evt.value+"]"));
            //             }
            //             break;
            //     }
            },
            set_model: function(model){
                var self=this;
                self._model =  model;
                model.register($.ui.view.prototype.get_adapter.call(this),  {folder: null, ensemble: null});    
                self._render();
            }, 
            _render: function(){
                var self = this;
                var model = self._model;
                //build view: 
                var params =  self.options.admin ? {admin: true} : {};
                var ensemble = model.get("ensemble", params).items;
                var data = [];
                var data_dropdown = "";
                var subfolders = null;
                var subfiles = null;
                var children = null;
                var s_numfiles = null;
                var qry = null;
                for (var i in ensemble){
                    //adds class to dropdown
                    data_dropdown += ("<li><a href='#' data-rel='ensemble' data-id=" + i + ">" + $.E(ensemble[i].name) + "</a></li>");
                }

                //insert folders into dropdown
                $("ul.dropdown-menu").append(data_dropdown);
                $("ul.dropdown-menu").append("<li><a href='#' data-id='' data-rel=''>All files</a></li>");
                $("a.dropdown-toggle").append("Home");

                //TODO (carolynz): bug where creating a new class appends home again -- figure out way to fix!
                //_render gets re-called frequently -- can't just keep appending items to the dropdown

                // trigger class selection / fileview change
                $("ul.dropdown-menu > li > a").on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    $("div.dropdown").removeClass("open");

                    var id_item = $(e.target).attr("data-id");
                    var rel = $(e.target).attr("data-rel");
                    
                    var id_changed = true;

                    //if selected same class as current class, do nothing?
                    if (self._selection && self._selection.id_item) {
                        id_changed = (id_item !== self._selection.id_item);
                    }

                    if (id_changed) {
                        // TODO (carolynz): add notifications div later
                        $("a.dropdown-toggle").html($(e.target).text());

                        self._selection =  {rel: rel, id_item: id_item};

                        if (self.options.callbacks[rel]) {
                            (self.options.callbacks[rel])({type: rel, value:id_item});
                        } else {
                            $.concierge.trigger({type:rel, value:id_item});
                        }
                    }
                });

            },

            update: function(action, payload, items_fieldname){
                if (action === "add" || action === "remove"){
                    this._render();
                }
            }
        });
    
    //what does this do??         
    $.widget("ui.treeView",V_OBJ );
    $.ui.treeView.prototype.options = {
        listens: {
            hello:null, folder: null, ensemble: null, file: null
        },
        admin: true, 
        filestats: false,
        showfiles: false,
        callbacks: {
          folder: null, ensemble: null, file: null
        }
    };
})(jQuery);
