/*
 * stats1.js: stats data
 *
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true*/

(function(GLOB){
    GLOB.report.data = {
      popular_groups2: {after: "2008-02-01", min_total: 50}
    };
    GLOB.report.media.tables = {
      popular_groups2 :{
        labels: ["id", "Class", "Threads", "Notes", "Authors", "Select"],
        facets: [null, null, 10, 5, 10, null],
        lenses: [null, null, null, null, null, function(i,j,d){
              return "<input type='checkbox' class='check_category' value='"+d.data[i][0]+"'></input>";}]
      }
    };

    GLOB.report.renderDone["popular_groups2"] = function(id){
        var $div =  NB$("#"+id);
        $div.append("<div id='auto_details'/>");
        NB$("input", $div).click(function(){
            var $checked =  NB$("input:checked", $div);
            var c=[], i;
            for (i=0;i<$checked.length;i++){
              c.push($checked[i].value);
            }
            var $d = NB$("#auto_details").empty();
            var ids = c.join(",");
            var A = GLOB.sections.links_autodata;
            for (i=0;i<A.length;i++){
              $d.append("<a style='margin-left:15px' href='"+A[i].href+"?"+A[i].loop+"="+ids+"'>"+A[i].l+"</a>");
            }
        });

    };
})(NB);
