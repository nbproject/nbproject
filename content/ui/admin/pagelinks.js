/**
 * pagelinks.js
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB:true */
(function(GLOB){
        GLOB.sections.page_links = [
                                                                {l: "Active groups", href: "report5.html"}, 
                                                                {l: "Online presence", href: "presence1.html"}, 
                                                                {l: "Feature usage", href: "features1.html"}, 
                                                                {l: "NB vs. webAnn", href: "compare_webann.html"}, 
                                                                {l: "Poll Fa09", href: "poll.html?ensembles=342&term=Fa09"}, 
                                                                {l: "Poll Sp10", href: "poll.html?ensembles=856,736,757,739,762&term=Sp10"}, 
                                                                {l: "Poll Fa10", href: "poll.html?ensembles=1548,2011,1382,1306,1386,1959,1552&term=Fa10"}, 
                                                                {l: "page changes", href: "page_changes.html?id_ensemble=856,736,757,739,762"}, 
                                                                {l: "Requirements", href: "requirement.html"}, 
                                                                {l: "Re-visits", href: "comeback1.html"}
                                                                ];

        GLOB.sections.links_autodata = [
                                                                        {l: "Time-based stats", href: "report6.html", loop: "id_ensemble"},
                                                                        {l: "Discussion-based stats", href: "report7.html", loop: "id_ensemble"},
                                                                        {l: "Deadline stats", href: "report8.html", loop: "id_ensemble"},
                                                                        {l: "Evolution stats", href: "report9.html", loop: "id_ensemble"}

                                                                        ];
})(NB);