/**
 * sections.js 

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true alert:false prompt:false console:false*/
(function(GLOB){
    GLOB.sections = {};
    GLOB.sections.__addSection = function(){
        var title = this.getAttribute("label");
        NB$("#toc").append("<a href='#"+this.id+"'>"+title+"</a>");
        NB$(this).children().wrapAll("<div class='section-body'></div>");
        NB$(this).prepend("<div class='section-header'><a class=\"navlink\"        href=\"#toc\">back to top </a>"+title+" </div>");
    };

    GLOB.sections.makeToc = function(){        
        var $toc = NB$("<div id='toc'/>");
        var $plinks = NB$("<div id='plinks'/>");
        if ("nav_links" in GLOB.sections){
            var nav_links = GLOB.sections.nav_links;
            for (var link in nav_links){
                $toc.append("<a href='"+nav_links[link].href+"'>"+nav_links[link].l+"</a> ");
            }
            $toc.append("<br/>");
        }
        if ("page_links" in GLOB.sections){
            var href, label;
            var page_links = GLOB.sections.page_links;
            var doLink;
            for (var i in page_links){
                doLink = true;
                href =        page_links[i].href;
                if (href.indexOf("://")===-1){
                    if (href[0]==="/" && href===document.location.pathname){
                        doLink = false;
                    }
                    else{
                        var path_tokens = document.location.pathname.split("/");
                        if (path_tokens[path_tokens.length-1]===href){
                            doLink = false;
                        }
                    }
                }
label = ("l" in page_links[i]) ? page_links[i].l : href;
                $plinks.append(doLink ? "<a href='"+href+"'>"+label+"</a> " : " <span class='currentpage'>"+label+"</span> " );
            }
        }
        NB$("body").prepend($toc).prepend("<h1>"+NB$("title").text()+"</h1>").prepend($plinks);
        NB$("div.section").each(GLOB.sections.__addSection);
    };
})(NB);