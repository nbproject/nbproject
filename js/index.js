function dum(data) {
	console.log("success");
}

$(document).ready(function(){
	var family = getFamilyObject();
	
	client.getFamilyInfo(family._id, function(data){
		var datatasks = data.tasks;
		console.log(data);
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
			console.log(pic);
			var userInfo = '<li><div class="profile" id="box' + name + '"><img src="'+ pic + '" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
			
			//var y = '<li><div class="profile" id="box' + name + '"><img src="assets/' + name + '.jpg" id="pic' + name + '"><h3>' + name + '</h3></div></li>'
			$(userInfo).appendTo(familyList);
		};

	});



	// populate the images

});