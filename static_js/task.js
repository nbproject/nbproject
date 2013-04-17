//some way 
function Task(name, id) {
	this.id = id; //like a in a db, ids need to be set on instantiation.
	this.name = name;
	//this.duedate = duedate;
	//this.assignedTo = undefined;
	this.finished = undefined; // this is the name of member who finished it
	this.status = undefined; // can be claimed or completed
	this.assignedTo = undefined;
	this.duedate;
	this.finishdate;
}
