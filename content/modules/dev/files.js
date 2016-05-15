/*
 * files.js:
 * This module defines the namespace NB.files
 * It requires the following modules:
 *        Module
 *        NB
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true alert:true NB:true*/

(function(GLOB){
    //require auth
    if ("NB$" in window){
    var $ = NB$;
    }
    GLOB.files = {};

GLOB.files.currentEnsemble = 0;
GLOB.files.currentFolder=0;
GLOB.files.model = null;
GLOB.files.labelfields = {file: "title", folder: "name"};
GLOB.files.set_model = function(model){
    GLOB.files.model = model;
    var $util_window = $.concierge.get_component("get_util_window")();
    $util_window.append("<iframe id='upload_target' name='upload_target' src='' style='display: none'></iframe>").append("<div id='add_file_dialog' > <table width='275'><tr><td><input type='radio' id='file_select' name='upload_type' value='file_select' checked></td><td><input type='radio' id='html_select' name='upload_type' value='html_select'></td><td><input type='radio' id='youtube_select' name='upload_type' value='youtube_select'></td></tr><tr><td>PDF</td><td>HTML</td><td>YouTube</td></tr></table><div id='add_file_div'> <form id='file_upload_form' target='upload_target' method='post' enctype='multipart/form-data' action='SET_IN_JS_FILE'> <table> <tr><td>Group</td><td> <select id='add_file_ensemble'/></td></tr><tr><td>Folder</td><td><select id='add_file_folder'/></td></tr><tr><td>File</td><td><input type='file' name='file' id='add_file_upload' ></input></td></tr></table></form></div><div style='display:none;' id='add_html_div'><form id='html_upload_form' target='upload_target' method='post' enctype='multipart/form-data' action=''> <table><tr><td>Title</td><td><input type='text' name='title' id='html_input_title'></input></td></tr><tr><td>URL</td><td><input type='text' name='url' id='html_input_url'></input></td></tr></table></form><br><p>Don't forget to add the NB annotation tag!  Follow the link below for more detailed instructions.</p><div><a id='add_file_html' href='#'>Detailed HTML Upload Instructions</a></div></div><div style='display:none' id='add_youtube_div'> <form id='youtube_upload_form' target='upload_target' method='post' enctype='multipart/form-data' action=''> <table><tr><td>URL</td><td><input type='text' name='url' maxlength='1024' id='youtube_input_url'></input></td></tr></table></form></table></div></div>").append("<div id='add_folder_dialog' > <table> <tr><td>Group</td><td> <select id='add_folder_ensemble'/></td></tr><tr><td>Parent Folder </td><td><select id='add_folder_folder'/></td></tr><tr><td>Name</td><td><input type='text'  id='add_folder_name' ></input></td></tr></table></div>").append("<div id='rename_file_dialog' ><input type='text'  id='rename_file_name' style='min-width: 24em;' ></input></div>").append("<div id='delete_folder_dialog' >Are you sure that you wish to delete the folder  <b id='delete_folder_name'/>?</div>").append("<div id='delete_file_dialog' >Are you sure that you wish to delete the file <b id='delete_file_name'/> ? <br/><i>Note: This will cause all annotations made on that file to be unusable</i></div>").append("<div id='move_file_dialog'>Move <b id='move_file_name'/> to...<br/><select id='move_file_select'/></div>").append("<div id='update_file_dialog'>Select a file...<form id='file_update_form' target='upload_target' method='post' enctype='multipart/form-data' action='SET_IN_JS_FILE'> <input type='file' name='file' id='add_file_update' ></input></form> <i>Warning</i> Proceeding will replace the current version of <b id='update_file_name'/>. As a consequence, exisiting annotations on that file may become <i>out of context</i>, especially if the file has changed a lot.</div>").append("<div id='add_ensemble_dialog' > <table> <tr><td>Name</td><td><input type='text'  id='add_ensemble_name' ></input></td></tr><tr><td>Brief Description</td><td><input type='text'  id='add_ensemble_description' ></input></td></tr>"+
"<tr><td><br/>Allow comments to staff ? </td>  <td><br/>  <span class='yesno'>Yes</span><input type='radio' value='1' name='allow_staffonly'/> <span class='yesno'>No</span><input type='radio' value='0' name='allow_staffonly'/> </td></tr> "+
"<tr><td>Allow anonymous comments ? </td>   <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='allow_anonymous'/> <span class='yesno'>No</span><input type='radio' value='0' name='allow_anonymous'/>        </td></tr> "+
"<tr><td>Allow guest access ? </td>         <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='allow_guest'/> <span class='yesno'>No</span><input type='radio' value='0' name='allow_guest'/>        </td></tr> "+
"<tr><td>Allow users to download PDFs ? </td>         <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='allow_download'/> <span class='yesno'>No</span><input type='radio' value='0' name='allow_download'/>        </td></tr> "+
"<tr><td>Allow users to add any PDF available online by its URL ? </td>     <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='allow_ondemand'/> <span class='yesno'>No</span><input type='radio' value='0' name='allow_ondemand'/>        </td></tr> "+
"<tr><td>Use subscribe URL ?</td>       <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='use_invitekey'/> <span class='yesno'>No</span><input type='radio' value='0' name='use_invitekey'/>        </td></tr>"+
"<tr><td>Pause on staff comments by default (for videos) ?</td>       <td>  <span class='yesno'>Yes</span><input type='radio' value='1' name='default_pause'/> <span class='yesno'>No</span><input type='radio' value='0' name='default_pause'/>        </td></tr>"+
"</table><br/><div><i>Once you've created a class, you can add files to it and invite users...</i></div></div>")
    .append(
        "<div id='invite_users_dialog' >" +
        "<div>To access the following group  <select id='invite_users_ensemble'/></div>" +
        "<div>For a particular section  <select id='invite_users_section'/> <em>(Optional)</em></div>" +
        "<br/><span class='fixdialog' >Enter the email address(es, separated by commas) of the people to whom you wish to send this invite</span><br/>" +
        "<textarea id='invite_users_emails'  rows='5' cols='50'/><br/>" +
        "<input type='checkbox' id='invite_users_admin' style='padding-left: 20px'></input>" +
        "<label for='invite_users_admin'>Grant administrative rights to these users</label><br/><br/>" +
        "<span class='fixdialog' ><em>Optional</em> Add a personal message (will appear on the invitation)</span><br/>" +
        "<textarea id='invite_users_msg'  rows='7' cols='50'/>" +
        "</div>")
    .append(
        "<div id='duplicate_file_dialog'></div>")
    .append("<div id='edit_assignment_dialog' ><span>Is this file an assignment ? </span><span class='yesno'>Yes</span><input type='radio' value='1' name='is_assignment'/> <span class='yesno'>No</span><input type='radio' value='0' name='is_assignment'>No</input><br/><br/><div id='assignment_due'><label for='due_date'>Due on</label> <input id='due_date'/> at <input id='due_time'/></div></div>");
};

// Returns 'file', 'html', or 'youtube' depending on the selected upload type ('' if there is an error)
function getUploadType() {
    if (document.getElementById('file_select').checked) {return 'file';}
    if (document.getElementById('html_select').checked) {return 'html';}
    if (document.getElementById('youtube_select').checked) {return 'youtube';}
    return '';
}

function updateVisibility(e) {
    if (getUploadType() === 'file') {
        $("#add_file_div").css("display", "inline");
        $("#add_html_div").css("display", "none");
        $("#add_youtube_div").css("display", "none");
    }

    if (getUploadType() === 'html') {
        $("#add_file_div").css("display", "none");
        $("#add_html_div").css("display", "inline");
        $("#add_youtube_div").css("display", "none");
    }

    if (getUploadType() === 'youtube') {
        $("#add_file_div").css("display", "none");
        $("#add_html_div").css("display", "none");
        $("#add_youtube_div").css("display", "inline");
    }
}


GLOB.files.addFile = function(id_ensemble, id_folder){
    GLOB.files.currentEnsemble = id_ensemble;
    GLOB.files.currentFolder = id_folder;

    $("input[name='upload_type']").on("change", updateVisibility);

    var foldername = (id_folder === null ) ? "": GLOB.files.model.o.folder[GLOB.files.currentFolder].name;
    $("#add_file_ensemble").html("<option id_ensemble='"+GLOB.files.currentEnsemble+"'>"+GLOB.pers.store.o.ensemble[GLOB.files.currentEnsemble].name+"</option>").attr("disabled", "disabled");
    $("#add_file_folder").html("<option id_folder='"+GLOB.files.currentFolder+"'>"+foldername+"</option>").attr("disabled", "disabled");
    $("#add_file_html").attr("href", "/addhtml/"+GLOB.files.currentEnsemble);
    $("#add_file_youtube").attr("href", "/addyoutube/"+GLOB.files.currentEnsemble);

    $('#add_file_dialog').dialog({
        title: "Add a File...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            $.concierge.get_component("source_id_getter")({}, GLOB.files.proceedUpload);
            $.I("Uploading in progress...");
            }
        }
    });
    $('#add_file_dialog').dialog("open");
};

