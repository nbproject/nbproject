/*
 * statsviewer.js: stats data
 *
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true console:false*/

(function(GLOB){
    GLOB.report.conf.autobuild = false;
    GLOB.report.mappings.fct["id_ensemble"] = {__fct: "get_label", args: {type: "ensemble"}};
    GLOB.report.data = {};
	GLOB.report.media.plots = {};
    GLOB.report.visuals = [];
    
//FIXME:  if we just use identfier as "a2", we can't plot two similar visual with differents params on the same report. 
    GLOB.report.buildVisual = function(i){
        var o = GLOB.report.visuals[i];

        //generate markup
        var $root = NB$("#statscontent"), 
        lib = GLOB.report.library, 
        fragments = ['<div class="graphitem">'];
        fragments.push("<div class='plot' id='"+o.id+"'></div>");
        fragments.push("<div align='center' class='plot_title'>"+NB$.E(lib.plots[o.id].caption)+"</div>");        
        fragments.push("</div>");
        $root.append(fragments.join(""));

        //generate data structures: 
        GLOB.report.media.plots[o.id] = lib.plots[o.id];
    };
    window.setTimeout(function(){
            var auth_str = GLOB.conf.userinfo.guest ? "guest=1" : "ckey="+GLOB.conf.userinfo.ckey;                    
            NB$.post(GLOB.conf.servers.rpc+"/stats/api?" + auth_str, {"f":  "report", "a": JSON.stringify({id: GLOB.pers.params["report"]})},function(payload){
                    var sections = payload.payload.sections; 
                    var visuals = [];
                    for (var i=0;i<sections.length;i++){
                        GLOB.report.visuals.push({id: sections[i].name});
                        GLOB.report.buildVisual(i);
                    }
                    GLOB.stats.run();
                }, "json");
        }, 2000);
})(NB);
