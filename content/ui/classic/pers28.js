/*
  pers28.js - framework for collage views
  Author 
  Sacha Zyto (sacha@csail.mit.edu) 

  License
  Copyright (c) 2010-2012 Massachusetts Institute of Technology.
  MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/


try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    //Module.require("NB.rpc", 0.1);
    Module.require("NB.conf", 0.1);
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("Init Error: "+e);
}

NB.pers.titles = {
    "auth": "My Notes", 
    "question": "My questions",
    "unclear": "Unclear points",
    "newauth": "New notes on my discussions",
    "newquestion": "New replies on my questions",
    "newunclear": "New replies on unclear points", 
    "newquestion_group": "New questions from classmates",
    "question_group": "Questions from classmates",
    "newunclear_group": "New places marked unclear by classmates",
    "unclear_group": "Places marked unclear by classmates",
    "auth_group": "My classmates' annotations", 
    "newauth_group": "New annotations from my classmates", 
    "auth_grader": "Notes [grader's view]", 
    "newauth_grader": "New Notes [grader's view]", 
    "auth_admin": "Notes [admin's view]", 
    "newauth_admin": "New Notes [admin's view]", 
    "unanswered": "Replies currently requested", 
    "auth_everyone": "Everyone's annotations", 
    "newauth_everyone": "Everyone's annotations", 
    "favorite": "My favorite comments", 
    "newfavorite": "New discussions on my favorite comments",
    "search": "Search"
};

NB.pers.approve_buttons = {
    auth_grader : true, 
    newauth_grader: true, 
    auth_admin: true, 
    newauth_admin: true
};

NB.pers.ExhibitLabelif = { f: function(args){
    var arg=args[0]._values[0];
    return new Exhibit.Expression._Collection(arg ? [args[1]._values[0]]: [], "text");
    }
};
NB.pers.ExhibitLoaded = false;

NB.pers.init = function(){   
    if ("Exhibit" in window){
	NB.pers.ExhibitLoaded = true;
	Exhibit.Functions["labelif"] = NB.pers.ExhibitLabelif;
	SimileAjax.History.enabled = false;
    }
    if (!("view" in NB.pers.params)){
	alert("missing view parameter in URL, assuming 'mynotes'");
	NB.pers.params.view = "mynotes";	    
    };
    if ("anon" in NB.pers.params){ //don't show names so we can show real views in public demos
	$("span[ID=author_email]").remove();
    }

    document.title=NB.pers.titles[NB.pers.params.view] + " " + document.title ;

    //init the observer machinery:
    if ("observer" in NB){
	NB.observer.register("/__RESPONDER", {
		"SAYHELLO": function(event){$.L("hello", event);}
	    });
    }
    $("#pers1").perspective();
    $("#viewport1, #viewport2").viewport({perspective: "#pers1", maxAppendTo:"#pers1", dock_visible: false});
    $("#view-1, #view-2").view();
    $("#pers1").perspective("update");
    let payload_objects = {types: ["files", "ensembles", "marks" ]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.on_getStore);
};

NB.pers.on_getStore = function(payload){
    if (!(NB.pers.ExhibitLoaded)){
	Exhibit.Functions["labelif"] = NB.pers.ExhibitLabelif;
	SimileAjax.History.enabled = false;
    }
    $.concierge.addComponents({
	    note_creator: function(payload, cb){NB.pers.call("saveNote", payload, cb);},
	    note_editor: function(payload, cb){NB.pers.call("editNote", payload, cb);},
	    note_marker: function(payload, cb){NB.pers.call("markNote", payload, cb);},
	    note_deleter: function(payload, cb){NB.pers.call("deleteNote", payload, cb);},
	    note_approver: function(payload, cb){NB.pers.call("approveNote", payload, cb);}
	});
    $.concierge.setRemoteLogger(function(payload, cb){NB.pers.call("remote_log", payload, cb);}, 60000);
    NB.pers.store = new NB.models.Store(true, {location: {label: "Thread", pluralLabel: "Threads"}});
    $("#view-2").view("set_model", NB.pers.store);
    NB.pers.store.create(payload, {
	    ensemble:{fieldName: "ensembles"}, 
		gradee: {fieldName: "gradees"},

		file:{fieldName: "files", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "ensemble", props: {valueType: "item"}}}}, 
		mark:{fieldName: "marks" , exhibit_properties:{ID: {type: "comment", field: "comment", props: {valueType: "item"}}}},
		location:{fieldName: "locations", exhibit_properties:{id_source: {type: "file", field: "source", props: {valueType: "item"}}, 
			id_ensemble: {type: "ensemble", field: "ensemble", props: {valueType: "item"}}
		}},
		comment:{fieldName: "comments", exhibit_properties:{ID_location: {type: "location", field: "location", props: {valueType: "item"}}, id_author: {type: "gradee", field: "gradee", props: {valueType: "item"}}}} 
	});
    NB.pers.store.o.seen={};//SACHA Fixme: Workaround for performance. 
    NB.pers.ex1 = Exhibit.create(NB.pers.store.db);
    window.exhibit = NB.pers.ex1; // fix to make tabular views work
    NB.pers.ex1.configureFromDOM();
    NB.pers.postProcess();
    SimileAjax.History.addListener({onAfterPerform: function() {NB.pers.postProcess();}});
    NB.pers.call("getGradees",{}, function(p2){
	    NB.pers.store.add("gradee", p2.gradees);
	});
    let rpc_parms = {view: NB.pers.params.view};
    if ("id_ensemble" in NB.pers.params){
	rpc_parms.id_ensemble = NB.pers.params.id_ensemble;
	
    }
    if ("id_source" in NB.pers.params){
	rpc_parms.id_source = NB.pers.params.id_source;
	
    }
    if ("id_search" in NB.pers.params){
	rpc_parms.id_search = NB.pers.params.id_search;
	
    }

    NB.pers.call("getMyNotes",rpc_parms,function(p2){
	    NB.pers.store.add_batch({location: p2.locations, comment:p2.comments});
	    NB.pers.postProcess();
	});
    
};


NB.pers.editorFactory =  function(el, doEdit){
    //open editor
    let body  = $("span.body",el);
    let contents = doEdit ? body.text():"";
    let $el = $(el);
    let $note =  $el.closest("div.note-lens");
    let id_comment = $note.attr("id_item");
    let comment =  NB.pers.store.o.comment[id_comment];
    let id_item =  (new Date()).getTime();
    let id_source =   NB.pers.store.o.location[comment.ID_location].id_source;
    let $editor = $("<div/>");
    $el.append($editor);
    let ed_args = {note:  comment, id_source: id_source};
    if (doEdit){
	body.hide();
	ed_args.doEdit = true;
    }
    $editor.editor(ed_args);
    $editor.bind("before_cleanup", function(){  
	    if (doEdit){
		body.show();
	    }
	    NB.pers.postProcess();
	});
};


NB.pers.set_approve = function(id, val){
    document.body.style.cursor="wait";
    //    $.I("Sending approval info to server...");
    $.concierge.get_component("note_approver")({id_comment: id, value: val}, function(p){
	    document.body.style.cursor="auto";

	    let action = (val==1)?"approved": "removed its approval";
	    $.I("Note "+id+" has been "+action);
	    NB.pers.store.add("comment", p.comments);
	    NB.pers.postProcess();

	});
};

NB.pers.f_on_option = function(p){
    let m = NB.pers.store;
    m.add_batch({mark: p.marks, comment: p.comments});
    $.I("This note has been marked...");
    NB.pers.postProcess();
};


NB.pers.f_overlens = function(event){
    let t = event.currentTarget;
    let id_item = t.getAttribute("id_item");
    let id_menu  = "contextmenu_notepane";
    let cm =  $("#"+id_menu);
    if (cm.is(":visible")){ //don't update menu if already visible
	return;
    }
    $("li.edit, li.delete", cm).addClass("disabled");
    let menus = [];
    let objs =  NB.pers.store.o;
    let comments =objs.comment;
    let marks= objs.mark;
    if (comments[id_item].email=="Me" && t.nextSibling==null){
	menus.push("li.edit");
	if ( t.nextSibling==null){
	    menus.push("li.delete");
	}
    }
    $(menus.join(","), cm).removeClass("disabled");
    //now checkboxes:
    $("input", cm).removeAttr("checked");
    let actions = ["answerplease", "approve", "reject", "favorite", "hide"];		    
    for (let i in actions){
	let action = actions[i];
	if ((id_item in marks) && (marks[id_item][action]==1)){
	    $("li."+action+ " input", cm)[0].setAttribute("checked", "checked");
	}
    }
    if (!(id_item in 	NB.pers.store.o.seen)){
	NB.pers.store.o.seen[id_item] = true;
	$.concierge.logRemote("seen", id_item); //regular update would be too slow
    }
    
};

NB.pers.f_on_delete = function(p){
    $.I("Note "+p.id_comment+" has been deleted");
    //    $("div.note-lens[id_item="+p.id_comment+"]").remove();
    NB.pers.store.remove("comment", p.id_comment);
    NB.pers.postProcess();
};

NB.pers.f_add_org = function(){
    this.href+="&org="+NB.pers.params.view;
};

NB.pers.postProcess = function(){
    let f_on_option = NB.pers.f_on_option;
    let f_on_delete = NB.pers.f_on_delete;
    let f_context =  function(action, el, pos){
	switch (action){
	case "reply": 
	NB.pers.editorFactory(el);
	break;
	case "edit":
	NB.pers.editorFactory(el,true);
	break;
	case "delete": 
	$.concierge.get_component("note_deleter")({id_comment: $(el).closest("div.note-lens").attr("id_item")}, f_on_delete);
	break;
	default: 
	$.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: action}, f_on_option);
	}
    };
	

    let f_approve = function(){
	let elt = $(this);
	if (elt.children("button").length==0){
	    let id = elt.attr("id_item");
	    let approved = (NB.pers.store.o.comment[id].p == 1);
	    let dis_b1 = approved ? "disabled=\"true\"": "";
	    let dis_b2 = approved ? "": "disabled=\"true\"";
	    elt.append("<br/><button "+dis_b1+" onclick=\"NB.pers.set_approve("+id+", 1)\" >Approve</button><button "+dis_b2+" onclick=\"NB.pers.set_approve("+id+", 0)\" >Remove Approval</button>");
	}
    };
    window.setTimeout(function(){
	    let dbItems = window.exhibit._database._spo;
	    $("div.material").draggable();
	    let sort1=function(a,b){
		return parseInt(a.getAttribute("id_item")) > parseInt(b.getAttribute("id_item")) ? 1 : -1 
	    };
	    $("div.location-lens:visible").each(function(i){
		    let container = $("div.material-container:visible", this);
		    let cw = container.width();
		    let ch = this.clientHeight;
		    if (container.height()+5 < ch){
			container.height(ch-5);
		    }

		    let id_item = "location_"+this.getAttribute("id_item");
		    let l = $("div.note-lens", this);
		    let p = l.parent();
		    l.remove().sort(sort1).appendTo(p);
		    let location = dbItems[id_item];
		    if (location.page[0]!=0){
			let s = 0.48;
			let w = s*location.w[0];
			let h = s*location.h[0];
			let top = s*location.top[0];
			let left = s*location.left[0];
			let css_top = Math.min(ch-top-h-50, 0);
			let css_left = Math.min(cw-left-w-50, 0);

			$("div.selection", this).css({width:w+"px", height: h+"px", top: top+"px",left:left+"px"}).parent().css({top:css_top+"px", left: css_left+"px"});

		    }
		});
	    let notes =  $("div.note-lens:visible");
	    notes.mouseover(NB.pers.f_overlens).contextMenu({menu:"contextmenu_notepane" }, f_context).each(function(){
		    $("span.body", this).html(NB.pers.store.o.comment[this.getAttribute("id_item")].body.replace(/\n/g, "<br/>"));
		});
	    if (NB.pers.params.view in NB.pers.approve_buttons){
		//special controls for graders
		notes.each(f_approve);
	    }
	    $("span.optionmenu").contextMenu({menu:"contextmenu_notepane", leftButton:true }, f_context) ;
	    $("a.directurl").each(NB.pers.f_add_org);
	},0);
};