GLOB.files.proceedUpload = function(payload){
    console.log("Upload Type:");
    console.log(getUploadType());
    // Handle HTML and YouTube uploads
    if (getUploadType() === 'html') {
        console.log("HTML Upload");
        $('#html_upload_form')
            .attr("action", "/addhtml/"+GLOB.files.currentEnsemble)
            .submit()[0]
            .reset();
    }
    else if (getUploadType() === 'youtube') {
        console.log("YouTube Upload");
        $('#youtube_upload_form')
            .attr("action", "/addyoutube/"+GLOB.files.currentEnsemble)
            .submit()[0]
            .reset();
    }
    else {
        console.log("File Upload");
        // we need a way to pass the id_ensemble and id_folder: we do it in the URL
        var folder_fragment = (GLOB.files.currentFolder === null) ? "" : "&id_folder="+GLOB.files.currentFolder;
        var newauth = ("ckey" in GLOB.conf.userinfo) ? "&ckey="+GLOB.conf.userinfo.ckey : "";
         $("#file_upload_form")
            .attr("action", GLOB.conf.servers.upload+"/pdf3/upload?id_ensemble="+GLOB.files.currentEnsemble+"&id_source="+ payload.id_source+folder_fragment+newauth)
            .submit()[0]
            .reset();
        //$.I("File added to remote repository");
    }
    $('#add_file_dialog').dialog("destroy");
    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function(){
        //NOTE (important !)
        $.I("NB is processing your file... You should receive an email once your file is available on NB.");
        var payload_objects = {types:["files"],  id: payload.id_source};
        if ("id_ensemble" in GLOB.pers.params){
            payload_objects["payload"]= {id_ensemble: GLOB.pers.params.id_ensemble};
        }
        GLOB.pers.call("getObjects", payload_objects, function(p){
        GLOB.pers.store.add("file", p.files);
        } );
    }, 3000);
};



