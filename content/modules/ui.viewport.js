/* Viewport Plugin: making webapps look like eclipse apps
 * inspired from: 
 *	- jquery UI (ui.tabs.js)
 *	- http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/
 * Depends:
 *	ui.core.js
 *	ui.tabs.js
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
(function($) {
    //cf bug 83 need mapping href -> tab index (tabs doesn't use the DOM order after tab dragged)
    $.extend($.ui.tabs.prototype, {
	    get_index: function(href){
		//snippet from ui.tabs.js:select
		return this.anchors.index(this.anchors.filter('[href$=' + href + ']'));
	    }
	});
    $.ui.tabs.getter+=" get_index";
    var __previousElement = function(node){
	var n = node.previousSibling;
	while(n){
	    if (n.nodeType == 1){
		return n;
	    }
	    else{
		n = n.previousSibling;
	    }
	}
	return null;
    };
    var __elt_pos = function(node){
	var i = 0;
	var n = __previousElement(node);
	while(n){
	    i++;
	    n= __previousElement(n);
	}
	return i;
    };
    var temp_tab = null;
    var $vp_src, $vp_dest;
    var isSameVP = true;
    var index_src, index_dest;
    var VP_OBJ = {
	temp_tab:  $("<div style='display:none'/>"),
	_init: function() {
	    this._viewportify(true);
	},
	_decorate: function(tab_elt){
	    var self = this;
	    var f_close = function(event){
		//		console.log('closing', self, this);
	    };
	    var f_togglemax = function(event){
		$(self.element[0]).toggleClass("ui-maximized");
	    };
	    var f_hover = function(event){
		$(this).addClass('ui-state-hover').removeClass('ui-view-semiopaque');
	    };
	    var f_out =  function(event){
		$(this).removeClass('ui-state-hover').addClass('ui-view-semiopaque');;
	    };
	    if(tab_elt===undefined){
		//uses same selectors as in ui.tabs.js:_tabify()
		this.list = this.element.children('ul:first');
		this.lis = $('li:has(a[href])', this.list);
		if (this.options.dock_visible){
		    $("<div class='ui-view-menu ui-view-semiopaque ui-corner-all '>+</div>").hover(f_hover, f_out).prependTo(self.element);
		}

	    }
	    else{ //adding a tab to an exisiting view
		this.lis = tab_elt;
	    }
	    this.lis.append("<a href='#' role='button' class='ui-view-tab-close ui-corner-all  ui-view-semiopaque'><span class='ui-icon ui-icon-close'/></a>").dblclick(f_togglemax);
	    this.lis.children("a[role='button']").click(f_close).hover(f_hover, f_out);
	},
	_viewportify: function(init) {
	    var self = this;
	    // initialization from scratch
	    if (init) {
		if (temp_tab == null){
		    temp_tab =  $("<div style='display:none'/>");
		    $("body").append(temp_tab);
		}
		this._decorate();
		self.element.tabs({
			"add": function(e, ui) {
			    //console.log("e: ", e, ", ui:", ui);
			    self._decorate($(ui.tab.parentNode));
			}			
		    }).find(".ui-tabs-nav").addClass('connectedSortable').sortable({
			connectWith: '.connectedSortable', 
			    remove: function(event, ui){
				//console.log("[remove] evt:", event, ", ui:", ui);
			}, 
			    receive: function(event, ui){
				//console.log("[received] evt:", event, ", ui:", ui, ", src:", $vp_src);
			    isSameVP = false;
			    var $a = $(ui.item).children("a");
			    var label = $a.text();
			    var $sel  = $($a.attr("href"));
			    var id_tab = $sel.attr("id");
			    tab_contents= $sel.children();

			    //figure destination and position in destination: 
			    $vp_dest	= $(ui.item[0].parentNode.parentNode);
			    index_dest	= __elt_pos(ui.item[0]);		    
			    //remove tab from src: 
			    $vp_src.tabs('remove', index_src);

			    //insert tab in dest:
			    var $div=$("<div id='"+id_tab+"'/>");
			    $div.append(tab_contents);		    
			    temp_tab.append($div);
			    $vp_dest.tabs('add', "#"+id_tab, label, index_dest);
			    //replace tab contents
			    //console.log("try to repplace tab now:", $("ul:first>li", $vp_dest)[index_dest]);
			    //var oldNode = $("ul:first>li", $vp_dest)[index_dest];
			    //			    $($("ul:first>li", $vp_dest)[index_dest]).replaceWith(ui.item[0]);
			    // oldNode.parentNode.replaceChild(ui.item[0], oldNode);
	      
			}, 
			    stop: function(event, ui){
			    //$(".ui-view-tab-close", ui.item[0]).show();
				//console.log("[stop] evt=" ,event, ", ui=", ui );
			    if (isSameVP){ //reorder tabs in depth
				$vp_src.tabs();
			    }
			}, 
			    start: function(event, ui){
			    //			    $(".ui-view-tab-close", ui.item[0]).hide();
			    //			    $(".ui-view-tab-close", ui.item[0]).remove();
				//				console.log("[start] evt=" ,event, ", ui=", ui, ", this=", this );

			    $vp_src	= $(ui.item[0].parentNode.parentNode);
			    //			    index_src	= __elt_pos(ui.item[0]);
			    var href =  $(ui.item).children("a:first").attr("href");
			    index_src=$vp_src.tabs('get_index', href)

				//			    console.log("[start] src=", $vp_src[0], " at pos ", index_src );
			}, 
			    forceHelperSize: true
		    });

	    }
	}
    };

    
    $.widget("ui.viewport",VP_OBJ );

    $.extend($.ui.viewport, {
	    version: '1.7.2',
		defaults: {
		close_button: true, 
		    always_open:{}, 
		    views_available:{}, 
		    dock_visible: true		   
	    }
	});
})(jQuery);
