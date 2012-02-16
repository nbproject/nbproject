/*
 * your_settings.js: 
 * Requires the following modules:
 *		Module
 *		NB
 *		NB.auth
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
    Module.require("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.init = function(){
    //get data: 
    var payload_objects = {types: ["settings"]};
    NB.pers.call("getObjects",payload_objects, NB.pers.createStore);
    $.concierge.addComponents({});
}


    
NB.pers.createStore = function(payload){
    NB.pers.store = new NB.models.Store();
    NB.pers.store.create(payload.settings, {
	    ds: 	{pFieldName: "ds"},
		us: 	{pFieldName: "us"},
		sl: 	{pFieldName: "sl"}
	});
    NB.pers.settings_menu();
};

NB.pers.validateNewPassword = function(event){
    var savebutton =  $("#save_button");
    if ($("#new_password1")[0].value == $("#new_password2")[0].value){
	savebutton.removeAttr("disabled");
	$("#newpassword_msg").text("Passwords match"); 
    }
    else{
	savebutton.attr("disabled", "disabled");
	$("#newpassword_msg").html("<span style='color: #FF0000;'>Passwords don't match...</span>"); 

    }
};

NB.pers.on_setting_change = function(event){
    var t = event.currentTarget;
    var id_item = t.getAttribute("id_item");
    NB.pers.newSettings[id_item] = t.options[t.selectedIndex].value;
}; 


NB.pers.settings_menu = function(){
    NB.pers.newSettings={};
    $("select.settings_selector").each(function(){
	    var m = NB.pers.store;
	    var elt = $(this);
	    elt.empty();

	    var id_item = this.getAttribute("id_item");
	    id_item = m.get("ds", {name: id_item}).first().id;
	    var labels = m.get("sl",{setting_id: id_item}).items;
	    var set_value =  m.o.ds[id_item].value;
	    var us = m.get("us", {setting_id: id_item}).first();
	    if (us != null){
		set_value =  us.value;
	    }
	    var default_str, l;
	    for (var v in labels){
		l = labels[v]
		default_str = (set_value==l.value) ? ' selected="true" ': '' ;
		elt.append('<option '+default_str+' value="'+l.value+'">'+l.label+'</option>');
	    }

	});
    var f_cleanup = function(do_save){
	if (do_save){
	    var passwd = $("#new_password1")[0].value;
	    if (passwd != ""){
		NB.pers.newSettings["__PASSWD__"] = passwd;
		$("#newpassword_msg").hide();
		$("#new_password1")[0].value="";
		$("#new_password2")[0].value="";
	    }
	    NB.pers.call("save_settings", NB.pers.newSettings, function(payload){
		    //update new settings
		    NB.pers.store.add("us", payload.settings.us);		    
		});
	    $.I("Your changes have been saved...");
	}
    };
    $("#cancel_button").click(function(){f_cleanup(false);});
    $("#save_button").click(function(){f_cleanup(true);});
    var u = NB.conf.userinfo;
    $("#your_firstname").text(u.firstname);
    $("#your_lastname").text(u.lastname);
};

