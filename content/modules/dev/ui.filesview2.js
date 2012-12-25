/* filesView Plugin
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

(function($) {
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
        $.ui.view.prototype._create.call(this);
        var self = this;
        self._model        = null;
        self._id_ensemble    = null;
        self._id_folder        = null;
        self._admin        = self.options.admin;
        //VAR splashtext="Please select a class or folder.";
        var splashtext= self._admin ? "<div style='padding: 20px; max-width: 600px'><font face='arial' size='5'>Welcome to the new NB admin interface !  <font color='#ffff00' face='courier new' size='4'><br/><font><span style='background-color: rgb(50, 50, 200);'><i>  under construction...  </i></span></font></font></font><br/><br/><font face='arial'><font size='4'><i>Select a class or a folder to start...</i></font><br/><br/>For now, this interface lets you:  </font><br/><ul style='font-family: Arial;'><li><b>Rename</b> a file , <b>delete </b>a file or <b>upload</b> a new version of a file  (<i>right-click on a file name</i> to see all those options). <br/></li><li><b>Create</b> directories and <b>organize</b> your files in them. For now students won't see any changes if you organize files in directories, but they will see those changes in the upcoming new NB User interface, so it's a good idea to start organizing them...  <br/></li><li><b>Visit</b> the online PDF, <b>download</b> the original PDF and <b>download the annotated pages</b> of the PDF. <br/></li></ul><br/><font face='arial'>This part of NB under active development: features are currently being added. Hence, <b>we need your feedback</b> ! If you think you've found a bug or have a feature request, please let us know by  </font><a href='https://spreadsheets.google.com/ccc?key=0ApEl6D2ioxlBdEktUjg3dm9kbUhGM0hJX1N5ajh4Qnc&amp;hl=en&amp;authkey=CIiPjsIJ' id='llca' style='font-family: Arial;' title='giving your feedback'>giving your feedback</a></div>" : "<div style='padding: 20px; max-width: 600px'><font face='arial' size='5'>Welcome to the new NB interface !  <font color='#ffff00' face='courier new' size='4'><br/><font><span style='background-color: rgb(50, 50, 200);'><i>  [alpha preview]  </i></span></font></font></font><br/><br/><font face='arial'><font size='4'><i>Select a class or a folder to start...</i></font><br/><br/>Put a brief descriprion of what we expect student to do here.  </font><br/><br/><font face='arial'>This part of NB under active development: features are currently being added. Hence, <b>we need your feedback</b> ! If you think you've found a bug or have a feature request, please let us know by  </font><a href='https://spreadsheets.google.com/ccc?key=0ApEl6D2ioxlBdEktUjg3dm9kbUhGM0hJX1N5ajh4Qnc&amp;hl=en&amp;authkey=CIiPjsIJ' id='llca' style='font-family: Arial;' title='giving your feedback'>giving your feedback</a></div>";
        var header    = self._admin ? "<div class='filesView-header'><button action='add_file'>Add file</button> <button action='add_folder'>New folder</button></div>" : "";
        var opts    = self._admin ? "<th>Actions</th>" : "";
        self.element.addClass("filesView").html("<div id='filesview-splash'>"+splashtext+"</div>"+header+"<div class='filesView-files'> <table class='tablesorter'><thead><tr><th>Name</th><th>Download PDF</th>"+opts+"</tr></thead><tbody/></table></div>");

        $("button[action=add_file]", self.element).click(function(){
            $.concierge.get_component("add_file_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
            });
        $("button[action=add_folder]", self.element).click(function(){
            $.concierge.get_component("add_folder_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
            });

        $.mods.declare({
            filesView1: {js: [], css: ["/content/modules/dev/ui.filesview.css"]}, 
                contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
        $.mods.ready("filesView1", function(){});
        $.mods.ready("contextmenu", function(){});
        var contextmenu_items = self._admin ? "<ul id='contextmenu_filesview' class='contextMenu'><li class='rename'><a href='#rename'>Rename</a></li><li class='move'><a href='#move'>Move</a></li><li class='update'><a href='#update'>Update</a></li><li class='delete separator'><a href='#delete'>Delete</a></li></ul>" : "";
        $("body").append(contextmenu_items);
        
        },
        _defaultHandler: function(evt){
        switch (evt.type){
        case "folder": 
        this._id_ensemble    = this._model.o.folder[evt.value].id_ensemble;
        this._id_folder        = evt.value;
        break;
        case "ensemble": 
        this._id_ensemble    = evt.value;
        this._id_folder        = null;
        break;
        }        
        this._render();
        },
        _lens: function(f){
        var opts = this._admin ? "<td><a href='javascript:void(0)' class='optionmenu'>Actions</a></td>" : "" ;
        return $("<tr class='filesview_row' id_item='"+f.ID+"'><td class='filesview_ftitle'><div class='nbicon pdficon'/><a class='aftericon' href='javascript:$.concierge.trigger({type:\"file\", value: "+f.ID+"})'>"+$.E(f.title)+"</a></td><td><a target='_blank' href='"+this.options.img_server+"/pdf/repository/"+f.ID+"?invite_key="+this.options.invite_key+"'>original</a> <a target='_blank' href='"+this.options.img_server+"/pdf/annotated/"+f.ID+"?invite_key="+this.options.invite_key+"'>annotated</a></td>"+opts+"</tr>");
        },         
        _render: function(){        
        var self=this;
        $("#filesview-splash").hide();
        var id_ensemble = self._id_ensemble;
        var id_folder = self._id_folder;
        var model = self._model; 
        var $files = $("tbody", self.element).empty();
        var f;
        var elts = (id_folder==null) ? model.get("file", {id_ensemble: id_ensemble, id_folder: null}) :  model.get("file", {id_folder: id_folder});
        for (var i in elts.items){
            f = model.o.file[i];
            $files.append(self._lens(f));
        }
        $("table.tablesorter", self.element).trigger("update"); 
        //.trigger("sorton", this.options.sort_list);
        var f_context = function(action, el, pos){            
            switch (action){
            case "open": 
            $.concierge.get_component("file_open")({id: el.attr("id_item")});
            //console.log("open", el);
            break;
            default: 
            $.concierge.get_component(action+"_file_menu")({id: el.attr("id_item")});
            break;
            }
        };
        var f_leftcontext = function(action, el, pos){
            f_context(action, el.parent().parent(), pos);
        }
        $("tr.filesview_row", self.element).contextMenu({menu: "contextmenu_filesview"}, f_context);
        $("a.optionmenu", self.element).contextMenu({menu:"contextmenu_filesview", leftButton:true }, f_leftcontext);
        }, 
        set_model: function(model){
        var self=this;
        self._model = model;
        model.register($.ui.view.prototype.get_adapter.call(this),  {file: null, folder: null}); //TODO: put stg here so that we update
        $.mods.declare({tablesorter: {js: ["/content/modules/tablesorter/jquery.tablesorter.min.js"], css: ["/content/modules/tablesorter/style.css"]}});
        $.mods.ready("tablesorter", function(){$("table.tablesorter", self.element).tablesorter({headers: {1:{sorter: false}}});});

        },
        _update: function(){
        /*
          var self = this;
          self.element.append("<p>_update request</p>");
        */
        }, 
        update: function(action, payload, items_fieldname){
        if (action === "add" || action === "remove"){
            this._render();
        }
        //        console.log("model update !", action, payload, items_fieldname);
        }
    });
             
    $.widget("ui.filesView",V_OBJ );
    $.ui.filesView.prototype.options = {
    img_server: "http://localhost", 
    invite_key: "", 
    sort_list: [[0,0]], 
    listens: {
        folder:null, 
        ensemble: null
    }, 
    admin: false
    };
})(jQuery);
