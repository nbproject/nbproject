/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		jquery
 *
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */

try{    
    Module.require("NB", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

$(document).ready(function(){
	var tab_contents;
	var $vp_src, $vp_dest;
	var index_src, index_dest;
	var temp_tab = $("<div style='display:none'/>");
	$("body").append(temp_tab);
	$("#viewport1, #viewport2").tabs().find(".ui-tabs-nav").addClass('connectedSortable').sortable({
		connectWith: '.connectedSortable', 
		    remove: function(event, ui){
		}, 
		    receive: function(event, ui){
		    //		    console.log("received: evt:", event, "ui:", ui);

		    var $a = $(ui.item).children("a");
		    var label = $a.text();
		    var $sel  = $($a.attr("href"));
		    var id_tab = $sel.attr("id");
		    tab_contents= $sel.children();

		    //figure destination and position in destination: 
		    $vp_dest	= $(ui.item[0].parentNode.parentNode);
		    index_dest	= NB.dom.elementPosition(ui.item[0]);		    


		    //remove tab from src: 
		    $vp_src.tabs('remove', index_src);

		    //insert tab in dest:
		    var $div=$("<div id='"+id_tab+"'/>");
		    $div.append(tab_contents);		    
		    temp_tab.append($div);
		    $vp_dest.tabs('add', "#"+id_tab, label, index_dest);
	      
		}, 
		    stop: function(event, ui){
		    //console.log("[stop] evt=" ,event, ", ui=", ui );
		}, 
		    start: function(event, ui){
		    $vp_src	= $(ui.item[0].parentNode.parentNode);
		    index_src	= NB.dom.elementPosition(ui.item[0]);		    
		    //console.log("[start] src=", $vp_src[0], " at pos ", index_src );
		}
	    });


    });
