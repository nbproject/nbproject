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
  var DEST_DIR = 'content/compiled/';

  /* MODS are modules that serve as building blocks, without being built themselves */
  var MODS = {};
  MODS.CONTEXTMENU = {
    src_css: addPrefix(LIB_DIR, ['contextmenu/jquery.contextMenu.css']),
  };
  MODS.FILTERWIZARD = {
    src_css: addPrefix(VIEWS_DIR, ['ui.filterwizard.css']),
  };
  MODS.FILTERWIZARDEMOTICON = {
    src_js: addPrefix(VIEWS_DIR, ["ui.filterwizardEmoticon.js" ]),
    src_css: addPrefix(VIEWS_DIR, ["ui.filterwizardEmoticon.css" ])
  };
  MODS.DUPLICATEWIZARD = {
    src_css: addPrefix(VIEWS_DIR, ['ui.duplicatewizard.css', 'ui.threadselect.css']),
  };
  MODS.TREEVIEW = {
    src_css: [].concat(addPrefix(LIB_DIR, ['jstree/themes/default/style.css']),
                       addPrefix(VIEWS_DIR, ['ui.treeview.css'])),
  };
  MODS.FILESVIEW = {
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(LIB_DIR, ['tablesorter/style.css', 'calendrical/calendrical.css']),
      addPrefix(VIEWS_DIR, ['ui.filesview.css'])),
  };
  MODS.DOCVIEW = {
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_COLLAGE = {
     src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_SPREADSHEET = {
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
    addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };
  MODS.DOCVIEW_YOUTUBE = {
    src_css: [].concat(
      addPrefix(MODULE_DIR, ['ui.drawable.css']),
      addPrefix(VIEWS_DIR, ['ui.docView.css'])),
  };

  MODS.NOTEPANEVIEW_DOC = {
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };

  MODS.NOTEPANEVIEW_COLLAGE = {
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };

  MODS.NOTEPANEVIEW_SPREADSHEET = {
    src_css: [].concat(
      MODS.CONTEXTMENU.src_css,
      addPrefix(VIEWS_DIR, ['ui.notepaneView.css'])),
  };
  MODS.NOTEPANEVIEW_YOUTUBE = {
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
    src_css: addPrefix(VIEWS_DIR, ['ui.editorview.css']),
  };

  MODS.SPREADSHEETVIEW = {
    src_css: addPrefix(VIEWS_DIR, ['ui.spreadsheetView1.css']),
  };

  MODS.DOCANALYTICSVIEW = {
    src_css: addPrefix(VIEWS_DIR, ['ui.docAnalyticsView.css']),
  };

  MODS.BREADCRUMB = {
    src_css: addPrefix(VIEWS_DIR, ['ui.breadcrumb.css'])
  };

  /* TARGETS are modules that are built (but they can also serve as building blocks) */
  var TARGETS = {};
  TARGETS.API =  {
    include: ['auth',  'dom', 'mvc', 'models'],
    src_js: [],
    dest_js: DEST_DIR + 'apidev_NB.js',
  };

  TARGETS.EMBED = {
    include: ['buildEmbed'],
    src_js: [].concat(['build_embed']),
    dest_js: DEST_DIR + 'embed_NB.js',
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css']),
      addPrefix(MODULE_DIR, ['ui.view.css', 'buildEmbed.css']),
      'content/ui/classic/base.css',
      addPrefix(UI_DIR, ['template.css']),
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_css: DEST_DIR + 'embed_NB.css',
    servername: servername,
  };

  TARGETS.DESKTOP = {
      // MODS.BREADCRUMB.src_js
    include: ['init_desktop', 'launch'],
    src_js: [].concat(['build_desktop']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      'content/ui/classic/base.css',
      addPrefix(UI_DIR, ['template.css']),
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'desktop_NB.js',
    dest_css: DEST_DIR + 'desktop.css',
  };

  TARGETS.DEVTEST = {
      // MODS.BREADCRUMB.src_js
    include: ['init_dev_test', 'launch'],
    src_js: [].concat(['build_devtest']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'dev_test_NB.js',
    dest_css: DEST_DIR + 'dev_test.css',
  };

  TARGETS.DEVTEST2 = {
      // MODS.BREADCRUMB.src_js
    include: ['init_dev_test2', 'launch'],
    src_js: [].concat(['build_devtest2']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'dev_test2_NB.js',
    dest_css: DEST_DIR + 'dev_test2.css',
  };

  TARGETS.PROPERTIES_ENSEMBLE_USERS = {
      // MODS.BREADCRUMB.src_js
    include: ['init_properties_ensemble_users', 'launch'],
    src_js: [].concat(['build_properties_ensemble_users']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'properties_ensemble_users_NB.js',
    dest_css: DEST_DIR + 'properties_ensemble_users.css',
  };

  TARGETS.STATIC_PAGE = {
      // MODS.BREADCRUMB.src_js
    include: ['init_static_page', 'launch'],
    src_js: [].concat(['build_static_page']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/css/smoothness/jquery-ui-1.9.2.custom.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'static_page_NB.js',
    dest_css: DEST_DIR + 'static_page.css',
  };

  TARGETS.LOGIN = {
    include: ['login'],
    src_js: [].concat(['build_login']),
    src_css: [].concat(
      addPrefix(UI_DIR, ['template.css'])),
    dest_js: DEST_DIR + 'login_NB.js',
    dest_css: DEST_DIR + 'login.css',
  };

  TARGETS.PDFVIEWER = {
    include: ['init_pdfviewer', 'launch'],
    src_js: [].concat(['build_pdfviewer']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.DOCVIEW.src_css,
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'pdfviewer_NB.js',
    dest_css: DEST_DIR + 'pdfviewer.css',
  };

  TARGETS.DOCANALYTICS = {
    include: ['init_analytics', 'launch'],
    src_js: [].concat(['build_analytics']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      MODS.DOCANALYTICSVIEW.src_css),
    dest_js: DEST_DIR + 'docanalytics_NB.js',
    dest_css: DEST_DIR + 'docanalytics.css',
  };

  TARGETS.YOUTUBEVIEWER = {
    include: ['init_youtubeviewer', 'launch'],
    src_js: [].concat(['build_youtubeviewer']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.DOCVIEW_YOUTUBE.src_css,
      MODS.NOTEPANEVIEW_YOUTUBE.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'youtubeviewer_NB.js',
    dest_css: DEST_DIR + 'youtubeviewer.css',
  };

  TARGETS.COLLAGE = {
    include: ['init_collage', 'launch'],
    src_js: [].concat(['build_collage']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
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
    include: [],
    src_js: [].concat(['build_logout']),
    src_css: [],
    dest_js: DEST_DIR + 'logout_NB.js',
  };

  TARGETS.PASSWORD = {
    include: ['password_reminder'],
    src_js: [].concat(['build_passwordreminder']),
    src_css: [],
    dest_js: DEST_DIR + 'password_reminder_NB.js',
  };

  TARGETS.SPREADSHEET = {
    include: ['init_spreadsheet', 'launch'],
    src_js: [].concat(['build_spreadsheet']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css',
      MODS.SPREADSHEETVIEW.src_css,
      MODS.NOTEPANEVIEW_SPREADSHEET.src_css,
      MODS.DOCVIEW_SPREADSHEET.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'spreadsheet_NB.js',
    dest_css: DEST_DIR + 'spreadsheet.css',
  };

  TARGETS.EMBEDOPENID = {
    include: ['embedopenid'],
    src_js: [].concat(['build_embedopenid']),
    dest_js: DEST_DIR + 'embedopenid_NB.js',
  };

  TARGETS.SETTINGS = {
    include: ['your_settings'],
    src_js: [].concat(['build_yoursettings']),
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery_ui/jquery-ui.css']),
      addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.view.css']),
      addPrefix(UI_DIR, ['template.css', 'your_settings.css'])),
    dest_js: DEST_DIR + 'settings_NB.js',
    dest_css: DEST_DIR + 'settings.css',
  };

  var JS_TARGETS = {};
  var i, src;
  for (i in TARGETS) {
    src = unique(TARGETS[i].src_js);
    if (src.length) {
      JS_TARGETS[i] = { src: src, dest: TARGETS[i].dest_js, include: TARGETS[i].include};
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

  var requirejsOptions = {};
  for (var key in JS_TARGETS) {
    var str = JS_TARGETS[key].src[0];
    if (str == null) {
      str = "";
    }
    requirejsOptions['task' + key] = {
      'options' : {
        baseUrl: 'content/',
        mainConfigFile: 'content/common.js',
        include: JS_TARGETS[key].include,
        // exclude: ['common'],
        name: str.substring(str.indexOf('/') + 1, str.length),
        out: JS_TARGETS[key].dest,
        optimize: 'none'
      }
    };
  }

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
    requirejs: requirejsOptions,
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task.
  // grunt.registerTask('default', 'lint qunit concat min');
  // grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['requirejs', 'cssmin']);
};
