/* filterwizardEmoticons Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
            $.ui.view.prototype._create.call(this);
            var self = this;
            self.element.addClass("filterWizardEmoticon");
            self._model = null;
            self._render();
        },
        _defaultHandler: function(evt){
            this._render();
        },
        _render: function(){
            var self=this;
            self.element.empty();

            var $h = $("<h3>Filter Emoticons&#x2026;</h3>");
            var $e = $("<p>").addClass("error-message");
            var $p = $("<p>");

            self.element.append($h).append($e).append($p);

            // Basic Idea:
            // The controls for these text fields are:
            //  - $n : number (raw or %, according to $r)
            //  - $r : ratio? (either "percentage" or "total")
            //  - $filterType : type of filter ["random", "reply", "students", "longest"]

            var $emot = [];
            $emot.push($("<input>").attr("type","image").attr("title","curious").attr("id","curious").attr("src","/content/modules/dev/emoticons/curious.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","confused").attr("id","confused").attr("src","/content/modules/dev/emoticons/confused.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","useful").attr("id","useful").attr("src","/content/modules/dev/emoticons/useful.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","interested").attr("id","interested").attr("src","/content/modules/dev/emoticons/interested.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","frustrated").attr("id","frustrated").attr("src","/content/modules/dev/emoticons/frustrated.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","help").attr("id","help").attr("src","/content/modules/dev/emoticons/help.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","question").attr("id","question").attr("src","/content/modules/dev/emoticons/questionMark.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));
            $emot.push($("<input>").attr("type","image").attr("title","idea").attr("id","idea").attr("src","/content/modules/dev/emoticons/idea.png").attr("onClick","but_toggle(this);").addClass("filterUnclicked"));

            var togg = "if(el.className=='filterUnclicked') {srcLen = el.src.length; tmpsrc = el.src.substring(0,srcLen-4); el.src = tmpsrc+'_on.png'; el.className='filterClicked';}" +
                      "else if(el.className=='filterClicked') {srcLen = el.src.length; tmpsrc = el.src.substring(0,srcLen-7); el.src = tmpsrc+'.png'; el.className='filterUnclicked';} return;";
            var fun = "<script> function but_toggle(el) {"+togg+"} </script>";

            var $go = $("<input>").attr("type", "button").attr("value", "Go");
            var $cancel = $("<input>").attr("type", "button").attr("value", "Cancel");

            $p.append(fun);
            for(var i=0; i< $emot.length; i++)
            {
                $p.append($emot[i]);
            }
            $p.append($go)
                .append($cancel);

            $cancel.click(function() {
                if (self.options.callbacks.onCancel) {
                    self.options.callbacks.onCancel();
                }
            });

            $go.click(function() {
                // Step 1: validate [formatting + n/r compatibility]

                //there is only buttons, no validation needed
                var chosenEmot=[];

                for(var i=0; i< $emot.length; i++)
                {
                    if($emot[i].hasClass("filterClicked"))
                    {
                        chosenEmot.push($emot[i].attr("id"));
                        $emot[i].toggleClass("filterClicked filterUnclicked");
                        var srcLen = $emot[i].attr("src").length;
                        var tmpsrc = $emot[i].attr("src").substring(0,srcLen-7);
                        $emot[i].attr("src",tmpsrc+'.png');
                    }
                }


                // Step 2: fire event OR callback
                if (self.options.callbacks.fireEvent) {
                    self.options.callbacks.fireEvent(chosenEmot);
                } else {
                    $.concierge.trigger({
                        type: "filter_emoticons",
                        value: chosenEmot
                    });
                }

                // Step 3: call callback if set
                if (self.options.callbacks.onOk) {
                     self.options.callbacks.onOk();
                }

            });

        },
        set_model: function(model){
            var self=this;
            self._model = model;
            model.register(
                $.ui.view.prototype.get_adapter.call(this),
                {
                    file: null,
                    folder: null,
                    file_stats: null,
                    replyrating: null,
                    question: null
                });

        },
        update: function(action, payload, items_fieldname){

        }
    });

    $.widget("ui.filterWizardEmoticon",V_OBJ );
    $.ui.filterWizardEmoticon.prototype.options = {
	listens: {
	},
	admin: false,
        callbacks: {
            onOk: null,
            fireEvent: null,
            onCancel: null
        }
    };
})(jQuery);
