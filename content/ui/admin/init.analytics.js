/*global NB$:true NB:true Page:true Document:true PageView:true Backbone:true _:true jQuery:true */

(function(GLOB){
    if ("NB$" in window){
        var $ = NB$;
    }
    var $str        = "NB$" in window ? "NB$" : "jQuery";

    GLOB.pers.init = function() {
		window.console.log($.concierge.get_component("get_userinfo")().ckey);
	};

	var getUserInfo = function() {
		return $.concierge.get_component("get_userinfo")().ckey;
	};

	GLOB.pers.createStore = function() {
		GLOB.pers.store = new GLOB.models.Store();
	};
})(NB);


var Page = Backbone.Model.extend({
	defaults: {
		num_annotations: 0,
		num_questions: 0
	}
});

var Highlight = Backbone.Model.extend();

var Document = Backbone.Collection.extend({
	model: Page,

	sort_key: 'page_num',

	comparator: function(page) {
		if (this.sort_key === "num_annotations" || this.sort_key === "num_questions") {
			// most heavily annotated first
			return -page.get(this.sort_key);
		} else {
			return page.get(this.sort_key);
		}
	},

	sortByField: function(fieldName) {
		this.sort_key = fieldName;
		this.sort();
	}

});