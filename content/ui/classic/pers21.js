/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.auth
 *		NB.rpc
 *		jquery
 *
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.auth", 0.1);
    Module.require("NB.rpc", 0.1);
    Module.createNamespace("NB.pers", 0.1);
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

$(document).ready(function(){
	//    NB.debug("in ready() !");
	NB.pers.params = NB.dom.getParams();
	//if email and password provided by server, set them as cookies for auto-login
	//so that we're authenticated for subsequent function calls
	if ($("#user_settings").attr("email") != ""){
	    NB.auth.set_cookie ("email",$("#user_settings").attr("email") );
	    NB.auth.set_cookie ("password",$("#user_settings").attr("password"));
	}

	//init the observer machinery:
	NB.observer.register("/__RESPONDER", {
		"SAYHELLO": function(event){$.L("hello", event);}
	    });

	//Tell View system about events hierarchy: 
	$.concierge.setHierarchy({
		file: {visibility: true, page: 1, zoom: 1.05}, note_hover:{}, note_out: {}, notes_loaded_for_file:{}, note:{},new_notes:{}, settings:{}, admin:{}, global_editor:{}, mynotes:{} });
	$.concierge.setConstants({res: 288, scale: 25});
	
	NB.pers.call("getStats", {},function(payload){
		/*
		$("#mystats_auth").text(payload.auth);
		$("#mystats_question").text(payload.question);
		$("#mystats_unclear").text(payload.unclear);
		$("#mystats_newauth").text(payload.newauth);
		$("#mystats_newquestion").text(payload.newquestion);
		$("#mystats_newunclear").text(payload.newunclear);
		$("#mystats_newquestion_group").text(payload.newquestion_group);
		$("#mystats_question_group").text(payload.question_group);
		$("#mystats_newunclear_group").text(payload.newunclear_group);
		$("#mystats_unclear_group").text(payload.unclear_group);
		$("#mystats_newauth_group").text(payload.newauth_group);
		$("#mystats_auth_group").text(payload.auth_group);
		$("#mystats_auth_grader").text(payload.auth_grader);
		$("#mystats_newauth_grader").text(payload.newauth_grader);
		*/
		if (payload.num_admin > 1){
		    $("#adminlink").show();
		}

		$.concierge.addConstants(payload); //SACHA: FIXME Hack 
	    });
	NB.pers.call("getObjects",{types: ["ensembles", "folders", "files", "assignments", "marks", "settings", "file_stats", "ensemble_stats", "ensemble_stats2"]},NB.pers.on_getStore);
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
	$("#view-10").thumbnailView();
	$("#view-5").pollView();
	$("#view-92").fileView();
	$("#pers1").perspective("update");
	let __addSection = function(){
	    let title = this.getAttribute("label");
	    //    $("#toc").append("<a href='#"+this.id+"'>"+title+"</a>");
	    $(this).children().wrapAll("<div class='section-body'></div>");
	    $(this).prepend("<div class='section-header'>"+title+"</div>");

	};

	$("div.section").each(__addSection);
    });



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
	});
    $.concierge.setRemoteLogger(function(payload, cb){NB.pers.call("remote_log", payload, cb);}, 60000);
    
    //new docs paradigm:
    NB.pers.store = new NB.models.Store(true);
    NB.pers.store.create(payload, {
	    ensemble:{fieldName: "ensembles"}, 
		folder: {fieldName: "folders"}, 
		gradee: {fieldName: "gradees"},
		file:{fieldName: "files", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "ensemble", props: {valueType: "item"}}}}, 
		location:{fieldName: "locations", exhibit_properties:{id_source: {type: "file", field: "file", props: {valueType: "item"}}}},
		comment:{fieldName: "comments", exhibit_properties:{ID_location: {type: "location", field: "location", props: {valueType: "item"}}, id_author: {type: "gradee", field: "gradee", props: {valueType: "item"}}}}, 
		assignment:{fieldName: "assignments", exhibit_properties:{ID_source: {type: "file", field: "file", props: {valueType: "item"}}}}, 
		file_stats:{fieldName: "file_stats", exhibit_properties:{ID_source: {type: "file", field: "stat_id_file", props: {valueType: "item"}}}}, 
		ensemble_stats:{fieldName: "ensemble_stats", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "stat_id_ensemble", props: {valueType: "item"}}}}, 
		ensemble_stats2:{fieldName: "ensemble_stats2", exhibit_properties:{ID_ensemble: {type: "ensemble", field: "stat2_id_ensemble", props: {valueType: "item"}}}}, 
		mark:{fieldName: "marks" , exhibit_properties:{ID: {type: "comment", field: "comment", props: {valueType: "item"}}}}
	});
    NB.pers.store.o.settings = payload.settings;
    $("#view-5").pollView('set_model', NB.pers.store);

    //get a second round of objects (we need an id for these: )
    /*

      NB.pers.call("getObjects", {types:["polls", "choices", "responses"], id: 0}, function(p){
      NB.pers.store.o.polls = p.polls;
      NB.pers.store.o.choices = p.choices;
      NB.pers.store.o.responses = p.responses;
      $("#view-5").pollView('set_model', NB.pers.store);
      });
    */  

    
    NB.pers.store.o.seen={};//SACHA Fixme: Workaround for performance.
    NB.pers.call("getGradees",{}, function(p2){
	    NB.pers.store.add("gradee", p2.gradees);
	});
    NB.pers.store.addIndex("ensemble", "file", "ID_ensemble");
    $("#view-10").thumbnailView('set_model', NB.pers.store);
    $("#view-7").notepaneView();
    $("#view-7").notepaneView('set_model', NB.pers.store);
    $("#obs-1").noteObserver();
    $("#obs-1").noteObserver('set_model', NB.pers.store);

    $.concierge.addFactory("file", "doc_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, NB.pers.store.o.file[id].title );
	    $("#"+view_id).docView();
	    $("#"+view_id).docView('set_model',NB.pers.store );
	});
    
    $.concierge.addFactory("ensemble", "ensemble_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id,  NB.pers.store.o.ensemble[id].name );
	    $("#"+view_id).ensembleView();
	    $("#"+view_id).ensembleView('set_model',NB.pers.store );
	});




    /*
      $.concierge.addFactory("settings", "settings_viewer", function(id){
      let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "Settings");
      $("#"+view_id).settingsView();
      $("#"+view_id).settingsView('set_model',NB.pers.store );
      });
    */
    $.concierge.addFactory("admin", "admin_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "Admin");
	    $("#"+view_id).adminView();
	    $("#"+view_id).adminView('set_model',NB.pers.store );
	    /*
	      //now this is done initially
	    NB.pers.call("getObjects",{types: ["file_stats", "ensemble_stats"]}, function(p){
		    NB.pers.store.add("file_stats", p.file_stats);
		    NB.pers.store.add("ensemble_stats", p.ensemble_stats);

		});

	    */
	    
	});

    $.concierge.addFactory("mynotes", "mynotes_viewer", function(id){
	    let view_id =  $("#viewport2").viewport("newView", "tab_"+id, "My Notes");
	    $("#"+view_id).mynotesView();
	    $("#"+view_id).mynotesView('set_model',NB.pers.store );
	});
    NB.pers.ex1 = Exhibit.create(NB.pers.store.db);
    window.exhibit = NB.pers.ex1; // fix to make tabular views work
    NB.pers.ex1.configureFromDOM();
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
		$.concierge.trigger({type:"page", value: location.page});
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
    let s = "<thead><tr><th>Group</th><th>Info</th><th/></tr></thead><tbody>";
    let S1 =  NB.pers.store.o.ensemble; //to test if admin
    let S2 =  NB.pers.store.o.ensemble_stats2;
    let E = NB.pers.store.o.ensemble;
    let lens = function(j){
	let a="";
	if (S1[j].admin==1){
	    a="<a href='javascript:NB.pers.addFile("+j+")' class='add_file'>Add a File</a><br/> <a href='javascript:NB.pers.addMember("+j+")' class='add_member'>Invite users</a>  ";
	}
	return "<tr id_item='"+j+"'><td>"+E[j].name+"</td><td><a href='?t=p20&amp;view=newauth&amp;id_ensemble="+j+"'>"+S2[j].newauth+"</a> <span class='caption'> unseen replies related to my </span> <a href='?t=p20&amp;view=auth&amp;id_ensemble="+j+"'>"+S2[j].auth+"</a> <span class='caption'>comments</span></td><td>"+a+"</td></tr>";
    }
    // SACHA: Proof of concept. 
    //    $.concierge.lenses=[lens];
    for (let i in S2){
	s += lens(i);
    }
    s+="</tbody>";
    $aag.append(s);
    $aag.tablesorter();
    //    $("#view-5-outer").css({"max-height": "100%", "overflow-y": "auto"});
};