GLOB.files.update_file = function(id){
    var $filename = $("#update_file_name");
    $filename.html(GLOB.files.model.o.file[id].title);
    $('#update_file_dialog').dialog({
        title: "Update a PDF File...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            var form = $("#file_update_form")[0];
            var newauth = ("ckey" in GLOB.conf.userinfo) ? "&ckey="+GLOB.conf.userinfo.ckey : "";
            form.setAttribute("action", GLOB.conf.servers.upload+"/pdf3/upload/update?id_source="+ id+newauth);
            form.submit();
            $.I("Updating in progress...");
            $(this).dialog("destroy");
            }
        }
    });
    $('#update_file_dialog').dialog("open");
};

GLOB.files.proceedUpdate = function(payload){
    var form = $("#file_upload_form")[0];
    // we need a way to pass the id_ensemble and id_folder: we do it in the URL
    var folder_fragment = (GLOB.files.currentFolder === null) ? "" : "&id_folder="+GLOB.files.currentFolder;
    form.setAttribute("action", GLOB.conf.servers.upload+"/pdf3/upload?id_ensemble="+GLOB.files.currentEnsemble+"&id_source="+ payload.id_source+folder_fragment);
    form.submit();
    //$.I("File updateed to remote repository");
    $('#update_file_dialog').dialog("destroy");
    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function(){
        //NOTE (important !)
        $.I("NB is processing your file... You should receive an email once your file has been updated.");
        var payload_objects = {types:["files"],  id: payload.id_source};
        if ("id_ensemble" in GLOB.pers.params){
        payload_objects["payload"]= {id_ensemble: GLOB.pers.params.id_ensemble};
        }
        GLOB.pers.call("getObjects", payload_objects, function(p){
            GLOB.pers.store.add("file", p.files);
        } );
    }, 3000);
};




