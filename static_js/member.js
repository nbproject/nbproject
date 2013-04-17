function member(name) {
	this.name = name;
	this.tasks = new Array();
	this.completedTasks = new Array();
	this.assignTask = function(task) {
		//if ( $.inArray(ta))
	}

	this.finishTask = function(task) {
		
	}

	this.containsTask = function(task_name) {
		return (containsNameValueInList(task_name, this.tasks) != -1);
	}
}

