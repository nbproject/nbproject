/* treeView Plugin
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
      var self    = this;
      self._model    = null;
      self._selection = {};
      self._admin    = self.options.admin;
      self.element.css('overflow-y', 'auto').html("<div class='tree'/>");
    },

    _defaultHandler: function (evt) {
      var self = this;
      var tree;

      // by default we listen to events directed to everyone
      switch (evt.type){
        case 'ensemble':
          tree = $('div.jstree');
          if (self._selection.rel !== 'ensemble' || self._selection.id_item !== evt.value) {
            tree.jstree('deselect_all');
            tree.jstree('select_node', $('li[rel=ensemble][id_item=' + evt.value + ']'));
          }

        break;
        case 'folder':
          tree = $('div.jstree');
          if (self._selection.rel !== 'folder' || self._selection.id_item !== evt.value) {
            tree.jstree('deselect_all');
            tree.jstree('select_node', $('li[rel=folder][id_item=' + evt.value + ']'));
          }

        break;
        case 'file':
          tree = $('div.jstree');
          if (self._selection.rel !== 'file' || self._selection.id_item !== evt.value) {
            tree.jstree('deselect_all');
            tree.jstree('select_node', $('li[rel=file][id_item=' + evt.value + ']'));
          }

        break;
      }
    },

    set_model: function (model) {
      var self = this;
      self._model =  model;
      model.register($.ui.view.prototype.get_adapter.call(this),  { folder: null, ensemble: null });
      self._render();
    },

    _f_sort_tree: function (a, b) {
      if (a.attr.rel === 'ensemble' && a.attr.id_item === 0) {
        return -1;
      } else if (b.attr.rel === 'ensemble' && b.attr.id_item === 0) {
        return 1;
      } else if (a.attr.rel === 'ensemble' && b.attr.rel === 'ensemble') {
        return a.data.title < b.data.title ? -1 : 1;
      } else if (a.attr.rel === 'ensemble' && b.attr.rel !== 'ensemble') {
        return -1;
      }

      return a.data > b.data ? 1 : -1;
    },

    _render: function () {
      var self = this;
      var model = self._model;

      //build view:
      var params =  self.options.admin ? { admin: true } : {};
      var ensemble = model.get('ensemble', params).items;
      var data = [];
      var subfolders = null;
      var subfiles = null;
      var children = null;
      var s_numfiles = null;
      var qry = null;
      for (var i in ensemble) {
        children = [];
        subfolders  = model.get('folder', { id_ensemble: i }).items;
        subfiles = model.get('file', { id_ensemble: i }).items;

        for (var j in subfolders) {
          if (subfolders[j].id_parent == null) {
            s_numfiles = (self.options.filestats) ? " <span class='numfiles'>" + model.get('file', { id_folder: j }).length() + '</span>' : '';
            children.push({
              data: $.E(subfolders[j].name) + s_numfiles,
              attr: { rel: 'folder', id_item: j },
              children: this._build_children(model, j),
            });
          }
        }

        if (self.options.showfiles) {
          for (j in subfiles) {
            if (subfiles[j].id_folder == null) {
              children.push({
                data: {
                  title: $.E(subfiles[j].title),
                  icon: 'jstree_icon file' + subfiles[j].filetype,
                },
                attr: { rel: 'file', id_item: j },
                children: [],
              });
            }
          }
        }

        children.sort(self._f_sort_tree);
        s_numfiles = (self.options.filestats) ? " <span class='numfiles'>" + model.get('file', { id_ensemble: i, id_folder: null }).length() + '</span>' : '';
        data.push({ data:  { title: $.E(ensemble[i].name) + s_numfiles, icon: 'jstree_icon ' + (ensemble[i].admin ? 'admin' : 'reg') }, children: children, attr: { title: $.E(ensemble[i].description),  rel: 'ensemble', id_item: i } });
      }

      data.push({
        data: {
          title: '<strong>Home</strong>',
          icon:'jstree_icon home',
        },
        children: [],
        attr: { title: 'Home',  rel: 'ensemble', id_item: 0 },
      });

      data.sort(self._f_sort_tree);
      var tree_data = {
        plugins: ['themes', 'json_data', 'ui'],
        json_data: { data: data },
        core: { html_titles: true },
      };
      $('div.tree', self.element).jstree(tree_data).bind('select_node.jstree', function (e, data) {
        var o = data.rslt.obj;
        var id_item = o.attr('id_item');
        var rel = o.attr('rel');

        var id_changed = true;
        if (self._selection && self._selection.id_item) {
          id_changed = (id_item !== self._selection.id_item);
        }

        self._selection =  { rel: rel, id_item: id_item };

        if (self.options.callbacks[rel]) {
          (self.options.callbacks[rel])({ type: rel, value:id_item });
        } else {
          $.concierge.trigger({ type:rel, value:id_item });
        }

        if (id_changed === false) {
          $.jstree._reference(o).toggle_node(o);
        }
      });

      //restore selection of there was any:
      var sel = self._selection;
      if (sel.rel) {
        var o = $('li[rel=' + sel.rel + '][id_item=' + sel.id_item + ']', self.element);
        $.jstree._reference(o).toggle_node(o);
      }

    },

    _build_children:  function (model, id_folder) {
      var subfolders =  model.get('folder', { id_parent: id_folder }).items;
      var subfiles = model.get('file', { id_folder: id_folder }).items;
      var children = [];
      var s_numfiles = null;

      for (var j in subfolders) {
        s_numfiles = (this.options.filestats) ? " <span class='numfiles'>" + model.get('file', { id_folder: j }).length() + '</span>' : '';
        children.push({
          data: $.E(subfolders[j].name) + s_numfiles,
          attr: { rel: 'folder', id_item: j },
          children: this._build_children(model, j),
        });
      }

      if (this.options.showfiles) {
        for (j in subfiles) {
          children.push({
            data: {
              title: $.E(subfiles[j].title),
              icon: 'jstree_icon file' + subfiles[j].filetype,
            },
            attr: { rel: 'file', id_item: j },
            children: [],
          });
        }
      }

      return children;
    },

    update: function (action, payload, items_fieldname) {
      if (action === 'add' || action === 'remove') {
        this._render();
      }
    },
  });

  $.widget('ui.treeView', V_OBJ);
  $.ui.treeView.prototype.options = {
    listens: {
      hello:null, folder: null, ensemble: null, file: null,
    },
    admin: true,
    filestats: false,
    showfiles: false,
    callbacks: {
          folder: null, ensemble: null, file: null,
        },
  };
})(jQuery);
