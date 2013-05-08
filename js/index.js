function dum(data) {
	console.log("success");
}


$(document).ready(function(){
	var family = getFamilyObject();

    $("#fam").text(family.name);
	client.getFamilyInfo(family._id, function(data){
		var datatasks = data.tasks;
		for (var i = 0; i < datatasks.length; i++) {
			var curDataTask = datatasks[i];
			var task = new Task(curDataTask.name, null,TaskListId);
			task.duedate = curDataTask.duedate;
			tasks[TaskListId.toString()] = task;
			updateTaskList(task);
			++TaskListId;
		};			

		var datamembers = data.members;
		var familyList = $("#family");
		for (var i = 0; i < datamembers.length; i++) {
			var member = datamembers[i];
			var name = member.name;

			var pic = member.pictureURL;
            if (pic === "") {
                pic = "/assets/unknown_person.jpg";
            }

			var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
			
			var popupUserInfo = '<td class="selectionCell"><img src="' + pic + '" class="selectionPic" id="' + name + '" /></td>'
			//var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
			$(userInfo).appendTo(familyList);
			$("#selectionTable tr:last").append(popupUserInfo);
			$('.profile').click(function(evt) {
                window.location = 'member_history.html?member=' + evt.target.id.slice(3);
            });

			document.getElementById('btnClaim').disabled = true;
    	document.getElementById('btnComplete').disabled = true;
    	
    	var currently_selected = '';
    	
    	// Selects a family member when clicked
    	$('.selectionCell').click(function(evt) {
    		console.log(evt);
    		console.log(pic);

    		currently_selected = evt.target.id;
            $('.selectionPic').removeClass('selected');
            $(evt.target).addClass('selected');
            console.log(currently_selected);
    		if (!currently_selected)
    			return;
    		document.getElementById("selectedName").innerHTML = currently_selected;
    		$('.selectionPic').css('border-width', '0px');
    		$('.selectionPic').css('margin', '3px');
    		$('#'+currently_selected).css('border-width', '3px');
    		$('#'+currently_selected).css('margin', '0px');
    		$('#selectedPerson').attr('src', evt.target.src);
    		//$('#buttonTable').css('margin-top', '14px');
    		document.getElementById('btnClaim').disabled = false;
    		document.getElementById('btnComplete').disabled = false;
    	});
    	
		// Cancel Button
		$('#btnCancel').click(function(evt) {
    		hidePopup();
    	});
    	


		};

	});

	console.log("done with making table");
	//taskPopupInit();
});