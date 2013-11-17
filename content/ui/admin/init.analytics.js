/*global NB$:true NB:true Page:true Document:true PageView:true Backbone:true _:true jQuery:true */

(function(GLOB){
    if ("NB$" in window){
        var $ = NB$;
    }
    var $str        = "NB$" in window ? "NB$" : "jQuery";

    GLOB.pers.init = function() {
		window.console.log($.concierge.get_component("get_userinfo")().ckey);
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

var Document = Backbone.Collection.extend({
	model: Page
});