var containsNameValueInList = function(name, list) {
		for (var i = 0; i < list.length; i++) {
			if (name === list[i].name) {
				return i;
			}
		}
		return -1;
	}
