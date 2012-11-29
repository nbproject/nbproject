/*
 * pers27.js
 * UI bindings 
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.rpc
 *		NB.pers
 *		jquery
 *
 *
 Author 
 Sacha Zyto (sacha@csail.mit.edu) 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.conf", 0.1);
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}
NB.pers.ensembles = null;
NB.pers.sources = null;
NB.pers.view1 = null;
NB.pers.docs = null;
NB.pers.currentEnsemble = 0;
NB.pers.newSettings = {};
NB.pers.search_timerID=null;
NB.pers.search_page_offset=0;
NB.pers.id_search=0;

NB.pers.init = function(){

    //Tell View system about events hierarchy: 
    $.concierge.setHierarchy({
	    file: {visibility: true, page: 1, zoom: 1.05}, 
		note_hover:{}, 
		note_out: {}, 
		notes_loaded_for_file:{}, 
		note:{},
		new_notes:{}, 
		settings:{}, 
		admin:{}, 
		global_editor:{}, 
		mynotes:{} });
    $.concierge.allowRepeatedEvents(["note_hover", "note_out", "sel_click", "note_click"]);
    $.concierge.setConstants({res: 288, scale: 25});
    NB.pers.call("getStats", {},function(payload){
	    if (payload.num_admin > 1){
		$("#adminlink").show();
	    }
	    $.concierge.addConstants(payload); //SACHA: FIXME Hack 
	});
    let payload_objects = {types: ["ensembles", "folders", "files", "marks", "settings", "file_stats", "ensemble_stats", "ensemble_stats2"]};
    if ("id_ensemble" in NB.pers.params){
	payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
    }
    NB.pers.call("getObjects",payload_objects, NB.pers.on_getStore);
    NB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"]},function(p){$.concierge.addConstants(p.value)});
    $("#pers1").perspective();
    $("#viewport1, #viewport2, #viewport3").viewport({perspective: "#pers1", maxAppendTo:"#pers1", dock_visible: false, select: function(panel){
		let id = panel.firstChild.id;
		if(id in $.concierge.views){
		    $.concierge.views[panel.firstChild.id].select();
		}
	    }}).bind("close_view", function(evt, id){
		    if (id in $.concierge.views){
			$.concierge.views[id].close();
		    }
		});
    $("#view-10").thumbnailView({img_server: NB.conf.servers.img, invite_key: NB.conf.identity});
    $("#view-5").pollView();
    $("#view-92").fileView();
    $("#pers1").perspective("update");
    let __addSection = function(){
	let title = this.getAttribute("label");
	$(this).children().wrapAll("<div class='section-body'></div>");
	$(this).prepend("<div class='section-header'>"+title+"</div>");
    };
    $("div.section").each(__addSection);
};

NB.pers.on_getStore = function(payload){
    

    //Set up components: 
    $.concierge.addComponents({
	    notes_loader: function(payload, cb){NB.pers.call("getNotes", payload, cb);}, 
	    note_creator: function(payload, cb){NB.pers.call("saveNote", payload, cb);},
	    note_editor: function(payload, cb){NB.pers.call("editNote", payload, cb);},
	    note_deleter: function(payload, cb){NB.pers.call("deleteNote", payload, cb);},
	    note_marker: function(payload, cb){NB.pers.call("markNote", payload, cb);},
	    admin_data: function(payload, cb){NB.pers.call("getAdminData", payload, cb);},
	    poll_getter:  function(payload, cb){
		payload["types"] = ["polls", "choices", "responses", "polls_stats"];
		NB.pers.call("getObjects", payload, function(p){
			NB.pers.store.o.polls = p.polls;
			NB.pers.store.o.choices = p.choices;
			NB.pers.store.o.responses = p.responses;
			NB.pers.store.o.polls_stats = p.polls_stats;
			cb(p);
		    });},
	    poll_editor: function(payload, cb){NB.pers.call("editPoll", payload, cb);}, 
	    source_id_getter: function(payload, cb){NB.pers.call("request_source_id", payload, cb);}, 
	    object_getter: function(payload, cb){NB.pers.call("getObjects",payload, cb);}, 
	    presearch:  function(payload, cb){NB.pers.call("presearch",payload, cb);}, 
	    members_getter: function(payload, cb){
		NB.pers.call("getMembers",payload, function(p){
			NB.pers.store.o.member = p;
			cb(p);
		    });}, 
	    invite_sender: function(payload, cb){
		NB.pers.call("sendInvites", payload, cb);
	    }, 
	    file_adder: function(payload, cb){
		let id_ensemble = payload.id_ensemble;
		NB.pers.addFile(id_ensemble);
		if (cb){
		    cb();
		}
	    }, 
	    member_adder: function(payload, cb){
		let id_ensemble = payload.id_ensemble;
		NB.pers.addMember(id_ensemble);
		if (cb){
		    cb();
		}
	    }, 
	    addExhibitListener: function(payload, cb){
		let args = {};
		args[payload.event_type] = cb;
		window.exhibit._collectionMap[payload.id_collection].addListener(args);
	    }, 
	    whoami: function(){
		return $("#user_settings").attr("uid");
	    }
	    
	});
    $.concierge.setRemoteLogger(function(payload, cb){NB.pers.call("remote_log", payload, cb);}, 60000);
    
    //new docs paradigm:
    NB.pers.store = new NB.models.Store(true);

    /* Convention for exhibit properties: 
       key: name of field in initial object ex: ID_ensemble. To the initial object, we add another field, where 
       field: ... is its name (ex: "ensemble" and its value is the concatenation of
       type: ... (ex: "ensemble" ) and the original id of the object, 
       ...this way, the object is augmented with a field that unamiguously references another object in the exhibit store
       If we don't want to add extra fields but still add exhibit properties, just don't specify a type, but DO specify a field, which is passed to Exhibit as the name of the field that has the given property . 
    */
    NB.pers.store.create(payload, {
	    ensemble:{fieldName: "ensembles"}, 
		folder: {fieldName: "folders"}, 
		gradee: {fieldName: "gradees"},
		link: {fieldName: "links"},
		file:{fieldName: "files", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "ensemble", props: {valueType: "item"}}}}, 
		location:{fieldName: "locations", exhibit_properties:{id_source: {type: "file", field: "file", props: {valueType: "item"}}, top: { field: "top", props:{valueType: "number"}}}},
		comment:{fieldName: "comments", exhibit_properties:{ID_location: {type: "location", field: "location", props: {valueType: "item"}}, id_author: {type: "gradee", field: "gradee", props: {valueType: "item"}}}}, 
		file_stats:{fieldName: "file_stats", exhibit_properties:{ID_source: {type: "file", field: "stat_id_file", props: {valueType: "item"}}}}, 
		ensemble_stats:{fieldName: "ensemble_stats", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "stat_id_ensemble", props: {valueType: "item"}}}}, 
		ensemble_stats2:{fieldName: "ensemble_stats2", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "stat2_id_ensemble", props: {valueType: "item"}}}}, 
		mark:{fieldName: "marks" , exhibit_properties:{ID: {type: "comment", field: "comment", props: {valueType: "item"}}}}
	});

    NB.pers.store.o.settings = payload.settings;
    $("#view-5").pollView('set_model', NB.pers.store);

    //get a second round of objects (we need an id for these: )
    NB.pers.store.o.seen={};//SACHA Fixme: Workaround for performance.
    NB.pers.call("getGradees",{}, function(p2){
	    NB.pers.store.add("gradee", p2.gradees);
	});
    NB.pers.store.addIndex("ensemble", "file", "ID_ensemble");
    $("#view-10").thumbnailView('set_model', NB.pers.store);
    $("#view-7").notepaneView();
    $("#obs-1").noteObserver();
    $("#obs-1").noteObserver('set_model', NB.pers.store);

    $.concierge.addFactory("file", "doc_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, NB.pers.store.o.file[id].title );
	    $("#"+view_id).docView({img_server: NB.conf.servers.img, invite_key: NB.conf.identity});
	    $("#"+view_id).docView('set_model',NB.pers.store );
	});
    
    $.concierge.addFactory("ensemble", "ensemble_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id,  NB.pers.store.o.ensemble[id].name );
	    $("#"+view_id).ensembleView();
	    $("#"+view_id).ensembleView('set_model',NB.pers.store );
	});
    $.concierge.addFactory("admin", "admin_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "Admin");
	    $("#"+view_id).adminView();
	    $("#"+view_id).adminView('set_model',NB.pers.store );
	});

    $.concierge.addFactory("mynotes", "mynotes_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "My Notes");
	    $("#"+view_id).mynotesView();
	    $("#"+view_id).mynotesView('set_model',NB.pers.store );
	});
    NB.pers.ex1 = Exhibit.create(NB.pers.store.db);
    window.exhibit = NB.pers.ex1; // fix to make tabular views work
    define_headless_facet(); //hack for chrome
    NB.pers.ex1.configureFromDOM();
    Exhibit.Functions["false2null"] = {
	f: function(args) {
	    var arg=args[0]._values[0];
	    $.L(arg);
	    return new Exhibit.Expression._Collection(arg ? [arg]: [], arg ? "boolean": null);
	}
    };
    Exhibit.Functions["labelif"] = {
	f: function(args) {
	    var arg=args[0]._values[0];
	    return new Exhibit.Expression._Collection(arg ? [args[1]._values[0]]: [], "text");
	}
    };
    $("#view-7").notepaneView('set_model', NB.pers.store);
    $("#view-92").fileView('set_model', NB.pers.store);

    //OK now, that this is done, let's look at URL parameters: 
    if ("location" in NB.pers.params){
	let rpc_args = {id:NB.pers.params.location};
	if ("org" in  NB.pers.params){
	    rpc_args.org = NB.pers.params.org;
	}
	NB.pers.call("get_location_info", rpc_args, function(p){
		let location = p.locations[NB.pers.params.location];
		NB.pers.on_file(null,location.id_source);
		if (location.page == 0){//global comment
		    NB.pers.expandGlobalComments();
		}
		else{
		    $.concierge.trigger({type:"page", value: location.page});
		}
		//SACHA: FIXME Dirty hack to have to wait for rendering... 
		//and set selection style ourselves
		window.setTimeout(function(){
			$.concierge.trigger({type:"sel_click", value: location.ID});
			$.concierge.trigger({type:"note_click", value: location.ID});
			$("div.selection[id_item="+location.ID+"], div.location-lens[id_item="+location.ID+"]").css({
				"border-width": "5px", 
				    "border-color": "#FF0000"});

		    }, 3000);
	    } );
    }
    if ("reply" in NB.pers.params){
	NB.pers.goToNote(NB.pers.params.reply, true);
    }
    if ("comment" in NB.pers.params){
	NB.pers.goToNote(NB.pers.params.comment, false);
    }
    if ("view" in NB.pers.params){
	let view = NB.pers.params.view;
	if (view=="settings"){
	    NB.pers.settings_menu();
	}
	if ((view=="addFile") && ("id_ensemble" in NB.pers.params)){
	    NB.pers.addFile(NB.pers.params.id_ensemble);
	}
	if ((view=="addMember") && ("id_ensemble" in NB.pers.params)){
	    NB.pers.addMember(NB.pers.params.id_ensemble);
	}
    }

    // populate new "at a glance" view:		      
    let $aag = $("#aag2");
    let s = "<thead><tr><th>Name</th><th>Info</th><th/></tr></thead><tbody>";
    let S2 =  NB.pers.store.o.ensemble_stats2;
    let E = NB.pers.store.o.ensemble;
    if("id_ensemble" in NB.pers.params){
	$("#restricted_ensemble_name").text(E[NB.pers.params.id_ensemble].name);
	$("#restricted_ensemble").show();
    }
    else{
	$("#all_ensembles").show();
    }
    if ("id_source" in NB.pers.params){
	NB.pers.on_file(null,NB.pers.params.id_source);
    }
    let lens = function(j){
	let admin_cmds="";
	let auth_msg = "<span class='caption'>You haven't written any comments yet.</span><br/>";
	let unanswered_msg="<span class='caption'>No unanswered questions at this time.</span><br/>";
	let favorite_msg = "<span class='caption'>No favorite notes yet...  <a href='/glossary#item-favorite'>(What's this?)</a></span> <br/>";
	if (E[j].admin==1){
	    admin_cmds="<a href='javascript:NB.pers.addFile("+j+")' class='add_file'>Add a File</a><br/> <a href='javascript:NB.pers.addMember("+j+")' class='add_member'>Invite users</a><br/>  ";
	}
	if (S2[j].locs_unanswered != 0){
	    unanswered_msg = "<a href='/collage/?view=unanswered&amp;id_ensemble="+j+"'>"+S2[j].unanswered+"</a> <span class='caption'> replies are being requested on </span> <a href='/collage/?view=unanswered&amp;id_ensemble="+j+"'>"+S2[j].locs_unanswered+"</a> <span class='caption'>threads</span><br/>";
	}
	if (S2[j].auth != 0){
	    auth_msg = "<a href='/collage/?view=newauth&amp;id_ensemble="+j+"'>"+S2[j].newauth+"</a> <span class='caption'> unseen replies related to my </span> <a href='/collage/?view=auth&amp;id_ensemble="+j+"'>"+S2[j].auth+"</a> <span class='caption'>comments</span><br/>";
	}
	if (S2[j].favorite != 0){
	    favorite_msg = "<a href='/collage/?view=newfavorite&amp;id_ensemble="+j+"'>"+S2[j].newfavorite+"</a> <span class='caption'> unseen replies related to my </span> <a href='/collage/?view=favorite&amp;id_ensemble="+j+"'>"+S2[j].favorite+"</a> <span class='caption'> <em>favorite</em> comments</span><br/>";
	}
	return "<tr id_item='"+j+"'><td><a href='?id_ensemble="+j+"'>"+E[j].name+"</a></td><td>"+auth_msg+unanswered_msg+favorite_msg+"</td><td>"+admin_cmds+"<a class='view_details' href='javascript:NB.pers.ensemble_menu(null, "+j+")'>View details...</a><br/><a class='view_details' href='javascript:NB.pers.onsearch("+j+")'>Search...</a></td></tr>";
    }
    // SACHA: Proof of concept. 
    //    $.concierge.lenses=[lens];
    for (let i in S2){
	s += lens(i);
    }
    s+="</tbody>";
    $aag.append(s);
    $aag.tablesorter();
};

