     var PageView = Backbone.View.extend({
        
        tagName: 'div',
        className: 'page-wrap',
        id: function() {
          return 'page-'+this.model.attributes.page_num;
        },
        template: _.template(jQuery("#page-template").html()),

        render: function(){
          jQuery(this.el).append(this.template(this.model.attributes));
          return this;
        },

      });

      var HighlightView = Backbone.View.extend({
        initialize: function() {
          this.render();
        },
        el: function() {
          if (this.model) {
            return "#page-"+this.model.attributes.page_num;
          }
        },
        template: _.template(jQuery("#highlight-template").html()),
        render: function(){
          // TODO: better way to calculate variables?
          var pgHtLg = 1045;
          var pgHtSm = 220; // set in ui.docAnalytiscView.css
          var s = 1.577; // calculated complicatedly
          var s2 = pgHtSm/(s*pgHtLg);
          var m = this.model.attributes;
          jQuery(this.el).append(this.template({
            'x': m.x*s2,
            'y': m.y*s2,
            'w': m.w*s2,
            'h': m.h*s2
          }));
        }
      });

      var DocumentView = Backbone.View.extend({

        initialize: function() {
          var _this = this;
          this._pageViews = [];

          this.collection.each(function(page) {
            _this._pageViews.push(new PageView({
              model: page,
            }));
          });

          this.collection.on('all', function() {
            _this.reorder();
          })
        },

        // type is 'annotations' or 'questions'
        filterByPropertyAndNum: function(property, num) {
          var tag = "."+property;
          jQuery(".page-wrap").show()
                              .each(function(index, value) {
                                var el = jQuery(this);
                                var val = el.find(tag).html();
                                if (val <= num) {
                                  el.hide();
                                }
                              });
        },

        reorder: function() {
          for(var i=0; i < this.collection.length; i++) {
            var pg = this.collection.at(i).attributes.page_num;
            var currentEl = jQuery("#page-"+pg);
            jQuery(this.el).append(currentEl);            
          }
        },

        render: function() {
          var _this = this;
          var fragment = document.createDocumentFragment();
          _(this._pageViews).each(function(pv) {
            fragment.appendChild(pv.render().el);
          })  
          jQuery(_this.el).html(fragment);
        }
      });