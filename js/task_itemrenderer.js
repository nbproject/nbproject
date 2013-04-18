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
		var taskDiv = template.clone().attr('id', "row_" + id);
		var icon = taskDiv(".taskIcon");
		var label = taskDiv(".taskLabel");
		var claim = taskDiv(".taskClaim");
		var complete = taskDiv(".taskComplete");

		return taskDiv;
	}

}

