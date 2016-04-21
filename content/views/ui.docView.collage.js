/* docView Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery:true*/
(function ($) {
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self.element.append("<div class='util'/><div class='contents'/>");
      self._last_clicked_selection =  0;

      //TODO self._h =  100;//sample init
      self._in_page_transition =  false;
      self.___best_fit =  true;

      //TODO self.___best_fit_zoom =  1.0; //this is computed later
      self._pages =  {}; //pages that have been rendered at current resolution (real page number of files, i.e. not 0 based)
      self._page =  null;  //current page
      self._location = null; //selected location (might not be on current page)
      self._id_collection =  null;

      self._scrollTimerID =  null;

      /* things we added for collections (zero-based):
        each entry should be a object with following entries:
        resolution, scale, w, h, best_fit_zoom, file
       */
      self._collection = null;
      self._pageinfo = [];
    },

    _defaultHandler: function (evt) {
      var self    = this;
      var id_collection    = self._id_collection;
      var model    = self._model;
      var h, H, i, page, scrollby, delta_top, delta_bottom;
      if (id_collection !== $.concierge.get_state('collection')) {
        return;
      }
      /*
       * From now on, we assume the event is directed to this view !
       */       
      switch (evt.type){
      case 'page_peek':
        self._page =  parseInt(evt.value, 10);
        $('div.material.selected', self.element).removeClass('selected');

        //        $("div.material[page="+evt.value+"]", self.element).addClass("selected").drawable({model: model});
        $('div.material[page=' + evt.value + ']', self.element).addClass('selected').children('div.innermaterial').draggable();
        self._render();

        //self._scroll_to_page();
      break;
      case 'page': //same as page_peek with scrolling in addition
        self._page =   parseInt(evt.value, 10);
        $('div.material.selected', self.element).removeClass('selected');

        //        $("div.material[page="+evt.value+"]", self.element).addClass("selected").drawable({model: model});
        $('div.material[page=' + evt.value + ']', self.element).addClass('selected').children('div.innermaterial').draggable();

        self._render();
        self._scroll_to_page();
      break;
      case 'zoom':
        self.___best_fit =  false;
        self._render();
        self._scroll_to_page();
      break;
      case 'note_hover':
        $('div.selection[id_item=' + evt.value + ']', self.element).addClass('hovered');
      break;
      case 'note_out':
        $('div.selection[id_item=' + evt.value + ']', self.element).removeClass('hovered');
      break;
      case 'visibility':
        var fct = evt.value ? 'show' : 'hide';
        $('div.selections, self.element')[fct]();
      break;
      case 'global_editor':
        var $editor = $('<div/>');
        $('div.global-editors', self.element).append($editor);
        $editor.editor();
      break;
      case 'select_thread':
        var o = model.o.location[evt.value];
        if (self._location === null || o.ID !== self._location.ID) {
          self._location = o;
          self._page =  self._collection.index[o.ID] + 1;
          self._render();
          $('div.material.selected', self.element).removeClass('selected');

          //            $("div.material[page="+self._page+"]", self.element).addClass("selected").drawable({model: model});
          $('div.material[page=' + self._page + ']', self.element).addClass('selected').children('div.innermaterial').draggable();

        }

        $('div.selection', self.element).removeClass('selected');
        var sel = $('div.selection[id_item=' + evt.value + ']', self.element).addClass('selected');
        if (sel.length > 0) {
          self._in_page_transition =  true; //prevent animation

          h = sel.height();
          H = self.element.height();
          delta_top = sel.offset().top - self.element.offset().top;
          delta_bottom = delta_top + h - H;
          if (delta_top > 0) { //we're not too high
            if (delta_bottom > 0) {//but we're too low... recenter
              scrollby = delta_bottom + H / 2 - h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget.
              self.element.stop(true).animate({ scrollTop: '+=' + scrollby  + 'px' }, 300);
            }
          }          else {  //too high: recenter:
            scrollby = delta_top + (h - H) / 2;
            self.element.stop(true).animate({ scrollTop: '+=' + scrollby + 'px' }, 300);
          }

          self._in_page_transition =  false;
        }

      break;
      case 'doc_scroll_down':
        self._in_page_transition =  true; //prevent animation
        H = self.element.height();
        self.element.stop(true).animate({ scrollTop: '+=' + H / 2  + 'px' }, 200);
        self._in_page_transition =  false;
      break;
      case 'doc_scroll_up':
        self._in_page_transition =  true; //prevent animation
        H = self.element.height();
        self.element.stop(true).animate({ scrollTop: '-=' + H / 2  + 'px' }, 200);
        self._in_page_transition =  false;
      break;
      }
    },

    set_model: function (model, init_event) {
      var self = this;

      //for now, we don't register to receive any particular updates.
      model.register($.ui.view.prototype.get_adapter.call(this),  { location: null });

      //build view:
      var id_collection = $.concierge.get_state('collection');
      self._id_collection =  id_collection;
      self._model =  model;
      self.element.addClass('docView').scroll(function (evt) {
        //we use a timer to coalesce scroll events happening in quick succession.
        var timerID = self._scrollTimerID;
        if (timerID !== null) {
          window.clearTimeout(timerID);
          self._scrollTimerID =  null;
        }

        if (self._in_page_transition === false) {
          timerID = window.setTimeout(function () {
            var $elt = $(evt.currentTarget);
            var st = $elt.scrollTop();
            var H = $elt.parent().height();

            //pbar is inititialized to "first guess" of current page, assuming all heights are equal...
            var pbar = Math.max(1, Math.min(Math.ceil(self._collection.items.length * st / H), self._collection.items.length));
            var p = $('div.material[page=' + pbar + ']', self.element);
            var next_p;
            var cond = p.offset().top < 0;
            while (p.offset().top < 0 === cond) {
              next_p =  p[cond ? 'next' : 'prev']();
              if (next_p[0].hasAttribute('page')) {
                p = next_p;
              }              else {
                break;
              }
            }

            if (p.offset().top < 0) { //make sure we get page with smallest but positive "top" value
              p = p.next();
            }

            $.concierge.trigger({ type: 'page_peek', value:p.attr('page') });
          }, 300);

          self._scrollTimerID =  timerID;
        }
      });

      //REMOVED        self._update_best_fit_zoom();
      self._generate_contents();
      if (init_event) {
        $.concierge.trigger(init_event);
      }      else {
        $.concierge.trigger({ type:'page', value: 1 });
      }

      if ($.concierge.activeView === null) {
        $.concierge.activeView = self; //init.
      }
    },

    _keydown: function (event) {
      var thread_codes = { 37: { sel: 'prev', no_sel: 'last', dir: -1, msg:'No more comments above...' }, 39: { sel: 'next', no_sel:'first', dir: 1, msg:'No more comments below...' } };
      var scroll_codes = { 38: '-=', 40: '+=' };
      var new_sel, id_item, id_new, new_page;
      if (event.keyCode in thread_codes) {
        var sel = $('div.selection.selected', this.element);
        if (sel.length) {
          new_page =  this._collection.index[this._location.ID] + 1 + thread_codes[event.keyCode].dir;
          if (new_page === 0 || new_page > this._collection.items.length) {
            $.I(thread_codes[event.keyCode].msg);
          }          else {
            $.concierge.trigger({ type:'select_thread', value: this._collection.items[new_page - 1] });
          }
        }        else { // no selection on the page
          new_sel = thread_codes[event.keyCode].no_sel === 'first' ? 0 :  this._collection.items.length - 1;
          $.concierge.trigger({ type:'select_thread', value:  this._collection.items[new_sel] });
          /*

          new_sel = $("div.selection")[thread_codes[event.keyCode].no_sel]();
          if (new_sel.length){
              new_sel.click();
              //                $.L("moving selection");
          }
          */
        }

        return false;
      }      else if (event.keyCode in scroll_codes) {
        //$.concierge.trigger({type:scroll_codes[event.keyCode], value: 0});
        var H = this.element.height();
        this.element.stop(true).animate({ scrollTop: scroll_codes[event.keyCode]  + H / 3  + 'px' }, 200);
      }      else {
        return true; // let the event be captured for other stuff
      }
    },

    update: function (action, payload, items_fieldname) {            //TODO: this is exactly the same code as ui.notepaneview7.js: maybe we should factor it out ?
      var D, page, pages, i;
      if (action === 'add' && items_fieldname === 'location') {
        var id_collection    = this._id_collection;
        page        = this._page;
        if (page === null || id_collection === null) {
          //initial rendering: Let's render the first page. We don't check the id_collection here since other documents will most likely have their page variable already set.
          this._page =  1;
          this._location = this._collection.items[0];
          this._render();

          //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already.
        }        else {
          //send signal to redraw pages that needs to be redrawn:
          D        = payload.diff;
          pages    = this._pages;
          var do_render_now = false;
          for (i in D) {
            if (D[i].id_collection === id_collection) {
              delete pages[D[i].page];
              if (page === D[i].page) {
                do_render_now = true;
              }
            }
          }

          if (do_render_now) {
            this._render();//re-render now if al least one note on active page
          }
        }
      }      else if (action === 'remove' && items_fieldname === 'location') { //just re-render the pages where locations were just removed.
        D        = payload.diff;
        var pages_done    = {};

        for (i in D) {
          page = D[i].page;
          if (!(page in pages_done)) {
            pages_done[page] = null;
            delete this._pages[page];
            this._render_one(page);
          }
        }
      }
    },

    _update: function () {
      $.ui.view.prototype._update.call(this);
      var self = this;
      self._generate_contents();
      self._scroll_to_page();
    },

    close: function () {
      var id =  this._id_collection;
      delete $.concierge.features['doc_viewer'][id];
      $.ui.view.prototype.close.call(this);
      $.L('closing docviewer',  id);
    },

    _scroll_to_page: function (cb) {
      var self = this;
      var st = self.element[0].scrollTop;
      var page1 =  $('div.material[page=' + self._page + ']', self.element);
      var w1 = page1.width();
      var w2 = self.element.width();

      //        var pbar = Math.ceil((st+0.01)/(self._h+self._v_margin));
      //        var current_page = self._page;
      if (self._in_page_transition === false) {
        self._in_page_transition =  true;
        var divOffset = self.element.offset().top;

        var materialPage = $('div.material[page=' + self._page + ']', self.element);
        if (materialPage.offset() !== undefined) {
          var imgOffset = materialPage.offset().top;
          self.element.animate({ scrollTop: '+=' + (imgOffset - divOffset) + 'px' }, 500, function () {
            self._in_page_transition =  false;
          });
        }

      }      else {
        $.L('animation to page ' + self._page + ' prevented');
      }

      self.element.scrollLeft((w1 - w2) / 2); //centers page

    },

    _generate_contents: function () {
      /*
       * either generates or updates contents
       * we don't systematically generate it so we can keep the editors, drawables etc...
       */
      var self    = this;
      var contents    = "<div class='global-editors'/>";
      var id_collection    = self._id_collection;
      var model    = this._model;

      // SACHA TODO: adapt the original resolution to the screen size
      var res0    = $.concierge.get_constant('res');
      var scale0    = $.concierge.get_constant('scale');
      self._collection = $.concierge.get_component('get_collection')();
      self._pageinfo = [];
      var items = self._collection.items;
      var location, file, width0, height0, zoom, res, scale, candidate_scale, desired_scale, resols, pageinfo;
      var RESOLUTIONS = $.concierge.get_constant('RESOLUTIONS');
      var f_sort = function (a, b) {return a - b;};

      for (var i = 0; i < items.length; i++) {
        pageinfo    = {};
        location    = model.o.location[items[i]];
        file    = model.o.file[location.id_source];
        width0    = file.rotation === 90 || file.rotation === 270 ? file.h : file.w;
        height0    = file.rotation === 90 || file.rotation === 270 ? file.w : file.h;
        zoom    = $.concierge.get_state('zoom');
        if (self.___best_fit) {
          zoom =  (this.element.width() + 0.0) / (1.1 * width0);
        }

        res        = res0;
        scale    = scale0;
        candidate_scale = scale;
        desired_scale = zoom * scale0;
        resols    = [];
        for (scale in RESOLUTIONS[res]) {
          resols.push(parseInt(scale, 10));
        }

        resols.sort(f_sort);
        candidate_scale = resols[resols.length - 1];
        for (var j = resols.length - 1; j > -1; j--) {
          if (resols[j] < desired_scale) {
            break;
          }          else {
            candidate_scale = resols[j];
          }
        }

        scale        = candidate_scale;
        delete self._pages[i + 1];
        pageinfo.resolution = res0;
        pageinfo.scale = scale;
        var w = parseInt((width0 * scale) / scale0, 10); //page width
        var h = parseInt((height0 * scale) / scale0, 10);
        pageinfo.w = w;
        pageinfo.h = h;
        pageinfo.zoom = zoom;
        self._pageinfo.push(pageinfo);
        var src = '';

        // For collage views, we only want to display part of the page (height of selection + 50px on each side)
        var s = (res0 * scale + 0.0) / ($.concierge.get_constant('RESOLUTION_COORDINATES') * 100);
        var fudge = width0 / 612.0;
        s = s * fudge;
        var h_collage = 100 + location.h * s;
        pageinfo.h_collage  = h_collage;
        var style = 'width: ' + w + 'px;height: ' + h_collage + 'px;';
        var inner_top = Math.min(0, 50 - location.top * s);
        var root = model.get('comment', { ID_location: location.ID, id_parent: null }).first();
        var link = "<a target='_blank' href='/f/" + file.id + '?c=' + root.ID + "'>" + $.E(model.o.ensemble[location.id_ensemble].name) + ' - ' + $.E(file.title) + ' (p.  ' + location.page + ')</a>';
        contents += "<div class='material'  page='" + (i + 1) + "' style='" + style + "' ><div class='pagenumber pagenumbertop'>" + link + "</div><div class='innermaterial' style='top: " + inner_top + "px'><div class='selections'/><div class='links'/><img class='material' page='" + (i + 1) + "'/></div></div>";

      }

      $('div.contents', self.element).html(contents);
      var $material = $('div.material', self.element).click(function (evt) {
        var numpage = evt.currentTarget.getAttribute('page');
        $.concierge.trigger({ type: 'page', value:numpage });
      }).mouseenter(function (evt) {
        var numpage = evt.currentTarget.getAttribute('page');
        if (numpage !== self._page) {
          $.concierge.trigger({ type: 'page_peek', value:numpage });
        }
      });

      self._v_margin =  parseInt($material.css('margin-bottom') +  parseInt($material.css('margin-top'), 10), 10);
      if (self._page == null) {
        self._page = 1;
      }

      self._render();
    },

    _render: function () {
      /*
       * this is where we implement the caching strategy we want...
       */
      var p = this._page;
      this._render_one(p);
      if (p < this._collection.items.length) {
        this._render_one(p + 1);
      }

      if (p > 1) {
        this._render_one(p - 1);
      }

      if (p < this._collection.items.length - 1) {
        this._render_one(p + 2);
      }
    },

    _render_one: function (page) {
      var self    = this;
      var pages    = self._pages;
      if (page in pages) {
        return;
      }

      pages[page]    = true;
      self._draw_material(page);
      self._draw_selections(page);
    },

    _draw_material: function (page) {
      var self    = this;
      var m        = self._model;
      var location    = m.o.location[self._collection.items[page - 1]];
      var pageinfo    = self._pageinfo[page - 1];
      var res        = pageinfo.resolution;
      var scale    = pageinfo.scale;
      var w        = pageinfo.w;
      var h        = pageinfo.h;
      var h_collage    = pageinfo.h_collage;
      var style    = 'width: ' + w + 'px;height: ' + h_collage + 'px';
      var src_pref    = self.options.img_server + '/pdf/cache2/' + res + '/' + scale + '/' + location.id_source + '?ckey=' + $.concierge.get_component('get_userinfo')().ckey + '&amp;page=' + location.page;
      $('>div.contents>div.material[page=' + page + ']', self.element).each(function (j) {
        var $this    = $(this);
        $this.attr('style', style);
        $this.children().children('img.material').attr('src', src_pref);
      });
    },

    _draw_selections: function (page) {
      var self = this;
      var contents;
      var m = this._model;
      var location    = m.o.location[self._collection.items[page - 1]];
      var t, l, w, h, ID, o, sel_contents;
      var s = ($.concierge.get_constant('res') * self._pageinfo[page - 1].scale + 0.0) / ($.concierge.get_constant('RESOLUTION_COORDINATES') * 100);
      var file = m.o.file[location.id_source];
      var fudge = (file.rotation === 90 || file.rotation === 270 ? file.h : file.w) / 612.0;
      s = s * fudge; //BUG_226: for compatibility with old UI, but needs to be removed !!!
      contents = '';
      var me =  $.concierge.get_component('get_userinfo')();

      //for (var i=0;i<locs.length;i++){
      o = location;
      ID = o.ID;
      t = o.top * s;
      l = o.left * s;
      w = o.w * s;
      h = o.h * s;
      sel_contents = '';
      if (!(m.get('comment', { ID_location: ID, admin: 1 }).is_empty())) {
        sel_contents += "<div class='nbicon adminicon' title='An instructor/admin has participated to this thread'/>";
      }

      if (!(m.get('comment', { ID_location: ID, id_author: me.id }).is_empty())) {
        if (m.get('comment', { ID_location: ID, type: 1 }).is_empty()) {
          sel_contents += "<div class='nbicon meicon' title='I participated to this thread'/>";
        }        else {
          sel_contents += "<div class='nbicon privateicon' title='I have private comments in this thread'/>";
        }
      }

      contents += ("<div class='selection' id_item='" + ID + "' style='top: " + t + 'px; left: ' + l + 'px; width: ' + w + 'px; height: ' + h + "px'>" + sel_contents + '</div>');

      $('div.material[page=' + page + ']>div>div.selections',  self.element).html(contents).children('div.selection').mouseover(function (evt) {
        $.concierge.trigger({ type:'note_hover', value: evt.currentTarget.getAttribute('id_item') });
      }).mouseout(function (evt) {
        $.concierge.trigger({ type:'note_out', value: evt.currentTarget.getAttribute('id_item') });
      }).click(function (evt) {
        $.concierge.trigger({ type:'select_thread', value: evt.currentTarget.getAttribute('id_item') });
      });
    },
  });

  $.widget('ui.docView', V_OBJ);
  $.ui.docView.prototype.options = {
    img_server: 'http://localhost',
    loc_sort_fct: function (o1, o2) {return o1.top - o2.top;},

    provides: ['doc'],
    listens: {
      page:null,
      page_peek: null,
      zoom: null,
      note_hover: null,
      note_out: null,
      visibility: null,
      global_editor: null,
      select_thread: null,
    },
  };
})(jQuery);
