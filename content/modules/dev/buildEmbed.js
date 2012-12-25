/*
 * buildEmbed.js: build embedded NB 
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

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
    GLOB.conf.servers.rpc=GLOB.pers.server_url;
    $("body").append("<div id='nb_sidebar' class='nb_inactive'><div id='nb_controls' class='nb_inactive'><button id='nb_loginbutton'>Log in to NB</button></div></div>");
    $("#nb_loginbutton").click(function(){
        alert("TODO: login");
        });
    }; 
    
    $(function(){
        GLOB.pers.params = GLOB.dom.getParams(); 
        GLOB.pers.preinit();
    });

})(NB);