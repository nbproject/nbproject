/* threadview Plugin
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
		self._location =  null; 
		//SACHA: FIXME (HACK) the 2 vars below are needed in order to defer rendering if code hasn't been loaded yet. For instance, when we have ?c=id_comment in the URL
		self._ready = false;
		self._doDelayedRender = false;
		self._STAR = null;
		self._QUESTION = null;

		/*
		  self.element.addClass("threadview").append("<div class='threadview-header'><button action='prev'>Prev</button> <button action='next'>Next</button> </div><div class='threadview-pane'/>");
		  
		  $("button[action=prev]", self.element).click(function(){
		  alert("todo");
		  });
		  $("button[action=next]", self.element).click(function(){
		  alert("todo");
		  });
		*/
		self.element.addClass("threadview").append("<div class='threadview-header'><div class='threadview-filter-controls'><button class='mark-toggle' action='star'><div class='nbicon staricon-hicontrast' style='margin-top: -3px'/><span class='n_star'>...</span></button><button class='mark-toggle' action='question'><div class='nbicon questionicon-hicontrast' style='margin-top: -3px'/><span class='n_question'>...</span></button></div><div class='mark-instructions'>Mark this thread</div></div><div class='threadview-pane'/>");
		var star_button = $("button.mark-toggle[action=star]", self.element).click(function(event){
			var comments = self._model.get("comment", {ID_location: self._location});
			var comment_id = (comments.length()==1) ? comments.first().ID : null;
			$.concierge.get_component("mark_thread")({comment_id: comment_id, id_location: self._location, type: self._STAR}, function(p){				
				self._model.add("threadmark", p.threadmarks);
				var i, tm;
				for ( i in p.threadmarks){
				    tm = p.threadmarks[i];
				    $.I("Thread #"+tm.location_id+ " has been "+(tm.active ? "":"un")+"marked as favorite.");
				}
			    });
		    }); 
		var question_button = $("button.mark-toggle[action=question]", self.element).click(function(event){
			var comments = self._model.get("comment", {ID_location: self._location});
			var comment_id = (comments.length()==1) ? comments.first().ID : null;
			$.concierge.get_component("mark_thread")({comment_id: comment_id, id_location: self._location, type: self._QUESTION}, function(p){				
				self._model.add("threadmark", p.threadmarks);
				var i, tm;
				for ( i in p.threadmarks){
				    tm = p.threadmarks[i];
				    $.I("Thread #"+tm.location_id+ " has been "+(tm.active ? "":"un")+"marked as 'Reply Requested'.");
				}
			    });
		    }); 

		//splash screen: 
		$("div.threadview-pane", self.element).append($.concierge.get_component("mini_splashscreen")());		
		$("div.threadview-header", self.element).hide();
		$.mods.declare({
			threadview1: {js: [], css: ["/content/modules/dev/ui.threadview1.css"]}, 
			    contextmenu: {js:["/content/modules/contextmenu/jquery.contextMenu.js"] , css: ["/content/modules/contextmenu/jquery.contextMenu.css"]}});
		$.mods.ready("threadview1", function(){});
		$.mods.ready("contextmenu", function(){self._ready = true;if (self._doDelayedRender){self._render();}});
		$("body").append("<ul id='contextmenu_threadview' class='contextMenu'> \
<li class='context thanks'><a href='#thanks'>That helped. Thanks !</a></li> \
<li class='context edit'><a href='#edit'>Edit</a></li> <li class='context reply'><a href='#reply'>Reply</a></li> \
 <li class='context question separator'><a href='#question'>Request a reply</a></li> \
 <li class='context noquestion separator'><a href='#noquestion'>Remove 'reply requested'</a></li> \
 <li class='context star'><a href='#star'>Mark as favorite</a></li> \
 <li class='context nostar'><a href='#nostar'>Remove from favorites</a></li> \
  <li class='context delete separator'><a href='#delete'>Delete</a></li></ul>");	       	    
	    },
	    _defaultHandler: function(evt){
		if (this._file ==  $.concierge.get_state("file")){
		    switch (evt.type){
		    case "select_thread":
		    this._location =  evt.value;
		    this._render();
		    break;
		    }	
		}	
	    },
	    _lens: function(o){
		var self		= this;
		var m			= self._model;
		var bold_cl		= (m.get("seen", {id: o.ID}).is_empty() || o.id_author == self._me.id) ? "" : "note-bold";
		var admin_info		= o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class' /> ": " ";
		var me_info		= (o.id_author == self._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> ":" ";
		var question_info_me	= (m.get("threadmark", {comment_id: o.ID, user_id: self._me.id, active: true, type: self._QUESTION }).is_empty()) ? " " : " <div class='nbicon questionicon-hicontrast' title='I am requesting a reply on this comment'/> " ;

		var tms			= m.get("threadmark", {comment_id: o.ID,  active: true, type: self._QUESTION });		
		var tms_me		= tms.intersect( self._me.id, "user_id");
		var tms_me_label	= tms_me.is_empty() ? "" : " including mine"; 
		var tms_me_class	= tms_me.is_empty() ? "" : "active";
		var question_info	= tms.is_empty()  ? " " : "<div class='stat-count "+tms_me_class+"' title='This comment has "+tms.length()+" pending question"+$.pluralize(tms.length())+tms_me_label+" '><div class='nbicon questionicon' style='margin-top: -3px;'/> "+tms.length()+" </div>";

		var type_info		= "";
		if (o.type == 1) {
		    type_info		= " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
		}
		else if (o.type == 2){
		    type_info		= " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
		}			
		var author_info		= " <span class='author'>"+o.fullname+"</span> ";
		var creation_info	= " <span class='created'> - "+o.created+"</span> ";
		var replymenu		= " <a class = 'replymenu' href='javascript:void(0)'>Reply</a> ";
		var optionmenu		= " <a class='optionmenu' href='javascript:void(0)'>Actions</a> ";
		var body		= o.body.replace(/\s/g, "")=="" ? "<span class='empty_comment'>Empty Comment</span>" : $.E(o.body).replace(/\n/g, "<br/>");
		return ["<div class='note-lens' id_item='",o.ID,"'><div class='lensmenu'>", replymenu, optionmenu,"</div><span class='note-body ",bold_cl,"'>",body,"</span>", author_info,admin_info,question_info, me_info, type_info, creation_info,"</div>"].join("");
	    },
	    _comment_sort_fct: function(o1, o2){return o1.ID-o2.ID;},
	    _fill_tree: function(m, c){
		var $div = $("<div class='threadview-branch'>"+this._lens(c)+"</div>");
		var children = m.get("comment", {ID_location: c.ID_location, id_parent: c.ID}).sort(this._comment_sort_fct);		
		for (var i = 0; i<children.length;i++){
		    $div.append(this._fill_tree(m,children[i]));
		}
		return $div;
	    },
	    _render_header: function(){
		var self = this;
		var header = $("div.threadview-header", self.element);
		var m = self._model;
		var tm_star = m.get("threadmark", {location_id: self._location, active:true, type: self._STAR});
		var tm_star_me = m.get("threadmark", {location_id: self._location, active:true, type: self._STAR, user_id: self._me.id});
		var tm_question = m.get("threadmark", {location_id: self._location, active:true, type: self._QUESTION});
		var tm_question_me = m.get("threadmark", {location_id: self._location, active:true, type: self._QUESTION, user_id: self._me.id});
		var buttons = $("button.mark-toggle", header).removeClass("active");
		if (tm_star_me.length()>0){
		    buttons.filter("[action=star]", header).addClass("active");
		}
		$("span.n_star", header).text(tm_star.length());
		if (tm_question_me.length()>0){
		    buttons.filter("[action=question]", header).addClass("active");
		}
		$("span.n_question", header).text(tm_question.length());

	    }, 
	    _render: function(){	
		var self	= this;
		self._me =  $.concierge.get_component("get_userinfo")();
		if (self._ready == false){
		    self._doDelayedRender = true;
		    return;
		}
		var model	= self._model; 	
		$("div.threadview-header", self.element).show();
		self._render_header();
		var $pane	= $("div.threadview-pane", self.element).empty();
		var root	= model.get("comment", {ID_location: self._location, id_parent: null}).sort(this._comment_sort_fct)[0];
		if (root == undefined){ //happens after deleting a thread that only contains 1 annotation
		    return;
		}
		$pane.append(this._fill_tree(model, root));
		var f_on_delete = function(p){
		    $.I("Note #"+p.id_comment+" has been deleted");
		    var c = model.o.comment[p.id_comment];
		    model.remove("comment", p.id_comment);
		    if (c.id_parent == null){
			model.remove("location", c.ID_location);
		    }
		    else{
			//we force an update of locations in case some styling needs to be changed. 
			var locs = {};
			locs[c.ID_location] = model.o.location[c.ID_location];
			model.add("location", locs);
		    }
		};
		var f_context = function(action, el, pos){
		    var $el	= $(el);
		    var $note	=  $el.closest("div.note-lens");
		    var id_item =  $note.attr("id_item");
		    switch (action){
		    case "reply": 			
			$.concierge.trigger({type: "reply_thread", value: id_item});
			break;
		    case "edit": 
			$.concierge.trigger({type: "edit_thread", value: id_item});
			break;
		    case "question": 
		    case "noquestion": 
			$.concierge.get_component("mark_thread")({id_location: self._location, type: self._QUESTION, comment_id: id_item}, function(p){				
				self._model.add("threadmark", p.threadmarks);
				var i, tm;
				for ( i in p.threadmarks){
				    tm = p.threadmarks[i];
				    $.I("Comment #"+tm.comment_id+ " has been "+(tm.active ? "":"un")+"marked as 'Reply Requested'.");
				}
			    });
		    break;
		    
		    case "star": 
		    case "nostar": 
			$.concierge.get_component("mark_thread")({id_location: self._location, type: self._STAR, comment_id: id_item}, function(p){				
				self._model.add("threadmark", p.threadmarks);
				var i, tm;
				for ( i in p.threadmarks){
				    tm = p.threadmarks[i];
				    $.I("Comment #"+tm.comment_id+ " has been "+(tm.active ? "":"un")+"marked as favorite.");
				}
			    });
			break;
		    case "thanks": 
			$.D("TODO: " + action);
			break;
		    case "delete":
			if (confirm("Are you sure you want to delete this note ?")){
			    $.concierge.get_component("note_deleter")({id_comment: id_item}, f_on_delete);
			}
			break;
		    }
		};
		var f_reply = function(event){
		    var id_item = $(event.target).closest("div.note-lens").attr("id_item");
		    $.concierge.trigger({type: "reply_thread", value: id_item});
		};
		$("div.note-lens", $pane).contextMenu({menu: "contextmenu_threadview"}, f_context);
		$("a.replymenu", $pane).click(f_reply);
		$("a.optionmenu", $pane).contextMenu({menu: "contextmenu_threadview", leftButton: true}, f_context);
		$("#contextmenu_threadview").bind("beforeShow", function(event, el){
			var id_item = el.closest("div.note-lens").attr("id_item");
			var m	= self._model; 			      
			var c = m.o.comment[id_item];
			$("li", this).show();

			//edit and delete: 
			if ((!(c.id_author == self._me.id)) || (!(m.get("comment", {id_parent: id_item}).is_empty()))){
			    $("li.context.edit, li.context.delete", this).hide();
			}		
			//star and question: 
			var tms_location = m.get("threadmark", {location_id: c.ID_location, user_id: self._me.id, active: true, type: self._QUESTION });	
			var tms_comment = tms_location.intersect(c.ID, "comment_id");
			//is this one of my active questions: if so, hide context.question
			var to_hide = [];
			to_hide.push(tms_comment.is_empty() ?  "li.context.noquestion": "li.context.question");
			to_hide.push(m.get("threadmark", {comment_id: c.ID, user_id: self._me.id, active: true, type:self._STAR }).is_empty() ?"li.context.nostar": "li.context.star" );
			// can't thank a comment for which I'm the author or where I haven't any replyrequested or which was authored before the comment I marked as "reply requested".
			if ( tms_location.is_empty() || c.id_author == self._me.id || tms_comment.is_empty() || tms_comment.first().comment_id>=c.ID){
			    to_hide.push("li.context.thanks");
			}
			$(to_hide.join(","), this).hide();			
		    });
	    }, 
	    set_model: function(model){
		var self=this;
		self._model =  model;
		self._me = null;
		var id_source = $.concierge.get_state("file");
		self._file =  id_source ; 
		self._QUESTION = $.concierge.get_constant("QUESTION");
		self._STAR = $.concierge.get_constant("STAR");
		model.register($.ui.view.prototype.get_adapter.call(this),  {comment: null, threadmark: null});
	    },
	    _keydown: function(event){ // same as ui.noteview8.js
		//just proxy to other view if any interested. 
		$.concierge.trigger({type: "keydown", value: event});
		return true;
	    }, 
	    update: function(action, payload, items_fieldname){
		if ((action == "add"|| action == "remove") && (items_fieldname=="comment" || items_fieldname=="threadmark") && this._location){
		    this._render();
		}
	    }
	});
			 
    $.widget("ui.threadview",V_OBJ );
    $.ui.threadview.prototype.options = {
	loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
	listens: {
	    select_thread: null, 
	}
    };
})(jQuery);
