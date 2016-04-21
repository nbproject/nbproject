/* notepaneView Plugin - Whole threads version
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
/*global jQuery:true */
(function ($) {
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _f_location_seen: function (id_location) {
      var self = this;
      return function () {
        var m        = self._model;
        var o        = m.get('comment', { ID_location: id_location }).items;
        var i;
        var new_seen    = {};
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
      var self        = this;
      self._pages        =  {}; //pages that have been rendered. By definition, in this particular view, we render one thread per page.
      self._maxpage        =  0; //last page that has been rendered
      self._page        =  null; //current page
      self._scrollTimerID    =  null;
      self._seenTimerID    = null;
      self._id_location    = null;
      self._rendered        = false;
      self._id_collection    =  null;
      self._collection    = null;
      self._location        = null; //selected location (might not be on current page)
      self._me        = null;

      self.element.addClass('notepaneView').addClass('threadview').append("<div class='splash'/><div class='notepaneView-header'></div><div class='notepaneView-pages'/>");
      $('div.splash', self.element).html($.concierge.get_component('splash_notepaneview')());
    },

    _defaultHandler: function (evt) {
      var self    = this;
      var sel, container, delta_top, delta_bottom, h, H, scrollby;
      switch (evt.type){
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
        var o = self._model.o.location[evt.value];
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
      case 'selection':
        var msg;
        var v = evt.value;
        sel = v.sel;
        var m = self._model;
        var id_source = v.files[sel[1] - 1].id;
        var id_author = v.users[sel[0] - 1].id;
        if (id_author + '_' + id_source in m.o.stat) {
          msg  = $.concierge.get_component('in_progress')();
        }        else {
          msg = "<div class='no-notes'>No comments have been made.</div>";
        }

        var $pane = $('div.notepaneView-pages', self.element).html(msg);
        /*
          $("div.notepaneView-header",self.element).empty();
        */
        var user = m.o.user[id_author];
        var file = m.o.file[id_source];
        var header = $('div.notepaneView-header', self.element).html("<div class='collectioninfo'> <span class='standout'>" + $.E(user.firstname + ' ' + user.lastname) + "</span> on <span class='standout'>" + $.E(file.title) + "</span> <span class='gradecontainer'><span class='gradeitem' id_item='4'>A</span> <span class='gradeitem' id_item='3'>B</span> <span class='gradeitem' id_item='2'>C</span> <span class='gradeitem' id_item='1'>D</span> <span class='gradeitem' id_item='0'>F</span>   </span> </div>");
        var grade = m.get('grade', { id_user: id_author, id_source:id_source }).first();
        var f_grade_click = function (event) {
          $.concierge.get_component('set_grade_assignment')({ grade: event.currentTarget.getAttribute('id_item'), id_user: id_author, id_source: id_source }, function (P) {
            m.add('grade', P.grades);
            $.I('grade added');
          });
        };

        if (grade !== null) {
          $('span.gradeitem[id_item=' + grade.grade + ']', header).addClass('selected');
        }

        $('span.gradeitem', header).click(f_grade_click);
      break;
      case 'collection':
        self._pages = {};
        self._maxpage = 0;
        self._page =  1;
        self._rendered = false;
        self.set_model(self._model);
      break;
      case 'proxy_keydown':
        var codes = { prev: -37, next: -39 };
        if (evt.value in codes) {
          self._keydown({ keyCode: codes[evt.value], charCode: 0 });
        }

      break;
      }
    },

    _commentlens: function (o) {
      var m = this._model;
      var meta = this._collection.meta;
      var replymenu, body;
      if (o.id_author === meta.id_user) {
        var bold_cl = m.get('seen', { id: o.ID }).is_empty() ? '' : 'note-bold';
        var admin_info = o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class'>&nbsp;</div> " : ' ';
        var me_info = (o.id_author === this._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> " : ' ';
        var type_info = '';
        if (o.type === 1) {
          type_info =  " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
        }        else if (o.type === 2) {
          type_info = " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
        }

        var author_name =  " <span class='author'>" + o.fullname + '</span> ';
        var creation_info = " <span class='created'> &ndash; " + (new Date(o.created * 1000)).toPrettyString() + '</span> ';
        replymenu = " <span class = 'replymenu clickable'>Reply</a> ";

        //            var optionmenu = " <a class='optionmenu' href='javascript:void(0)'>Actions</a> ";
        var optionmenu = '';
        body = o.body.replace(/\s/g, '') === '' ? "<span class='empty_comment'>Empty Comment</span>" : $.E(o.body).replace(/\n/g, '<br/>');
        return ["<div class='note-lens' id_item='", o.ID, "'><div class='lensmenu'>", replymenu, optionmenu, "</div><span class='note-body ", bold_cl, "'>", body, "</span><div class='authorship-info'>", author_name, admin_info, me_info, type_info, creation_info, '</div></div>'].join('');
      }      else {
        replymenu =  " <span class = 'replymenu-mini clickable'>Reply</span> ";
        body = o.body.replace(/\s/g, '') === '' ? "<span class='empty_comment'>Empty Comment</span>" : $.E($.ellipsis(o.body, 50));
        return "<div class='note-abridgedlens'  id_item='" + o.ID + "' title=\"" + $.E(o.body + ' [' + o.fullname + ']').replace(/"/g, "''") + "\"><div class='lensmenu'>" + replymenu + "</div><span class='abridged'>" + body + '</span></div>'; //"
      }
    },

    _comment_sort_fct: function (o1, o2) {return o1.ID - o2.ID;},

    _fill_tree: function (c) {
      var m = this._model;
      var $div = $("<div class='threadview-branch'>" + this._commentlens(c) + '</div>');
      var children = m.get('comment', { ID_location: c.ID_location, id_parent: c.ID }).sort(this._comment_sort_fct);
      for (var i = 0; i < children.length; i++) {
        $div.append(this._fill_tree(children[i]));
      }

      return $div;
    },

    _lens: function (l) {
      var m = this._model;
      var f_reply = function (event) {
        var id_item = $(event.target).closest('div.note-lens, div.note-abridgedlens').attr('id_item');
        $.concierge.trigger({ type: 'reply_thread', value: id_item });
      };

      var root = m.get('comment', { ID_location: l.ID, id_parent: null }).first();
      var loc_lens = $("<div class='location-lens' id_item='" + l.ID + "'/>");
      loc_lens.append(this._fill_tree(root));
      $('a.replymenu, a.replymenu-mini', loc_lens).click(f_reply);
      return loc_lens;
    },

    _keydown: function (event) {
      var code =  event.charCode || event.keyCode;  // since not every browser uses charCode or keyCode uniformly.
      var codes = { '-37': { sel: 'prev', no_sel: 'last', dir: -1, msg:'No more comments above...' }, '-39': { sel: 'next', no_sel:'first', dir: 1, msg:'No more comments below...' } };
      var translate_codes = { 44: -37, 46: -39, 60: -37, 62: -39, 188: -37, 190: -39 };
      var new_sel, id_item, id_new, new_page;
      var proxy_moving = { 37: 'move_left',
               39: 'move_right',
                     38: 'move_up',
                     40: 'move_down', };
      var proxy_grading = { 65:'grade_A', 66:'grade_B', 67:'grade_C', 68:'grade_D', 70:'grade_F', 97:'grade_A', 98:'grade_B', 99:'grade_C', 100:'grade_D', 102:'grade_F' };

      if (event.shiftKey || event.altKey || event.ctrlKey) {
        // We aren ot expecting shift, alt, or ctrl with our key codes, so we let others handle this
        return true;
      }

      if (code in translate_codes) {
        code = translate_codes[code];
      }

      if (code in codes) {
        var sel = $('div.location-lens.selected', this.element);
        if (sel.length) {
          new_page =  this._collection.index[this._location.ID] + 1 + codes[code].dir;
          if (new_page === 0 || new_page > this._collection.items.length) {
            $.I(codes[code].msg);
          }          else {
            $.concierge.trigger({ type:'select_thread', value: this._collection.items[new_page - 1] });
          }
        }        else { // no selection on the page
          new_sel = codes[code].no_sel === 'first' ? 0 :  this._collection.items.length - 1;
          $.concierge.trigger({ type:'select_thread', value: this._collection.items[new_sel] });

          //        new_sel.click();
        }

        return false;
      }      else if (code in proxy_moving) {
        $.concierge.trigger({ type: 'proxy_keydown', value: proxy_moving[code] });
      }      else if (code in proxy_grading) {
        $.concierge.trigger({ type: 'proxy_keydown', value: proxy_grading[code] });
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
      var m = this._model;
      var meta = this._collection.meta;
      var user = m.o.user[meta.id_user];
      var file = m.o.file[meta.id_source];
      /*
      var header = $("div.notepaneView-header", this.element).html("<div class='collectioninfo'> <span class='standout'>"+$.E(user.firstname + " " + user.lastname)+"</span> on <span class='standout'>" +$.E(file.title)+"</span> <span class='gradecontainer'><span class='gradeitem' id_item='4'>A</span> <span class='gradeitem' id_item='3'>B</span> <span class='gradeitem' id_item='2'>C</span> <span class='gradeitem' id_item='1'>D</span> <span class='gradeitem' id_item='0'>F</span>   </span> </div>");
      var grade = m.get("grade", {id_user: meta.id_user, id_source:meta.id_source}).first();
      var f_grade_click = function(event){
      $.concierge.get_component("set_grade_assignment")({grade: event.currentTarget.getAttribute("id_item"), id_user: meta.id_user, id_source: meta.id_source}, function(P){
          m.add("grade", P.grades);
          $.I("grade added");
          });
      };
      if (grade !== null){
      $("span.gradeitem[id_item="+grade.grade+"]", header).addClass("selected");
      }
      $("span.gradeitem", header).click(f_grade_click);
      */
      var grade = m.get('grade', { id_user: meta.id_user, id_source:meta.id_source }).first();
      if (grade !== null) {
        var header = $('div.notepaneView-header', this.element);
        $('span.gradeitem', header).removeClass('selected');
        $('span.gradeitem[id_item=' + grade.grade + ']', header).addClass('selected');
      }

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
        var id_location = self._collection.items[page - 1];
        var o = model.o.location[id_location];
        $pane.append(self._lens(o));
        var loc_lens = $('div.location-lens', $pane).click(self._f_location_click).mouseenter(self._f_location_hover).mouseleave(self._f_location_out).addClass(page % 2 ? 'lens-even' : 'lens-odd');
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
      model.register($.ui.view.prototype.get_adapter.call(this),  { grade: null, comment: null });
      $('div.splash', self.element).hide();

      //make placeholders for each page:
      self._collection = $.concierge.get_component('get_collection')();
      var items = self._collection.items;
      self._me =  $.concierge.get_component('get_userinfo')();
      var $pane = $('div.notepaneView-pages', self.element).empty();
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

      if (this._page === null) {
        this._page = 1;
      }

      if (items.length > 0) {
        this._update();
        this._render();
      }
    },

    _update: function () {
      $.ui.view.prototype._update.call(this);
    },

    update: function (action, payload, items_fieldname) {
      if (action === 'add' && this._rendered) {
        if (items_fieldname === 'grade') {
          this._render();
        }        else if (items_fieldname === 'comment') {
          this._pages = {};
          this._render();
        }
      }
    },
  });
  $.widget('ui.notepaneView', V_OBJ);
  $.ui.notepaneView.prototype.options = {
    loc_sort_fct: function (o1, o2) {return o1.top - o2.top;},

    expand: 'div.notepaneView-pages',
    listens: {
      select_thread: null,
      keydown: null,
      collection: null,
      selection: null,
      proxy_keydown: null,
    },
  };
})(jQuery);
