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
      self._h =  100;//sample init
      self._in_page_transition =  false;
      self._area_indicator =  false;
      self.___pbar_old =  1;
      self.___best_fit =  true;
      self.___best_fit_zoom =  1.0; //this is computed later
      self._pages =  {}; //pages that have been rendered at current resolution
      self._page =  null;
      self._id_source =  null;
      self._scrollTimerID =  null;
      self._scrollCounter = 0;
      self._id_location       = null; //location_id of selected thread

    },

    _defaultHandler: function (evt) {
      var self    = this;
      var id_source    = self._id_source;
      var model    = self._model;
      var h, H, i, page, scrollby, delta_top, delta_bottom;
      if (id_source !== $.concierge.get_state('file')) {
        return;
      }
      /*
       * From now on, we assume the event is directed to this view !
       */       
      switch (evt.type){
      case 'page_peek':
        this._page =  parseInt(evt.value, 10);
        $('div.material.selected', self.element).removeClass('selected');
        $('div.material[page=' + evt.value + ']', self.element).addClass('selected').drawable({ model: model });
        self._render();

        //self._scroll_to_page();
      break;
      case 'page': //same as page_peek with scrolling in addition
        this._page =  parseInt(evt.value, 10);
        $('div.material.selected', self.element).removeClass('selected');
        $('div.material[page=' + evt.value + ']', self.element).addClass('selected').drawable({ model: model });
        self._render();
        self._scroll_to_page();
      break;
      case 'zoom':
        self.___best_fit =  false;
        self._generate_contents();
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
        $('div.global-editors', this.element).append($editor);
        $editor.editor();
      break;
      case 'select_thread':
        var o = model.o.location[evt.value];
        self._id_location = evt.value;
        if (o.page !==  this._page) {
          this._page =  o.page;
          this._render();
          $('div.material.selected', self.element).removeClass('selected');
          $('div.material[page=' + o.page + ']', self.element).addClass('selected').drawable({ model: model });
        }

        $('div.selection', self.element).removeClass('selected');
        var sel = $('div.selection[id_item=' + evt.value + ']', self.element).addClass('selected');
        if (sel.length > 0) {
          self._in_page_transition =  true; //prevent animation

          h = sel.height();
          H = this.element.height();
          delta_top = sel.offset().top - this.element.offset().top;
          delta_bottom = delta_top + h - H;
          if (delta_top > 0) { //we're not too high
            if (delta_bottom > 0) {//but we're too low... recenter
              scrollby = delta_bottom + H / 2 - h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget.
              this.element.stop(true).animate({ scrollTop: '+=' + scrollby  + 'px' }, 300);
            }
          }          else {  //too high: recenter:
            scrollby = delta_top + (h - H) / 2;
            this.element.stop(true).animate({ scrollTop: '+=' + scrollby + 'px' }, 300);
          }

          self._in_page_transition =  false;
        }

      break;
      case 'doc_scroll_down':
        self._in_page_transition =  true; //prevent animation
        H = this.element.height();
        this.element.stop(true).animate({ scrollTop: '+=' + H / 2  + 'px' }, 200);
        self._in_page_transition =  false;
      break;
      case 'doc_scroll_up':
        self._in_page_transition =  true; //prevent animation
        H = this.element.height();
        this.element.stop(true).animate({ scrollTop: '-=' + H / 2  + 'px' }, 200);
        self._in_page_transition =  false;
      break;
      }
    },

    select: function () {
      var id = this._id_source;
      if (id && id !== $.concierge.get_state('file')) {
        $.concierge.trigger({ type:'file', value:this._id_source });
      }
    },

    set_model: function (model, init_event) {
      var self = this;

      //for now, we don't register to receive any particular updates.
      model.register($.ui.view.prototype.get_adapter.call(this),  { location: null });

      //build view:
      var id_source = $.concierge.get_state('file');
      self._id_source =  id_source;
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
            var st = evt.currentTarget.scrollTop;
            var h = self._h + self._v_margin;
            var pbar = (st === 0) ? 1 :  Math.ceil(st / h);
            var prem = h - st % h;
            var area_indicator = (prem - 0.5 * evt.currentTarget.clientHeight) > 0;
            var pbar_old = self.___pbar_old;
            if ((area_indicator !== self._area_indicator) || (pbar !== pbar_old)) {
              var newpage = (area_indicator) ?  pbar : pbar + 1;
              self._in_page_transition =  true; //prevent animation
              $.concierge.trigger({ type: 'page_peek', value:newpage });
              self._in_page_transition =  false;
            }

            self.___pbar_old =  pbar;
            self._area_indicator =  area_indicator;
            $.concierge.logHistory('scrolling', ['s', self.element.scrollTop(), self.element.height(),  self._scrollCounter++].join(','));
          }, 300);

          self._scrollTimerID =  timerID;
        }
      });

      self._update_best_fit_zoom();
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
      var thread_codes = { 37: { sel: 'prev', no_sel: 'last', dir: 'up', msg:'No more comments above...' }, 39: { sel: 'next', no_sel:'first', dir: 'down', msg:'No more comments below...' } };
      var scroll_codes = { 38: '-=', 40: '+=' };
      var zoom_codes = { 189: 0.8, 187: 1.25 }; //webkit (shiftKey insensitive)
      var zoom_charcodes = { 45: 0.8, 43: 1.25 }; //FF (shiftKey sensitive)
      var new_sel, id_item, id_new;
      if (event.keyCode in thread_codes) {
        var sel = $('div.selection.selected', this.element);
        if (sel.length) {
          new_sel = sel[thread_codes[event.keyCode].sel]();
          if (new_sel.length) {
            new_sel.click();
          }          else { // we need to find next location on subsequent pages
            id_item = sel.attr('id_item');
            id_new = $.concierge.get_component('location_closestpage')({ id: Number(id_item), model: this._model, direction: thread_codes[event.keyCode].dir });
            if (id_new !== null) {
              $.concierge.trigger({ type:'select_thread', value: id_new });
            }            else {
              $.I(thread_codes[event.keyCode].msg);
            }
          }
        }        else { // no selection on the page
          new_sel = $('div.selection')[thread_codes[event.keyCode].no_sel]();
          if (new_sel.length) {
            new_sel.click();

            //                $.L("moving selection");
          }
        }

        return false;
      }      else if (event.keyCode in scroll_codes) {
        //$.concierge.trigger({type:scroll_codes[event.keyCode], value: 0});
        var H = this.element.height();
        this.element.stop(true).animate({ scrollTop: scroll_codes[event.keyCode]  + H / 3  + 'px' }, 200);
      }      else if (event.keyCode in zoom_codes) {
        $.concierge.trigger({ type:'zoom', value: zoom_codes[event.keyCode] * ($.concierge.get_state('zoom') || this.___best_fit_zoom) });
      }      else if (event.keyCode === 0 && event.charCode in zoom_charcodes) { //FF
        $.concierge.trigger({ type:'zoom', value: zoom_charcodes[event.charCode] * ($.concierge.get_state('zoom') || this.___best_fit_zoom) });
      }      else {
        return true; // let the event be captured for other stuff
      }
    },

    update: function (action, payload, items_fieldname) {            //TODO: this is exactly the same code as ui.notepaneview7.js: maybe we should factor it out ?
      var D, page, pages, i;
      if (action === 'add' && items_fieldname === 'location') {
        var id_source    = this._id_source;
        page        = this._page;
        if (page === null || id_source === null) {
          //initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set.
          this._page =  1;
          this._render();

          //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already.
        }        else {
          //send signal to redraw pages that needs to be redrawn:
          D        = payload.diff;
          pages    = this._pages;
          var do_render_now = false;
          for (i in D) {
            if (D[i].id_source === id_source) {
              delete pages[D[i].page];
              if (page === D[i].page) {
                do_render_now = true;
              }
            }
          }

          if (do_render_now) {
            this._render();//re-render now if at least one note on active page
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
      self._update_best_fit_zoom();

      //        self._render();
      self._generate_contents();
      self._scroll_to_page();
    },

    _update_best_fit_zoom: function () {
      //best zoom: when the page fits in width with a 10% margin on the side
      var file =  this._model.o.file[$.concierge.get_state('file')];
      var w = file.rotation === 90 || file.rotation === 270 ? file.h : file.w;
      this.___best_fit_zoom =  (this.element.width() + 0.0) / (1.1 * w);
    },

    close: function () {
      var id =  this._id_source;
      delete $.concierge.features['doc_viewer'][id];
      $.ui.view.prototype.close.call(this);
      $.L('closing docviewer',  id);
    },

    _scroll_to_page: function (cb) {
      var self = this;
      var st = self.element[0].scrollTop;
      var page1 =  $('div.material[page=1]', self.element);
      var w1 = page1.width();
      var w2 = self.element.width();
      var pbar = Math.ceil((st + 0.01) / (self._h + self._v_margin));
      var current_page = self._page;
      if ((self._in_page_transition === false) && (pbar !== current_page)) {
        self._in_page_transition =  true;
        var divOffset = self.element.offset().top;
        var imgElement = $('img.material[page=' + current_page + ']', self.element).parent();

        if (imgElement.offset() !== undefined) {
          var imgOffset = imgElement.offset().top;
          self.element.animate({ scrollTop: '+=' + (imgOffset - divOffset) + 'px' }, 500, function () {
            self._in_page_transition =  false;
          });
        }
      }      else {
        $.L('animation to page ' + current_page + ' prevented, pbar=' + pbar);
      }

      self.element.scrollLeft((w1 - w2) / 2); //centers page

    },

    _generate_selections: function () {
      /*
       *  unlike generate_contents, we always regenerate the selections, irrespective
       *  of whether they were there previously or not
       */
      var self = this;
      var contents;
      var id_source = self._id_source;
      var model = this._model;
      var numpages = model.o.file[id_source].numpages;
      var t, l, w, h, ID, locs, o;
      var s = ($.concierge.get_constant('res') * self._scale + 0.0) / ($.concierge.get_constant('RESOLUTION_COORDINATES') * 100);
      var file = model.o.file[id_source];
      var fudge = (file.rotation === 90 || file.rotation === 270 ? file.h : file.w) / 612.0;
      s = s * fudge; //for compatibility with old UI, but needs to be changed !!!
      for (var p = 1; p <= numpages; p++) {
        contents = '';
        locs = model.get('location', { id_source: id_source, page: p }).sort(self.options.loc_sort_fct);

        //facet_page._filter(p, "", true);
        for (var i = 0; i < locs.length; i++) {
          o = locs[i];
          ID = o.ID;
          t = o.top * s;
          l = o.left * s;
          w = o.w * s;
          h = o.h * s;
          contents += ("<div class='selection' id_item='" + ID + "' style='top: " + t + 'px; left: ' + l + 'px; width: ' + w + 'px; height: ' + h + "px'/>");
        }

        $('div.material[page=' + p + ']>div.selections',  self.element).html(contents);
      }

      $('div.material>div.selections>div.selection', self.element).mouseover(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'note_hover', value: id_item });
      }).mouseout(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'note_out', value: id_item });
      }).click(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'select_thread', value: id_item });
      });

    },

    _generate_links: function () {
      var self = this;
      var contents;
      var id_source = self._id_source;
      var m = this._model;

      // use our index to find links for this file:
      var index = m.indexes['file']['link'][id_source];
      var links = m.o.link;
      var numpages = m.o.file[id_source].numpages;
      var link;
      var s = ($.concierge.get_constant('res') * self._scale + 0.0) / ($.concierge.get_constant('RESOLUTION_COORDINATES') * 100);
      var ID, note, t, w, h, l;
      for (var p = 1; p <= numpages; p++) {
        contents = '';
        for (var id in index) {
          link = links[id];
          if (link.page === p) {
            //SACHA continue here !!!
            ID = note.ID[0];
            t = note.top[0] * s;
            l = note.left[0] * s;
            w = note.w[0] * s;
            h = note.h[0] * s;
            contents += ("<div class='selection' id_item='" + ID + "' style='top: " + t + 'px; left: ' + l + 'px; width: ' + w + 'px; height: ' + h + "px'/>");
          }
        }

        $('div.material[page=' + p + ']>div.selections',  self.element).html(contents);
      }

      $('div.material>div.selections>div.selection', self.element).mouseover(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'note_hover', value: id_item });

      }).mouseout(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'note_out', value: id_item });
      }).click(function (evt) {
        var id_item = evt.currentTarget.getAttribute('id_item');
        $.concierge.trigger({ type:'select_thread', value: id_item });
      });

    },

    _generate_contents: function () {
      /*
       * either generates or updates contents
       * we don't systematically generate it so we can keep the editors, drawables etc...
       */
      var self    = this;
      var contents    = "<div class='global-editors'/>";
      var id_source    = self._id_source;
      var model    = this._model;

      // SACHA TODO: adapt the original resolution to the screen size
      var res0    = $.concierge.get_constant('res');
      var scale0    = $.concierge.get_constant('scale');
      var file    = model.o.file[id_source];
      var width0    = file.rotation === 90 || file.rotation === 270 ? file.h : file.w;

      //var width0    = 612; //SACHA: FIXME - should check it's really the case !

      //        var height0    = 792;
      var height0    = file.rotation === 90 || file.rotation === 270 ? file.w : file.h;
      var zoom    = self.___best_fit ? self.___best_fit_zoom : $.concierge.get_state('zoom');
      var RESOLUTIONS = $.concierge.get_constant('RESOLUTIONS');
      var res        = res0;
      var scale    = scale0;
      var candidate_scale = scale;
      var desired_scale = zoom * scale0;
      var resols    = [];
      var i;
      for (scale in RESOLUTIONS[res]) {
        resols.push(parseInt(scale, 10));
      }

      resols.sort(function (a, b) {return a - b;});

      candidate_scale = resols[resols.length - 1];
      for (i = resols.length - 1; i > -1; i--) {
        if (resols[i] < desired_scale) {
          break;
        }        else {
          candidate_scale = resols[i];
        }
      }

      scale        = candidate_scale;
      if (res0 !== self._resolution || scale !== self._scale) {
        self._pages =  {};
        self._resolution =  res0;
        self._scale =  scale;
        $.concierge.trigger({ type: 'scale', value: scale }); //way to let other views (such as editor) know.
        var w = parseInt((width0 * scale) / scale0, 10); //page width
        var h = parseInt((height0 * scale) / scale0, 10);
        self._w =  w;
        self._h =  h;
        var src = '';
        for (i = 1; i <= model.o.file[id_source].numpages; i++) {
          var style = 'width: ' + w + 'px;height: ' + h + 'px';
          contents += "<div class='material'  page='" + i + "' style='" + style + "' ><div class='pagenumber pagenumbertop'><a href='?p=" + i + "'>page " + i + "</a></div><div class='pagenumber pagenumberbottom'><a href='?p=" + i + "'>page " + i + "</a></div><div class='selections'/><div class='links'/><img class='material' page='" + i + "'/></div>";
        }

        $('div.contents', self.element).html(contents);
        var $material = $('div.material', self.element).click(function (evt) {
          var numpage = evt.currentTarget.getAttribute('page');

          //if (numpage !== self._page){
          //    self._in_page_transition =  true; //prevent animation
          $.concierge.trigger({ type: 'page', value:numpage });

          //    self._in_page_transition =  false;
          //                }
        }).mouseenter(function (evt) {
          var numpage = evt.currentTarget.getAttribute('page');
          if (numpage !== self._page) {
            $.concierge.trigger({ type: 'page_peek', value:numpage });
          }
        });

        self._v_margin =  parseInt($material.css('margin-bottom') +  parseInt($material.css('margin-top'), 10), 10);

      }

      self._render();
      $.concierge.logHistory('scrolling', ['u', self._id_source, self.element.scrollTop(), self.element.height(), self._scrollCounter++, self.element.children('.contents').height()].join(','));
    },

    _render: function () {
      /*
       * this is where we implement the caching strategy we want...
       */
      var p = this._page;
      this._render_one(p);
      if (p < this._model.o.file[this._id_source].numpages) {
        this._render_one(p + 1);
      }

      if (p > 1) {
        this._render_one(p - 1);
      }
    },

    _render_one: function (page) {
      var self    = this;
      var pages    = self._pages;

      //        var page    = self._page;
      if (page in pages) {
        return;
      }

      pages[page]    = true;
      self._draw_material(page);
      self._draw_selections(page);
    },

    _draw_material: function (page) {
      var self    = this;
      var res        = self._resolution;
      var scale    = self._scale;
      var id_source    = self._id_source;
      var w        = self._w;
      var h        = self._h;
      var style    = 'width: ' + w + 'px;height: ' + h + 'px';
      var src_pref    = self.options.img_server + '/pdf/cache2/' + res + '/' + scale + '/' + id_source + '?ckey=' + $.concierge.get_component('get_userinfo')().ckey + '&amp;page=';
      $('>div.contents>div.material[page=' + page + ']', self.element).each(function (j) {
        var $this    = $(this);
        var i        = $this.attr('page');
        $this.attr('style', style);
        $this.children('img.material').attr('src', src_pref + i);
      });
    },

    _draw_selections: function (page) {
      var self = this;
      var contents;
      var id_source = self._id_source;
      var model = this._model;
      var t, l, w, h, ID, locs, o, sel_contents;
      var s = ($.concierge.get_constant('res') * self._scale + 0.0) / ($.concierge.get_constant('RESOLUTION_COORDINATES') * 100);
      var file = model.o.file[id_source];
      var fudge = (file.rotation === 90 || file.rotation === 270 ? file.h : file.w) / 612.0;
      s = s * fudge; //BUG_226: for compatibility with old UI, but needs to be removed !!!
      contents = '';
      locs = model.get('location', { id_source: id_source, page: page }).sort(self.options.loc_sort_fct);
      var me =  $.concierge.get_component('get_userinfo')();
      for (var i = 0; i < locs.length; i++) {
        o = locs[i];
        ID = o.ID;
        t = o.top * s;
        l = o.left * s;
        w = o.w * s;
        h = o.h * s;
        sel_contents = '';
        if (!(model.get('comment', { ID_location: ID, admin: 1 }).is_empty())) {
          sel_contents += "<div class='nbicon adminicon' title='An instructor/admin has participated to this thread'/>";
        }

        if (!(model.get('comment', { ID_location: ID, id_author: me.id }).is_empty())) {
          if (model.get('comment', { ID_location: ID, type: 1 }).is_empty()) {
            sel_contents += "<div class='nbicon meicon' title='I participated to this thread'/>";
          }          else {
            sel_contents += "<div class='nbicon privateicon' title='I have private comments in this thread'/>";
          }
        }

        contents += ("<div class='selection' id_item='" + ID + "' style='top: " + t + 'px; left: ' + l + 'px; width: ' + w + 'px; height: ' + h + "px'>" + sel_contents + '</div>');
      }

      $('div.material[page=' + page + ']>div.selections',  self.element).html(contents).children('div.selection').mouseover(function (evt) {
        $.concierge.trigger({ type:'note_hover', value: evt.currentTarget.getAttribute('id_item') });
      }).mouseout(function (evt) {
        $.concierge.trigger({ type:'note_out', value: evt.currentTarget.getAttribute('id_item') });
      }).click(function (evt) {
        $.concierge.trigger({ type:'select_thread', value: evt.currentTarget.getAttribute('id_item') });
      });

      var sel = model.o.location[self._id_location];
      if (sel && sel.page === page) {//highlight selection
        $('div.selection[id_item=' + self._id_location + ']', self.element).addClass('selected');
      }
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
