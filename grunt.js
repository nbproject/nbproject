/*global module:false console:true*/
module.exports = function(grunt) {
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
    var DEST_DIR = "content/compiled/";

    /* MODS are modules that serve as building blocks, without being built themselves */
    var MODS = {};
    MODS.CONTEXTMENU = {
        src_js: addPrefix(MODULE_DIR,["contextmenu/jquery.contextMenu.js"]),
        src_css:  addPrefix(MODULE_DIR, ["contextmenu/jquery.contextMenu.css"])
    };
    MODS.TREEVIEW = {
        src_js: addPrefix(MODULE_DIR,["jstree/jquery.jstree.js", "dev/ui.treeview7.js"]), 
        src_css:  addPrefix(MODULE_DIR, ["jstree/themes/default/style.css" , "dev/ui.treeview4.css"])
    };  
    MODS.FILESVIEW = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["tablesorter/jquery.tablesorter.min.js", "calendrical/jquery.calendrical.js", "dev/ui.filesview4.js"])),
        src_css:  [].concat(
                            MODS.CONTEXTMENU.src_css,
                            addPrefix(MODULE_DIR, ["tablesorter/style.css", "calendrical/calendrical.css", "dev/ui.filesview.css"]))
    };  
    MODS.DOCVIEW = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView8.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView5.css"])
    };  
    MODS.DOCVIEW_COLLAGE = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.drawable4.js", "dev/ui.docView9.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.drawable.css", "dev/ui.docView5.css"])
    };  
    MODS.NOTEPANEVIEW_DOC = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView8.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.notepaneView6.css"]))
    };
    MODS.NOTEPANEVIEW_COLLAGE = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.notepaneView9.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.notepaneView6.css"]))
    };
    MODS.THREADVIEW = {
        src_js: [].concat(
                          MODS.CONTEXTMENU.src_js, 
                          addPrefix(MODULE_DIR,["dev/ui.threadview2.js"])),
        src_css:   [].concat(
                             MODS.CONTEXTMENU.src_css, 
                             addPrefix(MODULE_DIR, ["dev/ui.threadview1.css"]))
    };
    MODS.EDITORVIEW = {
        src_js: addPrefix(MODULE_DIR,["dev/ui.editorview2.js" ]),
        src_css:  addPrefix(MODULE_DIR, ["dev/ui.editorview1.css"])
    };




    /* TARGETS are modules that are built (but they can also serve as building blocks) */
    var TARGETS = {};
    TARGETS.API =  {
        src_js: addPrefix(MODULE_DIR, ["NB.js", "auth.js",  "dom.js", "mvc.js", "dev/models2.js"]), 
        dest_js: DEST_DIR+"apidev.js"
    };
    TARGETS.TRAIL = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js",  "dev/ui.concierge1.js"]), 
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers2.js", "dev/buildTrail.js"])
                          ), 
        dest_js:  DEST_DIR+"buildTrail.js"
    };
    TARGETS.EMBED = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge1.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view5.js", "dev/ui.perspective5.js"]),
                          MODS.NOTEPANEVIEW_DOC.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          TARGETS.API.src_js,
                          addPrefix(UI_DIR,["conf.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers2.js", "dev/buildEmbed.js"])
                          ), 
        dest_js:  DEST_DIR+"buildEmbed.js", 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "superfish-1.4.8/css/superfish.css", "ui.view.css", "dev/buildEmbed.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.NOTEPANEVIEW_DOC.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ),
        dest_css:  DEST_DIR+"buildEmbed.css"
                           
    };


    TARGETS.DESKTOP = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge1.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view5.js", "dev/ui.perspective5.js"]),
                          TARGETS.API.src_js,
                          MODS.TREEVIEW.src_js, 
                          MODS.FILESVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers2.js", "dev/files.js"]), 
                          addPrefix(UI_DIR, ["step21.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "superfish-1.4.8/css/superfish.css", "ui.view.css"]), 

                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.TREEVIEW.src_css, 
                           MODS.FILESVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"desktop.js",
        dest_css:  DEST_DIR+"desktop.css"
        
    };    


    TARGETS.PDFVIEWER = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge1.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view5.js", "dev/ui.perspective5.js"]),
                          TARGETS.API.src_js,

                          MODS.DOCVIEW.src_js, 
                          MODS.NOTEPANEVIEW_DOC.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers2.js"]), 
                          addPrefix(UI_DIR, ["step16.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "superfish-1.4.8/css/superfish.css", "ui.view.css"]), 
                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.DOCVIEW.src_css, 
                           MODS.NOTEPANEVIEW_DOC.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"pdfviewer.js",
        dest_css:  DEST_DIR+"pdfviewer.css"
        
    };    

    TARGETS.COLLAGE = {
        src_js: [].concat(
                          addPrefix(MODULE_DIR, ["jquery/1.8.3/jquery.min.js", "jquery_ui/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js", "dev/ui.concierge1.js"]), 
                          addPrefix(MODULE_DIR, ["dev/ui.view5.js", "dev/ui.perspective5.js"]),
                          TARGETS.API.src_js,
                          MODS.DOCVIEW_COLLAGE.src_js, 
                          MODS.NOTEPANEVIEW_COLLAGE.src_js,
                          MODS.THREADVIEW.src_js,
                          MODS.EDITORVIEW.src_js,
                          addPrefix(UI_DIR,["conf.js", "conf_local.js"]), 
                          addPrefix(MODULE_DIR, ["dev/pers2.js"]), 
                          addPrefix(UI_DIR, ["step18.js", "launch.js"])
                          ), 
        src_css: [].concat( 
                           addPrefix(MODULE_DIR, ["jquery_ui/jquery-ui-1.9.2.custom/css/smoothness/jquery-ui-1.9.2.custom.css", "ui.perspective.css", "ui.viewport.css", "superfish-1.4.8/css/superfish.css", "ui.view.css"]), 

                           addPrefix(UI_DIR, ["template.css"]),
                           MODS.DOCVIEW_COLLAGE.src_css, 
                           MODS.NOTEPANEVIEW_COLLAGE.src_css, 
                           MODS.THREADVIEW.src_css, 
                           MODS.EDITORVIEW.src_css
                            ), 
        dest_js:  DEST_DIR+"collage.js",
        dest_css:  DEST_DIR+"collage.css"
        
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
            CSS_TARGETS[i] = {src: src, dest: TARGETS[i].dest_css};
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
