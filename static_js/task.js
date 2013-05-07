//some way 
function Task(name, img, id) {
	this.id = id; //like a in a db, ids need to be set on instantiation.
	this.familyId = null;
	this.name = name;
	this.img = img;
	//this.duedate = duedate;
	//this.assignedTo = undefined;
	this.finished = undefined; // this is the name of member who finished it
	this.status = undefined; // can be claimed or completed
	this.assignedTo = undefined;
	this.duedate;
	this.finishdate;
}
