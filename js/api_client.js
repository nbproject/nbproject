function ApiClient() {

	this.url = "";


	this.login = function(email, password, callback){
		var credentials = {'email':email, 'password':password};
		console.log("--login--: " + credentials);
		var endpoint = this.url + "/login";
		$.post(endpoint, credentials, function(data){		
			callback(data);
		});

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
		console.log("Client:--createTask--");
		var endpoint = this.url + "/task/make";
		$.post(endpoint, family, function(data){		
			callback(data);
		});
	};

	this.getTask = function(id, callback){
		console.log("Client:--getTask--");
		var endpoint = this.url + "/task/" + id;
		$.get(endpoint, function(data){		
			callback(data);
		});	
	};

	this.modifyTask = function(task, callback){

	};

}