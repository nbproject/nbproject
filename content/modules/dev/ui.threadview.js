/* threadview Plugin
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
/*global jQuery:true confirm:true*/
(function ($) {
  var V_OBJ = $.extend({}, $.ui.view.prototype, {
    _create: function () {
      $.ui.view.prototype._create.call(this);
      var self = this;
      self._location =  null;

      //SACHA: FIXME (HACK) the 2 vars below are needed in order to defer rendering if code hasn't been loaded yet. For instance, when we have ?c=id_comment in the URL
      self._ready = false;
      self._doDelayedRender = false;
      self._STAR = null;
      self._QUESTION = null;

      /*
        self.element.addClass("threadview").append("<div class='threadview-header'><button action='prev'>Prev</button> <button action='next'>Next</button> </div><div class='threadview-pane'/>");

        $("button[action=prev]", self.element).click(function(){
        alert("todo");
        });
        $("button[action=next]", self.element).click(function(){
        alert("todo");
        });
      */
      self.element.addClass('threadview').append("<div class='threadview-header'><div class='threadview-header-sectioninfo'/><div class='threadview-filter-controls'> <div class='nbicon questionicon' /><button class='mark-toggle' arg='add' action='question'>+</button><span class='n_question'>...</span><button class='mark-toggle' arg='remove' action='question'>-</button> <span id='thread_request_reply'>replies requested</span>  <!--<button class='mark-toggle' action='star'><div class='nbicon staricon-hicontrast' /><span class='n_star'>...</span><span id='thread_mark_favorite'>Mark as Favorite.</span></button>--></div></div><div class='threadview-pane'/>");
      var star_button = $('button.mark-toggle[action=star]', self.element).click(function (event) {
        var comment_id = self._model.get('comment', { ID_location: self._location, id_parent: null }).first().ID;
        $.concierge.get_component('mark_thread')({ comment_id: comment_id, id_location: self._location, type: self._STAR }, function (p) {
          self._model.add('threadmark', p.threadmarks);
          var i, tm;
          for (i in p.threadmarks) {
            tm = p.threadmarks[i];
            $.I('Thread #' + tm.location_id + ' has been ' + (tm.active ? '' : 'un') + 'marked as favorite.');
          }
        });
      });

      var question_button = $('button.mark-toggle[action=question]', self.element).click(function (event) {
        //var comment_id = event.target.getAttribute("arg")=="remove" ? null : self._model.get("comment", {ID_location: self._location, id_parent: null }).first().ID;
        var comment_id = self._model.get('comment', { ID_location: self._location, id_parent: null }).first().ID;
        var active =  event.target.getAttribute('arg') !== 'remove';
        $.concierge.get_component('mark_thread')({ active: active, comment_id: comment_id, id_location: self._location, type: self._QUESTION }, function (p) {
          self._model.add('threadmark', p.threadmarks);
          var i, tm;
          for (i in p.threadmarks) {
            tm = p.threadmarks[i];
            $.I('Thread #' + tm.location_id + ' has been ' + (tm.active ? '' : 'un') + "marked as 'Reply Requested'.");
          }
        });
      });

      //splash screen:
      $('div.threadview-pane', self.element).append($.concierge.get_component('mini_splashscreen')());
      $('div.threadview-header', self.element).hide();
      self._ready = true;
      if (self._doDelayedRender) {
        self._render();
      }

      var builder = function ($trigger, e) {

        var item_object = self._context_build.call(self, $trigger, e);

        return {
          callback: function (key, options) {
            // we use 'call' and supply 'self' so that _context
            // will use 'self' as 'this', not the context menu.
            self._context_callback.call(self, this, key, options);
          },

          items: item_object,
        };
      };

      // Declare Threadview Context Menu
      $.contextMenu({
        selector: 'div.note-lens',
        build: builder,
      });
      $.contextMenu({
        selector: '.optionmenu',
        trigger: 'left',
        build: builder,
      });

    },

    _defaultHandler: function (evt) {
      if (this._file ===  $.concierge.get_state('file')) {
        switch (evt.type){
        case 'select_thread':
          this._location =  evt.value;
          this._render();
        break;
        case 'foo':
        break;
        }
      }
    },

    _commentLabelsFactory: function (o, scope) {
      //o: comment for which to draw labels
      //scope:
      //  1 to draw them for the specified comment
      //  2 to draw them for the whole thread.
      var self = this;
      var m = self._model;
      if (self.options.commentLabels) {
        var cl_container = ["<div style='position: relative'><div class='commentlabel_container' scope='" + scope + "' id_item='" + o.ID + "'>"];
        var cats = m.get('labelcategory', { scope: scope }).items;
        var i, j, label, tags = [], cat, caption;

        //tags are categories for which pointgrade=2: we just want to display the tag,
        //instead of displaying the name and the list of grades, we just want to display the name and whether it's toggled or not.
        for (i in cats) {
          cat = cats[i];
          if (cat.pointscale === 2) {
            tags.push(i);
          }          else {
            label = m.get('commentlabel', { comment_id: o.ID, category_id: cat.id }).first();
            cl_container.push("<div class='commentlabel_cat' id_item='" + i + "'><div class='cat_name'>" + $.E(cat.name) + '</div>');
            for (j = 0; j < cat.pointscale; j++) {
              try {
                caption = m.get('labelcategorycaption', { category_id: cat.id, grade: j }).first().caption;
              }catch (e) {
                caption = j;
              }

              cl_container.push("<span class='cat_elt" + ((label !== null && label.category_id === cat.id &&  label.grade === j) ? ' selected' : '') + "' val='" + j + "'>" + caption + '</span>');
            }

            cl_container.push('</div>');
          }
        }

        //now display tags:
        cl_container.push('<div>');
        for (j = 0; j < tags.length; j++) {
          cat = cats[tags[j]];
          label = m.get('commentlabel', { comment_id: o.ID, category_id: cat.id }).first();
          cl_container.push("<span id_item='" + tags[j] + "' class='tag cat_elt" + ((label !== null && label.category_id === cat.id &&  label.grade === 1) ? ' selected' : '') + "'>" + $.E(cat.name) + '</span>');

        }

        cl_container.push('</div>');
        cl_container.push('</div></div>');
        return cl_container.join('');
      }

      return '';
    },

    _lens: function (o) {
      var self        = this;
      var m            = self._model;
      var bold_cl        = (m.get('seen', { id: o.ID }).is_empty() === false || o.id_author === self._me.id) ? '' : 'note-bold';
      var admin_info        = o.admin ? " <div class='nbicon adminicon'  title='This user is an instructor/admin for this class' /> " : ' ';
      var me_info        = (o.id_author === self._me.id) ? " <div class='nbicon meicon' title='I am the author of this comment'/> " : ' ';
      var question_info_me    = (m.get('threadmark', { comment_id: o.ID, user_id: self._me.id, active: true, type: self._QUESTION }).is_empty()) ? ' ' : " <div class='nbicon questionicon-hicontrast' title='I am requesting a reply on this comment'/> ";

      var tms            = m.get('threadmark', { comment_id: o.ID,  active: true, type: self._QUESTION });
      var tms_me        = tms.intersect(self._me.id, 'user_id');
      var tms_me_label    = tms_me.is_empty() ? '' : ', including mine';
      var tms_me_class    = tms_me.is_empty() ? '' : 'active';
      var question_info    = tms.is_empty()  ? ' ' : "<div class='stat-count " + tms_me_class + "' title='" + tms.length() + ' ' + $.pluralize(tms.length(), 'replies', 'reply') + ' requested on this comment' + tms_me_label + " '><div class='nbicon questionicon' /> " + tms.length() + ' </div>';

      var type_info        = '';
      if (o.type === 1) {
        type_info        = " <div class='nbicon privateicon' title='[me] This comment is private'/> ";
      }      else if (o.type === 2) {
        type_info        = " <div class='nbicon stafficon' title='[staff] This comment is for Instructors and TAs'/> ";
      }

      var author_name;
      if (!o.signed && self.is_admin) {
        author_name = " <span class='author author-revealed' title='anonymous comment'>" + o.fullname + '</span> ';
      } else {
        author_name = " <span class='author'>" + o.fullname + '</span> ';
      }

      var creation_info = " <span class='created'> &#8211; " + (new Date(o.created * 1000)).toPrettyString() + '</span> '; //xml doctype rejects &ndash;
      var replymenu        = "<span class='replymenu clickable'><span class='nbicon replyicon' title='Reply' /></span>";
      var optionmenu       = " <span class='optionmenu clickable'><span title='Actions'>&#183;&#183;&#183;</span></span> "; //xml doctype rejects &middot;
      var url_regex = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig;
      var body        = o.body.replace(/\s/g, '') === '' ? "<span class='empty_comment'>Empty Comment</span>" : $.E(o.body).replace(/\n/g, '<br/>').replace(url_regex, '<a href="$1">$1</a>');
      var commentlabels = self._commentLabelsFactory(o, 1);

      return ["<div class='note-lens ", tms.is_empty() ? '' : 'replyrequested', "' id_item='", o.ID, "'><div class='lensmenu'>", replymenu, optionmenu, '</div>', commentlabels, "<span class='note-body ", bold_cl, "'>", body, "</span><div class='authorship-info'>", author_name, admin_info, me_info, question_info, type_info, creation_info, '</div>', '</div>'].join('');
    },

    _comment_sort_fct: function (o1, o2) {return o1.ID - o2.ID;},

    _fill_tree: function (m, c) {
      var $div = $("<div class='threadview-branch'>" + this._lens(c) + '</div>');
      var children = m.get('comment', { ID_location: c.ID_location, id_parent: c.ID }).sort(this._comment_sort_fct);
      for (var i = 0; i < children.length; i++) {
        $div.append(this._fill_tree(m, children[i]));
      }

      return $div;
    },

    _render_header: function () {
      var self = this;
      var header = $('div.threadview-header', self.element);
      var m = self._model;
      var tm_star = m.get('threadmark', { location_id: self._location, active:true, type: self._STAR });
      var tm_star_me = m.get('threadmark', { location_id: self._location, active:true, type: self._STAR, user_id: self._me.id });
      var tm_question = m.get('threadmark', { location_id: self._location, active:true, type: self._QUESTION });
      var tm_question_me = m.get('threadmark', { location_id: self._location, active:true, type: self._QUESTION, user_id: self._me.id });
      var buttons = $('button.mark-toggle', header).removeClass('active');
      if (tm_star_me.length() > 0) {
        buttons.filter('[action=star]', header).addClass('active');
      }

      $('span.n_star', header).text(tm_star.length());
      if (tm_question_me.length() > 0) {
        buttons.filter('[action=question][arg=add]').attr('disabled', 'disabled');
        buttons.filter('[action=question][arg=remove]').removeAttr('disabled');
      }      else {
        buttons.filter('[action=question][arg=remove]').attr('disabled', 'disabled');
        buttons.filter('[action=question][arg=add]').removeAttr('disabled');
      }

      $('span.n_question', header).text(tm_question.length());
      $('#thread_request_reply').text($.pluralize(tm_question.length(), 'replies requested', 'reply requested'));

      //indicate the section name if this thread is section-based:
      var section_header =  $('.threadview-header-sectioninfo', header);
      section_header.text('');
      var section_id = m.o.location[self._location].section_id;
      if (section_id !== null) {
        var section = m.o.section[section_id];
        if (section) {
          section_header.text(section.name);
        }
      }
    },

    _context_build: function (el, event) {
      var self = this;
      var id_item = el.closest('div.note-lens').attr('id_item');
      var m = self._model;
      var c = m.o.comment[id_item];

      var items = {
        thanks: { name: 'That helped. Thanks!', icon: 'thanks' },
        edit: { name: 'Edit', icon: 'edit' },
        reply: { name: 'Reply', icon: 'reply' },
        sep1: '---------',
        question: { name: 'Request a reply', icon: 'question' },
        noquestion: { name: "Remove 'reply requested'", icon: 'noquestion' },
        star: { name: 'Mark as favorite', icon: 'star' },
        nostar: { name: 'Remove from favorites', icon: 'nostar' },
        sep2: '---------',
        delete: { name: 'Delete', icon: 'delete' },
      };

      //edit and delete:
      if ((c.id_author !== self._me.id) || (!(m.get('comment', { id_parent: id_item }).is_empty()))) {
        delete items['edit'];
        delete items['delete'];
      }

      //star and question:
      var tms_location = m.get('threadmark', { location_id: c.ID_location, user_id: self._me.id, active: true, type: self._QUESTION });
      var tms_comment = tms_location.intersect(c.ID, 'comment_id');

      //is this one of my active questions: if so, hide context.question
      if (tms_comment.is_empty()) {
        delete items['noquestion'];
      } else {
        delete items['question'];
      }

      if (m.get('threadmark', { comment_id: c.ID, user_id: self._me.id, active: true, type:self._STAR }).is_empty()) {
        delete items['nostar'];
      } else {
        delete items['star'];
      }

      // can't thank a comment for which I'm the author or where I haven't
      // any replyrequested or which was authored before the comment I
      // marked as "reply requested".
      if (tms_location.is_empty() || c.id_author === self._me.id || tms_comment.is_empty() || tms_comment.first().comment_id >= c.ID) {
        delete items['thanks'];
      }

      return items;
    },

    _on_delete: function (p) {
      var self = this;
      var model = self._model;
      var c = model.o.comment[p.id_comment];

      $.I('Note #' + p.id_comment + ' has been deleted');
      model.remove('comment', p.id_comment);

      if (c.id_parent === null) {
        model.remove('location', c.ID_location);

        // model.remove("html5location", c.ID_location); FIXME: This is not working, but it should.
      } else {
        //we force an update of locations in case some styling needs to be changed.
        var locs = {};
        locs[c.ID_location] = model.o.location[c.ID_location];
        model.add('location', locs);
      }
    },

    _context_callback: function (el, action, options) {
      var self = this;
      var $el = $(el);
      var $note = $el.closest('div.note-lens');
      var id_item = $note.attr('id_item');

      switch (action) {
      case 'reply':
        $.concierge.trigger({ type: 'reply_thread', value: id_item });
      break;
      case 'edit':
        $.concierge.trigger({ type: 'edit_thread', value: id_item });
      break;
      case 'question':
      case 'noquestion':
        $.concierge.get_component('mark_thread')({
          id_location: self._location,
          type: self._QUESTION,
          comment_id: id_item,
        }, function (p) {
          self._model.add('threadmark', p.threadmarks);
          var i, tm;
          for (i in p.threadmarks) {
            tm = p.threadmarks[i];
            $.I('Comment #' + tm.comment_id + ' has been ' + (tm.active ? '' : 'un') + "marked as 'Reply Requested'.");
          }
        });

      break;
      case 'star':
      case 'nostar':
        $.concierge.get_component('mark_thread')({
          id_location: self._location,
          type: self._STAR,
          comment_id: id_item,
        }, function (p) {
          self._model.add('threadmark', p.threadmarks);
          var i, tm;
          for (i in p.threadmarks) {
            tm = p.threadmarks[i];
            $.I('Comment #' + tm.comment_id + ' has been ' + (tm.active ? '' : 'un') + 'marked as favorite.');
          }
        });

      break;
      case 'thanks':
        $.L('TODO: ' + action);
      break;
      case 'delete':
        if (confirm('Are you sure you want to delete this note ?')) {
          $.concierge.get_component('note_deleter')({ id_comment: id_item }, self._on_delete);
        }

      break;
      }
    },

    _render: function () {
      var self    = this;
      self._me =  $.concierge.get_component('get_userinfo')();
      if (self._ready === false) {
        self._doDelayedRender = true;
        return;
      }

      var model    = self._model;
      self.is_admin    = model.get('ensemble', {}).first().admin;
      $('div.threadview-header', self.element).show();
      self._render_header();
      var $pane    = $('div.threadview-pane', self.element).empty();
      var root    = model.get('comment', { ID_location: self._location, id_parent: null }).first();
      if (root === undefined) { //happens after deleting a thread that only contains 1 annotation
        return;
      }

      $pane.append(this._commentLabelsFactory(root, 2));
      $pane.append(this._fill_tree(model, root));
      var f_reply = function (event) {
        var id_item = $(event.target).closest('div.note-lens').attr('id_item');
        $.concierge.trigger({ type: 'reply_thread', value: id_item });
      };

      var f_comment_label = function (event) {
        var t = $(event.target),
            comment_id = parseInt(t.closest('div.commentlabel_container').attr('id_item'), 10), grade, category_id;
        if (t.hasClass('cat_elt')) {
          if (t.hasClass('tag')) {
            grade = t.hasClass('selected') ? 0 : 1; //toggle
            category_id = parseInt(t.attr('id_item'), 10);
          }          else {
            grade = parseInt(t.attr('val'), 10);
            category_id = parseInt(t.parent().attr('id_item'), 10);
          }

          $.concierge.get_component('set_comment_label')({ grade: grade, category_id:category_id, comment_id:comment_id }, function (P) {
            var m    = self._model;
            m.add('commentlabel', P.commentlabels);
          });
        }
      };

      $('.replymenu', $pane).click(f_reply);
      $('div.commentlabel_container', $pane).click(f_comment_label);
    },

    set_model: function (model) {
      var self = this;
      self._model =  model;
      self._me = null;
      var id_source = $.concierge.get_state('file');
      self._file =  id_source;
      self._QUESTION = $.concierge.get_constant('QUESTION');
      self._STAR = $.concierge.get_constant('STAR');
      model.register($.ui.view.prototype.get_adapter.call(this),  { comment: null, threadmark: null, commentlabel: null });
    },

    _keydown: function (event) { // same as ui.noteview8.js
      //just proxy to other view if any interested.
      $.concierge.trigger({ type: 'keydown', value: event });
      return true;
    },

    update: function (action, payload, items_fieldname) {
      if ((action === 'add' || action === 'remove') && (items_fieldname === 'comment' || items_fieldname === 'threadmark' || items_fieldname === 'commentlabel') && this._location) {
        this._render();
      }
    },
  });

  $.widget('ui.threadview', V_OBJ);
  $.ui.threadview.prototype.options = {
    loc_sort_fct: function (o1, o2) {return o1.top - o2.top;},

    listens: {
      select_thread: null,
    },
    commentLabels: false,
  };
})(jQuery);
