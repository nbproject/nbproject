var $, $str, Page, Highlight, PageCollection;
// The payloadSourceId gets set to the right value during page initialization. It is used by various event handlers.
var payloadSourceId = -1;

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

define(function(require) {
  var $ = require('jquery');
  var concierge = require('concierge');
  var Backbone = require('backbone');
  var Models = require('models');
  var Pers = require('pers');
  var img_server = Pers.server_url;

  if ('NB$' in window) {
    $ = NB$;
  }

  $str        = 'NB$' in window ? 'NB$' : 'jQuery';

  Pers.createStore = function () {
    Pers.store = new Models.Store();
  };

  Page = Backbone.Model.extend({
    defaults: {
      num_annotations: 0,
      num_questions: 0,
    },
  });

  Highlight = Backbone.Model.extend();

  PageCollection = Backbone.Collection.extend({
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

  function cb(data, status){
    if(data.status.errno){
      $(".nb-widget-body").append("<h1>Error: " + data.status.msg + "</h1>");
      return;
    }
    var p = data.payload;
    if(p.redirect){
      window.location.href = p.redirect;
      return;
    }
    $(".nb-widget-body").empty();
    $(".nb-widget-body").append(require("hbs!templates_dir/source_analytics")(p));
    setPageHandlers(p);
  };

  Pers.init = function () {
    var n = document.location.pathname.split("/")[2];
    var url = "/f/" + n + "/source_analytics";
    $.get(url, cb, "json");
  };

  function setPageHandlers(payload) {
    payloadSourceId = payload.source.id;
    // For logging
    window.onload = function() {
      var key = payloadSourceId + "|" + (new Date()).getTime();
      var payload = {};
      payload[key]=(new Date()).getTime();
      Pers.preinit();
      Pers.call("log_history", {"analytics": payload}, function(callback) {});
    };

    var recordAction = function(control, value) {
      var key = payloadSourceId + "|"+control + "|" + value;
      var payload = {};
      payload[key]=(new Date()).getTime();
      Pers.call("log_history", {"analyticsClick": payload}, function(callback) {});
    }

    // shows a preview of page 'num' with highlights in overlay
    var showPagePreview = function(num) {
      var contents = $('#page-preview-'+num).html();
      $('.pg-preview').html(contents);

      // get the larger image for the preview
      var ckey = Conf.userinfo.ckey;
      var img_url = img_server + "/pdf/cache2/72/100/" + payload.source.id + "?ckey=" + ckey + ";page=" + num;
      $(".pg-preview").find(".page-img").attr("src", img_url);

      $(".pg-preview").children(".highlight").each(function(i, el) {
        var s = 5;  // scale factor (for res 20 images)
        $(el).height($(el).height()*s);
        $(el).width($(el).width()*s);
        $(el).css("top", $(el).css("top").replace(/[^-\d\.]/g, '')*s);
        $(el).css("left", $(el).css("left").replace(/[^-\d\.]/g, '')*s);
      });
      $(".pg-preview").show();
    }

    // initialize page thumbnails
    var pages = JSON.parse(payload.pages);
    var highlights = payload.highlights;
    var doc = new PageCollection();

    var orientation;
    if (payload.source.h > payload.source.w) {
      orientation = "portrait";
    } else {
      orientation = "landscape";
    };

    var page;

    for (p in pages) {
      page = new Page(pages[p]);

      // TODO: better way to get the source ID/ckey?
      if (Conf.userinfo === undefined) {
        Pers.preinit();
      }
      var ckey = Conf.userinfo.ckey;
      var img_url = img_server + "/pdf/cache2/72/20/" + payload.source.id + "?ckey=" + ckey + ";page=" + p;
      page.set('img_url', img_url); // TODO: put img url in PageView?

      doc.add(page);
    }

    var documentView = new DocumentView({
      collection: doc,
      el: $("#pages-container"),
    });
    documentView.render();

    for (h in highlights) {
      var highlight = new Highlight(highlights[h]);
      highlight.set("page_orientation", orientation);
      var highlightView = new HighlightView({ model: highlight});
    }

    // color thumbnail stats using a gradient
    $(".color-stat").each(function(i, el) {
      var val = $(el).children(".val").text();
      var o = 1.0;
      var c = rgb2hex($(el).css("color"));
      var newC;
      // gradients set by arbitrary intervals // TODO make them different for each metric?
      if (val > 0) {
        $(el).css("opacity", o);
        if (val < 10) {
          newC = LightenDarkenColor(c, 10);
        }
        else if (val < 20) {
          // newC = LightenDarkenColor(c, -20);
        } else if (val < 30) {
          newC = LightenDarkenColor(c, -10);
        } else {
          newC = LightenDarkenColor(c, -20);
        }
        $(el).css("color", newC);
      }
    });

    /////////////// event handlers

    $("#sort-by").on('change', function() {
      var attr = $(this).val();
      doc.sortByField(attr);
      recordAction('page-sort-by', attr);
    })

    $("#show-filter").on('change', function() {
      var property = $(this).val();
      var num = 0; // TODO: make this flexible (another HTML property?)
      documentView.filterByPropertyAndNum(property, num);
      recordAction('page-filter', property);
    })

    $(".page-link").on('click', function() {
      var num = $(this).attr('id').split("link-")[1];
      recordAction('pagenum-click', num);
    })

    $(".page-label").on({
      mouseenter: function() {
        var num = $(this).html();
        showPagePreview(num);
        recordAction('chart-pagenum-hover', num);
      },
      mouseleave: function() {
        $('.pg-preview').hide();
      }
    });

    $(".page-preview").on({
      mouseenter: function() {
        var num = $(this).attr('id').split("page-preview-")[1];
        showPagePreview(num);
        recordAction('pagethumb-hover', num);
      },
      mouseleave: function() {
        $('.pg-preview').hide();
      }
    });

    // to avoid flicker when preview overlaps page number
    $(".pg-preview").on({
      mouseenter: function() {
        $('.pg-preview').show();
      },
      mouseleave: function() {
        $('.pg-preview').hide();
      }
    });

    // set up chart
    var chart_stats = payload.chart_stats;
    google.load("visualization", "1", {
      packages:["corechart"],
      callback: function() {
        // The presence of this callback prevents this google.load() from clearing the page
        // even though this callback does nothing. For further details see: http://stackoverflow.com/a/24980290/978369
        drawChart();
      }
    });

    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string','Page');
      data.addColumn('number','Threads');
      data.addColumn('number','Comments');
      data.addColumn('number','Replies requested');
      data.addColumn('number', 'Participants');
      data.addColumn('number', 'Total time (min)');
      data.addColumn('number', 'Avg time (min)');
      data.addRows(chart_stats);

      var view = new google.visualization.DataView(data);
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

      // Togglable series based on Andrew Gallant's code: http://jsfiddle.net/asgallant/6gz2Q/60/
      var columns = [];
      // display these data series by default
      var defaultSeries = [1, 2, 3, 4];
      var series = {};
      for (var i = 0; i < data.getNumberOfColumns(); i++) {
          if (i == 0 || defaultSeries.indexOf(i) > -1) {
              // if the column is the domain column or in the default list, display the series
              columns.push(i);
          }
          else {
              // otherwise, hide it
              columns.push({
                  label: data.getColumnLabel(i),
                  type: data.getColumnType(i),
                  sourceColumn: i,
                  calc: function () {
                      return null;
                  }
              });
          }
          if (i > 0) {
              // set the default series option
              series[i - 1] = {};
              if (defaultSeries.indexOf(i) == -1) {
                  // backup the default color (if set)
                  if (typeof(series[i - 1].color) !== 'undefined') {
                      series[i - 1].backupColor = series[i - 1].color;
                  }
                  series[i - 1].color = '#CCCCCC';
              }
              // use secondary y-axis for time values
              if (i - 1 > 3) {
                series[i - 1].targetAxisIndex = 1;
              } else {
                series[i - 1].targetAxisIndex = 0;
              }
          }
      }

      var options = {
          series: series,
          height: 300,
          colors: ["#3366CC", "#FF7100", "#109618", "#990099", "#21B7CC", "#CC89C7"], // same colors as thumbnail stats
          hAxis: {title: 'Page'},
          vAxes: {0: {logScale: false},
                  1: {logScale: false,
                      title: "min"}},
      }

      function showHideSeries () {
          var sel = chart.getSelection();
          // if selection length is 0, we deselected an element
          if (sel.length > 0) {
              // if row is undefined, we clicked on the legend
              if (sel[0].row == null) {
                  var col = sel[0].column;
                  if (typeof(columns[col]) == 'number') {
                      var src = columns[col];

                      // hide the data series
                      columns[col] = {
                          label: data.getColumnLabel(src),
                          type: data.getColumnType(src),
                          sourceColumn: src,
                          calc: function () {
                              return null;
                          }
                      };

                      // grey out the legend entry
                      series[src - 1].color = '#CCCCCC';
                  }
                  else {
                      var src = columns[col].sourceColumn;

                      // show the data series
                      columns[col] = src;
                      series[src - 1].color = null;
                  }
                  recordAction('chart-toggle', data.getColumnLabel(src));
                  var view = new google.visualization.DataView(data);
                  view.setColumns(columns);
                  chart.draw(view, options);
              }
          }
      }

      google.visualization.events.addListener(chart, 'select', showHideSeries);

      // create a view with the default columns
      var view = new google.visualization.DataView(data);
      view.setColumns(columns);
      chart.draw(view, options);

        // add page-label class to x-axis page labels
      $('text').each(function(i, el) {
        var obj = $(el);
        var n = obj.text();
        if ($.isNumeric(n)) {
          obj.attr('class', 'page-label');
        }
      });

      $(".page-label").on({
        mouseenter: function() {
          var num = $(this).html();
          showPagePreview(num);
          recordAction('chart-pagenum-hover', num);
        },
        mouseleave: function() {
          $('.pg-preview').hide();
        }
      });
    }
  } // End of setPageHandlers

});
