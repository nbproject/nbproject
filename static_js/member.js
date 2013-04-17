function member(name) {
	this.name = name;
	this.completedTasks = new Array();

	this.showCompletedTasks = function() {
		console.log("showing tasks for : " + this.name);
		for (var i = 0; i < this.completedTasks.length; i++) {
			console.log( (1+i) + ": " + this.completedTasks[i].name);
		}
	}
}