NB.pers.onglobalsearch = function(){    
    NB.pers.onsearch(0);
    let v = $("#global-search-text")[0].value;
    $("#search_dialog_text")[0].value = v;
    if (v!= ""){ //do a pre-search
	NB.pers.onsearchkey();
    }
};

NB.pers.onsearch = function(id_ensemble){
    let ensemble_str = "";
    let ensembles = NB.pers.store.o.ensemble;
    let check_str = "";
    //cleanup: 
    let sdt = $("#search_dialog_text")[0];
    sdt.value="";
    
    $("#search-dialog-results").empty();
    $("#search-dialog-begin,#search-dialog-end,#search-dialog-count").text("0");
    for (let i in ensembles){
	check_str = (id_ensemble=="0"||id_ensemble==i) ? "checked='true'" : "";
	ensemble_str += "<div><input type='checkbox' onchange='NB.pers.onsearchkey(event)' "+check_str+" id='search_group_"+i+"' id_ensemble='"+i+"'/> <label for='search_group_"+i+"'>"+ensembles[i].name+"</label></div>";
    }
    let sde = $("#search_dialog_ensemble").html(ensemble_str);
    $("#search_dialog").dialog({
	    title: "Search Annotations...", 
		width: 550, 
		height: 560,
		buttons: { 
		"Close": function() { 
		    $(this).dialog("close");  
		},
		    "Open in Collage View": function(){
			if (NB.pers.id_search != 0){
			    window.open("/?t=p24&view=search&id_search="+NB.pers.id_search);
			}
		    }
	    }
	});
    $("#search_dialog").dialog("open");
    sdt.focus();
    if (id_ensemble!=0){ //make sure checked element is visible
	sde[0].scrollTop+=($("#search_group_"+id_ensemble).offset().top-sde.offset().top)
	    }
};



