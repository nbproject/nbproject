/*global NB$:true NB:true Page:true Document:true PageView:true Backbone:true _:true jQuery:true */

(function (GLOB) {
  if ('NB$' in window) {
    var $ = NB$;
  }

  var $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  GLOB.pers.createStore = function () {
    GLOB.pers.store = new GLOB.models.Store();
  };
})(NB);

var Page = Backbone.Model.extend({
  defaults: {
    num_annotations: 0,
    num_questions: 0,
  },
});

var Highlight = Backbone.Model.extend();

var PageCollection = Backbone.Collection.extend({
  model: Page,

  sort_key: 'page_num',

  comparator: function (page) {
    if (this.sort_key === 'num_annotations' || this.sort_key === 'num_questions' || this.sort_key === 'num_threads' || this.sort_key === 'num_participants') {
      // decreasing order
      return -page.get(this.sort_key);
    } else {
      return page.get(this.sort_key);
    }
  },

  sortByField: function (fieldName) {
    this.sort_key = fieldName;
    this.sort();
  },

});

/// COLOR HELPERS
// from http://css-tricks.com/snippets/javascript/lighten-darken-color/
// col is a color in hex format
function LightenDarkenColor(col, amt) {

  var usePound = false;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  var g = (num & 0x0000FF) + amt;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);

}

var hexDigits = new Array
      ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

//Function to convert hex format to a rgb color
function hex(x) {
  return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
