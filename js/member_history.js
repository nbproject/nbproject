$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
            window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
        },
    getUrlVar : function(name) {
        return $.getUrlVars()[name];
    }
});

$(document).ready(function() {
    if ($.getUrlVar('member')) {
        member = test_account.getMember($.getUrlVar('member'));
    } else { //? default?
        member = test_account.getMember("Cersei");
    }  
    
    $("#header").text("Today " + member.name + "...");
    var imgHTML = "<img src='assets/" + member.name + ".jpg' height='200'>"
    $("#containsImage").html(imgHTML);
    $("#hideme").hide();

    var taskHTML = "";
    for (var i = 0; i < member.tasks.length; i++) {
        var ct = member.tasks[i];
        var curHTML = "<div class='task'> <table><tr><td>Task: " + ct.name + "</td></tr> <tr><td>Status: " + ct.status + "</td></tr>"
        if (ct.status === "Completed") {
            if (ct.img === undefined) {

            } else {
                curHTML += "<tr><td><img src='assets/" + ct.img + "' height ='200'></td></tr>"
            }
        }
        curHTML += "</table> </div>";
        taskHTML+=curHTML;
    }

    for (var i = 0; i < member.completedTasks.length; i++) {
        var ct = member.completedTasks[i];
        var curHTML = "<div class='task'> <table><tr><td>Task: " + ct.name + "</td></tr> <tr><td>Status: " + ct.status + "</td></tr>"
        if (ct.status === "Completed") {
            console.log(ct);
            if (ct.img === undefined) {

            } else {
                curHTML += "<tr><td><img src='assets/" + ct.img + "' height ='100'></td></tr>"
            }
        }
        curHTML += "</table> </div>";
        taskHTML+=curHTML;
    }

    if (member.tasks.length + member.completedTasks.length === 0) {
        taskHTML = "This family member has no activity!";
    }
    $("#memberTasks").html(taskHTML);
});