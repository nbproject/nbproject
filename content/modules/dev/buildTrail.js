/*
 * buildTrail.js: build Trails from NB links
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true $:true NB$:true  __nb_userinfo:true NB:true*/
(function(GLOB){
    if (NB$){
    var $ = NB$;
    }
    GLOB.build = {};
    var _comment_sort_fct =  function(o1, o2){return o1.ID-o2.ID;};
    var _commentlens = function(o){
    var m = GLOB.pers.store;
    var replymenu, body;
    var bold_cl = m.get("seen", {id: o.ID}).is_empty() ? "" : "note-bold";
    var admin_info = o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class' /> ": " ";
    //    var me_info = (o.id_author === this._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> ":" ";
    var me_info = "";
    var type_info = "";
    if (o.type === 1) {
        type_info =  " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
    }
    else if (o.type === 2){
        type_info = " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
    }            
    var author_info =  " <span class='author'>"+o.fullname+"</span> ";
    var creation_info = " <span class='created'> - "+o.created+"</span> ";
    //replymenu = " <a class = 'replymenu' href='javascript:void(0)'>Reply</a> ";
    //            var optionmenu = " <a class='optionmenu' href='javascript:void(0)'>Actions</a> ";
    var optionmenu ="";
    replymenu = "";

    body = o.body.replace(/\s/g, "") === "" ? "<span class='empty_comment'>Empty Comment</span>" : $.E(o.body).replace(/\n/g, "<br/>");
    return ["<div class='note-lens' id_item='",o.ID,"'><div class='lensmenu'>", replymenu, optionmenu,"</div><span class='note-body ",bold_cl,"'>",body,"</span>", author_info,admin_info,me_info, type_info, creation_info,"</div>"].join("");
    };

    
    var _fill_tree = function(c){
    var m = GLOB.pers.store;
    var $div = $("<div class='threadview-branch'>"+_commentlens(c)+"</div>");
    var children = m.get("comment", {ID_location: c.ID_location, id_parent: c.ID}).sort(_comment_sort_fct);        
    for (var i = 0; i<children.length;i++){
        $div.append(_fill_tree(children[i]));
    }
    return $div;
    };
    
    var loc_lens = function(l){
    var m = GLOB.pers.store;
    var root = m.get("comment", {ID_location: l.ID, id_parent: null}).first();
    var loc_lens = $("<div class='location-lens' id_item='"+l.ID+"'/>");
    loc_lens.append(_fill_tree(root));
    //    $("a.replymenu, a.replymenu-mini", loc_lens).click(f_reply);
    return loc_lens;
    };

    var render = function(){
    var m = GLOB.pers.store;
    var  c, l, $div, link, inner, style, inner_top, sel, $doc;
    var s = 0.6334;
    for (var i in GLOB.pers._comments){
        c = m.o.comment[GLOB.pers._comments[i]];        
        l = m.o.location[c.ID_location];        
        $div = $("<div class='nb-view'/>");
        link="";        
        inner_top = Math.min(0, 50-l.top*s);        
        style =  "height: 200px;";
        sel = "<div class='selection' id_item='"+l.ID+"' style='top: "+l.top*s+"px; left: "+l.left*s+"px; width: "+l.w*s+"px; height: "+l.h*s+"px'/>";

        inner = "<div class='innermaterial' style='top: "+inner_top+"px'><div class='selections'>"+sel+"</div><img class='material' page='"+(i+1)+"' src='http://nb.mit.edu/pdf/cache2/288/33/"+l.id_source+"?ckey="+GLOB.conf.userinfo.ckey+"&amp;page="+l.page+"'/></div>";
        $doc = $("<div class='material' page='"+(i+1)+"' style='"+style+"'><div class='pagenumber pagenumbertop'>"+link+"</div>"+inner+"</div>");
        $div.append($doc);
        $div.append(loc_lens(l));
        $("a[href=nb"+c.ID+"]").hide().after($div);
    }
    };


    GLOB.pers.init = function(){
    if (__nb_userinfo){
        GLOB.conf.userinfo=__nb_userinfo;
    }
    GLOB.pers.connection_id = 1;
    GLOB.conf.servers.rpc=GLOB.pers.server_url;
    GLOB.pers._comments = [];
    $("a").each(function(i, elt){
        var href = elt.getAttribute("href") || "";
        var matches = href.match(/^nb(\d+)$/);
        if (matches !== null){
            GLOB.pers._comments.push(Number(matches[1]));
        }
        });
    GLOB.pers.call("getMyNotes", {query: "collection", comments: GLOB.pers._comments}, function(P){
        GLOB.pers.store = new GLOB.models.Store();
        GLOB.pers.store.create(P, {
            ensemble:    {pFieldName: "ensembles"}, 
                file:    {pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}}, 
                folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}, 
                comment:{references: {id_location: "location"}},
                location:{references: {id_ensemble: "ensemble", id_source: "file"}}, 
                link: {pFieldName: "links"}, 
                mark: {}, 
                draft: {},
                seen:{references: {id_location: "location"}}
            });

        var m = GLOB.pers.store;
        m.add("comment", P["comments"]);
        m.add("location", P["locations"]);
        render();
        $.L("notes loaded");});
    }; 
    
    jQuery(function(){
        GLOB.pers.params = GLOB.dom.getParams(); 
        GLOB.pers.preinit();
    });

})(NB);