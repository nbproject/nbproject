function ApiClient() {

	this.url = "";


	this.login = function(username, password, callback){
		console.log("--login--: " + username, password);

	};

	this.logout = function(callback){

	};

	//Family Functions
	this.createFamily = function(family, callback){
		console.log("Client:--createFamily--");
		var endpoint = this.url + "/family/make";
		$.post(endpoint, family, function(data){		
			callback(data);
		});
	};

	this.getFamily = function(id, callback){
		console.log("Client:--getFamily--");
		var endpoint = this.url + "/family/" + id;
		$.get(endpoint, function(data){		
			callback(data);
		});	
	};

	this.modifyFamily = function(account, callback){

	};

	//Member functions
	this.createMember = function(member, callback){

	};

	this.getMember = function(id, callback){

	};

	this.modifyMember = function(member, callback){

	};

	//Task functions
	this.createTask = function(task, callback){

	};

	this.getTask = function(id, callback){

	};

	this.modifyTask = function(task, callback){

	};

}