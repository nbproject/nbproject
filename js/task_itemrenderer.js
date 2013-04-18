var TaskListRenderer = function(){

	this.line = function(txt){
		console.log("[TaskListRenderer] " + txt);
	}

	this.renderList = function(items, template, container){
		line("--renderList--");
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemDiv = this.renderItem(item, i, template);
			itemDiv.prependTo(container);
		}
	}

	this.renderItem = function(item, id, template){
		line("--renderItem--");
		var taskDiv = $("#taskRowTemplate").clone().attr('id', "task_" + id);
		return taskDiv;
	}

}

