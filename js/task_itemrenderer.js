function TaskListRenderer(){

	function line(txt){
		console.log("[TaskListRenderer] " + txt);
	}

	function renderList(items, template, container){
		line("--renderList--");
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemDiv = renderItem(item, i, template);
			itemDiv.prependTo("#historyPanel");
		}

	}

	function renderItem(item, id, template){
		var taskDiv = $("#taskRowTemplate").clone().attr('id', "task_" + id);
		return taskDiv;
	}

}

