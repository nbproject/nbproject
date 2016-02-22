/* filesView Plugin
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
/*global jQuery:true NB$:true */
(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
        $.ui.view.prototype._create.call(this);
        var self = this;
        self._model        = null;
        self._id_ensemble    = null;
        self._id_folder        = null;
        self._admin        = self.options.admin;
        self._me        = $.concierge.get_component("get_userinfo")();
        self._scrollTimerID =  null;
        //self._firstrender = true;
        self._defaultopen = null;

        self.element.addClass("filesView");
        $(document.body).on("click", "button[action=add_file]", function(){
            $.concierge.get_component("add_file_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
            });
        $(document.body).on("click","button[action=add_folder]", function(){
            $.concierge.get_component("add_folder_menu")({id_ensemble: self._id_ensemble, id_folder:  self._id_folder});
            });
        $(document.body).on("click","button[action=invite_users]", function(){
            $.concierge.get_component("invite_users_menu")({id_ensemble: self._id_ensemble});
            });

        // Declare Filesview Context Menu

        $.contextMenu({
            selector: 'tr.filesview_row',
            build: function ($trigger, e) {

                var item_object = self._context_build.call(self, $trigger, e);

                return {
                    callback: function (key, options) {
                        // we use 'call' and supply 'self' so that _context
                        // will use 'self' as 'this', not the context menu.
                        self._context_callback.call(self, this, key, options);
                    },
                    items: item_object
                };
            }
        });
        },
        _defaultHandler: function(evt){
        switch (evt.type){
        case "folder":
        this._id_ensemble    = this._model.o.folder[evt.value].id_ensemble;
        this._id_folder        = evt.value;
        break;
        case "ensemble":
        this._id_ensemble    = evt.value === 0 ? null : evt.value;
        this._id_folder        = null;
        break;
        case "home":
        this._id_ensemble    = null;
        this._id_folder        = null;
        break;
        /*
        case "rate_reply":
        $("#filesView-pending-list li[comment_id="+evt.value.comment_id+"] button").attr("disabled", "disabled");
        break;
        */
        }
        this._render();
        },
        _context_build: function (el, event) {

            var self = this;
            var items = {
                "rename": { name: "Rename", icon: "rename" },
                "move": { name: "Move", icon: "move" },
                "update": { name: "Update", icon: "update" },
                "assignment": { name: "Edit Assignment", icon: "assignment" },
                "sep1": "---------",
                "duplicate": { name: "Duplicate", icon: "duplicate" },
                "sep2": "---------",
                "delete": { name: "Delete", icon: "delete" }
            };

            if (self._model.get("ensemble", {ID: self._id_ensemble}).first().admin === false) {
                return false;
            }

            if (el.closest(".filesview_row").attr("item_type") === "folder") {
                delete items["update"];
                delete items["assignment"];
            }

            return items;
        },
        _context_callback: function (el, action) {
            switch (action) {
                case "open":
                    $.concierge.get_component("file_open")({ id: el.attr("id_item") });
                    break;
                case "foo":
                    break;
                default:
                    $.concierge.get_component(action + "_file_menu")({ item_type: el.attr("item_type"), id: el.attr("id_item") });
                    break;
            }
        },
        _filelens: function(f){
        var ckey = $.concierge.get_component("get_userinfo")().ckey;
        var analytics_link = (this._admin && f.filetype === 1) ?  "<br/><a href='/f/"+f.ID+"/analyze' target='_blank'>Analytics</a>" : "";
        var opts = this._admin ? "<td><a href='javascript:void(0)' class='optionmenu'>Actions</a>"+analytics_link+"</td>" : "" ;
        var d = new Date(f.date_published);
        var date_added = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear().toString().substring(2);
        var assignment_info = f.assignment ? ("Yes - due "+f.due.substring(4,0)+"-"+f.due.substring(7,5)+"-"+f.due.substring(10,8)+" at "+f.due.substring(13,11)+":"+f.due.substring(16,14)) :"<span>No</span>";
        var download = "";
        var f_stats =  this._model.o.file_stats[f.ID];
        if (this._admin || this._model.o.ensemble[f.id_ensemble].allow_download){
            if (f.filetype === 1){
                download = "<a target='_blank' href='"+this.options.img_server+"/pdf/repository/"+f.ID+"?ckey="+ckey+"'>original</a>";
                //for now only admin can download annotated PDF:
                if (this._admin && f_stats !== undefined){
                    download += " <a target='_blank' href='"+this.options.img_server+"/pdf/annotated/"+f.ID+"?ckey="+ckey+"'>annotated</a>";
                }
            }
            download = "<td>"+download+"</td>";
        }
        var stats;
        if(f_stats){
            stats = "<td><a title='You wrote  "+f_stats.mine+" comments on this file.' class='collagelink'";
            stats += f_stats.mine ? "target='_blank' href='/collage?q=auth&amp;id_source="+f.ID+"'>": ">";
            stats += "<span class='collagelink-caption'> me </span><div class='collagelink-number'> "+f_stats.mine+"</div></a> <a title=\"There are "+(f_stats.total-f_stats.seen)+" comments you haven't seen on this file.\" class='collagelink' ";
            stats += (f_stats.total-f_stats.seen) ? "target='_blank' href='/collage?q=auth_admin&amp;id_source="+f.ID+"&amp;unread=1'>": ">";
            stats += "<span class='collagelink-caption'> unread </span><div class='collagelink-number'>"+(f_stats.total-f_stats.seen)+"</div></a> <a title='There are "+f_stats.total+" comments on this file.' class='collagelink' ";
            stats += f_stats.total ? "target='_blank' href='/collage?q=auth_admin&amp;id_source="+f.ID+"'>": ">";
            stats += "<span class='collagelink-caption'> all </span><div class='collagelink-number'> "+f_stats.total+"</div></a> </td>";
        }
        else{stats = "<td/>";}
        var type_class = 'pdficon';
        if (f.filetype === 4) { type_class = 'html5icon'; } // TODO: 4 should not be hardcoded
        if (f.filetype === 2) { type_class = 'youtubeicon'; } // TODO: 2 should not be hardcoded
        return $("<tr class='filesview_row' item_type='file' id_item='"+f.ID+"'><td class='hidden'>"+date_added+"</td><td class='filesview_ftitle'><div class='nbicon "+type_class+"'/><a class='aftericon' target='_blank' href='/f/"+f.ID+"'>"+$.E(f.title)+"</a></td><td>"+assignment_info+"</td>"+download+stats+opts+"</tr>");

        },
        _folderlens: function(f){
        var opts = this._admin ? "<td><a href='javascript:void(0)' class='optionmenu'>Actions</a></td>" : "" ;
        return $("<tr class='filesview_row' item_type='folder' id_item='"+f.ID+"'><td class='filesview_ftitle'><div class='nbicon foldericon'/><a class='aftericon'  href='javascript:"+$str+".concierge.trigger({type:\"folder\", value:"+f.ID+"})'>"+$.E(f.name)+"</a></td><td/><td/><td/>"+opts+"</tr>");
        },
        _draw_pending: function(){
        var self = this;
        var m = self._model;
        var $list = $("#filesView-pending-list", self.element).empty();
        var f_question_sort = function(o1,o2){
            return o2.id-o1.id;
        };
        var id_ensemble = self._id_ensemble;
        var  query_params = {};
        var viewall_url = "/collage?q=pending";
        if (id_ensemble !== null){
            query_params["ensemble_id"] = id_ensemble;
            viewall_url+="&amp;id_ensemble="+id_ensemble;
        }
        $("#filesView-allpending-link").attr("href", viewall_url);

        var questions    = m.get("question", {user_id: self._me.id}).intersect(m.get("location", query_params).items, "location_id").sort(f_question_sort);
        if (questions.length){
            $("#filesView-pending-header-total").text(questions.length);
            $("#filesView-pending-header-plural").text($.pluralize(questions.length));
        }
        else{
            //  $("#filesView-panel-pending").hide();
        }
        var i,l,cs, c,q,s, body, reply_link,  ensemble_info, when, lens, lens_comment, comments, buttons, rating;
        for (i in questions){
            q = questions[i];
            l = m.o.location[q.location_id];
            cs = m.get("comment", {location_id: l.id}).items;
            comments = "";
            s = m.o.file[l.source_id];
            ensemble_info = id_ensemble === null ? ("<span class='filesView-item-ensembleinfo'>"+$.E(m.o.ensemble[l.ensemble_id].name)+"</span>") : "";
            for (var cid in cs){
            c = cs[cid];
            if (!((q.comment_id === null && c.parent_id === null) || q.comment_id === c.id)){
                //only display real answers, not the original comment
                body = $.E(c.body).replace(/\n/g, " ");
                reply_link = "/r/"+c.id;
                when = "<span class='filesView-when'>"+$.concierge.get_component("pretty_print_timedelta")({t: c.ctime})+"</span>";
                rating = m.get("replyrating", {comment_id: c.id});
                buttons =  rating.length() ? "<span class='reply-rated-as'>Reply rated as <button disabled='disabled'>"+self._RATING_LABELS[rating.first().status]+"</button></span>" : "<button onclick='NB$.concierge.trigger({type:\"rate_reply\", value:{status: 3, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'>"+self._RATING_LABELS[3]+"</button> <button onclick='NB$.concierge.trigger({type:\"rate_reply\", value:{status: 2, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'  >"+self._RATING_LABELS[2]+"</button> <button onclick='NB$.concierge.trigger({type:\"rate_reply\", value:{status: 1, comment_id:"+ c.id +", threadmark_id: " + q.id + "}})'  >"+self._RATING_LABELS[1]+"</button>";
                lens_comment = "<li comment_id='"+c.id+"'><div class='filesView-floatright'>"+buttons+"<a style='margin-left: 20px' href='"+reply_link+"'><button>Reply</button></a> </div><span class='filesView-reply-body'>"+body+"</span>"+when+"</li>";
                comments+="<ul>"+lens_comment+"</ul>";
            }
            }
            var c_orig = m.get("basecomment", {location_id: q.location_id}).first();
            lens = self.img_snippet(i,l,c_orig);
            lens.prepend(comments);
            $list.append(lens);
        }
        return questions.length;
        },
        _draw_questions: function(){
        var self = this;
        var m = self._model;
        var $list = $("#filesView-question-list", self.element).empty();
        var f_location_sort = function(o1,o2){
            return m.get("question",{location_id: o2.id}).length() - m.get("question",{location_id: o1.id}).length();
        };
        var id_ensemble = self._id_ensemble;
        var  query_params = {};
        var viewall_url = "/collage?q=questions";
        if (id_ensemble !== null){
            query_params["ensemble_id"] = id_ensemble;
            viewall_url+="&amp;id_ensemble="+id_ensemble;
        }
        $("#filesView-allquestions-link").attr("href", viewall_url);
        var locs = m.get("location", query_params).intersect(m.get("question").exclude({user_id: self._me.id}).values("location_id")).sort(f_location_sort);
        if (!locs.length){
            $("#filesView-panel-question").hide();
            $("#filesView-question-header-help").hide();

        }
        else{
            $("#filesView-question-header-help").show();
        }
        $("#filesView-question-header-total").text(locs.length ? locs.length : " no "  );
        $("#filesView-question-header-plural").text($.pluralize(locs.length));


        var i,l,c,q, snippet;
        for (i in locs){
            l = locs[i];
            c = m.get("comment", {location_id: l.id, parent_id: null}).first();
            q = m.get("question", {location_id: l.id});
            snippet = self.img_snippet(i,l,c,q);
            if (snippet){
                $list.append(snippet);
            }
        }
        return locs.length;
        },
        img_snippet: function(i, l, c, q){
        var self = this;
        var id_ensemble = self._id_ensemble;
        var m = self._model;
        if (!(l.source_id in m.o.file)){
            return null;
        }
        var s =  m.o.file[l.source_id];
        var scalefactor, doc, inner,  inner_top, sel, link, numvotes;
        var body, comment_link, reply_link, ensemble_info, lens;
        body = $.E(c.body).replace(/\n/g, " ");
        comment_link = "/c/"+c.id;
        reply_link = q === undefined ? "" : "<a target='_blank' href='/r/"+c.id+"'><button>Reply</button></a>";
        ensemble_info = id_ensemble === null ? ("<span class='filesView-item-ensembleinfo'>"+$.E(m.o.ensemble[l.ensemble_id].name)+"</span>") : "";

        scalefactor = 0.6334;
        //scalefactor = 0.4798
        inner_top = Math.min(0, 50-l.y*scalefactor);
        sel = "<div class='snippet-selection' id_item='"+l.id+"' style='top: "+l.y*scalefactor+"px; left: "+l.x*scalefactor+"px; width: "+l.w*scalefactor+"px; height: "+l.h*scalefactor+"px'/>";

        inner = "<div class='snippet-innermaterial' style='top: "+inner_top+"px'><div class='snippet-selections'>"+sel+"</div><img class='snippet-material' page='"+(Number(i)+1)+"' src2='"+self.options.img_server+"/pdf/cache2/288/33/"+l.source_id+"?ckey="+self._me.ckey+"&amp;page="+l.page+"'/></div>";
        link =" <a target='_blank' href='"+comment_link+"'>"+ $.E(m.o.ensemble[l.ensemble_id].name+" - "+s.title +" (p.  "+l.page+")") +"</a>";
        numvotes = q === undefined ? "": "<div class='nbicon questionicon-hicontrast'/><span class='filesView-question-numvotes'>"+q.length()+"</span>";
        doc = "<div class='snippet-material' page='"+(i+1)+"'><div class='snippet-pagenumber pagenumbertop'>"+link+numvotes+reply_link+"  </div>"+inner+"</div>";
        lens = $("<div class='filesView-item'>"+doc+"<div class='filesView-question-body'><ul><li>"+body+"</li></ul></div> </div>");
        $("div.snippet-innermaterial", lens).draggable();
        return lens;
        },
        _draw_frame: function(){
        var self = this;
        console.log("bleh",self._model.o.ensemble,self._id_ensemble);
        self._admin = self._id_ensemble === null ? false : self._model.o.ensemble[self._id_ensemble].admin;
        var header    = self._admin ? "<div class='filesView-header'><span class='title'>Admin Controls</span><button action='add_file'>Add file</button> <button action='add_folder'>New folder</button> <button action='invite_users'>Invite Users</button> <a id='see_users' target='_blank'>Users</a> <a id='group_sections' target='_blank'>Sections</a> <a id='group_props' target='_blank'>Properties</a>  <a id='spreadsheet' target='_blank'>Spreadsheet</a> <a id='spreadsheet_download' target='_blank'>Download as .xls</a></div>" : "";
        var opts    = self._admin ? "<th>Actions</th>" : "";

        var filesView_pending =  "<h3  id='filesView-pending-header'><a href='#'>You have <span id='filesView-pending-header-total'>0</span> feedback request<span id='filesView-pending-header-plural'/>.</a></h3><div id='filesView-panel-pending' class='filesView-panel'><div id='filesView-pending-list'/></div>";
        var filesView_question = "<h3 id='filesView-question-header'><a href='#'>Your classmates have <span id='filesView-question-header-total'>0</span> pending question<span id='filesView-question-header-plural'/>. <span id='filesView-question-header-help'>Can you help them ?</span> <!--<a id='filesView-allquestions-link'>View all</a>--></a></h3><div id='filesView-panel-question'  class='filesView-panel'><div id='filesView-question-list'/></div>";

        // UNCOMMENT THIS LINE AND DELETE THE ONE BELOW IT TO INCLUDE SORTING BY LAST SEEN (of all users)
       // var filesView_files = (self._id_ensemble === null) ?  "<!--<div  id='filesView-panel-recentfiles' class='filesView-panel'>Recent Files...</div>-->" : "<h3 id='filesView-files-header'><a href='#'>Contents of <span id='filesView-files-header-name'/></a></h3><div id='filesView-panel-files' class='filesView-panel'> Sort by <a href='#' data-id='1' class='sort-option asc active'><span class='arrow'></span>last seen</a> <a href='#' data-id='0' class='sort-option asc'><span class='arrow'></span>date added</a> <a href='#' data-id='2' class='sort-option asc'><span class='arrow'></span>name</a> <table id='contents-table' class='tablesorter'><thead><tr><th class='hidden'>Date Added</th><th class='hidden'>Last Seen</th><th>Name</th><th>Assignment</th><th id='th_download'>Download PDF</th><th>Stats</th>"+opts+"</tr></thead><tbody id='filesView-file-list'/></table></div>";
        var filesView_files = (self._id_ensemble === null) ?  "<!--<div  id='filesView-panel-recentfiles' class='filesView-panel'>Recent Files...</div>-->" : "<h3 id='filesView-files-header'><a href='#'>Contents of <span id='filesView-files-header-name'/></a></h3><div id='filesView-panel-files' class='filesView-panel'> Sort by <a href='#' data-id='0' class='sort-option asc'><span class='arrow'></span>date added</a> <a href='#' data-id='1' class='sort-option desc active'><span class='arrow'></span>name</a> <table id='contents-table' class='tablesorter'><thead><tr><th class='hidden'>Date Added</th><th>Name</th><th>Assignment</th><th id='th_download'>Download PDF</th><th>Stats</th>"+opts+"</tr></thead><tbody id='filesView-file-list'/></table></div>";

        self.element.html(header+ "<div id='filesView-accordion'>"+  filesView_files + filesView_pending + filesView_question +"</div>");
        if (self._menu_items){
            self._menu_items.remove();
        }
        self._menu_items = self._admin ? self._menu_items_admin : self._menu_items_reg;
        self.set_tablesort();
        $("body").append(self._menu_items);
        },
        _draw_files : function(){
        var self=this;
        var id_ensemble = self._id_ensemble;
        var id_folder = self._id_folder;
        var model = self._model;
        if (id_ensemble === null){
            // TODO: put drawing code here.
        }
        else{
            var $tbody = $("#filesView-file-list", self.element);
            //remove download header for users is not in admin mode and download isn't allowed.
            if (self._admin === false && model.o.ensemble[id_ensemble].allow_download === false){
            $("#th_download").remove();
            }
            //first files:
            var elts = model.get("file", {id_ensemble: id_ensemble, id_folder: id_folder});
            var name = (id_folder==null) ?  model.o.ensemble[id_ensemble].name : model.o.folder[id_folder].name;
            $("#filesView-files-header-name").text($.E(name));
            var items = elts.items;
            var i;
            for (i in items){
            $tbody.append(self._filelens(items[i]));
            }
            //now folders:
            elts =  model.get("folder", {id_ensemble: id_ensemble, id_parent: id_folder});
            items = elts.items;
            for (i in items){
            $tbody.append(self._folderlens(items[i]));
            }
            if ($tbody.children().length === 0){
            $tbody.append("<tr><td><div class='nofiles'>No files or folders</div></td></tr>");
            }
            $("table.tablesorter", self.element).trigger("update");

            $("a.optionmenu", self.element).click(function (e) {
                e.preventDefault();
                $(this).parents("tr.filesview_row").contextMenu();
            });
            /*
              $e_info = $("div.filesView-ensemble").empty();
              if (id_folder==null && self._admin){
              var e = model.o.ensemble[id_ensemble];
              $e_info.append("Allow staffonly ? ") //SACHA CONTINUE HERE
              }
            */

            $("#group_props").attr("href", "/properties/ensemble/"+self._id_ensemble);
            $("#group_sections").attr("href", "/properties/ensemble_sections/" + self._id_ensemble);
            $("#see_users").attr("href", "/properties/ensemble_users/"+self._id_ensemble);
            $("#spreadsheet").attr("href", "/spreadsheet?id_ensemble="+self._id_ensemble);
            $("#spreadsheet_download").attr("href", "/spreadsheet/download/"+self._id_ensemble);

        }
        },
        _render: function(){
        var self=this;
        self._draw_frame();
        var open_candidate =  "#filesView-files-header";
        open_candidate = "#filesView-files-header";
        if (self._draw_questions()){
            open_candidate = "#filesView-question-header";
        }
        if (self._draw_pending()){
            open_candidate = "#filesView-pending-header";
        }
        if (self._defaultopen === null){
            self._defaultopen = open_candidate;
        }
        self._draw_files();
        $("#filesView-accordion").accordion({
            autoHeight: false,
                collapsible: true,
                change: function(event, ui){
                //simulate scroll event to display img if not there already.
                self.element.scroll();
                self._defaultopen = "#" + ui.newHeader.attr("id");
            },
                active: self._defaultopen
                });

        // there might be quite a few questions: don't get all images at once
        var scroll_timeout = 300;
        var scroll_handler = function(evt){
            var $this = $(this);
            var timerID = self._scrollTimerID;
            if (timerID !== null){
            window.clearTimeout(timerID);
            self._scrollTimerID =  null;
            }
            timerID = window.setTimeout(function(){
                var panel_top = $this.offset().top;
                var H = $this.height();
                $("img[src2]:visible", $this).each(function(i){
                    var $elt = $(this);
                    var $div = $elt.closest("div.snippet-material");
                    var delta_top = $div.offset().top - panel_top;
                    if ((delta_top+$div.height() > 0) && (delta_top < H)){
                    $elt.attr("src", $elt.attr("src2"));
                    this.removeAttribute("src2");
                    }
                });
            }, scroll_timeout);
            self._scrollTimerID =  timerID;
        };
        self.element.scroll(scroll_handler).scroll();
        /*
        $("#filesView-panel-question").scroll(scroll_handler).scroll();

        window.setTimeout(function(){ //so that both can be initialized.
            $("#filesView-panel-pending").scroll(scroll_handler).scroll();
            }, scroll_timeout+200);
        */

        },
        set_model: function(model){
        var self=this;
        self._model = model;
        model.register($.ui.view.prototype.get_adapter.call(this),  {file: null, folder: null, file_stats: null, replyrating: null, question: null}); //TODO: put stg here so that we update
        },
        set_tablesort: function(){
            $("table.tablesorter").tablesorter({
                headers: {4:{sorter: false}, 5:{sorter:false}, 6:{sorter:false}},
                sortList: [[1,0]], // default sorting by [col index, asc/desc] where the cols are [date added, name]. use 0 for asc, 1 for desc
                textExtraction: function(node) {
                var $n = $(node);
                if ($n.hasClass("filesview_ftitle")){
                return node.childNodes[1].innerHTML;
                }
                else{
                return node.innerHTML;
                }
            }});

            $(document).on("click", ".sort-option", function(evt) {
                evt.preventDefault();
                var _this = evt.currentTarget;
                var col = $(_this).data('id');
                var dir;
                if ($(_this).hasClass("active")) {
                    dir = $(_this).hasClass("asc") ? 0 : 1;
                } else {
                    dir = $(_this).hasClass("asc") ? 1 : 0;
                }
                var sorting = [[col,dir]];
                $("table").trigger("sorton", [sorting]);
                var new_dir = dir === 0 ? "desc" : "asc";
                $(".sort-option").removeClass("active");
                $(_this).removeClass("asc").removeClass("desc").addClass(new_dir).addClass("active");
            }.bind(this));
        },
        update: function(action, payload, items_fieldname){
        if (action === "add" || action === "remove"){
            this._render();
            /*
            if ("replyrating" in payload){
            this._draw_pending();
            }
            else{
            this._render();
            }
            */
        }
        //        console.log("model update !", action, payload, items_fieldname);
        },
        _RATING_LABELS: {1: "<div class='nbicon refuseicon'/>Dismiss",
                 2: "<div class='nbicon checkicon'/>Accept",
                 3: "<div style='display: none' class='nbicon thankscheckicon'/> Thanks, this <i>really</i> helped !"
        }
    });

    $.widget("ui.filesView",V_OBJ );
    $.ui.filesView.prototype.options = {
    img_server: "http://localhost",
    sort_list: [[0,0]],
    listens: {
        folder:null,
        ensemble: null,
        home: null
    },
    admin: false
    };
})(jQuery);
