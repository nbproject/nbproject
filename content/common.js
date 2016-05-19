requirejs.config({
  baseUrl: '/content',
  paths: {
    // RequireJS
    'requirescript': 'lib/requirejs/require',

    // All external dependencies
    'backbone': 'lib/backbone/backbone',
    'calendrical': 'lib/calendrical/jquery.calendrical',
    'contextmenu': 'lib/contextmenu/jquery.contextMenu',
    'contextmenu_position': 'lib/contextmenu/jquery.ui.position',
    'dateformat': 'lib/dateformat/date.format',
    'jquery': 'lib/jquery/1.8.3/jquery.min',
    'jquery_ui': 'lib/jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min',
    'jstree': 'lib/jstree/jquery.jstree',
    'rangy-classapplier': 'lib/rangy/rangy-classapplier',
    'rangy-core': 'lib/rangy/rangy-core',
    'rangy-serializer': 'lib/rangy/rangy-serializer',
    'rangy-textrange': 'lib/rangy/rangy-textrange',
    'tablesorter': 'lib/tablesorter/jquery.tablesorter.min',
    'underscore': 'lib/underscore/underscore',
    'wgxpath': 'lib/wgxpath/wgxpath.install',

    // modules
    'auth': 'modules/auth',
    'buildEmbed': 'modules/buildEmbed',
    'docviewHtml': 'modules/docviewHtml5',
    'dom': 'modules/dom',
    'files': 'modules/files',
    'models': 'modules/models',
    'mvc': 'modules/mvc',
    'pers': 'modules/pers',
    'concierge': 'modules/ui.concierge',
    'drawable': 'modules/ui.drawable4',
    'perspective': 'modules/ui.perspective',
    'view': 'modules/ui.view',

    // admin
    'conf': 'ui/admin/conf',
    'conf_local': 'ui/admin/conf_local',
    'embedopenid': 'ui/admin/embedopenid',
    'init_analytics': 'ui/admin/init.analytics',
    'init_desktop': 'ui/admin/init.desktop',
    'init_collage': 'ui/admin/init.collage',
    'init_pdfviewer': 'ui/admin/init.pdfviewer',
    'init_spreadsheet': 'ui/admin/init.spreadsheet',
    'init_youtubeviewer': 'ui/admin/init.youtubeviewer',
    'launch': 'ui/admin/launch',
    'login': 'ui/admin/login',
    'logout': 'ui/admin/logout',
    'password_reminder': 'ui/admin/password_reminder',
    'your_settings': 'ui/admin/your_settings',

    // views
    'breadcrumb': 'views/ui.breadcrumb',
    'docview_collage': 'views/ui.docView.collage',
    'docview_pdf': 'views/ui.docView.pdf',
    'docview_spreadsheet': 'views/ui.docView.spreadsheet',
    'docview_video': 'views/ui.docView.video',
    'duplicatewizard': 'views/ui.duplicatewizard',
    'editorview': 'views/ui.editorview',
    'filterwizard': 'views/ui.filterwizard',
    'filterwizardEmoticon': 'views/ui.filterwizardEmoticon',
    'filesview': 'views/ui.filesview',
    'notepane_collage': 'views/ui.notepaneView.collage',
    'notepane_doc': 'views/ui.notepaneView.doc',
    'notepane_spreadsheet': 'views/ui.notepaneView.spreadsheet',
    'notepane_video': 'views/ui.notepaneView.video',
    'spreadsheetview': 'views/ui.spreadsheetView1',
    'threadselect': 'views/ui.threadselect',
    'treeview': 'views/ui.treeview',
    'threadview': 'views/ui.threadview',

    // build scripts
    'build_analytics': 'build-scripts/build-analytics',
    'build_collage': 'build-scripts/build-collage',
    'build_desktop': 'build-scripts/build-desktop',
    'build_embed': 'build-scripts/build-embed',
    'build_embedopenid': 'build-scripts/build-embedopenid',
    'build_login': 'build-scripts/build-login',
    'build_logout': 'build-scripts/build-logout',
    'build_passwordreminder': 'build-scripts/build-passwordreminder',
    'build_pdfviewer': 'build-scripts/build-pdfviewer',
    'build_spreadsheet': 'build-scripts/build-spreadsheet',
    'build_yoursettings': 'build-scripts/build-yoursettings',
    'build_youtubeviewer': 'build-scripts/build-youtubeviewer',

  },
  shim: {
    'jquery': {
        exports: '$'
    },
    'jquery_ui': {
        deps: ['jquery'],
    },
    'concierge': {
        deps: ['jquery'],
        exports: 'concierge'
    },
    'contextmenu': {
        deps: ['contextmenu_position'],
        exports: 'contextmenu'
    },
    'jstree': {
        deps: ['jquery']
    },
    'tablesorter': {
        deps: ['jquery']
    },
    'dateformat': {
    },
    'calendrical': {
        deps: ['jquery']
    },
    'backbone': {
        deps: ['underscore'],
        exports: 'Backbone'
    },
    'underscore': {
        exports: 'underscore'
    },
  }
});
