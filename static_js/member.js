function member(name) {
	this.name = name;
	this.assignedTasks = new Array();
	this.completedTasks = new Array();
	this.finishTask = function(task) {
		if (containsNameValueInList(task.name, this.assignedTasks) != -1) { //doesn't contain			
			this.assignedTasks.splice( containsNameValueInList(task.name, this.assignedTasks), 1);
		} 
		this.completedTasks.push(task);
	}

	this.containsTask = function(task) {
		return (containsNameValueInList(task.name, this.assignedTasks) != -1);
	}
}

