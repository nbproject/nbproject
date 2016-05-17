/*global NB$:true NB:true PageView:true HighlightView:true DocumentView:true Backbone:true _:true jQuery:true */

// depends on templates in source_analytics.html

var PageView = Backbone.View.extend({

  tagName: 'div',
  className: 'page-wrap',
  id: function () {
    return 'page-' + this.model.attributes.page_num;
  },

  template: _.template(jQuery('#page-template').html()),

  render: function () {
    jQuery(this.el).append(this.template(this.model.attributes));
    return this;
  },

});

var HighlightView = Backbone.View.extend({
  initialize: function () {
    this.render();
  },

  el: function () {
    if (this.model) {
      return '#page-preview-' + this.model.attributes.page_num;
    }
  },

  template: _.template(jQuery('#highlight-template').html()),
  render: function () {
    var m = this.model.attributes;
    var css_scale = 0.20;
    var fudge_scale; // scale of img with 72 dpi, 100%
    if (m.page_orientation === 'portrait') {
      fudge_scale = 0.4802; // portrait
    } else {
      fudge_scale = 0.6244; //landscape
    }

    var s2 = css_scale * fudge_scale;
    jQuery(this.el).append(this.template({
      x: m.x * s2,
      y: m.y * s2,
      w: m.w * s2,
      h: m.h * s2,
    }));
  },
});

var DocumentView = Backbone.View.extend({

  initialize: function () {
    var _this = this;
    this._pageViews = [];

    this.collection.each(function (page) {
      _this._pageViews.push(new PageView({
        model: page,
      }));
    });

    this.collection.on('all', function () {
      _this.reorder();
    });
  },

  // property is 'annotations' or 'questions'
  filterByPropertyAndNum: function (property, num) {
    var tag = '.' + property;
    jQuery('.page-wrap').show()
                        .each(function (index, value) {
                          var el = jQuery(this);
                          var val = el.find(tag).find('.val').html();
                          if (val <= num) {
                            el.hide();
                          }
                        });
  },

  reorder: function () {
    for (var i = 0; i < this.collection.length; i++) {
      var pg = this.collection.at(i).attributes.page_num;
      var currentEl = jQuery('#page-' + pg);
      jQuery(this.el).append(currentEl);
    }
  },

  render: function () {
    var _this = this;
    var fragment = document.createDocumentFragment();
    _(this._pageViews).each(function (pv) {
      fragment.appendChild(pv.render().el);
    });

    jQuery(_this.el).html(fragment);
  },
});