NB.pers.preSearchPage = function(){
    let page_offset = NB.pers.search_page_offset;
    let search_text = $("#search_dialog_text")[0].value;
    let ids_ensemble = [];
    $("#search_dialog_ensemble input:checked").each(function(){ids_ensemble.push(this.getAttribute("id_ensemble"));});
    //ids_ensemble = ids_ensemble.join(",");
    let div=$("#search-dialog-results");
    let cnt = $("#search-dialog-count").empty();
    div.append('<div align="center" style="position: relative;"><img src="/data/img/spinner.gif" style="position: absolute; top: 120px;"/></div>');
    $.concierge.get_component("presearch")({"id_ensemble": ids_ensemble, "text": search_text, page_offset: page_offset}, function(payload){
	    div.empty();
	    let items = payload.items;
	    let b = 	$("#search-dialog-buttonprevious");
	    if(payload.begin>1){
		b.removeAttr("disabled");
	    }
	    else{
		b.attr("disabled", true);
	    }
	    $("#search-dialog-begin").text(payload.begin);
	    b = 	$("#search-dialog-buttonnext");
	    if(payload.end<payload.total){
		b.removeAttr("disabled");
	    }
	    else{
		b.attr("disabled", true);
	    }
	    $("#search-dialog-end").text(payload.end);
	    NB.pers.id_search = payload.id_search;
	    cnt.text(payload.total);
	    let i = null;
	    for (i in items){
		let a = items[i];
		let title = NB.pers.store.o.file[a.id_source].title;
		let ensemble = NB.pers.store.o.ensemble[a.id_ensemble].name;
		let page_str = a.page==0 ? "(global comment)":"(page "+a.page+")";
		let parent_str = a.id_parent== null ? "": "<br/><span class='searchparent'><em>in reply to...</em><br/>"+payload.parents[a.id_parent].body+" </span>";
		div.append("<div class='search-result'><span class='searchresult-meta'> "+ensemble+" <a class='searchurl' href='/?comment="+a.ID+"'>url</a>   </span><a href='javascript:NB.pers.goToNote("+a.ID+", false)'>"+title+" "+page_str+"</a> <span class='searchresult'><br/>"+a.body+"</span>"+parent_str+"</div>");
	    }
	    let to_highlight = search_text.split(" ");
	    let results = $("span.searchresult", div);
	    for (let j in to_highlight){
		results.highlight(to_highlight[j]);
	    }
	    if (i == null){
		div.append("<em>No match found</em> for <b>"+search_text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</b>");
	    }
	});
};

NB.pers.onsearchkey=function(event){
    if (NB.pers.search_timerID != null){
	window.clearTimeout(NB.pers.search_timerID);
	NB.pers.search_timerID = null;
    }    
    NB.pers.search_page_offset = 0;
    NB.pers.search_timerID = window.setTimeout(NB.pers.preSearchPage, 300);
};

NB.pers.on_file = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"file", value: id_item});
};

