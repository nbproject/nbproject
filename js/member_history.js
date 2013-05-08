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


function doIOwnThis(id, task) {
    if (task.finished != "") {
        if (task.finished === id) {
            return true;
        } else {
            return false;
        }
    }

    if (task.assignedTo != "") {
        if (task.assignedTo === id) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

$(document).ready(function() {
    var member_name;
    var profile_member;
    if ($.getUrlVar('member')) {
        member_name = $.getUrlVar('member');
    } else { //? default?
        window.location = "index.html";
    }
    var family = getFamilyObject();
    


    client.getFamilyInfo(family._id, function(data){
        var datamembers = data.members;
        var familyList = $("#family");
        for (var i = 0; i < datamembers.length; i++) {
            var member = datamembers[i];
            var name = member.name;
            if (name === member_name) {
                profile_member = member;
            }

            var pic = member.pictureURL;
            if (pic === "") {
                pic = "/assets/unknown_person.jpg";
            }


            var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            
            //var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            $(userInfo).appendTo(familyList);
            $('.profile').click(function(evt) {
                window.location = 'member_history.html?member=' + evt.target.id.slice(3);
            });
        };

        var memberTasks = new Array();
        var datatasks = data.tasks;
        for (var i = 0; i < datatasks.length; i++) {
            var curDataTask = datatasks[i];
            console.log(doIOwnThis( profile_member._id, curDataTask));
            if (doIOwnThis(profile_member._id, curDataTask)) {
                memberTasks.push(curDataTask);
            }
        };  

        
        var taskHTML = "";
        for (var i = 0; i < memberTasks.length; i++) {
            var ct = memberTasks[i];
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
        $("#memberTasks").html(taskHTML);

    });

    

    $("#header").text("Today " + member_name + "...");
    //var imgHTML = "<img src='assets/" + member.name + ".jpg' height='200'>"
    //$("#containsImage").html(imgHTML);
    $("#hideme").hide();
    
    // Color Tabs
    $('#box'+member_name).css('background', '#C9E9FF');
    $('#tabs li').css('background', '#FFFFC9');
    
    $('.profile').click(function(evt) {
    	window.location = window.location.pathname + '?member=' + evt.target.id.slice(3);
    });
    
    $('#tabTodo').click(function(evt) {
    	window.location = 'index.html';
    });
    
     $('#manageFamily').click(function(evt) {
        window.location = 'manage_family.html';
    });

    $('#titleButton').click(function(evt) {
    	window.location = 'index.html';
    });

    



/*
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

    */

    //if (member.tasks.length + member.completedTasks.length === 0) {
    //    taskHTML = "This family member has no activity!";
    //}

    //$("#memberTasks").html(taskHTML);
});