NB.pers.call = function(fctname, dict, callback, nowait){
    if (!(nowait)){
	document.body.style.cursor="wait";
    }
    NB.rpc.rpc_json("pdf2/rpc", fctname,[dict],NB.rpc.__callback, {"cb": callback});
};


NB.pers.on_file = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"file", value: id_item});
};

NB.pers.on_note = function(evt, id){
    let id_item = evt ? evt.currentTarget.getAttribute("id_item"):id;
    $.concierge.trigger({type:"note", value: id_item});
};

NB.pers.logout = function(){
    NB.auth.delete_cookie("email");
    NB.auth.delete_cookie("password");
    document.location ="http://"+document.location.host;
};


NB.pers.on_setting_change = function(event){
    let t = event.currentTarget;
    let id_item = t.getAttribute("id_item");
    NB.pers.newSettings[id_item] = t.options[t.selectedIndex].value;
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
	    NB.pers.call("save_settings", NB.pers.newSettings, function(){
		    //update new settings
		    for (let name in NB.pers.newSettings){
			NB.pers.store.o.settings.values[name] = NB.pers.newSettings[name];
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
    window.open("/?t=p20&view="+viewtype);
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
    form.setAttribute("action", "/pdf2/upload?id_ensemble="+NB.pers.currentEnsemble+"&id_source="+ payload.id_source);
    form.submit();
    //$.I("File added to remote repository");    
    $('#add_file_dialog').dialog("destroy");
    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function(){
	    //NOTE (important !) 
	    $.I("File added to remote repository");    
	    NB.pers.call("getObjects", {types:["files"],  id: payload.id_source}, function(p){
		    NB.pers.store.add("file", p.files);
		} );
	}, 3000);
};

NB.pers.adminToggle = function(evt){
    let t = $(evt.currentTarget);
    t.siblings("ul").toggle();
    t.parent().parent().toggleClass("openfolder");
};
