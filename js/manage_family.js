

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
});