NB.pers.on_note = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"note", value: id_item});
};

NB.pers.on_setting_change = function(event){
    let t = event.currentTarget;
    let id_item = t.getAttribute("id_item");
    NB.pers.newSettings[id_item] = t.options[t.selectedIndex].value;
}; 


NB.pers.validateNewPassword = function(event){
    let savebutton =  $("#settings_panel").parent().find("button:contains(Save)");
    if ($("#new_password1")[0].value == $("#new_password2")[0].value){
	savebutton.removeClass("ui-state-disabled").removeAttr("disabled");
	$("#newpassword_msg").text("Passwords match OK !"); 
    }
    else{
	savebutton.addClass("ui-state-disabled").attr("disabled", "disabled");
	$("#newpassword_msg").html("<span style='color: #FF0000;'>Passwords don't match...</span>"); 

    }
};


NB.pers.goToNote = function(id, doEditor){
    let rpc_args = {id:id};
    if ("org" in  NB.pers.params){
	rpc_args.org = NB.pers.params.org;
    }
    NB.pers.call("get_comment_info", rpc_args, function(p){
	    let note = p.comments[id];
	    let location = p.locations[note.ID_location];
	    NB.pers.on_file(null,location.id_source);
	    if (location.page == 0){//global comment
		NB.pers.expandGlobalComments();
	    }
	    else{
		$.concierge.trigger({type:"page", value: location.page});
	    }
	    window.setTimeout(function(){
		    //			$.concierge.trigger({type:"sel_click", value: location.ID});
		    //$.concierge.trigger({type:"note_click", value: location.ID});
		    $("div.selection[id_item="+location.ID+"], div.note-lens[id_item="+note.ID+"]").css({
			    "border-width": "5px", 
			    "border-color": "#FF0000"});
			
		    $("div.location-lens[id_item="+location.ID+"]").children("div.location-header").click();
		    let notelens = $("div.note-lens[id_item="+note.ID+"]");
		    notelens[0].scrollIntoView();

		    if (doEditor){ //can't use jquuery .closest(".notepaneView") since the note may me global (i.e not inside a notepaneview)
			let npv = null;
			let v;
			for (let i in $.concierge.views){
			    v=$.concierge.views[i];
			    if (v.widgetName=="notepaneView"){
				npv=v;
				break;
			    }
			}
			if (npv != null){
			    npv.editorFactory(notelens.children()[0]);
			}
		    }

		}, 4000);
	});
};

