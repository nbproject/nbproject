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
        fragments.push("<div class='caption'>+"+NB$.E(lib.plots[o.id].caption)+"</div>");        
        fragments.push("</div>");
        $root.append(fragments.join(""));

        //generate data structures: 
        GLOB.report.media.plots[o.id] = lib.plots[o.id];
    };
    window.setTimeout(function(){
            console.log("this fakes the callback being called from the server, telling us what to put into the report"); 
            var P = {
                visuals: [
            {id: "a2"}, 
            {id: "reply1"} 
                           ]
            };            
            (function(payload){
                for (var i=0;i<payload.visuals.length;i++){
                    GLOB.report.visuals.push(P.visuals[i]);
                    GLOB.report.buildVisual(i);
                }                
                GLOB.stats.run();
            })(P);
        }, 4000);
})(NB);
