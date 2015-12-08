

$(document).ready(function() {
    var family = getFamilyObject();

    $("#fam").text(family.name);

    var familyNames = new Array();
    var deleteUserHTML = "";
    var targetParent;
    client.getFamilyInfo(family._id, function(data){
        var datamembers = data.members;
        var familyList = $("#family");

        var familyTable = $("#familyTable");
        for (var i = 0; i < datamembers.length; i++) {
            var member = datamembers[i];
            var name = member.name;
            console.log(name);
            familyNames.push(name);
            var pic = member.pictureURL;
            if (pic === "") {
                pic = "/assets/unknown_person.jpg";
            }
            var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            
            var userTableInfo = '<tr id="row'+name+'"><td class="left"><img id="managePic" src="' + pic + '" /></td> <td class="middle">' + name + '</td> <td id=class="right"><button id="delete' + name + '" class="btn btn-danger btn-mini">Delete</btn></td></tr>'
            //var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
            $(userInfo).appendTo(familyList);
            $(familyTable).append(userTableInfo);
            $('.profile').click(function(evt) {
                window.location = 'member_history.html?member=' + evt.target.id.slice(3);
            });

            $("#delete"+name).click(function(e) {
                e.stopPropagation();
                var name = $(this).attr("id").substr(6);
                var proceed = confirm("Are you sure you want to delete " + name + "?");
                if (proceed) {
                    $("#row"+name).remove();
                    var memberToDelete;
                    client.getFamilyInfo(family._id, function(data){
                        for (var i = 0; i < datamembers.length; i++) {
                            var thismember = datamembers[i];
                            var thisname = thismember.name;
                            if (name === thisname) {
                                console.log("fuck");
                                memberToDelete = thismember;
                                client.deleteMember(memberToDelete, function(){});

                                return;
                            }
                        }
                    });
                }

            });


        };

    });



    // populate the images


    $('#tabTodo').click(function(evt) {
    	window.location = 'index.html';
    });
    
   

    $('#boxTodo').click(function(evt) {
    	window.location = 'index.html';
    });

    
    $('.profile').click(function(evt) {
        window.location = 'member_history.html?member=' + evt.target.id.slice(3);
    });



    var newMemberVisible = false;
        
    console.log(familyNames);
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
            var userTableInfo = '<tr id="row'+name+'"><td class="left"><img id="managePic" src="' + pic + '" /></td> <td class="middle">' + name + '</td> <td id=class="right"><button id="delete' + name + '" class="btn btn-danger btn-mini">Delete</btn></td></tr>'
            $(familyTable).append(userTableInfo);

            $("#delete"+name).click(function() {
                e.stopPropagation();
                var name = $(this).attr("id").substr(6);
                console.log(name);
                var proceed = confirm("Are you sure you want to delete " + name + "?");

                if (proceed) {
                    $("#row"+name).remove();
                    var memberToDelete;
                    client.getFamilyInfo(family._id, function(data){
                        var datamembers = data.members;
                        for (var i = 0; i < datamembers.length; i++) {
                            var thismember = datamembers[i];
                            var thisname = thismember.name;
                            console.log(name);
                            if (name === thisname) {
                                memberToDelete = thismember;
                                client.deleteMember(memberToDelete, function(){});
                                return;
                            }
                        }
                    });
                }

            });
            newMemberVisible = false;
            if (errorAddMember) {
                errorAddMember = false;
            }
        }else{
            console.log(data.error);
        }
    }

    var errorAddMember = false;
    function addMember(e) {
        //e.stopPropagation();
        console.log("--submit Member--");
        var name =  $("#newName").val();
        var pictureURL =  "";
        var member = {'name': name, 'pictureURL':pictureURL};
        if (familyNames.indexOf(name) != -1) {
            if (errorAddMember) { return;}
            $("#familyTable tr:first").append("<td id='error'>This member name already exists!</td>");
            errorAddMember = true;
            return;
        }


        client.createMember(member, newMemberCallback);
    }
        
    function populatePage(family) {
        
    }
        
    $("#addMember").click(function(e) {
        e.stopPropagation();
        if (!newMemberVisible) {        
            $("#familyMemberList").prepend('<tr><td class="left"><img id="newPic" src="assets/unknown_person.jpg" /></td> <td class="middle"><input id="newName" type="text"></td> <td class="right"><button id="newAddButton" class="btn btn-success btn-mini">Add</btn></td></tr>');
            newMemberVisible = true;        
            $("#newAddButton").click(addMember);        
        }
    });         
});