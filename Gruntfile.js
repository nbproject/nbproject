module.exports = function (grunt) {
  var child_process = require('child_process');

  var servername = child_process.exec("python -c 'from __future__ import print_function;from  apps.settings import NB_SERVERNAME;print(NB_SERVERNAME, end=\"\")'");
  var serverport = child_process.exec("python -c 'from __future__ import print_function;from  apps.settings import NB_HTTP_PORT;print(NB_HTTP_PORT, end=\"\")'");
  if (serverport !== '80') {
    servername += ':' + serverport;
  }

  var addPrefix = function (prefix, names) {
    /*
     * given a prefix and an array, returns a new array where each element
     * is prefixed by the prefix
     */
    var output = [];
    for (var i in names) {
      output.push(prefix + names[i]);
    }

    return output;
  };

  var unique = function (names) {
    /*
     * returns a new array with the subsequent occurences of a string removed.
     * for instance unique(["a", "b", "c", "a", "d", "a"]) returns ["a", "b", "c", "d"]
     */
    var index = {};
    var output = [];
    for (var i in names) {
      if (!(names[i] in index)) {
        index[names[i]] = null;
        output.push(names[i]);
      }
    }

    return output;
  };

  var LIB_DIR = 'content/lib/';
  var MODULE_DIR = 'content/modules/';
  var VIEWS_DIR = 'content/views/';
  var UI_DIR = 'content/ui/admin/';
  var UITEST_DIR = 'content/ui/test/';
  var DEST_DIR = 'content/compiled/';

  /* MODS are modules that serve as building blocks, without being built themselves */
  var MODS = {};
  MODS.CONTEXTMENU = {
    src_js: addPrefix(LIB_DIR, ['contextmenu/jquery.ui.position.js', 'contextmenu/jquery.contextMenu.js']),
    src_css: addPrefix(LIB_DIR, ['contextmenu/jquery.contextMenu.css']),
  };
  MODS.FILTERWIZARD = {
    src_js: addPrefix(VIEWS_DIR, ['ui.filterwizard.js']),
    src_css: addPrefix(VIEWS_DIR, ['ui.filterwizard.css']),
  };
  MODS.DUPLICATEWIZARD = {
    src_js: addPrefix(VIEWS_DIR, ['ui.duplicatewizard.js', 'ui.threadselect.js']),
    src_css: addPrefix(VIEWS_DIR, ['ui.duplicatewizard.css', 'ui.threadselect.css']),
  };
  MODS.TREEVIEW = {
    src_js: [].concat(addPrefix(LIB_DIR, ['jstree/jquery.jstree.js']),
                      addPrefix(VIEWS_DIR, ['ui.treeview.js'])),
    src_css: [].concat(addPrefix(LIB_DIR, ['jstree/themes/default/style.css']),
                       addPrefix(VIEWS_DIR, ['ui.treeview.css'])),
  };
  MODS.FILESVIEW = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      addPrefix(LIB_DIR, ['tablesorter/jquery.tablesorter.min.js', 'calendrical/jquery.calendrical.js']),
      addPrefix(VIEWS_DIR, ['ui.filesview.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(LIB_DIR, ['tablesorter/style.css', 'calendrical/calendrical.css']),
      addPrefix(VIEWS_DIR, ['ui.filesview.css'])),
  };
  MODS.DOCVIEW = {
    src_js: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable4.js']),
      addPrefix(VIEWS_DIR, ['ui.docView.pdf.js'])),
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_COLLAGE = {
    src_js: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable4.js']),
      addPrefix(VIEWS_DIR, ['ui.docView.collage.js'])),
     src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_SPREADSHEET = {
    src_js: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable4.js']),
    addPrefix(VIEWS_DIR, ['ui.docView.spreadsheet.js'])),
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
    addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_YOUTUBE = {
    src_js: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable4.js']),
      addPrefix(VIEWS_DIR, ['ui.docView.video.js'])),
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };

  MODS.NOTEPANEVIEW_DOC = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      MODS.FILTERWIZARD.src_js,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.doc.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      MODS.FILTERWIZARD.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };
  MODS.NOTEPANEVIEW_COLLAGE = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.collage.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };
  MODS.NOTEPANEVIEW_SPREADSHEET = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      addPrefix(LIB_DIR, ['dateformat/date.format.js']),
      addPrefix(VIEWS_DIR, ['ui.notepaneView.spreadsheet.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };
  MODS.NOTEPANEVIEW_YOUTUBE = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.video.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };

  MODS.THREADVIEW = {
    src_js: [].concat(
      MODS.CONTEXTMENU.src_js,
      addPrefix(LIB_DIR, ['dateformat/date.format.js']),
      addPrefix(VIEWS_DIR, ['ui.threadview.js'])),
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.threadview.css'])),
  };

  MODS.EDITORVIEW = {
    src_js: addPrefix(VIEWS_DIR, ['ui.editorview.js']),
    src_css: addPrefix(VIEWS_DIR, ['ui.editorview.css']),
  };

  MODS.RANGY = {
    src_js: addPrefix(LIB_DIR + 'rangy/', ['rangy-core.js', 'rangy-classapplier.js', 'rangy-textrange.js', 'termfix.js']),
    src_css: [],
  };
  MODS.SPREADSHEETVIEW = {
    src_js: addPrefix(VIEWS_DIR, ['ui.spreadsheetView1.js']),
    src_css: addPrefix(VIEWS_DIR, ['ui.spreadsheetView1.css']),
  };

  MODS.DOCANALYTICSVIEW = {
    src_css: addPrefix(VIEWS_DIR, ['ui.docAnalyticsView.css']),
  };

  MODS.BREADCRUMB = {
    src_js: addPrefix(MODULE_DIR,['ui.breadcrumb.js']),
    src_css: addPrefix(MODULE_DIR, ['ui.breadcrumb.css'])
  };

  /* TARGETS are modules that are built (but they can also serve as building blocks) */
  var TARGETS = {};
  TARGETS.API =  {
    src_js: addPrefix(MODULE_DIR, ['NB.js', 'auth.js',  'dom.js', 'mvc.js', 'models.js']),
    dest_js: DEST_DIR + 'apidev_NB.js',
  };

  TARGETS.EMBED = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      MODS.NOTEPANEVIEW_DOC.src_js,
      MODS.THREADVIEW.src_js,
      MODS.EDITORVIEW.src_js,
      TARGETS.API.src_js,
      MODS.RANGY.src_js,
      addPrefix(LIB_DIR, ['wgxpath/wgxpath.install.js', 'wgxpath/termfix.js']),
      addPrefix(UI_DIR, ['conf.js']),
      addPrefix(MODULE_DIR, ['pers.js', 'docviewHtml5.js', 'buildEmbed.js'])),
    dest_js: DEST_DIR + 'embed_NB.js',
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css']),
      addPrefix(MODULE_DIR, ['ui.view.css', 'buildEmbed.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_css: DEST_DIR + 'embed_NB.css',
    servername: servername,
  };

  TARGETS.DESKTOP = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      addPrefix(MODULE_DIR, ['ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      MODS.FILTERWIZARD.src_js,
      MODS.DUPLICATEWIZARD.src_js,
      MODS.TREEVIEW.src_js,
      MODS.FILESVIEW.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js', 'files.js']),
      addPrefix(UI_DIR, ['init.desktop.js', 'launch.js']),
      MODS.BREADCRUMB.src_js
    ),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.FILTERWIZARD.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'desktop_NB.js',
    dest_css: DEST_DIR + 'desktop.css',
  };

  TARGETS.LOGIN = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['login.js'])),
    src_css: [].concat(
      addPrefix(UI_DIR, ['template.css'])),
    dest_js: DEST_DIR + 'login_NB.js',
    dest_css: DEST_DIR + 'login.css',
  };

  TARGETS.PDFVIEWER = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      MODS.DOCVIEW.src_js,
      MODS.NOTEPANEVIEW_DOC.src_js,
      MODS.THREADVIEW.src_js,
      MODS.EDITORVIEW.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.pdfviewer.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCVIEW.src_css,
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'pdfviewer_NB.js',
    dest_css: DEST_DIR + 'pdfviewer.css',
  };

  TARGETS.DOCANALYTICS = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js', 'ui.concierge.js']),
      addPrefix(LIB_DIR, ['underscore/underscore.js', 'backbone/backbone.js']),
      addPrefix(MODULE_DIR, ['ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.analytics.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCANALYTICSVIEW.src_css),
    dest_js: DEST_DIR + 'docanalytics_NB.js',
    dest_css: DEST_DIR + 'docanalytics.css',
  };

  TARGETS.YOUTUBEVIEWER = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      MODS.DOCVIEW_YOUTUBE.src_js,
      MODS.NOTEPANEVIEW_YOUTUBE.src_js,
      MODS.THREADVIEW.src_js,
      MODS.EDITORVIEW.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.youtubeviewer.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCVIEW_YOUTUBE.src_css,
      MODS.NOTEPANEVIEW_YOUTUBE.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'youtubeviewer_NB.js',
    dest_css: DEST_DIR + 'youtubeviewer.css',
  };

  TARGETS.COLLAGE = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      MODS.DOCVIEW_COLLAGE.src_js,
      MODS.NOTEPANEVIEW_COLLAGE.src_js,
      MODS.THREADVIEW.src_js,
      MODS.EDITORVIEW.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.collage.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCVIEW_COLLAGE.src_css,
      MODS.NOTEPANEVIEW_COLLAGE.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'collage_NB.js',
    dest_css: DEST_DIR + 'collage.css',
  };

  TARGETS.LOGOUT = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['logout.js'])),
    src_css: [],
    dest_js: DEST_DIR + 'logout_NB.js',
  };

  TARGETS.PASSWORD = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['password_reminder.js'])),
    src_css: [],
    dest_js: DEST_DIR + 'password_reminder_NB.js',
  };

  TARGETS.SPREADSHEET = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      MODS.SPREADSHEETVIEW.src_js,
      MODS.NOTEPANEVIEW_SPREADSHEET.src_js,
      MODS.DOCVIEW_SPREADSHEET.src_js,
      MODS.EDITORVIEW.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.spreadsheet.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.SPREADSHEETVIEW.src_css,
      MODS.NOTEPANEVIEW_SPREADSHEET.src_css,
      MODS.DOCVIEW_SPREADSHEET.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'spreadsheet_NB.js',
    dest_css: DEST_DIR + 'spreadsheet.css',
  };

  TARGETS.EMBEDOPENID = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['embedopenid.js'])),
    dest_js: DEST_DIR + 'embedopenid_NB.js',
  };

  TARGETS.SETTINGS = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js', 'ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['your_settings.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css', 'your_settings.css'])),
    dest_js: DEST_DIR + 'settings_NB.js',
    dest_css: DEST_DIR + 'settings.css',
  };

  TARGETS.DOCANALYTICS = {
    src_js: [].concat(
      addPrefix(LIB_DIR, ['jquery/1.8.3/jquery.min.js', 'jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js']),
      addPrefix(MODULE_DIR, ['ui.concierge.js']),
      addPrefix(LIB_DIR, ['underscore/underscore.js', 'backbone/backbone.js']),
      addPrefix(MODULE_DIR, ['ui.view.js', 'ui.perspective.js']),
      TARGETS.API.src_js,
      addPrefix(UI_DIR, ['conf.js', 'conf_local.js']),
      addPrefix(MODULE_DIR, ['pers.js']),
      addPrefix(UI_DIR, ['init.analytics.js', 'launch.js'])),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCANALYTICSVIEW.src_css),
    dest_js: DEST_DIR + 'docanalytics_NB.js',
    dest_css: DEST_DIR + 'docanalytics.css',
  };

  var JS_TARGETS = {};
  var i, src;
  for (i in TARGETS) {
    src = unique(TARGETS[i].src_js);
    if (src.length) {
      JS_TARGETS[i] = { src: src, dest: TARGETS[i].dest_js };
      JS_TARGETS[i].nonull = true;
    }
  }

  var CSS_TARGETS = {};
  for (i in TARGETS) {
    src = unique(TARGETS[i].src_css);
    if (src.length) {
      CSS_TARGETS[i] = { src: src, dest: TARGETS[i].dest_css };
      CSS_TARGETS[i].nonull = true;
    }

    if (TARGETS[i].servername) {
      CSS_TARGETS[i].servername = 'http://' + TARGETS[i].servername + '/';
    }
  }

  var ALL_TARGETS = {};
  for (i in JS_TARGETS) {
    ALL_TARGETS[i + '_js'] = JS_TARGETS[i];
  }

  for (i in CSS_TARGETS) {
    ALL_TARGETS[i + '_css'] = CSS_TARGETS[i];
  }

  //    console.log(JSON.stringify(CSS_TARGETS));
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
          '* Copyright (c) <%= gruytplayernt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
    },
    jshint: {
      src: ['Gruntfile.js', 'grunt.js', 'content/ui/admin/*.js'],
      options: {
        globals: {
          jQuery: false,
          console: false,
          alert: false,
          module:false,
          require:false,
          NB$:true,
          $: false,
          NB: false,
          escape: false,
          confirm: false,
          rangy: false,
          wgxpath: false,
          Backbone: false,
          _: false,
          swfobject: false,
          google: false,
          __nb_userinfo:true,
        },
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
      },
    },
    qunit: {
      files: ['templates/web/*.html'],
    },
    concat: JS_TARGETS,
    csslint: CSS_TARGETS,
    cssmin: CSS_TARGETS,
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js',
      },
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit',
    },
    uglify: {},
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  // grunt.registerTask('default', 'lint qunit concat min');
  // grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'cssmin']);
};
