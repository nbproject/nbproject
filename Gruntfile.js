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
  MODS.JQUI = {
    src_css: addPrefix(LIB_DIR, ['jquery-ui/1.12.1/jquery-ui.css',
				   'jquery-ui/1.12.1/jquery-ui.theme.css',
				   'jquery-ui/1.12.1/jquery-ui.structure.css'])
  };
  MODS.CORE = {
      src_css: [].concat(
          addPrefix(MODULE_DIR, ['ui.perspective.css', 'ui.viewport.css', 'ui.menu.css','ui.view.css']),
          'content/ui/classic/base.css',
	  addPrefix(UI_DIR, ['template.css'])
      )
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
    src_js: ['build_embed'],
    dest_js: DEST_DIR + 'embed_NB.js',
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      addPrefix(MODULE_DIR, ['buildEmbed.css']),
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_css: DEST_DIR + 'embed_NB.css',
    servername: servername,
  };

  TARGETS.NEWSITE = {
    include: ['init_newsite', 'launch'],
    src_js: ['build_newsite'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'newsite_NB.js',
    dest_css: DEST_DIR + 'newsite.css',
  };

  TARGETS.DESKTOP = {
    include: ['init_desktop', 'launch'],
    src_js: ['build_desktop'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
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

  TARGETS.PROPERTIES_ENSEMBLE_USERS = {
      // MODS.BREADCRUMB.src_js
    include: ['init_properties_ensemble_users', 'launch'],
    src_js: ['build_properties_ensemble_users'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
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

  TARGETS.PROPERTIES_ENSEMBLE = {
    include: ['init_properties_ensemble', 'launch'],
    src_js: ['build_properties_ensemble'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'properties_ensemble_NB.js',
    dest_css: DEST_DIR + 'properties_ensemble.css',
  };

  TARGETS.PROPERTIES_ENSEMBLE_SECTIONS = {
    include: ['init_properties_ensemble_sections', 'launch'],
    src_js: ['build_properties_ensemble_sections'],
    src_css: [].concat(
      addPrefix(LIB_DIR, ['jquery-ui/1.12.1/jquery-ui.theme.css',
      'DataTables-1.10.12/media/css/jquery.dataTables.css']),
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'properties_ensemble_sections_NB.js',
    dest_css: DEST_DIR + 'properties_ensemble_sections.css',
  };

  TARGETS.SUBSCRIBE = {
    include: ['init_subscribe', 'launch'],
    src_js: ['build_subscribe'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'subscribe_NB.js',
    dest_css: DEST_DIR + 'subscribe.css',
  };

  TARGETS.ADD_NAVBAR = {
    include: ['init_add_navbar', 'launch'],
    src_js: ['build_add_navbar'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.FILTERWIZARD.src_css,
      MODS.FILTERWIZARDEMOTICON.src_css,
      MODS.DUPLICATEWIZARD.src_css,
      MODS.TREEVIEW.src_css,
      MODS.FILESVIEW.src_css,
      MODS.BREADCRUMB.src_css
    ),
    dest_js: DEST_DIR + 'add_navbar_NB.js',
    dest_css: DEST_DIR + 'add_navbar.css',
  };

  TARGETS.LOGIN = {
    include: ['login', 'launch'],
    src_js: ['build_login'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css'),
    dest_js: DEST_DIR + 'login_NB.js',
    dest_css: DEST_DIR + 'login.css',
  };

  TARGETS.PDFVIEWER = {
    include: ['init_pdfviewer', 'launch'],
    src_js: ['build_pdfviewer'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.DOCVIEW.src_css,
      MODS.NOTEPANEVIEW_DOC.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'pdfviewer_NB.js',
    dest_css: DEST_DIR + 'pdfviewer.css',
  };

  TARGETS.DOCANALYTICS = {
    include: ['init_analytics', 'launch'],
    src_js: ['build_analytics'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
     addPrefix(VIEWS_DIR, ['ui.docAnalyticsView.css'])
    ),
    dest_js: DEST_DIR + 'docanalytics_NB.js',
    dest_css: DEST_DIR + 'docanalytics.css',
  };

  TARGETS.YOUTUBEVIEWER = {
    include: ['init_youtubeviewer', 'launch'],
    src_js: ['build_youtubeviewer'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.DOCVIEW_YOUTUBE.src_css,
      MODS.NOTEPANEVIEW_YOUTUBE.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'youtubeviewer_NB.js',
    dest_css: DEST_DIR + 'youtubeviewer.css',
  };

  TARGETS.COLLAGE = {
    include: ['init_collage', 'launch'],
    src_js: ['build_collage'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.DOCVIEW_COLLAGE.src_css,
      MODS.NOTEPANEVIEW_COLLAGE.src_css,
      MODS.THREADVIEW.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'collage_NB.js',
    dest_css: DEST_DIR + 'collage.css',
  };

  TARGETS.LOGOUT = {
    include: ['logout', 'launch'],
    src_js: ['build_logout'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css'),
    dest_js: DEST_DIR + 'logout_NB.js',
    dest_css: DEST_DIR + 'logout.css'
  };

  TARGETS.PASSWORD = {
    include: ['password_reminder', 'launch'],
    src_js: ['build_passwordreminder'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      addPrefix(UI_DIR, ['template.css']),
      'content/ui/classic/base.css'),
    dest_js: DEST_DIR + 'password_reminder_NB.js',
    dest_css: DEST_DIR + 'password.css'
  };

  TARGETS.SPREADSHEET = {
    include: ['init_spreadsheet', 'launch'],
    src_js: ['build_spreadsheet'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      MODS.SPREADSHEETVIEW.src_css,
      MODS.NOTEPANEVIEW_SPREADSHEET.src_css,
      MODS.DOCVIEW_SPREADSHEET.src_css,
      MODS.EDITORVIEW.src_css),
    dest_js: DEST_DIR + 'spreadsheet_NB.js',
    dest_css: DEST_DIR + 'spreadsheet.css',
  };

  TARGETS.EMBEDOPENID = {
    include: ['embedopenid'],
    src_js: ['build_embedopenid'],
    dest_js: DEST_DIR + 'embedopenid_NB.js',
  };

  TARGETS.SETTINGS = {
    include: ['your_settings', 'launch'],
    src_js: ['build_yoursettings'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css,
      addPrefix(UI_DIR, ['your_settings.css'])
    ),
    dest_js: DEST_DIR + 'settings_NB.js',
    dest_css: DEST_DIR + 'settings.css',
  };

  TARGETS.ENTER_YOUR_NAME = {
    include: ['init_enteryourname', 'launch'],
    src_js: ['build_enteryourname'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css
    ),
    dest_js: DEST_DIR + 'enteryourname_NB.js',
    dest_css: DEST_DIR + 'enteryourname.css',
  };

  TARGETS.CONFIRM_INVITE = {
    include: ['init_confirm_invite', 'launch'],
    src_js: ['build_confirm_invite'],
    src_css: [].concat(
      MODS.JQUI.src_css,
      MODS.CORE.src_css
    ),
    dest_js: DEST_DIR + 'confirm_invite_NB.js',
    dest_css: DEST_DIR + 'confirm_invite.css',
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
      CSS_TARGETS[i].servername = '//' + TARGETS[i].servername + '/';
    }
  }
/*
  var ALL_TARGETS = {};
  for (i in JS_TARGETS) {
    ALL_TARGETS[i + '_js'] = JS_TARGETS[i];
  }

  for (i in CSS_TARGETS) {
    ALL_TARGETS[i + '_css'] = CSS_TARGETS[i];
  }
*/
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
    copy: {
        files: {
            cwd: 'content/lib/jquery-ui/1.12.1/images/',
            src: '**/*',
            dest: 'content/compiled/images/',
            expand: true 
        }
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
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  // grunt.registerTask('default', 'lint qunit concat min');
  // grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['requirejs', 'cssmin', 'copy']);
};
