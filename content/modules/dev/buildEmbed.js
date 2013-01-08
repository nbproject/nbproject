/*
 * buildEmbed.js: build embedded NB 
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true $:true NB$:true NB:true alert:true*/

(function(GLOB){
    if (NB$){
    var $ = NB$;
    }
    GLOB.pers.init = function(){
    /*
    //userinfo will be determined later. 
    if (__nb_userinfo){
        GLOB.conf.userinfo=__nb_userinfo;
    }
    */
    GLOB.pers.connection_id = 1;
    
    var cur =  GLOB.pers.currentScript;
    var server_info =  cur.src.match(/([^:]*):\/\/([^\/]*)/);    
    var server_url = server_info[1]+"://"+server_info[2];
    GLOB.pers.add_css(server_url+"/content/compiled/buildEmbed.css");

    GLOB.conf.servers.rpc=GLOB.pers.server_url;
    $("body").append("<div id='nb_sidebar' class='nb_inactive'><div id='nb_controls' class='nb_inactive'><button id='nb_loginbutton'>Log in to NB</button></div></div>");
    $("#nb_loginbutton").click(function(){
            $.concierge.get_component("login_user_menu")();
        });
    }; 
    
    jQuery(function(){
        GLOB.pers.params = GLOB.dom.getParams(); 
        GLOB.pers.preinit();
    });

})(NB);