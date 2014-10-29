/* notepaneView Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true NB$:true*/
(function($) {
    var $str = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _f_location_seen: function(id_location){
        var self = this;
        return function(){
            var m = self._model;
            var o = m.get("comment", {ID_location: id_location}).items;
            var i;
            var new_seen = {};
            for (i in o){
            if (!(i in m.o.seen)){
                new_seen[i] = {id: i, id_location: id_location};
                $.concierge.logHistory("seen", i);
            }
            }            
            //            $.L("Marking thread " + id_location + " as seen !");
            self._model.add("seen", new_seen);
        };
        },
        _create: function() {
            $.ui.view.prototype._create.call(this);
            var self = this;
            self._pages =  {}; //pages that have been rendered
            self._maxpage =  0; //last (i.e. max page number of) page that has been rendered
            self._page = null; 
            self._scrollTimerID = null;
            self._seenTimerID = null;
            self._id_location = null; //location_id of selected thread
            self._is_first_stroke = true;
            self._rendered = false;
            self._filters = {me: false, star: false, question: false, advanced: false};
            self.QUESTION = null;
            self.STAR = null;

            self.element.addClass("notepaneView");

            var $header = $("<div>").addClass("notepaneView-header");
            var $filters = $("<div>").addClass("filter-controls");
            var $filter_me = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: threads I participated in")
                .attr("action", "me")
                .html("<span>me</span><div class='filter-count'>0</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'me'
                    });
                });
            var $filter_star = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: starred threads")
                .attr("action", "star")
                .html("<span><div class='nbicon staricon' /></span><div class='filter-count'>...</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'star'
                    });
                });
            var $filter_question = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: threads with standing questions")
                .attr("action", "question")
                .html("<span><div class='nbicon questionicon' /></span><div class='filter-count'>...</div>")
                .click(function() {
                    $.concierge.trigger({
                        type: 'filter_toggle',
                        value: 'question'
                    });
                });
            var $filter_advanced = $("<a>")
                .addClass("filter")
                .attr("title", "toggle filter: toggle by advanced features")
                .attr("action", "advanced")
                .html("<div class='filter-count'>advanced</div>")
                .click(function() {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        self._filters.advanced = false;
                        self._page = 1;
                        self._pages = {};
                        self._maxpage = 0;
                        self._render(true);
                    } else {
                        $wizard.dialog("open");
                    }
                });

            var $filtered_message = $("<span class='filter-msg-filtered'><span class='n_filtered'>0</span> threads out of <span class='n_total'>0</span></span>");
            var $unfiltered_message = $("<span class='filter-msg-unfiltered'><span class='n_unfiltered'>0</span> threads</span>");
            var $notepaneView_pages = $("<div>").addClass("notepaneView-pages");

            $filters.append($filter_me).append($filter_star).append($filter_question).append($filter_advanced);
            $header.append($filters).append($filtered_message).append($unfiltered_message);
            self.element.append($header).append($notepaneView_pages);

            if (window.location.href.indexOf("?filter") === -1) {
                $filter_advanced.remove();
            }

            $("body").append(
                "<ul id='contextmenu_notepaneView' class='contextMenu'>" +
                "<li class='context export-top'><a href='#export-top'>Export Original Post</a></li>"+
                "<li class='context export-all'><a href='#export-all'>Export Entire Thread</a></li>"+
                "</ul>");

            $("body").append(
                $("<div>").attr("id", "filterWizardDialog")
                );

            var $wizard = $("#filterWizardDialog");
            $wizard.filterWizard({
                admin: true, // TODO: use 'admin' variable
                callbacks: {
                    onOk: function() { $wizard.dialog("close"); }
                }
            }).dialog({
                width: 800,
                height: 200,
                modal: true,
                autoOpen: false
            });

            $("#contextmenu_notepaneView").bind("beforeShow", function(event, el) {
                var id_item = el.closest("div.location-lens").attr("id_item");
                var m = self._model;
                var c = m.o.comment[id_item];
                $("li", this).show();
            });

        },
        _defaultHandler: function(evt){
        var self=this;
        if (self._id_source ===  $.concierge.get_state("file")){
            var sel, container, delta_top, delta_bottom, o, h, H, scrollby;
            switch (evt.type){
            case "page":
                if (self._page !== parseInt(evt.value, 10)){
                    self._page =  parseInt(evt.value, 10);            
            self._render();

            container = $("div.notepaneView-pages", self.element);
            sel = $("div.notepaneView-comments[page="+evt.value+"]",self.element);
            delta_top = sel.offset().top - container.offset().top;
            container.stop(true).animate({scrollTop: (delta_top>0?"+="+delta_top:"-="+(-delta_top))  + 'px'}, 300); 
            }
            break;
            case "filter_threads":
                $.concierge.get_component("advanced_filter")({
                    id_source: self._id_source,
                    n: evt.value.n,
                    r: evt.value.r,
                    type: evt.value.type
                }, function(result) {
                    self._filters.advanced = result.locs;
                    self._page = 1;
                    self._pages = {};
                    self._maxpage = 0;
                    self._render(true);
                });

            break;
            case "filter_toggle": 
            if (evt.value in self._filters){
                self._filters[evt.value] = (!(self._filters[evt.value]));
                self._page =  1;
                self._pages = {};
                self._maxpage = 0;
                self._render(true);
            }
            break;
            case "note_hover": 
            $("div.location-lens[id_item="+evt.value+"]", self.element).addClass("hovered");
            break;
            case "note_out": 
            $("div.location-lens[id_item="+evt.value+"]", self.element).removeClass("hovered");        
            break;
            case "warn_page_change": 
            o = self._model.o.location[evt.value];
            var page_summary;
            if (o.page > self._page){
            self._render_one(o.page);
            page_summary = o.page;
            }
            else{
                page_summary = self._page;
            }
            sel = $("div.location-pagesummary[page="+page_summary+"]", self.element).addClass("selected");
            container = $("div.notepaneView-pages", self.element);
            if (sel.length>0){

            h = sel.height() ;
            H = container.height();
            delta_top = sel.offset().top - container.offset().top;
            delta_bottom = delta_top + h - H;
            if (delta_top > 0){ //selected note is not too high
                if (delta_bottom > 0) {//but it's too low... scroll down
                scrollby = delta_bottom + H/2-h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget. 
                container.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300);     
                }
            }
            else{ //too high: recenter: 
                scrollby = delta_top + (h-H)/2;
                container.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300);     
            }
            }
            break;
            case "select_thread": 
            $("div.location-pagesummary.selected", self.element).removeClass("selected");
            if (self._seenTimerID !== null){
            window.clearTimeout(self._seenTimerID);
            }
            self._seenTimerID = window.setTimeout(self._f_location_seen(evt.value), 1000);
            o = self._model.o.location[evt.value];
            if (o.page !==  self._page){
            self._page =  o.page;
            self._render();
            }
            $("div.location-lens[id_item="+self._id_location+"]", self.element).removeClass("selected");
            self._id_location = evt.value;
            sel = $("div.location-lens[id_item="+evt.value+"]",self.element).addClass("selected");
            container = $("div.notepaneView-pages", self.element);
            if (sel.length>0){
            
            h = sel.height() ;
            H = container.height();
            delta_top = sel.offset().top - container.offset().top;
            delta_bottom = delta_top + h - H;
            if (delta_top > 0){ //selected note is not too high
                if (delta_bottom > 0) {//but it's too low... scroll down
                scrollby = delta_bottom + H/2-h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget. 
                container.stop(true).animate({scrollTop: '+=' + scrollby  + 'px'}, 300);     
                }
            }
            else{ //too high: recenter: 
                scrollby = delta_top + (h-H)/2;
                container.stop(true).animate({scrollTop: '+=' + scrollby + 'px'}, 300);     
            }
            }
            break;
            case "keydown": 
            self._keydown(evt.value);
            break;
            }    
        }    
        },
        _update_filters: function(){
        var self = this;
        var m = self._model;
        var locs = m.get("location", {id_source:  self._id_source});
        var me = $.concierge.get_component("get_userinfo")();
        var n_unfiltered = locs.length();
        var filters_on = false;
        var $filters = $("a.filter", self.element).removeClass("active");
        var $filter_me = $filters.filter("[action=me]");
        var $filter_star = $filters.filter("[action=star]");
        var $filter_question = $filters.filter("[action=question]");
        var $filter_advanced = $filters.filter("[action=advanced]");

        var locs_me        = locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
        var locs_star        = m.get("threadmark", {active: true, type: self._STAR });
        var locs_question    = m.get("threadmark", {active: true, type: self._QUESTION });

        var locs_filtered = locs;
        if (self._filters.me){
            $filter_me.addClass("active");
            filters_on = true;
            locs_filtered = locs_filtered.intersect(locs_me.items);
        }
        if (self._filters.star){
            $filter_star.addClass("active");
            filters_on = true;
            locs_filtered = locs_filtered.intersect(locs_star.values("location_id"));
        }
        if (self._filters.question){
            $filter_question.addClass("active");
            filters_on = true;
            locs_filtered = locs_filtered.intersect(locs_question.values("location_id"));
        }
        if (self._filters.advanced) {
            $filter_advanced.addClass("active");
        }
        var n_me =  locs_me;
        var n_star = locs_star;
        var n_question = locs_question;

        $("div.filter-count", $filter_me).text(n_me.length());
        $("div.filter-count", $filter_star).text(n_star.length());                               
        $("div.filter-count", $filter_question).text(n_question.length());                               
        if (filters_on){
            $("span.filter-msg-unfiltered", self.element).hide();
            $("span.filter-msg-filtered", self.element).show();
            $("span.n_total", self.element).text(n_unfiltered);
            $("span.n_filtered", self.element).text(locs_filtered.length());
        } 
        else{
            $("span.filter-msg-unfiltered", self.element).show();
            $("span.filter-msg-filtered", self.element).hide();    
            $("span.n_unfiltered", self.element).text(locs.length());
        }
        },
        _lens: function(l){
        var self = this;
        var m = self._model;
        var me = $.concierge.get_component("get_userinfo")();
        var numnotes = m.get("comment", {ID_location: l.ID}).length();
        var numseen = m.get("seen", {id_location: l.ID}).length();
        var numstar = m.get("threadmark",  {active: true, type: self._STAR, location_id: l.ID }).length();
        var numquestion = m.get("threadmark",  {active: true, type: self._QUESTION, location_id: l.ID }).length();

        var unseen_me = m.get("comment", {ID_location: l.ID, id_author: me.id}).length() -  m.get("seen", {ID_location: l.ID, id_author: me.id}).length(); 
        var numnew    = numnotes - numseen - unseen_me; //so that notes that I've authored but that I haven't seen don't count.     
        var lf_numnotes =  "<ins class='locationflag "+(numnew>0?"lf-numnewnotes":"lf-numnotes")+"'>"+numnotes+"</ins>";
        var lf_admin    = m.get("comment", {ID_location: l.ID, admin:1}).is_empty() ? "" : "<ins class='locationflag'><div class='nbicon adminicon' title='An instructor/admin has participated to this thread'>&nbsp;</div></ins>";
        var lf_me_private =  m.get("comment", {ID_location: l.ID, id_author:me.id}).is_empty() ? "": (m.get("comment", {ID_location: l.ID, type:1}).is_empty() ?  "<ins class='locationflag'><div class='nbicon meicon' title='I participated to this thread'/></ins>" : "<ins class='locationflag'><div class='nbicon privateicon' title='I have private comments in  this thread'/></ins>" );
        var bold_cl    = numnew > 0 ? "location-bold" : "";
        var lf_star    = numstar > 0 ? "<ins class='locationflag'><div class='nbicon staricon-hicontrast' title='This thread has been starred'/></ins>" : "";
        var lf_question    = numquestion > 0 ? "<ins class='locationflag'><div class='nbicon questionicon-hicontrast' title='A reply is requested on this thread'/></ins>" : "";
        var root =  m.get("comment", {ID_location: l.ID, id_parent: null}).first();
        var htmlStrippedString = root.body.replace(/(<([^>]+)>)/ig,"");
        var body = (root===null || root.body.replace(/\s/g, "") === "") ? "<span class='empty_comment'>Empty Comment</span>" : htmlStrippedString;
        return "<div class='location-flags'>"+lf_numnotes+lf_admin+lf_me_private+lf_star+lf_question+"</div><div class='location-shortbody "+(numquestion>0?"replyrequested":"")+"'><div class='location-shortbody-text "+bold_cl+"'>"+body+"</div></div>";
        }, 
        _keydown: function(event){
        var self=this;
        var codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
        var new_sel, id_item, id_new;

        if (event.shiftKey || event.altKey || event.ctrlKey) {
            // We aren ot expecting shift, alt, or ctrl with our key codes, so we let others handle this
            return true;
        }

        if (event.keyCode in codes){
            var sel = $("div.location-lens.selected", self.element);
            if (sel.length){
            new_sel = sel[codes[event.keyCode].sel]("div.location-lens");
            if (new_sel.length){
                self._is_first_stroke = true;
                new_sel.click();
            }        
            else { // we need to find a following location on subsequent pages
                id_item = sel.attr("id_item");
                id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: self._model, direction: codes[event.keyCode].dir, filters: self._filters}); 
                if (id_new !== null){
                if (self._is_first_stroke){//add an extra keystroke between changing pages
                    self._is_first_stroke = false;                
                    $.concierge.trigger({type:"warn_page_change", value: id_new});
                }
                else{
                    self._is_first_stroke = true;                    
                    $.concierge.trigger({type:"select_thread", value: id_new});
                }
                }
                else{
                $.I( codes[event.keyCode].msg);
                }
            }
            }
            else{ // no selection on the page
            new_sel = $("div.location-lens")[codes[event.keyCode].no_sel](); 
            if (new_sel.length){
                new_sel.click();
                //                $.L("moving selection");
            }
            }
            return false;
        }
        else{
            return true; // let the event be captured for other stuff
        }
        //        $.L("keypressed");
        }, 
        _f_location_click : function(event){
        var id_item = event.currentTarget.getAttribute("id_item");
        $.concierge.trigger({type:"select_thread", value: id_item});
        },
        _f_location_hover : function(event){
        var id_item = event.currentTarget.getAttribute("id_item");
        $.concierge.trigger({type:"note_hover", value: id_item});
        }, 
        _f_location_out : function(event){
        var id_item = event.currentTarget.getAttribute("id_item");
        $.concierge.trigger({type:"note_out", value: id_item});
        },
        _render: function(do_erase){
        /*
         * this is where we implement the caching strategy we want...
         */
        var self = this;
        if (do_erase){
            self.element.children("div.notepaneView-pages").children("div.notepaneView-comments").empty();
        }
        //first, render the current page...
        var f = this._model.o.file[ this._id_source];
        var p = this._page;
        var p_after = p; 
        var p_before = p;
        this._render_one(p);        
        this._update_filters();
        //estimate how much space taken by annotations, and render 120% of a whole screen of them if not enough on current page
        var container =     $("div.notepaneView-pages", this.element);        
        while ( container.children().last().offset().top - container.offset().top < container.height() ){
            p_after++;
            if (p_after<=f.numpages){
            this._render_one(p_after);
            }            
            p_before--;
            if (p_before>0){
            this._render_one(p_before);
            }
            if (p_before<1 && p_after >= f.numpages){
            //There's just not enough annotations to render a whole screen 
            return;
            }
        }
        }, 
        _render_one: function(page){

        var self    = this;        
        var nosummary = false;

        if (page > self._maxpage){
            self._maxpage =  page;
        }

        // If we only have one page, no need to display the page summary
        if (self._maxpage <= 1) {
            nosummary = true;
        }

        if (!(page in self._pages)){
            var m    = self._model;
            var $pane    = $("div.notepaneView-comments[page="+page+"]", self.element).empty();
            var locs    = m.get("location", {id_source:  self._id_source, page: page });
            var me = $.concierge.get_component("get_userinfo")();
            if (self._filters.me){
            locs = locs.intersect(m.get("comment", {id_author: me.id}).values("ID_location"));
            }
            if (self._filters.star){
            locs = locs.intersect(m.get("threadmark", {active: true, type: self._STAR }).values("location_id"));
            }
            if (self._filters.question){
            locs = locs.intersect(m.get("threadmark", {active: true, type: self._QUESTION }).values("location_id"));
            }
            if (self._filters.advanced){
                locs = locs.intersect(self._filters.advanced);
            }
            var locs_array = locs.sort(self.options.loc_sort_fct);
            var o;
            if (locs_array.length && !nosummary){
            $pane.append("<div class='location-pagesummary' page='"+page+"'>"+locs_array.length+" thread"+$.pluralize(locs_array.length)+" on page "+page+"</div>");
            }

            var admin = m.get("ensemble", {}).first().admin === true;

            locs_array.forEach(function(o) {
                var loc_lens =
                    $("<div class='location-lens' id_item='"+o.ID+"'>"+self._lens(o)+"</div>");
                $pane.append(loc_lens);
                // Get the location shortbody text containers
                var $shortBody = loc_lens.find(".location-shortbody-text");
                // Activate MathJax for Latex Formulas in the containers
                $shortBody.each(function(i, mathBlock) {
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,mathBlock]);
                });
                if (admin === true) {
                    loc_lens.contextMenu({menu: "contextmenu_notepaneView"}, function(action, el, pos) {
                        var $loc = $(el).closest("div.location-lens");
                        var id_item = $loc.attr("id_item");
                        if (action === "export-top" || action === "export-all") {
                            var text = "@import(" + id_item + ", " + ((action === "export-top") ? "top" : "all") + ")";
                            window.prompt("Copy the text below and insert it as a new annotation to import it.", text);
                        }
                    });
                }
            });

            $("div.location-lens", $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass("lens-odd").filter(":odd").addClass("lens-odd");
            if (self._id_location in locs.items && locs.items[self._id_location].page === page){//highlight selection
            $("div.location-lens[id_item="+self._id_location+"]",self.element).addClass("selected");
            }
            self._pages[page] = true;           
            self._rendered = true;
            return locs;
        }
        self._rendered = true;
        return null;
        }, 
        set_model: function(model){
        var self=this;
        self._STAR = $.concierge.get_constant("STAR");
        self._QUESTION =  $.concierge.get_constant("QUESTION");
        self._model =  model;
        var id_source = $.concierge.get_state("file");
        self._id_source =  id_source ; 
        model.register($.ui.view.prototype.get_adapter.call(this),  {location: null, seen: null, threadmark: null});
        //make placeholders for each page: 
        var f = model.o.file[id_source];
        var $pane = $("div.notepaneView-pages", self.element);
        $pane.scroll(function(evt){
            var timerID = self._scrollTimerID;
            if (timerID !== null){
                window.clearTimeout(timerID);
            }            
            timerID = window.setTimeout(function(){
                //Are we within 20px from the bottom of scrolling ?
                while ($pane.children().last().offset().top - $pane.offset().top - $pane.height() < 20){
                    var maxpage = self._maxpage;
                    $.L("scroll: maxpage="+maxpage);
                    if (maxpage < f.numpages){
                    self._render_one(maxpage+1);
                    }
                    else{
                    return; //last page has been rendered. 
                    }
                }
                }, 300);
            self._scrollTimerID =  timerID;   
            
            });
        for (var i = 1;i<=f.numpages;i++){
            $pane.append("<div class='notepaneView-comments' page='"+i+"'/>");
        }
        self._update();    
        }, 
        update: function(action, payload, items_fieldname){
        var self = this;
        var m = self._model;
        var i, D, loc, pages_done, id_source, page, pages, pages_to_render;
        if (action === "add" && items_fieldname === "location"){
            id_source    = self._id_source; 
            page        = self._page;
            if (page === null || id_source === null ){
            //initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set. 
            self._page =  1;
            self._pages = {};
            self._maxpage = 0;
            self._render();
            //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already. 
            }
            else{
            //send signal to redraw pages that needs to be redrawn: 
            D        = payload.diff;
            pages    = self._pages;
            pages_to_render = {};
            for (i in D){
                if (D[i].id_source === id_source){
                delete pages[D[i].page];
                pages_to_render[[D[i].page]] = null;
                }
            }
            for (i in pages_to_render){
                self._render_one(i);
            }
            }
        }
        else if (action === "add" && items_fieldname === "seen" && self._rendered){
            D        = payload.diff;
            var locs_done = {};
            for (i in D){
            loc = m.get("location", {ID: D[i].id_location}).first();
            if (loc !== null && loc.id_source === self._id_source && (!(loc.ID in locs_done))){
                locs_done[loc.ID] = null;
                $("div.location-lens[id_item="+loc.ID+"]",self.element).html(self._lens(loc));
            }
            }           
        }
        else if (action === "remove" && items_fieldname === "location"){ //just re-render the pages where locations were just removed. 
            D        = payload.diff;
            pages_done    = {};

            for (i in D){
            page = D[i].page;
            if (! (page in pages_done)){
                pages_done[page] = null;
                delete self._pages[page];
                self._render_one(page);
            }
            }
        }
        else if (action === "add" && items_fieldname === "threadmark" && self._rendered){
            D = payload.diff;
            
            pages_done    = {};
            for (i in D){
            loc = m.get("location", {ID: D[i].location_id}).first();
            if (loc!= null){
                page = loc.page;
                if (! (page in pages_done)){
                delete self._pages[page];
                self._render_one(page);
                }
            }
            }
            self._update_filters();
        }
        }    
    });
    $.widget("ui.notepaneView",V_OBJ );
    $.ui.notepaneView.prototype.options = {
    loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
    expand: "div.notepaneView-pages", 
    listens: {
        page: null, 
        note_hover: null, 
        note_out: null, 
        select_thread: null, 
        warn_page_change: null, 
        keydown: null,
        filter_toggle: null,
	filter_threads: null
    }            
    };
})(jQuery);