GLOB.files.inviteUsers = function(id_ensemble){
    GLOB.files.currentEnsemble = id_ensemble;

    $("#invite_users_ensemble").html("<option id_ensemble='"+GLOB.files.currentEnsemble+"'>"+GLOB.pers.store.o.ensemble[GLOB.files.currentEnsemble].name+"</option>").attr("disabled", "disabled");

    var sections_html = "<option value='None'>None</option>";
    var sections = GLOB.pers.store.get("section", {id_ensemble:GLOB.files.currentEnsemble}).items;

    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            var section = sections[key];
            sections_html += "<option value='" + section.ID + "'>" + section.name + "</option>";
        }
    }

    $("#invite_users_section").html(sections_html);
    $('#invite_users_dialog').dialog({
        title: "Send an invitation...",
        width: 550,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            var to = $("#invite_users_emails")[0].value;
            var msg = $("#invite_users_msg")[0].value;
            var admin = $("#invite_users_admin:checked").length;
            var section = $("#invite_users_section").val();
            $.concierge.get_component("invite_users")({id_ensemble: id_ensemble, id_section: section, to: to, msg: msg, admin: admin}, function(){$.I("Your invitation has been sent !");});
            $(this).dialog("destroy");
            }
        }
    });
    $('#invite_users_dialog').dialog("open");
};



GLOB.files.addEnsemble = function(){
    //defaults:
    $("input[name=allow_staffonly][value=1]")[0].checked="true";
    $("input[name=allow_anonymous][value=1]")[0].checked="true";
    $("input[name=allow_guest][value=0]")[0].checked="true";
    $("input[name=allow_download][value=1]")[0].checked="true";
    $("input[name=allow_ondemand][value=0]")[0].checked="true";
    $("input[name=use_invitekey][value=1]")[0].checked="true";
    $("input[name=default_pause][value=0]")[0].checked="true";
    $('#add_ensemble_dialog').dialog({
        title: "Create a new class...",
        width: 540,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
                $.concierge.get_component("add_ensemble")({name: $("#add_ensemble_name")[0].value, description: $("#add_ensemble_description")[0].value, allow_staffonly:$("input[name=allow_staffonly]:checked")[0].value === "1", allow_anonymous: $("input[name=allow_anonymous]:checked")[0].value === "1", allow_guest: $("input[name=allow_guest]:checked")[0].value === "1",  default_pause: $("input[name=default_pause]:checked")[0].value === "1", allow_download: $("input[name=allow_download]:checked")[0].value === "1", allow_ondemand: $("input[name=allow_ondemand]:checked")[0].value === "1", use_invitekey: $("input[name=use_invitekey]:checked")[0].value === "1" }, function(p){GLOB.files.model.add("ensemble", p);$.I("Class created !");} );
            $(this).dialog("destroy");
            }
        }
    });
    $('#add_ensemble_dialog').dialog("open");
};





