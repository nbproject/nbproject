function account(id) {
	this.id = id;
	this.members = new Array();
	this.tasks= new Array();
	this.finishedTasks = new Array();

	this.createMember = function(name) {
		if ( containsNameValueInList(name, this.members) === -1) {
			this.members.push(new member(name));
			console.log("successfully added member " + name);
		} else {
			console.log(name + " already a member");
		}
	}

	this.createTask = function(task_name, img) {
		if ( containsNameValueInList(task_name, this.tasks) === -1) {
			this.tasks.push(new Task(task_name, img));
			console.log("successfully added task " + task_name);
		} else {
			console.log(task_name + " already in tasks");
		}
	}


	this.claimTask = function(task_name, member_name) {
		if (containsNameValueInList(task_name, this.tasks) === -1) {
			console.log("this task does not exist");
			return;
		}

		if (containsNameValueInList(member_name, this.members) === -1) {
			console.log("this member does not exist");
			return;
		}

		var tmp_member = this.members[containsNameValueInList(member_name, this.members)];
		var tmp_task = this.tasks[containsNameValueInList(task_name, this.tasks)];

		if (tmp_task.finished === undefined) {
			if (tmp_task.assignedTo === undefined) {
				tmp_task.assignedTo = member_name;
				tmp_member.tasks.push(tmp_task);
				tmp_task.status = "Claimed";
				console.log("task : " + task_name + " successfully claimed by member " + member_name);
			} else {
				var old_member = this.members[containsNameValueInList(tmp_task.assignedTo, this.members)];
				old_member.tasks.splice( containsNameValueInList(task_name, this.tasks), 1);
				tmp_task.assignedTo = member_name;
				tmp_member.tasks.push(tmp_task);
				tmp_task.status = "Claimed";
				console.log("task : " + task_name + " successfully claimed by member " + member_name);
			}
			
		} else {
			console.log("task already done");
			return;
		}
	}

	this.finishTask = function(task_name, member_name) {
		if (containsNameValueInList(task_name, this.tasks) === -1) {
			console.log("this task does not exist");
			return;
		}

		if (containsNameValueInList(member_name, this.members) === -1) {
			console.log("this member does not exist");
			return;
		}

		var tmp_member = this.members[containsNameValueInList(member_name, this.members)];
		var tmp_task = this.tasks[containsNameValueInList(task_name, this.tasks)];

		if (tmp_task.finished === undefined) {
			tmp_task.finished = member_name;
			tmp_member.completedTasks.push(tmp_task);
			tmp_member.tasks.splice( containsNameValueInList(task_name, this.tasks), 1);
			this.finishedTasks.push(tmp_task);
			this.tasks.splice( containsNameValueInList(task_name, this.tasks), 1);
			tmp_task.status = "Completed";
			console.log("task : " + task_name + " successfully completed by member " + member_name);
		} else {
			console.log("task already done");
			return;
		}
	}

	//gets

	this.getMember = function(member_name) {
		if (containsNameValueInList(member_name, this.members) === -1) {
			console.log("this member does not exist");
			return;
		}
		return this.members[containsNameValueInList(member_name, this.members)];
	}

	this.getTask = function(task_name) {
		if (containsNameValueInList(task_name, this.tasks) === -1) {
			console.log("this task does not exist");
			return;
		}
		return this.tasks[containsNameValueInList(task_name, this.tasks)];
	}
}