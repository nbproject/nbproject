/* filesView Plugin
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
		self._model		= null;
		self._id_ensemble	= null;
		self._id_folder		= null;
		self._admin		= self.options.admin;
		var splashtext="<div style='padding: 30px; font-size: x-large; color: #a0a0a0;'>Please select a class or folder...</div>";
		var header	= self._admin ? "<div class='filesView-header'><button action='add_file'>Add file</button> <button action='add_folder'>New folder</button> <button action='invite_users'>Invite Users</button> <a id='see_users' target='_blank'>Users</a> <a id='group_props' target='_blank'>Properties</a>  <a id='spreadsheet' target='_blank'>Spreadsheet</a></div>" : "";
		var opts	= self._admin ? "<th>Actions</th>" : "";
		self.element.addClass("filesView").html("<div id='filesview-splash'>"+splashtext+"</div>"+header+"<div class='filesView-ensemble'/><div class='filesView-files'> <table class='tablesorter'><thead><tr><th>Name</th><th>Assignment</th><th id='th_download'>Download PDF</th><th>Stats</th>"+opts+"</tr></thead><tbody/></table></div>");
		$("button[action=add_file]", self.element).click(function(){
			$.concierge.get_component("add_file_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
		    });
		$("button[action=add_folder]", self.element).click(function(){
			$.concierge.get_component("add_folder_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
		    });
		$("button[action=invite_users]", self.element).click(function(){
			$.concierge.get_component("invite_users_menu")({id_ensemble: self._id_ensemble});
		    });
	
		$.mods.declare({
			filesView1: {js: [], css: ["/content/modules/dev/ui.filesview.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("filesView1", function(){});
		$.mods.ready("contextmenu", function(){});
		var contextmenu_items = self._admin ? "<ul id='contextmenu_filesview' class='contextMenu'><li class='rename'><a href='#rename'>Rename</a></li><li class='move'><a href='#move'>Move</a></li><li class='update'><a href='#update'>Update</a></li><li class='assignment'><a href='#assignment'>Edit Assignment</a></li><li class='delete separator'><a href='#delete'>Delete</a></li></ul>" : "";
		$("body").append(contextmenu_items);
		
	    },
	    _defaultHandler: function(evt){
		switch (evt.type){
		case "folder": 
		this._id_ensemble	= this._model.o.folder[evt.value].id_ensemble;
		this._id_folder		= evt.value;
		break;
		case "ensemble": 
		this._id_ensemble	= evt.value;
		this._id_folder		= null;
		break;
		}		
		this._render();
	    },
	    _filelens: function(f){
		var self=this;
		var ckey = $.concierge.get_component("get_userinfo")().ckey;
		var opts = this._admin ? "<td><a href='javascript:void(0)' class='optionmenu'>Actions</a></td>" : "" ;
		var assignment_info = f.assignment ? ("Yes - due "+f.due.substring(4,0)+"-"+f.due.substring(7,5)+"-"+f.due.substring(10,8)+" at "+f.due.substring(13,11)+":"+f.due.substring(16,14)) :"<span>No</span>";
		var download = "";
		if (self._admin || self._model.o.ensemble[f.id_ensemble].allow_download ){
		    download = "<td><a target='_blank' href='"+this.options.img_server+"/pdf/repository/"+f.ID+"?ckey="+ckey+"'>original</a></td>";
		}
		var f_stats =  self._model.o.file_stats[f.ID];
		var stats = f_stats ? "<td><a title='You wrote  "+f_stats.mine+" comments on this file.' class='collagelink' target='_blank' href='/collage?q=auth&amp;id_source="+f.ID+"'><span class='collagelink-caption'> me </span><div class='collagelink-number'> "+f_stats.mine+"</div></a> <a title=\"There are "+(f_stats.total-f_stats.seen)+" comments you haven't seen on this file.\" class='collagelink' target='_blank' href='/collage?q=auth_admin&amp;id_source="+f.ID+"&amp;unread=1'><span class='collagelink-caption'> unread </span><div class='collagelink-number'>"+(f_stats.total-f_stats.seen)+"</div></a> <a  title='There are "+f_stats.total+" comments on this file.' class='collagelink' target='_blank' href='/collage?q=auth_admin&amp;id_source="+f.ID+"'><span class='collagelink-caption'> all </span><div class='collagelink-number'> "+f_stats.total+"</div></a> </td>":"<td/>";
		//link to annotated PDF:  <a target='_blank' href='"+this.options.img_server+"/pdf/annotated/"+f.ID+"?ckey="+ckey+"'>annotated</a>
		return $("<tr class='filesview_row' id_item='"+f.ID+"'><td class='filesview_ftitle'><div class='nbicon pdficon'/><a class='aftericon' target='_blank' href='/f/"+f.ID+"'>"+$.E(f.title)+"</a></td><td>"+assignment_info+"</td>"+download+stats+opts+"</tr>");

	    }, 
	    _folderlens: function(f){
		return $("<tr class='filesview_row' id_item='"+f.ID+"'><td class='filesview_ftitle'><div class='nbicon foldericon'/><a class='aftericon'  href='javascript:$.concierge.trigger({type:\"folder\", value:"+f.ID+"})'>"+$.E(f.name)+"</a></td></tr>");
	    }, 
	    _render: function(){		
		var self=this;
		$("#filesview-splash").hide();
		var id_ensemble = self._id_ensemble;		
		var id_folder = self._id_folder;
		var model = self._model; 
		var $tbody = $("tbody", self.element).empty();
		//remove download header for users is not in admin mode and download isn't allowed. 
		if (self._admin==false && model.o.ensemble[id_ensemble].allow_download==false){
		    $("#th_download").remove();
		}
		//first files: 
		var elts = (id_folder==null) ? model.get("file", {id_ensemble: id_ensemble, id_folder: null}) :  model.get("file", {id_folder: id_folder});
		for (var i in elts.items){
			$tbody.append(self._filelens(elts.items[i]));
		}
		//now folders: 
		elts =  model.get("folder", {id_ensemble: id_ensemble, id_parent: id_folder});
		for (var i in elts.items){
		    $tbody.append(self._folderlens(elts.items[i]));
		}
		if ($tbody.children().length==0){
		    $tbody.append("<tr><td><div class='nofiles'>No files or folders</div></td></tr>");
		}
		$("table.tablesorter", self.element).trigger("update"); 
		//.trigger("sorton", this.options.sort_list);
		var f_context = function(action, el, pos){		    
		    switch (action){
		    case "open": 
		    $.concierge.get_component("file_open")({id: el.attr("id_item")});
		    //console.debug("open", el);
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
		/*
		$e_info = $("div.filesView-ensemble").empty();
		if (id_folder==null && self._admin){ 
		    var e = model.o.ensemble[id_ensemble];
		    $e_info.append("Allow staffonly ? ") //SACHA CONTINUE HERE
		}
		*/
		$("#group_props").attr("href", "/properties/ensemble/"+self._id_ensemble);
		$("#see_users").attr("href", "/properties/ensemble_users/"+self._id_ensemble);
		$("#spreadsheet").attr("href", "/spreadsheet?id_ensemble="+self._id_ensemble);
	    }, 
	    set_model: function(model){
		var self=this;
		self._model = model;
		model.register($.ui.view.prototype.get_adapter.call(this),  {file: null, folder: null, file_stats: null}); //TODO: put stg here so that we update
		$.mods.declare({tablesorter: {js: ["/content/modules/tablesorter/jquery.tablesorter.min.js"], css: ["/content/modules/tablesorter/style.css"]}});
		$.mods.ready("tablesorter", function(){$("table.tablesorter", self.element).tablesorter({headers: {2:{sorter: false}, 3:{sorter:false}, 4:{sorter:false}}, textExtraction: function(node) { 
				    var $n = $(node);
				    if ($n.hasClass("filesview_ftitle")){
					return node.childNodes[1].innerHTML; 
				    }
				    else{
					return node.innerHTML;
				    }
				}  });});

	    },
	    _update: function(){
		/*
		  var self = this;
		  self.element.append("<p>_update request</p>");
		*/
	    }, 
	    update: function(action, payload, items_fieldname){
		if (action == "add" || action == "remove"){
		    this._render();
		}
		//		console.debug("model update !", action, payload, items_fieldname);
	    }
	});
			 
    $.widget("ui.filesView",V_OBJ );
    $.ui.filesView.prototype.options = {
	img_server: "http://localhost", 
	sort_list: [[0,0]], 
	listens: {
	    folder:null, 
	    ensemble: null
	}, 
	admin: false
    };
})(jQuery);
