/*
Author 
    cf AUTHORS.txt 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/

$(document).ready(function(){
	var T = $("#example > ul");
	T.tabs({
		add: function(e, ui) {
		    T.tabs('select', '#' + ui.panel.id);
		}
	    })
	    });

function addSampleTab(){
    var id = (new Date()).getTime();
    //      $("#example > ul").append("<li><a href=\"#fragment-"+id+"\"><span>"+id+"</span></a></li>");
    $("#vp1").append("<div id=\"fragment-"+id+"\">New div ("+id+")</div>");
    $("#example > ul").tabs("add","#fragment-"+id, id);	
    
}