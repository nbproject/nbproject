function dum(data) {
	console.log("success");
}

$(document).ready(function(){
	var family = getFamilyObject();
	
	client.getFamilyInfo(family._id, function(data){
		var datatasks = data.tasks;
		for (var i = 0; i < datatasks.length; i++) {
			var curDataTask = datatasks[i];
			console.log(curDataTask);
			var task = new Task(curDataTask.name, null,TaskListId);
			task.duedate = curDataTask.duedate;
			tasks[TaskListId.toString()] = task;
			updateTaskList(task);
			++TaskListId;
		};			
	});


});