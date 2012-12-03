/* Polls plugin
 * Depends:
 *	ui.core.js
 * 	ui.view.js
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 *
 */
(function($) {
    var LIST_TAGS = {t: "ul", n: "ol"};
    var V_OBJ = $.extend({},$.ui.view.prototype,{
	    _init: function() {
		$.ui.view.prototype._init.call(this);
		var self = this;
		var VIEWID = self.element.attr("id");
		/*
		 * UI Event handlers
		 */
		var _click_page= function(evt){
		    let id_item =  this.getAttribute("id_item");
		    $.concierge.trigger({type:"page", value: id_item});
		};
		let s = "<div class='panel controls'><p style='display: none'>Each poll you complete gives you one chance of being one of our 5 winners of a $20 gift card.</p><p>We want to know how you think we can improve NB. Please give us your opinion by participating to our survey below. </p></div><div class='panel nav'><button action='prev'>&lt;&lt;</button><span class='poll_meter'><span class='poll_current'>0</span>/<span class='poll_total'>0</span></span><button action='next'>&gt;&gt;</button></div><div class='panel content'>Loading polls...</div>";
		self.element.addClass("pollView").html(s);
		$("button[action=prev]", self.element).click(function(){
			self._setData('poll_index', Number(self._getData('poll_index'))-1);
			self.get_poll();
		    });
		$("button[action=next]", self.element).click(function(){
			self._setData('poll_index', Number(self._getData('poll_index'))+1);
			self.get_poll();
		    });

	    },
	    _defaultHandler: function(evt){
	    }, 
	    set_model: function(model){
		var self = this;
		this._setData('model', model);
		let poll_index = 0;
		this._setData('poll_index', poll_index);
		//for now, we don't register to receive any particular updates.
		model.register($.ui.view.prototype.get_adapter.call(this),  {});
		self.get_poll();
	    },
	    get_poll: function(){
		let self = this; 
		let poll_index = self._getData('poll_index');
		$.concierge.get_component("poll_getter")({payload:{id: poll_index}}, function(p){
			// we embed the call in an anymous fct in order to have the 'this' object be our pollView and not just "Window"
			self.__update_poll(p);
		    });
	    },
		
	    _update: function(){
	    },
	    __update_poll: function(payload){
		let self = this; 
		let model = this._getData('model');
		let poll_index = this._getData('poll_index');		
		let latestPoll = null;
		//		let altered = 0;
		let s = "";
		for (let i in model.o.polls){
		    latestPoll =  model.o.polls[i];
		    break; // but only 0 or 1 in theory
		}
		if (latestPoll){
		    s=latestPoll.body+"<"+LIST_TAGS[latestPoll.type]+">";
		    let choices = model.o.choices;
		    latestPoll.type
		    let choice_by_value = [];
		    for (let i in choices){
			choice_by_value.push(choices[i]);
		    }
		    choice_by_value.sort(function(a,b){
			    return a.value-b.value;
			});
		    for (let i in choice_by_value){
			    let c = choice_by_value[i];
			    s+="<li><input type='radio' id_item='"+c.id+"' value='"+i+"' name='poll-choice'/><span>"+c.body+"</span></li>";
			}
		
		    let TEXTAREA_VIS = (latestPoll.showcomment==1)? "": " style='display: none' ";
		    s+="</"+LIST_TAGS[latestPoll.type]+"><textarea class='textarea-comments' "+TEXTAREA_VIS+" >"+latestPoll.commentlabel+"</textarea><br/><button disabled='1' action='save'>Save</button><button style='margin-left: 30px' disabled='1' action='cancel'>Cancel</button>";
		}
		else{
		    s="<i>You've answered all the current polls. <b>Thanks a lot for your paricipation ! </b> </i><br/><span>The NB Team</span>";
		}
	
		$("div.content", self.element).html(s);
		let savebutton = $("button[action=save]", self.element);
		let cancelbutton = $("button[action=cancel]", self.element);
		let nextButton =  $("button[action=next]", self.element);
		let prevButton =  $("button[action=prev]", self.element);
		for (let i in model.o.responses){
		    //		    savebutton.removeAttr("disabled");
		    $("input[id_item="+model.o.responses[i].id_choice+"]", self.element).attr("checked", "1");
		    $("textarea", self.element)[0].value = model.o.responses[i].comment;
		}
		$("input", self.element).click(function(){
			savebutton.add(cancelbutton).removeAttr("disabled");
			nextButton.add(prevButton).attr("disabled", 1);
		    });
		savebutton.click(function(){
			//			self._setData('poll_index', Number(poll_index)+1);
			self._setData('poll_index',0);
			let checked_input = $("input:checked", self.element);
			let checked_choices = [];
			for (let i=0;i<checked_input.length;i++){
			    checked_choices.push( checked_input[i].getAttribute("id_item")) ;
			}
			$.concierge.get_component("poll_editor")(
			    {id_poll:latestPoll.id,
				    ids_choice: checked_choices, 
				    comment:$("textarea", self.element)[0].value
				    },  function(p){self.get_poll();});
			nextButton.add(prevButton).removeAttr("disabled");
			savebutton.add(cancelbutton).attr("disabled", 1);
		    });
		cancelbutton.click(function(){
			nextButton.add(prevButton).removeAttr("disabled");
			$("input:checked", self.element).each(function(){this.checked=false});
			for (let i in model.o.responses){
			    $("input[id_item="+model.o.responses[i].id_choice+"]", self.element).each(function(){this.checked=true});
			    $("textarea", self.element)[0].value = model.o.responses[i].comment;
			}
			savebutton.add(cancelbutton).attr("disabled", 1);

		    });
		let completed = Number(model.o.polls_stats.completed);
		let total = Number(model.o.polls_stats.total);
	
		let currentIndex = completed+1+poll_index;
		if (currentIndex >= total){
		    nextButton.attr("disabled", 1);
		}
		else{
		    nextButton.removeAttr("disabled");
		}
		if (currentIndex==1){
		    prevButton.attr("disabled", 1);
		}
		else{
		    prevButton.removeAttr("disabled");
 		}
		$("span.poll_total", self.element).text(total);
		let textCurrent = (currentIndex > total) ? "-":currentIndex;
		$("span.poll_current", self.element).text(textCurrent);

	    },
	    update: function(payload){
	
	    }
	});
    $.widget("ui.pollView",V_OBJ );
    $.ui.pollView.defaults = $.extend({}, {});
    $.extend($.ui.pollView, {
	    defaults: {
		provides: ["polls"], 
		    listens: {
			}		    
	    },
		getter:$.ui.view.getter
		});
})(jQuery);
