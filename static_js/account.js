function account(id) {
	this.id = id;
	this.members = new Array();
	this.tasks= new Array();

	this.createMember = function(name) {
		if ( containsNameValueInList(name, this.members) === -1) {
			this.members.push(new member(name));
			console.log("successfully added member " + name);
		} else {
			console.log(name + " already a member");
		}
	}

	this.createTask = function(task_name) {
		if ( containsNameValueInList(task_name, this.tasks) === -1) {
			this.tasks.push(new task(task_name));
			console.log("successfully added task " + task_name);
		} else {
			console.log(task_name + " already in tasks");
		}
	}

	this.assignTask = function(task_name, member_name) {
		if (containsNameValueInList(member_name, this.members) === -1) {
			console.log("this member does not exist");
			return;
		}

		if (containsNameValueInList(task_name, this.tasks) === -1) {
			console.log("this task does not exist");
			return;
		}

		var tmp_member = this.members[containsNameValueInList(member_name, this.members)];
		var tmp_task = this.tasks[containsNameValueInList(task_name, this.tasks)];

		if (tmp_task.assignedTo === undefined) {

		} else {
			console.log("task is already assigned to " + tmp_task.assignedTo);
			return;
		}
		if ( !tmp_member.containsTask(tmp_task)) {
			tmp_member.assignedTasks.push(tmp_task);
			tmp_task.assignedTo = member_name;
			console.log("successfully added task " + task_name + " to member " + member_name);
		} else {
			console.log(member_name + " already contains task " + task_name);
		}
	}

	this.finishTask = function(task_name, member) {
		if (containsNameValueInList(task_name, this.tasks) === -1) {
			console.log("this task does not exist");
			return;
		}

		var tmp_task = this.tasks[containsNameValueInList(task_name, this.tasks)];

		//if (tmp_task)


	}
}


