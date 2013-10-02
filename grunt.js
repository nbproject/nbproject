/*global module:false console:true require:false*/
module.exports = function(grunt) {
    var execSync = require('execSync');
    var execFct = execSync.exec || execSync.stdout; // in order to be compatible with both grunt 0.3 and 0.4
    var servername = execFct("python -c 'from __future__ import print_function;from  apps.settings import NB_SERVERNAME;print(NB_SERVERNAME, end=\"\")'");
    var serverport = execFct("python -c 'from __future__ import print_function;from  apps.settings import NB_HTTP_PORT;print(NB_HTTP_PORT, end=\"\")'");
    if (serverport !== "80"){
        servername += ":"+serverport;
    }
    var addPrefix = function(prefix, names){
        /*
         * given a prefix and an array, returns a new array where each element 
         * is prefixed by the prefix
         */
        var output = [];
        for (var i in names){
            output.push(prefix+names[i]);
        }             
        return output;
    }; 
    var unique = function(names){
        /*
         * returns a new array with the subsequent occurences of a string removed. 
         * for instance unique(["a", "b", "c", "a", "d", "a"]) returns ["a", "b", "c", "d"]
         */
        var index = {};
        var output = [];
        for (var i in names){
            if (!(names[i] in index)){
                index[names[i]] = null;
                output.push(names[i]);
            }
        }
        return output;
    };
    var MODULE_DIR = "content/modules/";
    var UI_DIR = "content/ui/admin/";
    var UITEST_DIR = "content/ui/test/";
    var DEST_DIR = "content/compiled/";

    /* MODS are modules that serve as building blocks, without being built themselves */
    var MODS = {};
    MODS.CONTEXTMENU = {
        src_js: addPrefix(MODULE_DIR,["contextmenu/jquery.contextMenu.js"]),
        src_css:  addPrefix(MODULE_DIR, ["contextmenu/jquery.contextMenu.css"])
    };
    MODS.TREEVIEW = {
        src_js: addPrefix(MODULE_DIR,["jstree/jquery.jstree.js", "dev/ui.treeview.js"]), 
        src_css:  addPrefix(MODULE_DIR, ["jstree/themes/default/style.css" , "dev/ui.treeview.css"])
    };  
    MODS.FILESVIEW = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["tablesorter/jquery.tablesorter.min.js", "calendrical/jquery.calendrical.js", "dev/ui.filesview.js"])),
        src_css:  [].concat(
                            MODS.CONTEXTMENU.src_css,
                            addPrefix(MODULE_DIR, ["tablesorter/style.css", "calendrical/calendrical.css", "dev/ui.filesview.css"]))
    };  
    MODS.DOCVIEW = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView8.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView.css"])
    };  
    MODS.DOCVIEW_COLLAGE = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView9.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView.css"])
    };  
    MODS.DOCVIEW_SPREADSHEET = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView10.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView.css"])
    };  
     MODS.DOCVIEW_YOUTUBE = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView11.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView.css"])
    }; 
    
    MODS.NOTEPANEVIEW_DOC = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView.doc.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.notepaneView.css"]))
    };
    MODS.NOTEPANEVIEW_COLLAGE = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView.collage.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.notepaneView.css"]))
    };
    MODS.NOTEPANEVIEW_SPREADSHEET = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js,
                          addPrefix(MODULE_DIR,["dateformat/date.format.js"]),
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView.spreadsheet.js"])),
        src_css: [].concat(
                           MODS.CONTEXTMENU.src_css, 
                           addPrefix(MODULE_DIR, ["dev/ui.notepaneView.css"]))
    };
    MODS.NOTEPANEVIEW_YOUTUBE = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView.video.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.notepaneView.css"]))
    };

    MODS.THREADVIEW = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js,
                          addPrefix(MODULE_DIR,["dateformat/date.format.js"]),
                          addPrefix(MODULE_DIR,["dev/ui.threadview.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.threadview.css"]))
    };

    MODS.EDITORVIEW = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.editorview.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.editorview.css"])
    };
    MODS.RANGY = {
        src_js: addPrefix(MODULE_DIR+"rangy/",["rangy-core.js", "rangy-cssclassapplier.js", "rangy-textrange.js", "termfix.js" ]),
        src_css:  []
    };
    MODS.SPREADSHEETVIEW = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.spreadsheetView1.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.spreadsheetView1.css"])
    };



    /* TARGETS are modules that are built (but they can also serve as building blocks) */
    var TARGETS = {};
    TARGETS.API =  {
        src_js: addPrefix(MODULE_DIR, ["NB.js", "auth.js",  "dom.js", "mvc.js", "dev/models.js"]), 
        dest_js: DEST_DIR+"apidev_NB.js"
    };

    TARGETS.TRAIL = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js",  "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dateformat/date.format.js"]),
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]),
                          addPrefix(MODULE_DIR, ["dev/pers.js", "dev/buildTrail.js"])
                          ), 
        dest_js:  DEST_DIR+"buildTrail_NB.js"
    };
    TARGETS.EMBED = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          MODS.NOTEPANEVIEW_DOC.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          TARGETS.API.src_js,
                          MODS.RANGY.src_js, 
                          addPrefix(MODULE_DIR, ["wgxpath/wgxpath.install.js"]),
                          addPrefix(MODULE_DIR+"wgxpath/",["termfix.js" ]),
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js", "dev/docviewHtml5.js", "dev/buildEmbed.js"])
                          ), 
        dest_js:  DEST_DIR+"embed_NB.js", 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css", "dev/buildEmbed.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.NOTEPANEVIEW_DOC.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ),
        dest_css:  DEST_DIR+"embed_NB.css",
        servername: servername
    };


    TARGETS.DESKTOP = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,
                          MODS.TREEVIEW.src_js, 
                          MODS.FILESVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js", "dev/files.js"]), 
                          addPrefix(UI_DIR, ["init.desktop.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css"]), 

                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.TREEVIEW.src_css, 
                           MODS.FILESVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"desktop_NB.js",
        dest_css:  DEST_DIR+"desktop.css"
        
    };    

    TARGETS.LOGIN = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "dev/ui.concierge.js"]), 
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR, ["login.js"])
                          ),
        src_css: [].concat(
                           addPrefix(UI_DIR, ["template.css"])
                            ), 
        dest_js:  DEST_DIR+"login_NB.js",
        dest_css:  DEST_DIR+"login.css"
        
    };    

    TARGETS.PDFVIEWER = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,

                          MODS.DOCVIEW.src_js, 
                          MODS.NOTEPANEVIEW_DOC.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR, ["init.pdfviewer.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.DOCVIEW.src_css, 
                           MODS.NOTEPANEVIEW_DOC.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"pdfviewer_NB.js",
        dest_css:  DEST_DIR+"pdfviewer.css"
    };    

 TARGETS.YOUTUBEVIEWER = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,
                          MODS.DOCVIEW_YOUTUBE.src_js, 
                          MODS.NOTEPANEVIEW_YOUTUBE.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR, ["init.youtubeviewer.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.DOCVIEW_YOUTUBE.src_css, 
                           MODS.NOTEPANEVIEW_YOUTUBE.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"youtubeviewer_NB.js",
        dest_css:  DEST_DIR+"youtubeviewer.css"
        
    };    

    TARGETS.COLLAGE = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,
                          MODS.DOCVIEW_COLLAGE.src_js, 
                          MODS.NOTEPANEVIEW_COLLAGE.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR, ["init.collage.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css"]), 

                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.DOCVIEW_COLLAGE.src_css, 
                           MODS.NOTEPANEVIEW_COLLAGE.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"collage_NB.js",
        dest_css:  DEST_DIR+"collage.css"
        
    }; 
    
    TARGETS.LOGOUT = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "dev/ui.concierge.js"]), 
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR,["logout.js"]) 
                          ), 
        src_css: [], 
        dest_js:  DEST_DIR+"logout_NB.js"
    };

    TARGETS.PASSWORD = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "dev/ui.concierge.js"]), 
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR,["password_reminder.js"]) 
                          ), 
        src_css: [], 
        dest_js:  DEST_DIR+"password_reminder_NB.js"
    };

    TARGETS.SPREADSHEET = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,
                          MODS.SPREADSHEETVIEW.src_js,
                          MODS.NOTEPANEVIEW_SPREADSHEET.src_js,
                          MODS.DOCVIEW_SPREADSHEET.src_js, 
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR, ["init.spreadsheet.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "ui.menu.css", "ui.view.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.SPREADSHEETVIEW.src_css,
                           MODS.NOTEPANEVIEW_SPREADSHEET.src_css, 
                           MODS.DOCVIEW_SPREADSHEET.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"spreadsheet_NB.js",
        dest_css:  DEST_DIR+"spreadsheet.css"
        
    }; 
    
    TARGETS.EMBEDOPENID = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "dev/ui.concierge.js"]),                         
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR,["embedopenid.js"])
                          ), 
        dest_js:  DEST_DIR+"embedopenid_NB.js"
    };

    TARGETS.SETTINGS = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge.js"]),                         
                          addPrefix(MODULE_DIR, ["dev/ui.view.js", "dev/ui.perspective.js"]),
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers.js"]), 
                          addPrefix(UI_DIR,["your_settings.js"])
                          ), 
        src_css: [].concat(
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "dev/ui.view.css"]),
                           addPrefix(UI_DIR, ["template.css", "your_settings.css"])
                           ),
        dest_js:  DEST_DIR+"settings_NB.js",
	dest_css: DEST_DIR+"settings.css"
    };

    var JS_TARGETS = {};
    var i, src;
    for (i in TARGETS){
        src = unique(TARGETS[i].src_js);
        if (src.length){
            JS_TARGETS[i] = {src: src, dest: TARGETS[i].dest_js};
        }
    }
    var CSS_TARGETS = {};
    for (i in TARGETS){
        src = unique(TARGETS[i].src_css);
        if (src.length){
            CSS_TARGETS[i] = {src: src, dest: TARGETS[i].dest_css };
        }
        if (TARGETS[i].servername){
            CSS_TARGETS[i].servername = "http://"+TARGETS[i].servername+"/";
        }
    }
    var ALL_TARGETS = {};
    for (i in JS_TARGETS){
        ALL_TARGETS[i+"_js"] = JS_TARGETS[i];
    }
    for (i in CSS_TARGETS){
        ALL_TARGETS[i+"_css"] = CSS_TARGETS[i];
    }
    //    console.log(JSON.stringify(CSS_TARGETS));
    // Project configuration.
    grunt.initConfig({
            pkg: '<json:package.json>',
                meta: {
                banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
                    },
                lint: {
                files: ['grunt.js', 'content/ui/admin/*.js', 'content/modules/dev/*.js']
                    },
                qunit: {
                files: ['templates/web/*.html']
                    },
                concat: JS_TARGETS,
                csslint: CSS_TARGETS, 
                cssmin: CSS_TARGETS, 
                min: {
                dist: {
                    src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                        dest: 'dist/<%= pkg.name %>.min.js'
                        }
            },
                watch: {
                files: '<config:lint.files>',
                    tasks: 'lint qunit'
                    },
                jshint: {
                options: {
                    curly: true,
                        eqeqeq: true,
                        immed: true,
                        latedef: true,
                        newcap: true,
                        noarg: true,
                        sub: true,
                        undef: true,
                        boss: true,
                        eqnull: true,
                        browser: true
                        },
                    globals: {}
            },
                uglify: {}
        });
   

    grunt.loadNpmTasks('grunt-css');
    
        
    // Default task.
    // grunt.registerTask('default', 'lint qunit concat min');
    grunt.registerTask('default', 'lint concat  cssmin');
};
