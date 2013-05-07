function Member(name, pictureURL) {
	this.name = name;
	this.pictureURL = pictureURL;
	this.familyId = null;
	this.completedTasks = new Array();
	this.tasks = new Array();

	this.showClaimedTasks = function() {
		console.log("showing claimed tasks for : " + this.name);
		for (var i = 0; i < this.tasks.length; i++) {
			console.log( (1+i) + ": " + this.tasks[i].name);
		}
	};
	this.showCompletedTasks = function() {
		console.log("showing completed tasks for : " + this.name);
		for (var i = 0; i < this.completedTasks.length; i++) {
			console.log( (1+i) + ": " + this.completedTasks[i].name);
		}
	};
}

