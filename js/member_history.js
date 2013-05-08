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
    var family = getFamilyObject();
    
    client.getFamilyInfo(family._id, function(data){
        var datamembers = data.members;
        var familyList = $("#family");
        for (var i = 0; i < datamembers.length; i++) {
            var member = datamembers[i];
            var name = member.name;

            var pic = member.pictureURL;
            console.log(pic);
            var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            
            //var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            $(userInfo).appendTo(familyList);
            $('.profile').click(function(evt) {
                window.location = 'member_history.html?member=' + evt.target.id.slice(3);
            });
        };

    });

    if ($.getUrlVar('member')) {
        member = test_account.getMember($.getUrlVar('member'));
        member = test_account.getMember("Cersei");
    } else { //? default?
        member = test_account.getMember("Cersei");
    }  
    



    $("#header").text("Today " + member.name + "...");
    //var imgHTML = "<img src='assets/" + member.name + ".jpg' height='200'>"
    //$("#containsImage").html(imgHTML);
    $("#hideme").hide();
    
    // Color Tabs
    $('#box'+member.name).css('background', '#C9E9FF');
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