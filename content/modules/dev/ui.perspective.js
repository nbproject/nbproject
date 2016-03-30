/* Perspective Plugin v.5
 * Depends:
 *    ui.core.js
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 Example usage:
 In your HTML:
 <div id="pers1" label="Home">
   <div id="view-1" style="min-width: 250px;"  ></div>
   <div class="separator" orientation="vertical"/>
   <div class="pers-protection">
     <div id="view-2" style="min-height: 150px;" ></div>
     <div class="separator" orientation="horizontal"/>
     <div id="view-3"></div>
   </div>
 </div>

 In your JS:
 $("#pers1").perspective();
*/
/*global alert:true jQuery:true console:false*/
(function ($) {
  var P_OBJ = {
    SEP_TOTAL_SIZE: 4,
    SEP_INSIDE_SIZE:4,
    ORIENTATIONS: {
      vertical:  { axis: 'x', dir:  'left', dim: 'width',  dim2:'height', cursor: 'col-resize', margin: 'margin-right' },
      horizontal:{ axis: 'y', dir:  'top', dim: 'height', dim2:'width',  cursor: 'ns-resize', margin: 'margin-bottom' },
    },
    CP_PARAMS: {
      width: {
        orientation1: 'vertical',
        orientation2: 'horizontal',
        cp: '_cpw',
        scp: '_scpw',
        dim: '_min_width',
      },
      height: {
        orientation1: 'horizontal',
        orientation2: 'vertical',
        cp: '_cph',
        scp: '_scph',
        dim: '_min_height',
      },
    },
    CLA_PARAMS: {
      width: {
        dir: '_width',
        cp: '_cpw',
        scp: '_scpw',
        d_min: '_min_width',
        frac: '_frac_desired_width',
        alloc: '_allocated_width',
        des: '_desired_width',
        mem: '_memorized_width',
      },
      height: {
        dir: '_height',
        cp: '_cph',
        scp: '_scph',
        d_min: '_min_height',
        frac: '_frac_desired_height',
        alloc: '_allocated_height',
        des: '_desired_height',
        mem:  '_memorized_height',
      },
    },
    PROPAGATE_PARAMS: {
      width: {
        alloc: '_allocated_width',
        cp: '_cpw',

      },
      height: {
        alloc: '_allocated_height',
        cp: '_cph',
      },
    },
    PREFIX_KEYS: ['v1', 'v2'],
    PREFIXES: { v1: 1, v2: 2 },
    _protect: function ($sep) {
      /*
       * embeds each viewpane, vp1 and vp2 in a protection "cage" div (i.e position=relative), itself embedded in a widget
       * This way, embedded views can use regular coordinates, width=100% etc... without intererferting with other views.
       */       
      var self = this;
      if ($sep.length === 0) {
        return;
      }

      if ($sep.length !== 1) {
        alert('There are ' + $sep.length + ' separators in here... There should be at most 1');
        return;
      }

      var $p = $sep.parent();
      var $vp1 = $sep.prev();
      var $vp2 = $sep.next();
      var $sibs =  $sep.siblings();
      $sibs.not('div.pers-protection').wrap("<div class='pers-widget'><div class='pers-protection'/></div>");
      $sibs.filter('div.pers-protection').wrap("<div class='pers-widget'></div>");
      self._adjust($sep, true); //don't recurse...
      self._protect($vp1.children('div.separator'));
      self._protect($vp2.children('div.separator'));
    },

    _adjust: function ($SEPS, dont_recurse) {
      //PRE: containers have been embedded in their protection div and their widgets
      if ($SEPS.length === 0) {
        return;
      }

      var self = this;
      var f_adjust = function (i, sep) {
        var $sep = $(sep);
        var $p = $sep.parent();
        var $prev = $sep.prev();
        var $next = $sep.next();
        var size1, margin, o_css; //size1: desired size of prev
        var v = self.ORIENTATIONS[$sep.attr('orientation')];
        size1 = ($sep.attr('end')) ?  $p[v.dim]() - parseInt($sep.attr('end'), 10) - self.SEP_TOTAL_SIZE : $prev[v.dim]();
        margin = self.SEP_TOTAL_SIZE + Number(size1);
        o_css            = {};
        o_css[v.dim2]        = $p[v.dim2]() + 'px';
        o_css[v.dim]        = size1 + 'px';
        $sep.prev().css(o_css);
        o_css            = {};
        o_css['margin-' + v.dir]    =  margin + 'px';
        o_css[v.dim2]        = $p[v.dim2]() + 'px';
        o_css[v.dim]        = ($p[v.dim]() - margin) + 'px';
        $sep.next().css(o_css);
        o_css            = {};
        o_css[v.dir]        = size1 + 'px';
        o_css[v.dim2]        = $p[v.dim2]() + 'px';
        o_css[v.dim]        = self.SEP_INSIDE_SIZE + 'px';
        o_css['cursor']        = v.cursor;

        //o_css["border-"+v.dir]    = "thin solid #FEFCFB";
        $sep.css(o_css);
      };

      $SEPS.each(f_adjust);
      if (!(dont_recurse)) {
        self._adjust($('>div.pers-protection>div.separator', $SEPS.prev().add($SEPS.next())));
      }
    },

    _adjust_outerview_height: function (i, elt) {
      var $elt = $(elt);
      var $p = $elt.parent();
      $elt.height($p.height() - $p.children('ul').height());
    },

    _f_new_draggable: function (o) {
      var self = this;
      var v =  self.ORIENTATIONS[o];
      $('div.separator[orientation=' + o + ']').draggable({
        axis: v.axis,
        stop: function (event, ui) {
          var VD    = self._views_data;
          var x1 = parseInt(this.style[v.dir], 10);
          var $elt = $(this);
          var $prev = $elt.prev();
          var $next = $elt.next();
          var leaf;
          $prev.css(v.dim, x1);

          //memorize if leaf:
          leaf  = $('>div.pers-protection>div.view', $prev);
          if (leaf.length) {
            VD['_memorized_' + v.dim][leaf[0].id] = x1;
          }

          var o_css = {};
          o_css['margin-' + v.dir] = (x1 + self.SEP_TOTAL_SIZE) + 'px';
          var x2 = $elt.parent()[v.dim]() - self.SEP_TOTAL_SIZE - x1;
          leaf = $('>div.pers-protection>div.view', $next);
          if (leaf.length) {
            VD['_memorized_' + v.dim][leaf[0].id] = x2;
          }

          o_css[v.dim] = x2 + 'px';
          $next.css(o_css);
          self._adjust($('>div.pers-protection>div.separator', $prev.add($next)));
          self.element.trigger('resize_perspective', [v.axis]);
        },
      });
    },

    _fill_alloc_opts: function (prefix, views) {
      var self    = this;
      var newprefix, id;
      var elt_id    = self.element[0].id + '_';

      //        var O    = self.options;
      var VD    = self._views_data;
      var W    = self._width();
      var H    = self._height();
      for (var v in self.PREFIXES) {
        newprefix    = prefix + self.PREFIXES[v];
        id        = elt_id + newprefix;
        if ('data' in views[v]) {//found a leaf
          VD._min_width[id]    =  'min_width' in views[v].data ?  views[v].data.min_width : W;
          VD._min_height[id] =  'min_height' in views[v].data ?  views[v].data.min_height : H;
          var priority        =  views[v].data.priority;
          if (priority !== 1 && priority !== 2) {
            throw new Error('priority=' + priority + '  but can only be 1 or 2 for now');
          }

          VD._pr2id[priority][id]    = null;
          VD._priority[id]        = views[v].data.priority;
          VD._desired_width[id]    = 'desired_width' in views[v].data ?  views[v].data.desired_width * W / 100 : W;
          VD._desired_height[id]    = 'desired_height' in views[v].data ?  views[v].data.desired_height * H / 100 : H;
          VD._frac_desired_width[id]    = Math.max(VD._desired_width[id] / VD._min_width[id], 1);
          VD._frac_desired_height[id]    = Math.max(VD._desired_height[id] / VD._min_height[id], 1);
          if ('transcient' in views[v].data && views[v].data.transcient) {
            //existence of a key means the view is transcient and boolean value encodes for current visibility
            VD._transcient[id]        = false;
          }
        } else {//need to recurse
          self._fill_alloc_opts(newprefix, views[v].children);
        }
      }

    },

    _find_cp: function (prefix, views, orientation) {
      //computes (an approximation of) the critical path in 'orientation' (width or height).
      var self    = this;

      //        var O    = self.options;
      var VD    = self._views_data;
      var P    = self.CP_PARAMS[orientation];
      var newprefix, id;
      var elt_id    = self.element[0].id + '_';
      if (prefix === '') { //reinit
        VD[P.cp] = {};
      }

      for (var v in self.PREFIXES) {
        newprefix    = prefix + self.PREFIXES[v];
        id        = elt_id + newprefix;
        if ('data' in views[v]) {//found a leaf
          if (views[v].data.priority === 1 && views.orientation === P.orientation1) {
            //here we make the approx that this IS on the critical path
            VD[P.cp][id] = null;
          }
        } else {
          self._find_cp(newprefix, views[v].children, orientation);
        }
      }

      //"max" case (approx): leaves with separator in between
      //TODO: don't ignore transcient windows !
      if (views.orientation === P.orientation2 && 'data' in views.v1 && 'data' in views.v2) {
        var id1 =  elt_id + prefix + self.PREFIXES.v1;
        var id2 =  elt_id + prefix + self.PREFIXES.v2;
        if ((VD[P.dim][id1] >  VD[P.dim][id2]) || (id2 in VD._transcient && VD._transcient[id2] === false)) {
          VD[P.cp][id1] = null;
          VD[P.scp][id2] = id1;
        } else {
          VD[P.cp][id2] = null;
          VD[P.scp][id1] = id2;
        }
      }
    },

    _propagate_allocations: function (prefix, views, orientation) {
      var self = this;

      //        var O    = self.options;
      var VD    = self._views_data;
      var P    = self.PROPAGATE_PARAMS[orientation];
      var newprefix, id;
      var elt_id = self.element[0].id + '_';
      var output = 0;
      for (var v in self.PREFIXES) {
        newprefix = prefix + self.PREFIXES[v];
        id = elt_id + newprefix;
        if (id in VD[P.alloc] && id in VD[P.cp]) {
          output += VD[P.alloc][id];
        }

        if ('children' in views[v]) {
          output += self._propagate_allocations(newprefix, views[v].children, orientation);
        }
      }

      VD[P.alloc][elt_id + prefix] = output;
      return output;
    },

    _compute_leaves_allocations: function (orientation, use_memorized) {
      var self = this;

      //        var O    = self.options;
      var VD    = self._views_data;
      var P    = self.CLA_PARAMS[orientation];

      //can we satisfy P1 minimum assignt ?
      var D        = self[P.dir]();
      var available    = D;
      var remaining    = available;
      var P1        = VD._pr2id[1];
      var P2        = VD._pr2id[2];
      var req        = 0;
      var total_req_frac    = 0;
      var allocated    = 0;
      var v;
      if (!(use_memorized)) { //reinit
        VD[P.mem] = {};
      }

      for (v in  P1) {
        if (v in  VD[P.cp] && ((!(v in VD._transcient)) || VD._transcient[v])) { //it's on the critical path
          req +=  VD[P.d_min][v];
        }
      }

      if (req < available) {//every P1 widget will get at least min size
        remaining = available - req;
        for (v in  P2) { //every P2 widget
          if ((!(v in VD._transcient)) || VD._transcient[v]) {
            req +=  VD[P.d_min][v];
          }
        }

        if (req < available) {//the P1 widgets will get some extra space, since P1 and P2 already getting their min
          remaining = available - req;
          for (v in  P1) {
            if ((!(v in VD._transcient)) || VD._transcient[v]) {
              total_req_frac += VD[P.frac][v];
            }
          }

          for (v in  P1) {
            VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ? ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : Math.min(VD[P.d_min][v] + Math.floor(remaining * VD[P.frac][v] / total_req_frac), VD[P.des][v] * D / 100)) : 0;

            //TODO: we should check that the widget that isn't on the critical path didn't allocate more that the one that's on the critical path.
            if (v in  VD[P.cp]) {
              allocated += VD[P.alloc][v];
            }
          }

          for (v in  P2) {/// and for now, P2 views get their min
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? VD[P.d_min][v] : 0;
            allocated += VD[P.alloc][v];
          }

          //anything left ?
          if (allocated < available) {
            remaining = available - allocated;

            //now give extra space to P2 widgets (//TODO refactor)
            total_req_frac = 0;
            for (v in  P2) {
              if ((!(v in VD._transcient)) || VD._transcient[v]) {
                total_req_frac += VD[P.frac][v];
              }
            }

            for (v in  P2) {
              allocated -= VD[P.alloc][v]; //remove current P2 size i.e. minsize
              VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ? Math.min(VD[P.d_min][v] + Math.floor(remaining * VD[P.frac][v] / total_req_frac), VD[P.des][v] * D / 100) : 0;
              allocated += VD[P.alloc][v];
            }
          }
        } else { //P2 widgets get less than their min
          req = 0;
          for (v in  P2) {
            if ((!(v in VD._transcient)) || VD._transcient[v]) {
              req += VD[P.d_min][v];
              VD[P.alloc][v] = Math.floor(remaining * VD[P.d_min][v] / req);
            } else {
              VD[P.alloc][v] = 0;
            }
          }

          for (v in  P1) {/// and for now, P2 views get their min
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ?  ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : VD[P.d_min][v]) : 0;
            if (v in  VD[P.cp]) {
              allocated += VD[P.alloc][v];
            }
          }
        }
      }      else { //P1 widget gets less than min, and P2 are collapsed
        for (v in  P1) {
          if (v in VD[P.cp]) {
            VD[P.alloc][v] =  ((!(v in VD._transcient)) || VD._transcient[v]) ?  ((use_memorized && v in VD[P.mem]) ? VD[P.mem][v] : Math.floor(available * VD[P.d_min][v] / req)) : 0;
          }          else if (v in  VD[P.scp]) { //this view has a sibling that's on the critical path for this orientation. Use sibling's size
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? Math.floor(available * VD[P.d_min][VD[P.scp][v]] / req) : 0;
          }          else { //TODO: this is an approx. For now, just allocate desired size
            VD[P.alloc][v] = ((!(v in VD._transcient)) || VD._transcient[v]) ? VD[P.des][v] : 0;
          }
        }

        for (v in  P2) {
          VD[P.alloc][v] = 0;
        }
      }
    },

    _create_ext_separator: function () {
      var self = this;
      if (self._ext_separator) {
        var v =  self.ORIENTATIONS[self._ext_separator.orientation];
        var $p = $(self._ext_separator.container);
        var  o_css            = {};
        o_css[v.dir]        = 0;
        o_css[v.dim2]        = '100%';
        o_css[v.dim]        = self.SEP_INSIDE_SIZE + 'px';
        o_css['cursor']        = v.cursor;

        //o_css["border-"+v.dir]    = "thin solid #FEFCFB";
        var sep = $("<div class='external-separator' orientation='" + self._ext_separator.orientation + "'/>").css(o_css).draggable({
          axis: v.axis,
          stop: function (event, ui) {
            var VD    = self._views_data;
            var x1 = parseInt(this.style[v.dir], 10);
            var $elt = $(this);
            var $p = $elt.parent();
            var newdim = $p[v.dim]() - $elt.position()[v.dir];
            $p[v.dim](newdim);
            $p.parent().css(v.margin, newdim + 'px');
            $elt.css(v.dir, 0);
            self.f_on_window_resize();
          },
        });
        $p.prepend(sep);
      }
    },

    _create_contents: function (prefix, elt, views) {
      var self        = this;
      var VD        = self._views_data;
      var elt_id        = self.element[0].id + '_';
      var did_sep        = false;
      var newprefix, id, $div;
      var key;
      var f_transcient = function (id, do_transcient) {
        return function () {
          VD._transcient[id] = do_transcient;
          self._resize_contents(true);
          self._adjust(self.element.children('div.separator'));
          self.element.trigger('resize_perspective', ['xy']);
        };
      };

      for (var i in self.PREFIX_KEYS) {
        key = self.PREFIX_KEYS[i];
        newprefix = prefix + self.PREFIXES[key];
        id = elt_id + newprefix;
        if ('data' in views[key]) {
          $div = $("<div id='" + id + "' style='width: " + VD._allocated_width[id] + 'px; height: ' + VD._allocated_height[id] + "px;'/>");
          elt.append($div);
          if ('content' in views[key].data) {
            views[key].data.content($div);
            if (id in VD._transcient) {
              $div.bind({ minimize: f_transcient(id, false), restore:  f_transcient(id, true) });
            }
          }          else {
            $div.append('No contents for view <i>' + id + '</i>');
          }
        } else {
          var p = $("<div class='pers-protection'/>");
          elt.append(p);
          self._create_contents(newprefix, p, views[key].children);
        }

        if (!(did_sep)) {
          did_sep = true;
          elt.append("<div class='separator' orientation='" + views.orientation + "'/>");
        }
      }
    },

    _resize_contents: function (use_memorized) { //resizes contents if the window has been resized.
      var self    = this;
      var VD    = self._views_data;
      if (self._views) {
        self._find_cp('', self._views, 'width'); //critical path for width
        self._find_cp('', self._views, 'height'); //critical path for width
        self._compute_leaves_allocations('width', use_memorized);
        self._compute_leaves_allocations('height', use_memorized);
        self._propagate_allocations('', self._views, 'width');
        self._propagate_allocations('', self._views, 'height');

        for (var v in VD._allocated_width) {
          //resize the view and the  correspoding pers-widget
          $('#' + v).css({ width: VD._allocated_width[v] + 'px', height: VD._allocated_height[v] + 'px' }).parent().parent('.pers-widget').css({ width: VD._allocated_width[v] + 'px', height: VD._allocated_height[v] + 'px' });
        }
      }
    },

    _create: function () {
      var self = this;
      self.element.addClass('perspective');//.css({width: self.options.width(self.element), height: self.options.height(self.element)});
      //stuff in options gets shared bewteen each instance, so let's make our own copy now (at creation time) before another instance changes it !
      self._views        = self.options.views;
      self._width        = self.options.width || function () {return self.element.parent().width();};

      self._height    = self.options.height || function () {return self.element.parent().height();};

      self._orientation    = self.options.orientation;
      self._listens    = self.options.listens;
      self._ext_separator = self.options.ext_separator;
      if (self._views) {//are we creating any contents ?
        var views_data = {
          _min_width: {},
          _desired_width: {},
          _frac_desired_width: {},
          _allocated_width: {},
          _min_height: {},
          _desired_height: {},
          _frac_desired_height: {},
          _allocated_height: {},
          _priority:{},
          _pr2id:{ 1:{}, 2:{} },
          _cpw: {},
          _cph: {},
          _scpw: {}, //sibling of a view that's in the critical path for its width
          _scph: {},
          _transcient: {},
          _memorized_width: {},
          _memorized_height: {},
        };
        self._views_data = views_data;
        self._fill_alloc_opts('', self._views);
        self._find_cp('', self._views, 'width'); //critical path for width
        self._find_cp('', self._views, 'height'); //critical path for width
        self._compute_leaves_allocations('width', false);
        self._compute_leaves_allocations('height', false);
        self._propagate_allocations('', self._views, 'width');
        self._propagate_allocations('', self._views, 'height');
        self._create_contents('', self.element, self._views);
        self._create_ext_separator();
        if (self._listens) {
          $.concierge.addListeners(self, self._listens);
        }
      }

      //self.element.addClass("perspective");
      self._protect(self.element.children('div.separator'));
      for (var o in self.ORIENTATIONS) {
        /* here it's necessary to put the loop code into a function so that the
           parameter (o) gets copied, because if we inlined the code, the callback
           function declared in _f_new_draggable ("stop") would only have the value
           of the closure variable at the last iteration */
        self._f_new_draggable(o);
      }

      window.addEventListener('resize', self.f_on_window_resize.bind(self), false);
      if (self._views) {
        //this is needed when opening a 3rd perspective for instance
        self._resize_contents(true);
        self._adjust(self.element.children('div.separator'));
        self.element.trigger('resize_perspective', ['xy']);
      }
    },

    f_on_window_resize: function (evt) {
      var self = this;
      var $vp = self.element.closest('div.viewport');
      if ($vp.length) {
        $vp.viewport('adjust_height');
      }

      self._resize_contents(false);
      self._adjust(self.element.children('div.separator'));
      self.element.trigger('resize_perspective', ['xy']);
    },

    update: function () {
      var self = this;
      self._adjust(self.element.children('div.separator'));

      //send update to all registered observers:
      self.element.trigger('resize_perspective', ['xy']);
    },
  };
  $.widget('ui.perspective', P_OBJ);
  $.ui.perspective.prototype.options = {
    width:  null,
    height: null,
    orientation: null,
    views: null,
  };
  $.extend($.ui.perspective, {
    version: '1.8',
  });
})(jQuery);
