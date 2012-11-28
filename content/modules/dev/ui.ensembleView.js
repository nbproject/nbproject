/* ensembleView Plugin
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
	_init: function() {
	    $.ui.view.prototype._init.call(this);
	    var self = this;
	    //var that=this;
	    self._bring_to_front();
	    self.repaint();
	    self.element.addClass("ensembleView");
	},
	addMember: function(){
		var self = this;
		let current_ensemble = $.concierge.get_state("ensemble");
		$("#invite_dialog_ensemble").html("<option id_ensemble='"+current_ensemble+"'>"+self._getData('model').o.ensemble[current_ensemble].name+"</option>").attr("disabled", "disabled");
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
				    $.concierge.get_component("invite_sender")({"id_channel": current_ensemble, "to": to, "msg": msg, "admin": admin}, function(){
					    $.I("Invite Sent !");
					});
				    $(this).dialog("close");  
				    
				}
			}
		    });
		$("#invite_dialog").dialog("open");
	    },
	_fill_files: function(){
		var self = this;
		let model = self._getData('model');
		//let current_ensemble = $.concierge.get_state("ensemble");
		let current_ensemble =  self._getData('ensemble');
		let sel = model.indexes.ensemble.file[current_ensemble];
		let table = $("table.list[items=files]", self.element);
		let objs = model.o.file;
		let S2 = model.o.file_stats;
		let o = false;
		let total_msg = "";
		let viewname = "auth_everyone";  
		if (model.o.ensemble[current_ensemble].admin){
		    viewname = "auth_admin";  
		}
		let s = "<thead><tr><th>Direct URL</th><th>Name</th><th>Total comments</th></tr></thead><tbody>";
		//		let 
		for (let i in sel){
		    o = objs[i];
		    total_msg= (i in S2)? "<a href='?t=p24&amp;view=new"+viewname+"&amp;id_source="+i+"'>"+S2[i].unseen+"</a> <span class='caption'>unseen (total: </span> <a href='?t=p24&amp;view="+viewname+"&amp;id_source="+i+"'>"+S2[i].total+"</a><span class='caption'>)</span>" : "<span class='caption'>No annotations yet...</span>";
		    s+=("<tr><td class='file_directurl'><a href='/?id_source="+i+"'>"+i+"</a></td><td><a href='javascript:$.concierge.trigger({type:\"file\", value: "+i+"})'>"+o.title+"</a> </td><td>"+total_msg+"</td></tr>");
		}
		if (o==false){
		    table.append("<tr><td>This group doesn't contain any files yet.</td></tr>");
		}
		else{
		    s+="</tbody>";
		    table.append(s).tablesorter();
		}
	    }, 
	_fill_members: function(){
		var self = this;
		let model = self._getData('model');
		let current_ensemble = $.concierge.get_state("ensemble");
		let table = $("table.list[items=members]", self.element);
		let objs = model.o.member;
		let o;
		let s = "<thead><tr><th>email</th><th>Admin</th><th>Status</th></tr></thead><tbody>";
		//		table.append("<tr><th>email</th><th>Admin</th><th>Status</th></tr>");
		for (let i in objs){
		    o = objs[i];
		    let admin = (o.admin) ? "Yes": "No";
		    let status = (o.status) ? "Member": "Invite Sent";
		    s+="<tr><td>"+o.email+"</td><td>"+admin+"</td><td>"+status+"</td></tr>";
		    // table.append("<tr><td>"+o.email+"</td><td>"+admin+"</td><td>"+status+"</td></tr>");
		}
		s+="</tbody>";
		table.append(s).tablesorter();
		$("div.accordeon", self.element).accordion({fillSpace: true , collapsible: true});
	    }, 

	_defaultHandler: function(evt){
	    var self = this;
	    self._bring_to_front();

	},
	select: function(){
	}, 
	set_model: function(model){	    
	    let self=this;
	    let current_ensemble = $.concierge.get_state("ensemble");
	    //for now, we don't register to receive any particular updates.
	    model.register($.ui.view.prototype.get_adapter.call(this),  {});
	    //build view: 
	    self._setData('ensemble', current_ensemble); 
	    self._setData('model', model);
	    self.element.html("<div class='accordeon'><h3><a href='#'>Files</a></h3><div class='filetab'><div class='list2'><table items='files' class='list tablesorter'/></div></div>   </div>");
	    self._fill_files();
	    if (model.o.ensemble[current_ensemble].admin){
		$("div.filetab", self.element).prepend("<a href='javascript:void(0)' class='add_file'>Add File</a><br/>");
		$("div.accordeon", self.element).append("<h3><a href='#'>Users</a></h3><div><a href='javascript:void(0)' class='add_member'>Add User(s)</a><br/><div class='list2'><table items='members' class='list tablesorter'/> </div></div>");
		$("a.add_file", self.element).click(function(evt){
			$.concierge.get_component("file_adder")({id_ensemble: $.concierge.get_state("ensemble")});
		    });
		$("a.add_member", self.element).click(function(evt){
			$.concierge.get_component("member_adder")({id_ensemble: $.concierge.get_state("ensemble")});
		    });
		$.concierge.get_component("members_getter")({id_ensemble: current_ensemble}, function(p){self._fill_members(p);});
	    }
	},
	close: function(){
		let id =  this._getData("ensemble");
		delete $.concierge.features["ensemble_viewer"][id];
		$.ui.view.prototype.close.call(this);
		$.L("closing ensembleviewer",  id);
	    }, 
	update: function(action, payload, props){
	    var self = this;
	    $.L("[ensembleView] TODO updating:, ", action, payload, props);
	}, 
	proceedUpload: function(payload){
	    var self = this;
	    //
	    //	    let current_ensemble = $.concierge.get_state("ensemble");
	    let current_ensemble = self._getData("ensemble");
	    var form = $("#file_upload_form")[0];
	    // we need a way to pass the id_ensemble: we do it in the URL
	    form.setAttribute("action", "/pdf2/upload?id_ensemble="+current_ensemble+"&id_source="+ payload.id_source);
	    form.submit();
	    $("#add_file_dialog").dialog("destroy");
	    //SACHA TODO: Fix this when we setup connectionIds
	    window.setTimeout(function(){
		    //NOTE (important !) 
		    $.I("File added to remote repository");    
		    $.concierge.get_component("object_getter")({types:["files"],  id: payload.id_source}, function(p){
			    NB.pers.store.add("file", p.files);
			} );
		    /*
		    NB.pers.call("getObjects", {types:["files"],  id: payload.id_source}, function(p){
			    NB.pers.store.add("file", p.files);
			} );
		    */
		}, 3000);
	    }, 
	addFile: function(){
		var self = this;
		//		let model = self._getData('model');
		let current_ensemble = $.concierge.get_state("ensemble");
		$("#add_file_ensemble").html("<option id_ensemble='"+current_ensemble+"'>"+self._getData('model').o.ensemble[current_ensemble].name+"</option>").attr("disabled", "disabled");
		 $("#add_file_dialog").dialog({
			title: "Add a File...", 
			    width: 390, 
			    buttons: { 
			    "Cancel": function() { 
				$(this).dialog("close");  
			    },
				"Ok": function() {
				    $.concierge.get_component("source_id_getter")({}, self.proceedUpload);
				    $.I("Uploading in progress...");
				}
			}
		    });
		 $("#add_file_dialog").dialog("open");
	    }



    });
			 
    $.widget("ui.ensembleView",V_OBJ );
    $.ui.ensembleView.defaults = $.extend({}, {});
    $.extend($.ui.ensembleView, {
    defaults: {
    provides: ["ensemble"], 
		  listens: {
		  ensemble: null
    }		    
    },
		  getter:$.ui.view.getter
			     });
})(jQuery);