GLOB.files.addFolder = function(id_ensemble, id_folder){
    GLOB.files.currentEnsemble = id_ensemble;
    GLOB.files.currentFolder = id_folder;
    var foldername = (id_folder === null ) ? "": GLOB.files.model.o.folder[GLOB.files.currentFolder].name;
    $("#add_folder_ensemble").html("<option id_ensemble='"+GLOB.files.currentEnsemble+"'>"+GLOB.pers.store.o.ensemble[GLOB.files.currentEnsemble].name+"</option>").attr("disabled", "disabled");
    //    $("#add_file_folder").html("<option id_folder='"+GLOB.files.currentFolder+"'>"+GLOB.pers.store.o.folder[GLOB.files.currentFolder].name+"</option>").attr("disabled", "disabled");
    $("#add_folder_folder").html("<option id_folder='"+GLOB.files.currentFolder+"'>"+foldername+"</option>").attr("disabled", "disabled");

    $('#add_folder_dialog').dialog({
        title: "Add a Folder...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            $.concierge.get_component("add_folder")({id_parent: id_folder, id_ensemble: id_ensemble, name: $("#add_folder_name")[0].value}, function(p){GLOB.files.model.add("folder", p);$.I("folder added");} );
            $(this).dialog("destroy");
            }
        }
    });
    $('#add_folder_dialog').dialog("open");
};

GLOB.files.edit_assignment = function(id){
    var f =  GLOB.files.model.o.file[id];
    //controls:
    var assignment_ref = f.assignment ? "1" : "0";
    var checkboxes = $("input[name=is_assignment]");
    var f_checkbox = function(){
    var v = checkboxes.filter(":checked")[0].value;
    $("#assignment_due")[v === "1"? "show":"hide"]();
    };
    checkboxes.click(f_checkbox);
    checkboxes.filter("[value="+assignment_ref+"]")[0].checked="true";
    f_checkbox();
    if (f.due!=null){
    $('#due_date')[0].value = f.due.substring(7,5)+"/"+f.due.substring(10,8)+"/"+f.due.substring(4,0);
    $('#due_time')[0].value = f.due.substring(13,11)+":"+f.due.substring(16,14);
    }
    $('#edit_assignment_dialog').dialog({
        title: "Assignment Properties for "+$.E(f.title),
        width: 600,
        height: 380,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
        "Ok": function() {
            var v_date = $('#due_date')[0].value;
            var v_time = $('#due_time')[0].value;

            //TODO: validate form
            var due_datetime = v_date === "" ? null : v_date.substring(10, 6)+"-"+v_date.substring(2, 0)+"-"+v_date.substring(5, 3)+" "+v_time.substring(2,0)+":"+v_time.substring(5,3);
            $.concierge.get_component("edit_assignment")({id: id, assignment:  $("input[name=is_assignment]:checked")[0].value === "1", due:due_datetime}, function(p){GLOB.files.model.add("file", p.files);$.I("Changes Saved");} );
            $(this).dialog("destroy");
        }
        }
    });
    $('#edit_assignment_dialog').dialog("open");
    $('#due_date').calendricalDate({usa: true,  isoTime: true, two_digit_mdh: true});
    $('#due_time').calendricalTime({usa: true,  isoTime: true, two_digit_mdh: true, meridiemUpperCase: true});
};

GLOB.files.rename_file = function(id, item_type){
    var $filename = $("#rename_file_name");
    var o =  (item_type==="file")? GLOB.files.model.o.file[id] : GLOB.files.model.o.folder[id];
    $filename[0].value =  o[GLOB.files.labelfields[item_type]];
    $('#rename_file_dialog').dialog({
        title: "Rename "+item_type+"...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            $.concierge.get_component("rename_file")(
                { item_type: item_type, id: id, title:  $filename[0].value },
                function(p){
                    GLOB.files.model.add(item_type, p[item_type+"s"]);
                    $.I(item_type+" renamed");
                });
            $(this).dialog("destroy");
            }
        }
    });
    $('#rename_file_dialog').dialog("open");
    $filename.focus();
};

GLOB.files.duplicate_file = function(id, item_type){
    if (item_type !== "file") {
        return;
    }
    var o = GLOB.files.model.o.file[id];
    var $dialog = $('#duplicate_file_dialog');
    $dialog.empty();
    $dialog.duplicateWizard({
        admin: true,
        file_id: id,
        callbacks: {
            onOk: function() {
                $dialog.dialog("destroy");
                $dialog.duplicateWizard("destroy");
            },
            onCancel: function() {
                $dialog.dialog("destroy");
                $dialog.duplicateWizard("destroy");
            },
            onSubmit: function() {
                $dialog.dialog("destroy");
                $dialog.duplicateWizard("destroy");
            }
        }
    });
    $dialog.duplicateWizard("set_model", GLOB.pers.store);

    $dialog.dialog({
        title: "Duplicate file",
        buttons: {},
        width: 700,
        height: 320
    });
    $dialog.dialog("open");

};