NB.pers.settings_menu = function(id){
    NB.pers.newSettings={};
    $("select.settings_selector").each(function(){
	    let elt = $(this);
	    elt.empty();
	    let id_item = this.getAttribute("id_item");
	    let labels = NB.pers.store.o.settings.labels[id_item];
	    let saved_value =  NB.pers.store.o.settings.values[id_item];
	    let default_str;
	    for (let v in labels){
		default_str = (saved_value==v) ? ' selected="true" ': '' ;
		elt.append('<option '+default_str+' value="'+v+'">'+labels[v]+'</option>');
	    }

	});
    let f_cleanup = function($dlg, do_save){
	if (do_save){
	    let passwd = $("#new_password1")[0].value;
	    if (passwd != ""){
		NB.pers.newSettings["__PASSWD__"] = passwd;
		$("#newpassword_msg").hide();
		$("#new_password1")[0].value="";
		$("#new_password2")[0].value="";
	    }
	    NB.pers.call("save_settings", NB.pers.newSettings, function(){
		    //update new settings
		    for (let name in NB.pers.newSettings){
			if (name != "__PASSWD__"){
			    NB.pers.store.o.settings.values[name] = NB.pers.newSettings[name];
			}
		    }
		});
	}
	$dlg.dialog("close");
    };
    $("#settings_panel").dialog({
	    title: "Settings...", 
		modal: true, 
		width: 800, 
		height: 300,
		buttons: {
		"Cancel": function() { 
		    f_cleanup($(this), false);
		},
		    "Save Changes": function() {
			f_cleanup($(this), true);
		    }
	    }
	}
	);
    $("#settings_panel").dialog("open");
};


