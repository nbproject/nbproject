/* Autotabs Plugin: making webapps look like eclipse apps
 * inspired from: 
 *	- jquery UI (ui.tabs.js)
 *	- http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/
 * Depends:
 *	ui.core.js
 *	ui.tabs.js
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
(function($) {
    var _M = {
	vp2v: {},
	v2vp: {}, 
	labels:{}, 
	closable:{},
    };
    var VP_OBJ = {
	temp_tab:  $("<div style='display:none'/>"),
	_init: function() {
	    this._autotabsify(true);
	},
	newView: function(prefix, title){
	    let new_id= prefix+"_"+(new Date()).getTime();
	    let $div=$("<div id='"+new_id+"-outer' class='outerview'><div id='"+new_id+"'/></div>");
	    temp_tab.append($div);
	    let id_view = new_id+"-outer";
	    this.element.tabs('add', "#"+id_view, title);
	    this._addView(id_view,this.element[0].id,title, "true");
	    return new_id;
	},
	select: function(id){
	    var self = this;
	    self.element.tabs('select', id);
	}, 
	smoothSelect: function(id){
	    var self = this;
	    self.element.tabs('option', 'fx', { opacity: 'toggle' });
	    self.element.tabs('select', id);
	    self.element.tabs('option', 'fx', null);
	},
	_decorate: function(tab_elt){
	    var self = this;
	    var f_close = function(event){
		let href = $(this).siblings("a").attr("href");
		let id = /#(.*)-outer/.exec(href)[1];
		self.element.trigger("close_view", id);
		$.L('closing', self, this);
		let index = self.element.tabs('get_index', href);
		self.element.tabs('remove', index);
		event.stopPropagation();
		self._removeView(id);

	    };
	    var f_togglemax = function(event){
		if (self.options.maxAppendTo){
		    var ph = $("#VP_PLACEHOLDER");
		    var vp_elt = self.element[0];
		    if (ph.length==0){//maximize
			$(vp_elt).after("<div id='VP_PLACEHOLDER'/>");
			vp_elt.parentNode.removeChild(vp_elt);
			$(self.options.maxAppendTo).append(vp_elt);
		    }
		    else{//unmaximize
			ph[0].parentNode.replaceChild(vp_elt, ph[0]);
		    }
		}
		$(self.element[0]).toggleClass("ui-maximized");
	    };
	    var f_hover = function(event){
		$(this).addClass('ui-state-hover').removeClass('ui-view-semiopaque');
	    };
	    var f_out =  function(event){
		$(this).removeClass('ui-state-hover').addClass('ui-view-semiopaque');;
	    };
	    var f_menu =  function(event){
		$("div.vp-menu", self.element).toggleClass("hidden");
	    };
	    if(tab_elt===undefined){
		//uses same selectors as in ui.tabs.js:_tabify()
		this.list = this.element.children('ul:first');
		this.lis = $('li:has(a[href])', this.list);
		if (this.options.dock_visible){
		    $("<div class='ui-view-menu ui-view-semiopaque ui-corner-all '>+</div>").hover(f_hover, f_out).click(f_menu).prependTo(self.element);
		}

	    }
	    else{ //adding a tab to an exisiting view
		this.lis = tab_elt;
	    }
	    this.lis.filter(function(){
		let view_id = $(">a", this).attr("href").substring(1);
		if (view_id in _M.closable){
		    return _M.closable[view_id];
		}
		return true;
	    }).append("<a href='#' role='button' class='ui-view-tab-close ui-corner-all  ui-view-semiopaque'><span class='ui-icon ui-icon-close'/></a>").dblclick(f_togglemax);
	    this.lis.children("a[role='button']").click(f_close).hover(f_hover, f_out);
	},
	_addAutotabs: function(id_autotabs){
	    _M.vp2v[id_autotabs]={};
	},
	_addView: function(id_view, id_autotabs, label, closable){ //adds a view to the model
	    _M.labels[id_view] = label;
	    _M.vp2v[id_autotabs][id_view]=true;
	    _M.v2vp[id_view] = id_autotabs;
	    _M.closable[id_view] = (closable=="true");
	},
	_moveView: function(id_view,  id_autotabs){ 
	    var id_autotabs_old =  _M.v2vp[id_view];
	    delete _M.vp2v[id_autotabs_old][id_view];
	    _M.vp2v[id_autotabs][id_view]=true;
	    _M.v2vp[id_view] = id_autotabs;
	},
	_removeView: function(id){
	    let id_view = id+"-outer";
	    let id_autotabs = _M.v2vp[id_view]; 
	    delete _M.vp2v[id_autotabs][id_view];
	    delete _M.v2vp[id_view];
	    delete _M.labels[id_view];
	    delete _M.closable[id_view];

	},
	_build_tocs: function(){
	    var self = this;
	    var toc1 = $("<ul/>").prependTo(self.element); //for tabs
	    var vp_menu = $("<div class='vp-menu hidden'/>").prependTo(self.element); //for swicher
	    var toc2 = $("<ul/>").appendTo(vp_menu);
	    self.element.children("[id]").each(function(i){
		    toc1.append("<li><a href='#"+this.id+"'>"+_M.labels[this.id]+"</a></li>");
		    $("<li>"+_M.labels[this.id]+"</li>").appendTo(toc2);
		});	    
	},
	_create_model: function(){
	    var self = this;
	    self._addAutotabs(self.element[0].id);
	    self.element.children("[id]").each(function(i){
		    var firstChild = $(this).children()[0];
		    var label = firstChild.hasAttribute("label")?firstChild.getAttribute("label"):"["+firstChild.id+"]";
		    var closable =  firstChild.hasAttribute("closable")?firstChild.getAttribute("closable"):"true";
		    self._addView(this.id, self.element[0].id, label, closable);
		});	    
	},	
	_autotabsify: function(init) {
	    var self = this;
	    // initialization from scratch
	    if (init) {
		if (temp_tab == null){
		    temp_tab =  $("<div style='display:none'/>");
		    $("body").append(temp_tab);
		}
		/*
		  embed views in outer containers
		*/
		self.element.children().wrap("<div class='outerview'/>");
		$("div.outerview", self.element).children().each(function(){
			this.parentNode.id = this.id+"-outer";
		    });
		this._create_model();
		this._build_tocs();
		this._decorate();
		self.element.addClass("autotabs").tabs({
			"add": function(e, ui) {
			    //$.L("e: ", e, ", ui:", ui);
			    self._decorate($(ui.tab.parentNode));
			}, 
			    "show": function(evt, ui){
				$.L(ui.panel , " selected");
				if (self.options.select){
				    self.options.select(ui.panel);
				}
			    }
		    }).find(".ui-tabs-nav").addClass('connectedSortable').sortable({
			    connectWith: '.connectedSortable', 
				remove: function(event, ui){
				//$.L("[remove] evt:", event, ", ui:", ui);
			    }, 
				receive: function(event, ui){
				//$.L("[received] evt:", event, ", ui:", ui, ", src:", $vp_src);
				isSameVP = false;
				var $a = $(ui.item).children("a");
				var label = $a.text();
				var $sel  = $($a.attr("href"));
				//$sel.view('beforeMove');
				var id_tab = $sel.attr("id");
				tab_contents= $sel.children()[0];
				tab_contents = tab_contents.parentNode.removeChild(tab_contents);

				//figure destination and position in destination: 
				$vp_dest	= $(ui.item[0].parentNode.parentNode);
				index_dest	= __elt_pos(ui.item[0]);		    

				//remove tab from src: 
				$vp_src.tabs('remove', index_src);
			
				//insert tab in dest:
				var $div=$("<div id='"+id_tab+"'/>");
				//$div.append(tab_contents);		    
				temp_tab.append($div);
				$vp_dest.tabs('add', "#"+id_tab, label, index_dest);


				//insert contents in new tab
				$div[0].appendChild(tab_contents);
	
				self._moveView(id_tab,  $vp_dest[0].id);
				$.L(_M);
			    }, 
				stop: function(event, ui){
				//$.L("[stop] evt=" ,event, ", ui=", ui );
				if (isSameVP){ //reorder tabs in depth
				    $vp_src.tabs();
				}
			    }, 
				start: function(event, ui){
				//				$.L("[start] evt=" ,event, ", ui=", ui, ", this=", this );
				$vp_src	= $(ui.item[0].parentNode.parentNode);
				var href =  $(ui.item).children("a:first").attr("href");
				index_src=$vp_src.tabs('get_index', href)
				    }, 
				forceHelperSize: false,
				helper: 'clone',
				appendTo: 'body'
				});

	    }
	}
    };

    
    $.widget("ui.autotabs",VP_OBJ );

    $.extend($.ui.autotabs, {
	    version: '1.7.2',
		defaults: {
		close_button: true, 
		    always_open:{}, 
		    views_available:{}, 
		    dock_visible: true, 
				      maxAppendTo: null, 
				      select: null
		    }, 
		getter: "newView"
	});
})(jQuery);