GLOB.files.delete_file = function(id, item_type){
    var m = GLOB.pers.store;
    if (item_type==="folder" && (!m.get("file", {id_folder: id}).is_empty() || !m.get("folder", {id_parent: id}).is_empty())){
    alert("This folder isn't empty. You can only delete folders that are empty.");
    return;
    }
    var $filename = $("#delete_"+item_type+"_name");
    var o =  (item_type==="file")? GLOB.files.model.o.file[id] : GLOB.files.model.o.folder[id];
    $filename.text( o[GLOB.files.labelfields[item_type]]);
    $('#delete_'+item_type+'_dialog').dialog({
        title: "Delete "+item_type+"...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
            $.concierge.get_component("delete_file")({id: id, item_type: item_type}, function(P){GLOB.files.model.remove(item_type, P["id"]);$.I(item_type+" deleted");} );
            $(this).dialog("destroy");
            }
        }
    });
    $('#delete_'+item_type+'_dialog').dialog("open");
};

GLOB.files.__abspath = function(id_folder){
    var m = GLOB.files.model;
    var f = m.o.folder[id_folder];
    var id_parent = f.id_parent;
    var s = f.name;
    var p;
    while (id_parent !== null){
    p = m.o.folder[id_parent];
    s = p.name + "/" + s;
    id_parent = p.id_parent;
    }
    s = GLOB.files.model.o.ensemble[f.id_ensemble].name + "/" + s;
    return s;
};

GLOB.files.__isDirOrParent = function(id_a,id_b){
    //returns true is a === b or is a is a parent of b
    var folders = GLOB.files.model.o.folder;
    var d = folders[id_b];
    while (d.id_parent !== null){
    if (d.ID === id_a){
        return true;
    }
    d = folders[d.id_parent];
    }
    return id_a === d.ID;
};

GLOB.files.__generate_folders = function(id_ensemble, id_sel, id_exclude){
    var subfolders  = GLOB.files.model.get("folder", {id_ensemble:id_ensemble });
    var sel_str = (id_sel==null) ? " selected='selected' ": " ";
    var s="<option "+sel_str+" id_item='0'>"+GLOB.files.model.o.ensemble[id_ensemble].name+"</option>";
    for (var i in subfolders.items){
        if (id_exclude === undefined || (!GLOB.files.__isDirOrParent(parseInt(id_exclude, 10), parseInt(i, 10)))){
        sel_str = (i === id_sel ) ? " selected='selected' ": " ";
        s+="<option "+sel_str+" id_item='"+i+"'>"+GLOB.files.__abspath(i)+"</option>";
    }
    }
    return s;
};

GLOB.files.move_file = function(id, item_type){
    var $filename = $("#move_file_name");
    var o =  (item_type==="file")? GLOB.files.model.o.file[id] : GLOB.files.model.o.folder[id];
    $filename.text( o[GLOB.files.labelfields[item_type]]);
    var $select = $("#move_file_select");
    $select.html(GLOB.files.__generate_folders(o.id_ensemble,o.id_folder||o.id_parent, (item_type==="file")?undefined:id));
    $('#move_file_dialog').dialog({
        title: "Move "+item_type+"...",
        width: 390,
        buttons: {
        "Cancel": function() {
            $(this).dialog("close");
        },
            "Ok": function() {
                $.concierge.get_component("move_file")({id: id, item_type: item_type, dest:  parseInt($select.children(":selected").attr("id_item"), 10)||null}, function(p){GLOB.files.model.add(item_type, p[item_type+"s"]);$.I(item_type + " moved");} );
            $(this).dialog("destroy");
            }
        }
    });
    $('#move_file_dialog').dialog("open");
};

})(NB);