NB.pers.admin_menu = function(id){
    $.concierge.trigger({type:"admin", value: 0});
};

NB.pers.ensemble_menu = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"ensemble", value: id_item});
};

NB.pers.myNotes = function(viewtype){
    window.open("/?t=p24&view="+viewtype);
};


NB.pers.addMember = function(id_ensemble){
    $("#invite_dialog_ensemble").html("<option id_ensemble='"+id_ensemble+"'>"+NB.pers.store.o.ensemble[id_ensemble].name+"</option>").attr("disabled", "disabled");
    $("#invite_dialog").dialog({
	    title: "Send an invitation...", 
		width: 550, 
		height: 550,
		buttons: { 
		"Cancel": function() { 
		    $(this).dialog("close");  
		},
		    "Ok": function() {
			var to = $("#invite_dialog_emails")[0].value;
			var msg = $("#invite_dialog_msg")[0].value;
			var admin = $("#invite_dialog_admin:checked").length;
			$.concierge.get_component("invite_sender")({"id_channel": id_ensemble, "to": to, "msg": msg, "admin": admin}, function(){
				$.I("Invite Sent !");
			    });
			$(this).dialog("close");  
		    }
	    }
	});
    $("#invite_dialog").dialog("open");
};

NB.pers.expandGlobalComments = function(){
    $("#global_comment_dialog").dialog({
	    title: "Global Comments...", 
	    width: 800,
	    height: 600,
	    buttons: {
		"Done": function() { 
		    $(this).dialog("close");  
		}
	    }
	});
    $("#global_comment_dialog").dialog("open");
};

NB.pers.addFile = function(id_ensemble){
    NB.pers.currentEnsemble = id_ensemble;
    $("#add_file_ensemble").html("<option id_ensemble='"+NB.pers.currentEnsemble+"'>"+NB.pers.store.o.ensemble[NB.pers.currentEnsemble].name+"</option>").attr("disabled", "disabled");
    $('#add_file_dialog').dialog({
	    title: "Add a PDF File...", 
		width: 390,
		buttons: { 
		"Cancel": function() { 
		    $(this).dialog("close");  
		},
		    "Ok": function() { 
			$.concierge.get_component("source_id_getter")({}, NB.pers.proceedUpload);
			$.I("Uploading in progress...");
		    }
	    }
	});
    $('#add_file_dialog').dialog("open");
};

NB.pers.proceedUpload = function(payload){
    var form = $("#file_upload_form")[0];
    // we need a way to pass the id_ensemble: we do it in the URL
    form.setAttribute("action", NB.conf.servers.upload+"/pdf3/upload?id_ensemble="+NB.pers.currentEnsemble+"&id_source="+ payload.id_source);
    form.submit();
    //$.I("File added to remote repository");    
    $('#add_file_dialog').dialog("destroy");
    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function(){
	    //NOTE (important !) 
	    $.I("NB is processing your file... You should receive an email once your file is available on NB."); 
	    let payload_objects = {types:["files"],  id: payload.id_source};
	    if ("id_ensemble" in NB.pers.params){
		payload_objects["payload"]= {id_ensemble: NB.pers.params.id_ensemble};
	    }
	    NB.pers.call("getObjects", payload_objects, function(p){
		    NB.pers.store.add("file", p.files);
		} );
	}, 3000);
};

NB.pers.adminToggle = function(evt){
    let t = $(evt.currentTarget);
    t.siblings("ul").toggle();
    t.parent().parent().toggleClass("openfolder");
};
