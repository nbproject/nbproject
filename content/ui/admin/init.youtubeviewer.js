/*
 * step22.js: YouTube player
 * Requires the following modules:
 *        Module
 *        NB
 *        NB.auth
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true  alert:true NB:true*/

(function(GLOB){
    if ("NB$" in window){
    var $ = NB$;
    }

    var $str        = "NB$" in window ? "NB$" : "jQuery";

GLOB.pers.init = function(){
    var matches = document.location.pathname.match(/\/(\d*)$/);
    if (matches==null || matches.length !== 2){
    alert("Can't open file b/c URL pathname doesn't have an integer: "+document.location.pathname);
    }
    GLOB.pers.id_source =  matches[1];
    GLOB.pers.call("getParams",{name: ["RESOLUTIONS", "RESOLUTION_COORDINATES"], clienttime: (new Date()).getTime()},function(p){
        $.concierge.addConstants(p.value);
    });
    //Factories: methods called if an event calls for a function that's not yet present
    $.concierge.addFactory("file", "doc_viewer", function(id){
            var pers_id        = "pers_"+id;
            var $vp        = $("<div class='nb-viewport'><div class='nb-widget-header' style='height:24px;' /></div>").prependTo("body");
            var $pers        = $("<div id='"+pers_id+"'/>").appendTo($vp);
            var docview        =  {priority: 1, min_width: 970, desired_width: 50,
                                   content: function($div){
                    $div.docView({img_server: GLOB.conf.servers.img});
                    $div.docView("set_model",GLOB.pers.store );
                }
            };
            var notesview    =  {priority: 1, min_width: 630, desired_width: 35, min_height: 1000, desired_height: 50,
                        content: function($div){
                    $div.notepaneView();
                    $div.notepaneView("set_model",GLOB.pers.store );
                }
            };
            var threadview    = {priority: 1, min_width: 630, desired_width: 35,  min_height: 1000, desired_height: 50,
                       content: function($div){
                    $div.threadview();
                    $div.threadview("set_model",GLOB.pers.store );
                }
            };
            var editorview    =  {priority: 1, min_width: 630, desired_width: 35,  min_height: 1000, desired_height: 50, transcient: true,
                                  content: function($div){
                    var m = GLOB.pers.store;
                    var ensemble = m.o.ensemble[m.o.file[id].id_ensemble];
                    $div.editorview({allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous, allowTagPrivate: ensemble.allow_tag_private, defaultPause: ensemble.default_pause, admin: ensemble.admin});
                    $div.editorview("set_model",GLOB.pers.store );
                }
            };
            $pers.perspective({
                    height: function(){return $vp.height() - $pers.offset().top;},
                        listens: {
                        page_peek: function(evt){
                            //need to add 1 value for uniqueness
                            //do not keep history of page seen for now since evt.value is null
                            //$.concierge.logHistory("page", evt.value+"|"+id+"|"+(new Date()).getTime());
                        },
                    successful_login: function(evt){
                    GLOB.auth.set_cookie("ckey", evt.value.ckey);
                    document.location ="http://"+document.location.host+document.location.pathname;
                    $.I("Welcome !");
                },
                close_view: function(evt){
                    if (evt.value === this.l.element[0].id){
                    delete($.concierge.features.doc_viewer[id]);
                    }
                    $.L("closeview: ", evt, this.l.element[0].id);
                }
                },
                views: {
                    v1:{ data: docview },
                    v2:{children: {
                        v1:{ data: notesview},
                            v2:{children: {v1: { data: threadview}, v2: {data: editorview}, orientation: "horizontal"}},  orientation: "horizontal"
                        }
                }, orientation: "vertical"}
            });
    });

    //get data:
    var payload_objects = {types: ["ensembles", "folders", "files"]};
    if ("id_ensemble" in GLOB.pers.params){
    payload_objects["payload"]= {id_ensemble: GLOB.pers.params.id_ensemble};
    }
    GLOB.pers.call("getGuestFileInfo", {id_source: GLOB.pers.id_source}, GLOB.pers.createStore, GLOB.pers.on_fileinfo_error );
    $.concierge.addConstants({res: 288, scale: 25, QUESTION: 1, STAR: 2 });
    $.concierge.addComponents({
        notes_loader:    function(P, cb){GLOB.pers.call("getNotes", P, cb);},
        note_creator:    function(P, cb){GLOB.pers.call("saveNote", P, cb);},
        note_editor:    function(P, cb){GLOB.pers.call("editNote", P, cb);}
        });
    //start a metronome every second:
    var metronome = function(){
	$.concierge.trigger({type: "player_at", value:0});
    };
};

GLOB.pers.createStore = function(payload){
    GLOB.pers.store = new GLOB.models.Store();
    GLOB.pers.store.create(payload, {
        ensemble:    {pFieldName: "ensembles"},
        section:    {pFieldName: "sections", references: {id_ensemble: "ensemble"}},
        file:    {pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}},
        folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}},
        youtubeinfo: {pFieldName: "youtubeinfos", references: {source_id: "file"}},
        comment:{references: {id_location: "location"}},
        location:{references: {id_ensemble: "ensemble", id_source: "file"}},
        link: {pFieldName: "links"},
        mark: {},
        threadmark: {pFieldName: "threadmarks", references: {location_id: "location"}},
        draft: {},
        seen:{references: {id_location: "location"}},
        labelcategory:{references: {ensemble_id: "ensemble"}},
        commentlabel: {references: {category_id: "labelcategory"}},
        labelcategorycaption: {references: {category_id: "labelcategory"}},
        members: {},
        tags: {references: {user_id: "members", comment_id: "comment"}}
    });

    var ensembleID = NB.pers.store.get("ensemble", {}).first().ID;

    GLOB.pers.call("getMembers", {id_ensemble: ensembleID}, function(P5){
        console.log("getMembers callback");

        GLOB.pers.store.add("members", P5);
    });

    //get the section info as well as info whether user is admin:
    GLOB.pers.call("getSectionsInfo", {id_ensemble: ensembleID}, function(P3){
        var m = GLOB.pers.store;
        m.add("section", P3["sections"]);
        NB.pers.store.get("ensemble", {}).first().admin=true; //we only get a callback if we're an admin for this ensemble
    });


    //here we override the callback so that we can get new notes.
    var cb2 = function(P2){
    var m = GLOB.pers.store;
    m.add("comment", P2["comments"]);
    m.add("location", P2["locations"]);
    var msg="";
    var l,c;
    for (var i in P2["comments"]){
        c = m.o.comment[i];
        l = m.o.location[c.ID_location];
        if (c.id_author !==  $.concierge.get_component("get_userinfo")().id){    //do nothing if I'm the author:
        msg+="<a href='javascript:$.concierge.trigger({type: \"select_thread\", value:\""+l.ID+"\"})'>New comment on page "+l.page+"</a><br/>";
        }
    }
    if (msg !== ""){
        $.I(msg, true);
    }
    };
    $.concierge.setHistoryHelper(function(_payload, cb){
        _payload["__return"] = {type:"newNotesOnFile", a:{id_source: GLOB.pers.id_source}};
        GLOB.pers.call("log_history", _payload, cb);
    }, 120000, cb2);
    var matches = document.location.pathname.match(/\/(\d*)$/);
    if (matches==null || matches.length !== 2){
    alert("Can't open file b/c URL pathname doesn't with an integer: "+document.location.pathname);
    }
    var id_source =  GLOB.pers.id_source;
    $.concierge.trigger({type:"file", value: id_source});
    var f = GLOB.pers.store.o.file[id_source];
    document.title = $.E(f.title);
    var noteLoaderCallback = function(P) {
        console.log("noteLoaderCallback:");
        console.log(P["tags"]);
        var m = GLOB.pers.store;
        m.add("seen", P["seen"]);
        m.add("comment", P["comments"]);
        m.add("location", P["locations"]);
        m.add("link", P["links"]);
        m.add("threadmark", P["threadmarks"]);
        m.add("tags", P["tags"]);
        //now check if need to move to a given annotation:
        if ("c" in GLOB.pers.params){
        window.setTimeout(function(){
            var id =  GLOB.pers.params.c;
            var c = m.get("comment", {ID: id}).items[id];
            if ("reply" in GLOB.pers.params){
                $.concierge.trigger({type: "reply_thread", value: c.ID});
            }
            $.concierge.trigger({type: "select_thread", value: c.ID_location});


            }, 300);
        }
        else if ("p" in GLOB.pers.params){
        window.setTimeout(function(){
            var page = GLOB.pers.params.p;
            $.concierge.trigger({type: "page", value: page});
            }, 300);
        }
        else{
        window.setTimeout(function(){
            $.concierge.trigger({type: "page", value: 1});
            }, 300);
        }
    };
    $.concierge.get_component("notes_loader")( {file:id_source }, function(P) {
        window.setTimeout(function() {noteLoaderCallback(P);}, 1000);
    });
};

GLOB.pers.on_fileinfo_error = function(P){
    //    console.log("fileinfo error", P);
    $("#login-window").hide();
    var me = $.concierge.get_component("get_userinfo")();
    var name = "a guest";
    var loginmenu = "";
    if (!(me.guest)){
    name = (me.firstname !== null && me.lastname !== null) ?  me.firstname + " " + me.lastname + " (" +me.email + ") ": me.email;
    }
    else{
            loginmenu = "Would you like to  <a href='javascript:"+$str+".concierge.get_component(\"login_user_menu\")()'>login as another NB User</a>, maybe ?";
    }
    $("<div><div id=\"splash-welcome\">Welcome to NB !</div> <br/>You're currently logged in as <b>"+$.E(name)+"</b>, which doesn't grant you sufficient privileges to see this page. <br/><br/>"+loginmenu+"</div>").dialog({title: "Access Restricted...", closeOnEscape: false,   open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }, width: 600, buttons: {"Take me back to NB's home page": function(){
            GLOB.auth.delete_cookie("userinfo");
            GLOB.auth.delete_cookie("ckey");
            document.location.pathname = "/logout?next=/";}
        }});
};

})(NB);
