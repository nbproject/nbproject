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
		self._me		= $.concierge.get_component("get_userinfo")();
		self._menu_items	= $();
		self._menu_items_reg	= $("<ul id='contextmenu_filesview' class='contextMenu'/>");
		self._menu_items_admin	= $("<ul id='contextmenu_filesview' class='contextMenu'><li class='rename'><a href='#rename'>Rename</a></li><li class='move'><a href='#move'>Move</a></li><li class='update'><a href='#update'>Update</a></li><li class='assignment'><a href='#assignment'>Edit Assignment</a></li><li class='delete separator'><a href='#delete'>Delete</a></li></ul>");

		
		self.element.addClass("filesView");
		$(document).on("click", "button[action=add_file]", function(){
			$.concierge.get_component("add_file_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
		    });
		$(document).on("click","button[action=add_folder]", function(){
			$.concierge.get_component("add_folder_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
		    });
		$(document).on("click","button[action=invite_users]", function(){
			$.concierge.get_component("invite_users_menu")({id_ensemble: self._id_ensemble});
		    });
	
		$.mods.declare({
			filesView1: {js: [], css: ["/content/modules/dev/ui.filesview.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("filesView1", function(){});
		$.mods.ready("contextmenu", function(){});
		
		
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
		case "home": 
		this._id_ensemble	= null;
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
	    _draw_pending: function(){
		var self = this;
		var m = self._model;
		var $list = $("#filesView-pending-list", self.element).empty();
		var f_location_sort = function(o1,o2){
		    return m.get("pending",{location_id: o2.id}).length() - m.get("pending",{location_id: o1.id}).length();
		}
		var id_ensemble = self._id_ensemble;
		var  query_params = {};
		var viewall_url = "/collage?q=pending";
		if (id_ensemble != null){
		    query_params["ensemble_id"] = id_ensemble;
		    viewall_url+="&amp;id_ensemble="+id_ensemble; 
		}
		$("#filesView-allpending-link").attr("href", viewall_url);
		
		var questions	= m.get("question", {user_id: self._me.id}).intersect(m.get("location", query_params).items, "location_id")
		if (questions.length()){
		    $("#filesView-pending-header-total").text(questions.length());
		    $("#filesView-pending-header-plural").text($.pluralize(questions.length()));
		}
		else{
		    $("#filesView-panel-pending").hide();
		}
		questions = questions.items;
		var i,l,cs, c,q,s, body, reply_link, comment_link, ensemble_info, parity, when, lens, lens_comment, comments;
		for (i in questions){
		    q = questions[i];
		    l = m.o.location[q.location_id];
		    cs = m.get("comment", {location_id: l.id}).items;
		    comments = "";
		    s = m.o.file[l.source_id];
		    ensemble_info = id_ensemble == null ? ("<span class='filesView-item-ensembleinfo'>"+$.E(m.o.ensemble[l.ensemble_id].name)+"</span>") : "";
		    parity = (!(i % 2)) ? " class='filesView-item-odd' ":" class='filesView-item-even' ";
		    var c_orig = null;
		    for (var cid in cs){
			c = cs[cid];
			if ((q.comment_id == null && c.parent_id == null) || q.comment_id == c.id){
			    c_orig = c;
			}
			else{
			    //only display real answers, not the original comment
			    body = $.E(c.body).replace(/\n/g, " ");
			    comment_link = "/c/"+c.id;
			    reply_link = "/r/"+c.id;   
			    when = "<span class='filesView-pending-when'>"+$.concierge.get_component("pretty_print_timedelta")({t: c.ctime})+"</span>";
			    lens_comment = "<div><div class='filesView-floatright'><a class='button' href='"+comment_link+"'>link</a> <a class='button' href='"+reply_link+"'>Reply</a> <br/> <a class='button' href='javascript:$.concierge.trigger({type:\"rate_reply\", value:{status: 3, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'>Thanks, that <i>really</i> helped !</a> <a class='button' href='javascript:$.concierge.trigger({type:\"rate_reply\", value:{status: 2, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'  >Accept this reply</a> <a class='button' href='javascript:$.concierge.trigger({type:\"rate_reply\", value:{status: 1, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'  >Request another reply</a></div>"+when+": " +body+"</div>";
			    comments+=lens_comment;
			}
		    }
		    c_orig = m.get("basecomment", {location_id: q.location_id}).first();
		    lens = "<div "+parity+">"+"<div class='filesView-question-body'>"+c_orig.body+"</div>"+comments+"<span class='filesView-item-numpage'>p."+l.page+"</span>"+ensemble_info+"</div>";	    
		    $list.append(lens);
		}
	    }, 
	    _draw_questions: function(){
		var self = this;
		var m = self._model;
		var $list = $("#filesView-question-list", self.element).empty();
		var f_location_sort = function(o1,o2){
		    return m.get("question",{location_id: o2.id}).length() - m.get("question",{location_id: o1.id}).length();
		}
		var id_ensemble = self._id_ensemble;
		var  query_params = {};
		var viewall_url = "/collage?q=questions";
		if (id_ensemble != null){
		    query_params["ensemble_id"] = id_ensemble;
		    viewall_url+="&amp;id_ensemble="+id_ensemble; 
		}
		$("#filesView-allquestions-link").attr("href", viewall_url);
		var locs = m.get("location", query_params).intersect(m.get("question").exclude({user_id: self._me.id}).values("location_id")).sort(f_location_sort);
		if (locs.length){
		    $("#filesView-question-header-total").text(locs.length);
		    $("#filesView-question-header-plural").text($.pluralize(locs.length));
		}
		else{
		    $("#filesView-panel-question").hide();
		}
		var i,l,c,q,s, body, reply_link, comment_link, ensemble_info, parity, lens;
		for (i in locs){
		    l = locs[i];
		    c = m.get("comment", {location_id: l.id, parent_id: null}).first();
		    q = m.get("question", {location_id: l.id});
		    s = m.o.file[l.source_id];
		    body = $.E(c.body).replace(/\n/g, " ");
		    comment_link = "/c/"+c.id;
		    reply_link = "/r/"+c.id;   
		    ensemble_info = id_ensemble == null ? ("<span class='filesView-item-ensembleinfo'>"+$.E(m.o.ensemble[l.ensemble_id].name)+"</span>") : "";
		    parity = (!(i % 2)) ? " class='filesView-item-odd' ":" class='filesView-item-even' ";

		    // inserting image:
		    var scalefactor, doc, inner, style, inner_top, sel, link;
		    scalefactor = 0.6334;
		    inner_top = Math.min(0, 50-l.y*scalefactor);	    
		    sel = "<div class='snippet-selection' id_item='"+l.id+"' style='top: "+l.y*scalefactor+"px; left: "+l.x*scalefactor+"px; width: "+l.w*scalefactor+"px; height: "+l.h*scalefactor+"px'/>";
		    
		    inner = "<div class='snippet-innermaterial' style='top: "+inner_top+"px'><div class='snippet-selections'>"+sel+"</div><img class='snippet-material' page='"+(i+1)+"' src='http://nb.mit.edu/pdf/cache2/288/33/"+l.source_id+"?ckey="+self._me.ckey+"&amp;page="+l.page+"'/></div>";
		    link =" <a target='_blank' href='"+comment_link+"'>"+ $.E(m.o.ensemble[l.ensemble_id].name+" - "+s.title +" (p.  "+l.page+")") +"</a>"
		    doc = "<div class='snippet-material' page='"+(i+1)+"'><div class='pagenumber pagenumbertop'>"+link+" <div class='nbicon questionicon-hicontrast'/><span class='filesView-question-numvotes'>"+q.length()+"</span> <a class='button' target='_blank' href='"+reply_link+"'>Reply</a></div>"+inner+"</div>";

		    lens = "<div "+parity+">"+doc+"<div class='filesView-question-body'>"+body+"</div> </div>";
		    
		    $list.append(lens);
		    $("div.snippet-innermaterial", $list).draggable();
		}
	    },
	    _draw_frame: function(){
		var self = this;
		var header	= self._admin ? "<div class='filesView-header'><button action='add_file'>Add file</button> <button action='add_folder'>New folder</button> <button action='invite_users'>Invite Users</button> <a id='see_users' target='_blank'>Users</a> <a id='group_props' target='_blank'>Properties</a>  <a id='spreadsheet' target='_blank'>Spreadsheet</a></div>" : "";
		var opts	= self._admin ? "<th>Actions</th>" : "";

		var filesView_pending = "<div id='filesView-panel-pending' class='filesView-panel'><div id='filesView-pending-header'>You have <span id='filesView-pending-header-total'>0</span> feedback request<span id='filesView-pending-header-plural'/>.</div><div id='filesView-pending-list'/></div>";
		var filesView_question = "<div id='filesView-panel-question'  class='filesView-panel'><div id='filesView-question-header'>Your classmates have <span id='filesView-question-header-total'>0</span> pending question<span id='filesView-question-header-plural'/>. Can you help them ? <!--<a id='filesView-allquestions-link'>View all</a>--></div><div id='filesView-question-list'/></div>";

		var filesView_files = (self._id_ensemble == null) ?  "<!--<div  id='filesView-panel-recentfiles' class='filesView-panel'>Recent Files...</div>-->" : "<div id='filesView-panel-files' class='filesView-panel'> <table class='tablesorter'><thead><tr><th>Name</th><th>Assignment</th><th id='th_download'>Download PDF</th><th>Stats</th>"+opts+"</tr></thead><tbody id='filesView-file-list'/></table></div>";
		self.element.html(header+ filesView_pending + filesView_question + filesView_files);


		var contextmenu_items = self._admin ? "<ul id='contextmenu_filesview' class='contextMenu'><li class='rename'><a href='#rename'>Rename</a></li><li class='move'><a href='#move'>Move</a></li><li class='update'><a href='#update'>Update</a></li><li class='assignment'><a href='#assignment'>Edit Assignment</a></li><li class='delete separator'><a href='#delete'>Delete</a></li></ul>" : "";
		self._menu_items.remove();
		self._menu_items = self._admin ? self._menu_items_admin : self._menu_items_reg;
		$("body").append(self._menu_items);
	    },
	    _draw_files : function(){
		var self=this;
		var id_ensemble = self._id_ensemble;		
		var id_folder = self._id_folder;
		var model = self._model; 
		self._admin = id_ensemble == null ? false : model.o.ensemble[id_ensemble].admin;
		
		if (id_ensemble == null){
		    // TODO: put drawing code here.
		}
		else{
		    var $tbody = $("#filesView-file-list", self.element);
		    //remove download header for users is not in admin mode and download isn't allowed. 
		    if (self._admin==false && model.o.ensemble[id_ensemble].allow_download==false){
			$("#th_download").remove();
		    }
		    //first files: 
		    var elts = (id_folder==null) ? model.get("file", {id_ensemble: id_ensemble, id_folder: null}) :  model.get("file", {id_folder: id_folder});
		    var items = elts.items;
		    for (var i in items){
			$tbody.append(self._filelens(items[i]));
		    }
		    //now folders: 
		    elts =  model.get("folder", {id_ensemble: id_ensemble, id_parent: id_folder});
		    items = elts.items;
		    for (var i in items){
			$tbody.append(self._folderlens(items[i]));
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
		}
	    }, 
	    _render: function(){		
		var self=this;
		self._draw_frame();
		self._draw_pending();
		self._draw_questions();
		self._draw_files();
		//var containers = $("div.filesView-panel");
		self._expand();
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
	    ensemble: null, 
	    home: null,
	}, 
	admin: false, 
	expand: "div.filesView-panel",
    };
})(jQuery);
