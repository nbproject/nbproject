/* notepaneView Plugin - Collage view version
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
    _f_location_seen: function (id_location) {
      var self = this;
      return function () {
        var m = self._model;
        var o = m.get('comment', { ID_location: id_location }).items;
        var i;
        var new_seen = {};
        for (i in o) {
          if (!(i in m.o.seen)) {
            new_seen[i] = { id: i, id_location: id_location };
            $.concierge.logHistory('seen', i);
          }
        }

        self._model.add('seen', new_seen);
      };
    },

    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self._pages =  {}; //pages that have been rendered
      self._maxpage =  0; //last (i.e. max page number of) page that has been rendered
      self._page =  null; //current page
      self._scrollTimerID    =  null;
      self._seenTimerID    = null;
      self._id_location    = null;
      self._rendered        = false;
      self._id_collection =  null;
      self._collection = null;
      self._location = null; //selected location (might not be on current page)

      self.element.addClass('notepaneView').append("<div class='notepaneView-header'></div><div class='notepaneView-pages'/>");
    },

    _defaultHandler: function (evt) {
      var self    = this;
      var sel, container, delta_top, delta_bottom, o, h, H, scrollby;
      switch (evt.type){
      case 'page':
        if (self._page !== parseInt(evt.value, 10)) {
          self._page =  parseInt(evt.value, 10);
          self._render();
          container = $('div.notepaneView-pages', self.element);
          sel = $('div.notepaneView-comments[page=' + evt.value + ']', self.element);
          delta_top = sel.offset().top - container.offset().top;
          container.stop(true).animate({ scrollTop: (delta_top > 0 ? '+=' + delta_top : '-=' + (-delta_top))  + 'px' }, 300);
        }

      break;
      case 'note_hover':
        $('div.location-lens[id_item=' + evt.value + ']', self.element).addClass('hovered');
      break;
      case 'note_out':
        $('div.location-lens[id_item=' + evt.value + ']', self.element).removeClass('hovered');
      break;
      case 'select_thread':
        self._id_location = evt.value;
        if (self._seenTimerID !== null) {
          window.clearTimeout(self._seenTimerID);
        }

        self._seenTimerID = window.setTimeout(self._f_location_seen(self._id_location), 1000);
        o = self._model.o.location[evt.value];
        if (self._location === null || o.ID !== self._location.ID) {
          self._location = o;
          self._page =  self._collection.index[o.ID] + 1;
          self._render();
        }

        $('div.location-lens', self.element).removeClass('selected');
        sel = $('div.location-lens[id_item=' + evt.value + ']', self.element).addClass('selected');
        container = $('div.notepaneView-pages', self.element);
        if (sel.length > 0) {

          h = sel.height();
          H = container.height();
          delta_top = sel.offset().top - container.offset().top;
          delta_bottom = delta_top + h - H;
          if (delta_top > 0) { //we're not too high
            if (delta_bottom > 0) {//but we're too low... recenter
              scrollby = delta_bottom + H / 2 - h; //delta_bottom is how much to scroll so that bottom of lens coincides with bottom of widget.
              container.stop(true).animate({ scrollTop: '+=' + scrollby  + 'px' }, 300);
            }
          }          else { //too high: recenter:
            scrollby = delta_top + (h - H) / 2;
            container.stop(true).animate({ scrollTop: '+=' + scrollby + 'px' }, 300);
          }
        }

      break;
      case 'keydown':
        self._keydown(evt.value);
      break;
      }
    },

    _lens: function (l) {
      var m = this._model;
      var numnotes = m.get('comment', { ID_location: l.ID }).length();
      var numseen = m.get('seen', { id_location: l.ID }).length();
      var numnew    = numnotes - numseen;
      var me = $.concierge.get_component('get_userinfo')();
      var lf_numnotes =  "<ins class='locationflag " + (numnew > 0 ? 'lf-numnewnotes' : 'lf-numnotes') + "'>" + numnotes + '</ins>';
      var lf_admin    = m.get('comment', { ID_location: l.ID, admin:1 }).is_empty() ? '' : "<ins class='locationflag'><div class='nbicon adminicon' title='An instructor/admin has participated to this thread'>&nbsp;</div></ins>";
      var lf_me_private =  m.get('comment', { ID_location: l.ID, id_author:me.id }).is_empty() ? '' : (m.get('comment', { ID_location: l.ID, type:1 }).is_empty() ?  "<ins class='locationflag'><div class='nbicon meicon' title='I participated to this thread'/></ins>" : "<ins class='locationflag'><div class='nbicon privateicon' title='I have private comments in  this thread'/></ins>");
      var bold_cl    = numnew > 0 ? 'location-bold' : '';
      var root =  m.get('comment', { ID_location: l.ID, id_parent: null }).first();
      var body = root.body.replace(/\s/g, '') === '' ? "<span class='empty_comment'>Empty Comment</span>" : $.E(root.body.substring(0, 200));
      return "<div class='location-flags'>" + lf_numnotes + lf_admin + lf_me_private + "</div><div class='location-shortbody'><div class='location-shortbody-text " + bold_cl + "'>" + body + '</div></div>';
    },

    _keydown: function (event) {
      var codes = { 37: { sel: 'prev', no_sel: 'last', dir: -1, msg:'No more comments above...' }, 39: { sel: 'next', no_sel:'first', dir: 1, msg:'No more comments below...' } };
      var new_sel, id_item, id_new, new_page;

      if (event.shiftKey || event.altKey || event.ctrlKey) {
        // We aren ot expecting shift, alt, or ctrl with our key codes, so we let others handle this
        return true;
      }

      if (event.keyCode in codes) {
        var sel = $('div.location-lens.selected', this.element);
        if (sel.length) {
          new_page =  this._collection.index[this._location.ID] + 1 + codes[event.keyCode].dir;
          if (new_page === 0 || new_page > this._collection.items.length) {
            $.I(codes[event.keyCode].msg);
          }          else {
            $.concierge.trigger({ type:'select_thread', value: this._collection.items[new_page - 1] });
          }
        }        else { // no selection on the page
          new_sel = codes[event.keyCode].no_sel === 'first' ? 0 :  this._collection.items.length - 1;
          $.concierge.trigger({ type:'select_thread', value: this._collection.items[new_sel] });

          //        new_sel.click();
        }

        return false;
      }      else {
        return true; // let the event be captured for other stuff
      }

      //        $.L("keypressed");
    },

    _f_location_click: function (event) {
      var id_item = event.currentTarget.getAttribute('id_item');
      $.concierge.trigger({ type:'select_thread', value: id_item });
    },

    _f_location_hover: function (event) {
      var id_item = event.currentTarget.getAttribute('id_item');
      $.concierge.trigger({ type:'note_hover', value: id_item });
    },

    _f_location_out: function (event) {
      var id_item = event.currentTarget.getAttribute('id_item');
      $.concierge.trigger({ type:'note_out', value: id_item });
    },

    _render: function () {
      /*
       * this is where we implement the caching strategy we want...
       */

      //first, render the current page...

      //        var f = this._model.o.file[ this._id_source];
      var items = this._collection.items;
      var p = this._page;
      var p_after = p;
      var p_before = p;
      this._render_one(p);

      //estimate how much space taken by annotations, and render 120% of a whole screen of them if not enough on current page
      var container =     $('div.notepaneView-pages', this.element);
      while (container.children().last().offset().top - container.offset().top < 1.2 * container.height()) {
        p_after++;
        if (p_after <= items.length) {
          this._render_one(p_after);
        }

        p_before--;
        if (p_before > 0) {
          this._render_one(p_before);
        }

        if (p_before < 1 && p_after >= items.length) {
          //There's just not enough annotations to render a whole screen
          return;
        }
      }
    },

    _render_one: function (page) {
      if (page > this._maxpage) {
        this._maxpage =  page;
      }

      if (!(page in this._pages)) {
        var self    = this;
        var model    = self._model;
        var $pane    = $('div.notepaneView-comments[page=' + page + ']', self.element).empty();

        //            var locs    = model.get("location", {id_source:  this._id_source, page: page }).sort(self.options.loc_sort_fct);
        var id_location = self._collection.items[page - 1];
        var o = model.o.location[id_location];
        $pane.append("<div class='location-lens' id_item='" + o.ID + "'>" + self._lens(o) + '</div>');
        $('div.location-lens', $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).removeClass('lens-odd').filter(':odd').addClass('lens-odd');
        self._pages[page] = true;
        this._rendered = true;
      }

      this._rendered = true;
    },

    set_model: function (model) {
      var self = this;
      self._model =  model;
      var id_collection = $.concierge.get_state('collection');
      self._id_collection =  id_collection;

      //        var id_source = $.concierge.get_state("file");
      //        self._id_source =  id_source ;
      model.register($.ui.view.prototype.get_adapter.call(this),  { location: null, seen: null });

      //make placeholders for each page:
      self._collection = $.concierge.get_component('get_collection')();
      var items = self._collection.items;

      //var f = model.o.file[id_source];
      var $pane = $('div.notepaneView-pages', self.element);
      $pane.scroll(function (evt) {
        var timerID = self._scrollTimerID;
        if (timerID !== null) {
          window.clearTimeout(timerID);
        }

        timerID = window.setTimeout(function () {
          //Are we within 20px from the bottom of scrolling ?
          while ($pane.children().last().offset().top - $pane.offset().top - $pane.height() < 20) {
            var maxpage = self._maxpage;
            $.L('scroll: maxpage=' + maxpage);
            if (maxpage < items.length) {
              self._render_one(maxpage + 1);
            }            else {
              return; //last page has been rendered.
            }
          }
        }, 300);

        self._scrollTimerID =  timerID;

      });

      for (var i = 1; i <= items.length; i++) {
        $pane.append("<div class='notepaneView-comments' page='" + i + "'/>");
      }

      this._update();
      if (this._page === null) {
        this._page = 1;
      }

      if (items.length > 0) {
        this._render();
      }
    },

    update: function (action, payload, items_fieldname) {
      var i, D, loc, pages_done, id_source, page, pages, pages_to_render;
      if (action === 'add' && items_fieldname === 'location') {
        var id_collection    = this._id_collection;
        page        = this._page;
        if (page === null || id_collection === null) {
          //initial rendering: Let's render the first page. We don't check the id_collection here since other documents will most likely have their page variable already set.
          this._page =  1;
          this._pages = {};
          this._maxpage = 0;
          this._render();

          //TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already.
        }        else {
          //send signal to redraw pages that needs to be redrawn:
          D        = payload.diff;
          pages    = this._pages;
          var do_render_now = false;
          for (i in D) {
            delete pages[D[i].page];
            if (page === D[i].page) {
              do_render_now = true;
            }
          }

          if (do_render_now) {
            this._maxpage = 0;
            this._render();//re-render now if al least one note on active page
          }
        }
      }      else if (action === 'add' && items_fieldname === 'seen' && this._rendered) {
        D        = payload.diff;
        var m        = this._model;

        var locs_done = {};
        for (i in D) {
          loc = m.get('location', { ID: D[i].id_location }).first();
          if (loc !== null  && (!(loc.ID in locs_done))) {
            locs_done[loc.ID] = null;
            $('div.location-lens[id_item=' + loc.ID + ']', this.element).html(this._lens(loc));
          }
        }
      }      else if (action === 'remove' && items_fieldname === 'location') { //just re-render the pages where locations were just removed.
        D        = payload.diff;
        pages_done    = {};

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
  });
  $.widget('ui.notepaneView', V_OBJ);
  $.ui.notepaneView.prototype.options = {
    loc_sort_fct: function (o1, o2) {return o1.top - o2.top;},

    expand: 'div.notepaneView-pages',
    listens: {
      page: null,
      note_hover: null,
      note_out: null,
      select_thread: null,
      keydown: null,
    },
  };
})(jQuery);
