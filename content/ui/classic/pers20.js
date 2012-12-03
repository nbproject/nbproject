/*
pers20.js - framework for collage views
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.pers", 0.1);
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
};

NB.pers.approve_buttons = {
    auth_grader : true, 
    newauth_grader: true, 
    auth_admin: true, 
    newauth_admin: true
};

$(document).ready(function(){   
	SimileAjax.History.enabled = false;
	NB.pers.params = NB.dom.getParams();
	if (!("view" in NB.pers.params)){
	    alert("missing view parameter in URL, assuming 'mynotes'");
	    NB.pers.params.view = "mynotes";	    
	};
	if ("anon" in NB.pers.params){ //don't show names
	    $("span[ID=author_email]").remove();
	}

	document.title=NB.pers.titles[NB.pers.params.view] + " " + document.title ;


	if ($("#user_settings").attr("email") != ""){
	    NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	    NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
	}


	//init the observer machinery:
	NB.observer.register("/__RESPONDER", {
		"SAYHELLO": function(event){$.L("hello", event);}
	    });
    
	//	$("#pers1").perspective();
	$("#pers1").perspective();
	$("#viewport1, #viewport2").viewport({perspective: "#pers1", maxAppendTo:"#pers1", dock_visible: false});
	$("#view-1, #view-2").view();
	$("#pers1").perspective("update");

	NB.pers.call("getObjects",{types: ["files", "ensembles", "marks" ]}, NB.pers.on_getStore);

    });

NB.pers.call = function(fctname, dict, callback, nowait){
    if (!(nowait)){
	document.body.style.cursor="wait";
    }
    NB.rpc.rpc_json("pdf2/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};

NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location ="http://"+document.location.hostname;
};

NB.pers.on_getStore = function(payload){
    $.concierge.addComponents({
	    note_creator: function(payload, cb){NB.pers.call("saveNote", payload, cb);},
	    note_editor: function(payload, cb){NB.pers.call("editNote", payload, cb);},
	    note_marker: function(payload, cb){NB.pers.call("markNote", payload, cb);},
	    note_deleter: function(payload, cb){NB.pers.call("deleteNote", payload, cb);},
	    note_approver: function(payload, cb){NB.pers.call("approveNote", payload, cb);}
	});
    $.concierge.setRemoteLogger(function(payload, cb){NB.pers.call("remote_log", payload, cb);}, 60000);
    NB.pers.store = new NB.models.Store(true);
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

    NB.pers.call("getMyNotes",rpc_parms,function(p2){
	    NB.pers.store.add("location", p2.locations);
	    NB.pers.store.add("comment", p2.comments);
	    //NB.pers.store.add("mark", p2.marks);

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
    m.add("mark", p.marks);
    m.add("comment", p.comments);
    //f_after_update();
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
    $("li", cm).addClass("disabled");
    let menus = ["li.reply"];
    let objs =  NB.pers.store.o;
    let comments =objs.comment;
    let marks= objs.mark;
    
    if (comments[id_item].email=="Me" && t.nextSibling==null){
	menus.push("li.edit");
	if ( t.nextSibling==null){
	    menus.push("li.delete");
	}
    }
    if (!(id_item in 	NB.pers.store.o.seen)){
	NB.pers.store.o.seen[id_item] = true;
	$.concierge.logRemote("seen", id_item); //regular update would be too slow
    }
    menus.push((id_item in marks && marks[id_item].subscribe==1)?"li.unsubscribe":"li.subscribe", 
	       (id_item in marks && marks[id_item].answerplease==1)?"li.answered":"li.answerplease"
	       );
    $(menus.join(","), cm).removeClass("disabled");
    //TODO: hide and star
};

NB.pers.f_on_delete = function(p){
    $.I("Note "+p.id_comment+" has been deleted");
    //    $("div.note-lens[id_item="+p.id_comment+"]").remove();
    NB.pers.store.remove("comment", p.id_comment);
    NB.pers.postProcess();
};

NB.pers.f_add_org = function(){
    this.href+="&org="+NB.pers.params.view;
}

    NB.pers.postProcess = function(){
    
	let f_context =  function(action, el, pos){
	    switch (action){
	    case "reply": 
	    NB.pers.editorFactory(el);
	    break;
	    case "edit":
	    NB.pers.editorFactory(el,true);
	    break;
	    case "subscribe": 
	    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "subscribe"}, NB.pers.f_on_option);		    
	    break;
	    case "unsubscribe": 
	    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "unsubscribe"}, NB.pers.f_on_option);		    
	    break;
	    case "answerplease": 
	    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "answerplease"}, NB.pers.f_on_option);
	    break;
	    case "answered": 
	    $.concierge.get_component("note_marker")({id_comment: $(el).closest("div.note-lens").attr("id_item"), action: "answered"}, NB.pers.f_on_option);
	    break;
	    case "delete": 
	    $.concierge.get_component("note_deleter")({id_comment: $(el).closest("div.note-lens").attr("id_item")}, NB.pers.f_on_delete);
	    break;
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
		let container = $("div.material-container:visible:eq(0)");
		let cw = container.width();
		let ch = container.height();
		$("div.location-lens:visible").each(function(i){
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
		notes.mouseover(NB.pers.f_overlens).contextMenu({menu:"contextmenu_notepane" }, f_context);
		if (NB.pers.params.view in NB.pers.approve_buttons){
		    //special controls for graders
		    notes.each(f_approve);
		}
		$("span.optionmenu").contextMenu({menu:"contextmenu_notepane", leftButton:true }, f_context) ;
		$("a.directurl").each(NB.pers.f_add_org);
	    },0);
    };
