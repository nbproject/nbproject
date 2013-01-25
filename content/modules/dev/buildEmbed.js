/*
 * buildEmbed.js: build embedded NB 
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true $:true NB$:true NB:true alert:true escape:false*/

(function(GLOB){
    
    if ("NB$" in window){
        var $ = NB$;
    }
    var $str        = "NB$" in window ? "NB$" : "jQuery";


    var $vp;
    var id_ensemble = null;  //SACHA TODO: replace this by user's real id_ensemble

    var f_after_successful_login = function(){    
        $vp = $("<div class='nb-viewport'><div class='ui-widget-header' style='height:24px;' /></div>").prependTo(".nb_sidebar");
        $("#login-window").appendTo(".ui-widget-header"); // add this here so it's fixed as well
        //TODO: get id_ensemble from cookie or localStorage if available. 
        $.concierge.addConstants({res: 288, scale: 25, QUESTION: 1, STAR: 2 });
        $.concierge.addComponents({
                notes_loader:    function(P, cb){GLOB.pers.call("getNotes", P, cb);}, 
                    note_creator:    function(P, cb){GLOB.pers.call("saveNote", P, cb);},
                    note_editor:    function(P, cb){GLOB.pers.call("editNote", P, cb);}
            });   
    GLOB.pers.store = new GLOB.models.Store();
    GLOB.pers.call(
                   "getHTML5Info", {id_ensemble: id_ensemble, url: document.location.href}, 
                   function(payload){
                       //TODO: refactor (same as in step16.js:createStore)
                       GLOB.pers.store.create(payload, {
                               ensemble:    {pFieldName: "ensembles"}, 
                                   file:    {pFieldName: "files", references: {id_ensemble: "ensemble", id_folder: "folder"}}, 
                                   folder: {pFieldName: "folders", references: {id_ensemble: "ensemble", id_parent: "folder"}}, 
                                   comment:{references: {id_location: "location"}},
                                   location:{references: {id_ensemble: "ensemble", id_source: "file"}}, 
                                   html5location:{references: {id_location: "location"}}, 
                                   link: {pFieldName: "links"}, 
                                   mark: {}, 
                                   threadmark: {pFieldName: "threadmarks", references: {location_id: "location"}},
                                   draft: {},
                                   seen:{references: {id_location: "location"}}
                           });
                           
                       //TODO: Take something else than first id_source
                       var source = GLOB.pers.id_source = NB.pers.store.get("file").first();
                       if (source === null){
                           alert("The URL for this page ("+document.location.href+") isn't registered on NB.");
                           return;
                       }
                       var id_source = GLOB.pers.id_source = NB.pers.store.get("file").first().ID;
                       $.concierge.setHistoryHelper(function(_payload, cb){
                               _payload["__return"] = {type:"newNotesOnFile", a:{id_source: GLOB.pers.id_source}};
                               GLOB.pers.call("log_history", _payload, cb);
                           }, 120000,  function(P2){    
                               //here we override the callback so that we can get new notes.
                                   
                               var m = GLOB.pers.store;
                               m.add("comment", P2["comments"]);
                               m.add("location", P2["locations"]);
                               m.add("html5location", P2["html5locations"]);
                               var msg="";
                               var l,c;
                               for (var i in P2["comments"]){
                                   c = m.o.comment[i];
                                   l = m.o.location[c.ID_location];
                                   if (c.id_author !==  $.concierge.get_component("get_userinfo")().id){    //do nothing if I'm the author:         
                                       msg+="<a href='javascript:"+$str+".concierge.trigger({type: \"select_thread\", value:\""+l.ID+"\"})'>New comment on page "+l.page+"</a><br/>";
                                   }
                               }
                               if (msg !== ""){
                                   $.I(msg, true);
                               }
                           });    
                       $.concierge.trigger({type:"file", value: id_source});

                       //let's create perspective here: 
                       var $pers        = $("<div id='pers_"+id_source+"'/>").appendTo($vp);
                       var notesview    =  {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35, 
                           min_height: 1000, 
                           desired_height: 50, 
                           content: function($div){
                               $div.notepaneView();
                               $div.notepaneView("set_model",GLOB.pers.store );
                           }
                       }; 
                       var threadview    = {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35,  
                           min_height: 1000, 
                           desired_height: 50, 
                           content: function($div){
                               $div.threadview();
                               $div.threadview("set_model",GLOB.pers.store );                
                           }
                       };
                       var editorview    =  {
                           priority: 1, 
                           min_width: 650, 
                           desired_width: 35,  
                           min_height: 1000, 
                           desired_height: 50, 
                           transcient: true,  
                           content: function($div){
                               var m = GLOB.pers.store;
                               var ensemble = m.o.ensemble[m.o.file[id_source].id_ensemble];                    
                               $div.editorview({allowStaffOnly: ensemble.allow_staffonly, allowAnonymous: ensemble.allow_anonymous});
                               $div.editorview("set_model",GLOB.pers.store );                
                           }
                       };
                       
                       $pers.perspective({
                               height: function(){
                                   return $vp.height() - ($pers.offset().top - $vp.offset().top);
                               }, //3rd term is to account for the fact we have NB embedded as part of widget that has a 'fixed' position
                                   listens: {
                                   page_peek: function(evt){
                                       //need to add 1 value for uniqueness
                                       $.concierge.logHistory("page", evt.value+"|"+id_source+"|"+(new Date()).getTime());
                                   }, 
                                       close_view: function(evt){
                                       if (evt.value === this.l.element[0].id){
                                           delete($.concierge.features.doc_viewer[id_source]);
                                       }
                                       $.L("closeview: ", evt, this.l.element[0].id);
                                   }                    
                               }, 
                                   views: {
                                   v1:{data: notesview}, 
                                       v2:{children: 
                                       {v1: { data: threadview}, v2: {data: editorview}, orientation: "horizontal"}},  
                                       orientation: "horizontal"
                                       }
                           });
                       
                       //end of perspective creation code
                       
                       
                       var f = GLOB.pers.store.o.file[id_source];
                       $.concierge.get_component("notes_loader")( {file:id_source }, function(P){
                               var m = GLOB.pers.store;
                               m.add("seen", P["seen"]);
                               m.add("comment", P["comments"]);
                               m.add("location", P["locations"]);
                               m.add("html5location", P["html5locations"]);
                               m.add("link", P["links"]);
                               m.add("threadmark", P["threadmarks"]);
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
                           });
                       
                       
                       
                   },
                   function(P){
                       $(".ui-widget-header").append("<button onclick='"+$str+".concierge.get_component(\"login_user_menu\")()' id='#login_to_nb'>Login to NB</button>");
                       /*
                       //TODO: refactor (same as in step16.js:on_fileinfo_error)
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
                       */
                   });
    
        //    var id=4156;  //SACHA TODO: replace this by file's real id
        //        var pers_id        = "pers_embedded";//+id;
};
    GLOB.pers.init = function(){
        /*
        //userinfo will be determined later. 
        if (__nb_userinfo){
        GLOB.conf.userinfo=__nb_userinfo;
        }
        */
        GLOB.pers.connection_id = 1;
        GLOB.pers.embedded = true;
        //add our CSS
        var cur =  GLOB.pers.currentScript;
        var server_info =  cur.src.match(/([^:]*):\/\/([^\/]*)/);    
        var server_url = server_info[1]+"://"+server_info[2];
        GLOB.pers.add_css(server_url+"/content/compiled/embed_NB.css");

        //register for some events: 
        $.concierge.addListeners(GLOB.pers, {
                successful_login: function(evt){
                    GLOB.auth.set_cookie("ckey", evt.value.ckey);
                    GLOB.auth.set_cookie("userinfo", escape(JSON.stringify(evt.value)));
                    GLOB.conf.userinfo = evt.value;
                    $.L("Welcome TO NB !");
                    $("#splash-welcome").parent().dialog("destroy");
                    f_after_successful_login();
                    
                    
                }
            }, "globalPersObject");
        
        //tell who to make rpc requests to
        GLOB.conf.servers.rpc=GLOB.pers.server_url;

        $("body").append("<div class='nb_sidebar' class='nb_inactive'></div>");
        $("#nb_loginbutton").click(function(){
                $.concierge.get_component("login_user_menu")();
            });

        //if authenticated already, let's proceed: 
        if (GLOB.conf.userinfo){
            f_after_successful_login();
        }
    }; 
    
    jQuery(function(){
            GLOB.pers.params = GLOB.dom.getParams(); 
            GLOB.pers.preinit();
        });

    })(NB);
