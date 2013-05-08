

$(document).ready(function() {
    var family = getFamilyObject();
    
    client.getFamilyInfo(family._id, function(data){
        var datamembers = data.members;
        var familyList = $("#family");

        var familyTable = $("#familyTable");
        for (var i = 0; i < datamembers.length; i++) {
            var member = datamembers[i];
            var name = member.name;

            var pic = member.pictureURL;
            if (pic === "") {
                pic = "/assets/unknown_person.jpg";
            }
            var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            
            var userTableInfo = '<tr><td class="left"><img id="managePic" src="' + pic + '" /></td> <td class="middle">' + name + '</td> <td class="right"><button class="btn btn-danger btn-mini">Delete</btn></td></tr>'
            //var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            $(userInfo).appendTo(familyList);
            $(familyTable).append(userTableInfo);
            $('.profile').click(function(evt) {
                window.location = 'member_history.html?member=' + evt.target.id.slice(3);
            });
        };

    });



    // populate the images


    $('#tabTodo').click(function(evt) {
    	window.location = 'index.html';
    });
    
    $('#manageFamily').click(function(evt) {
        window.location = 'manage_family.html';
    });

    $('#titleButton').click(function(evt) {
    	window.location = 'index.html';
    });

    
    $('.profile').click(function(evt) {
        window.location = 'member_history.html?member=' + evt.target.id.slice(3);
    });



    var newMemberVisible = false;
        

    function newMemberCallback(data) {
        if(data.error == null){
            var id = data._id;
            $("#familyTable tr:first").remove();
            var name = data.name;
            var pic = data.pictureURL;
            if (pic === "") {
                pic = "/assets/unknown_person.jpg";
            }
            var familyTable = $("#familyTable");
            var userTableInfo = '<tr><td class="left"><img id="managePic" src="' + pic + '" /></td> <td class="middle">' + name + '</td> <td class="right"><button class="btn btn-danger btn-mini">Delete</btn></td></tr>'
            $(familyTable).append(userTableInfo);
            newMemberVisible = false;

        }else{
            console.log(data.error);
        }
    }

    function addMember() {
        console.log("--submit Member--");
        var name =  $("#newName").val();
        var pictureURL =  "";
        var member = {'name': name, 'pictureURL':pictureURL};
        client.createMember(member, newMemberCallback);
    }
        
    function populatePage(family) {
        
    }
        
    $("#addMember").click(function() {
        if (!newMemberVisible) {        
            $("#familyMemberList").prepend('<tr><td class="left"><img id="newPic" src="assets/unknown_person.jpg" /></td> <td class="middle"><input id="newName" type="text"></td> <td class="right"><button id="newAddButton" class="btn btn-success btn-mini">Add</btn></td></tr>');
            newMemberVisible = true;        
            $("#newAddButton").click(addMember);        
        }
    });         
});