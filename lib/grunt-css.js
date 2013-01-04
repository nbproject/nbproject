/*
 * grunt-css
 * https://github.com/jzaefferer/grunt-css
 *
 * Copyright (c) 2012 Jörn Zaefferer
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  function min_max(min, max) {
    var gzip = require('gzip-js');
    var gzipSize = String(gzip.zip(min, {}).length);
    grunt.log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
  }

  grunt.registerMultiTask( "csslint", "Lint CSS files with csslint", function() {
    var csslint = require( "csslint" ).CSSLint;
    var files = grunt.file.expandFiles( this.file.src );
    var ruleset = {};
    var verbose = grunt.verbose;
    csslint.getRules().forEach(function( rule ) {
      ruleset[ rule.id ] = 1;
    });
    for ( var rule in this.data.rules ) {
      if ( !this.data.rules[ rule ] ) {
        delete ruleset[rule];
      } else {
        ruleset[ rule ] = this.data.rules[ rule ];
      }
    }
    var hadErrors = 0;
    files.forEach(function( filepath ) {
      var file = grunt.file.read( filepath ),
        message = "Linting " + filepath + "...",
        result;

      // skip empty files
      if (file.length) {
        result = csslint.verify( file, ruleset );
        verbose.write( message );
        if (result.messages.length) {
          verbose.or.write( message );
          grunt.log.error();
        } else {
          verbose.ok();
        }

        result.messages.forEach(function( message ) {
          grunt.log.writeln( "[".red + (typeof message.line !== "undefined" ? ( "L" + message.line ).yellow + ":".red + ( "C" + message.col ).yellow : "GENERAL".yellow) + "]".red );
          grunt.log[ message.type === "error" ? "error" : "writeln" ]( message.message + " " + message.rule.desc + " (" + message.rule.id + ")" );
        });
        if ( result.messages.length ) {
          hadErrors += 1;
        }
      } else {
        grunt.log.writeln( "Skipping empty file " + filepath);
      }

    });
    if (hadErrors) {
      return false;
    }
    grunt.log.writeln( "Lint free files: " + files.length );
  });

  grunt.registerMultiTask( "cssmin", "Minify CSS files with Sqwish.", function() {
    // Get banner, if specified.
    var banner = grunt.task.directive( this.file.src[0], function() {
      return null;
    });
    if ( banner === null ) {
      banner = '';
    } else {
      // Remove banner from src files as it is removed with minification (L73) anyway
      this.file.src.shift();
    }
    var max = "", current;
    var dest = this.file.dest;
    var destPaths = dest.split("/"), srcPaths;
    var dots = function(n){
        s = "";
        for (var i =0;i<n;i++){
            s+="../";
        }
        return s;
    };
    var findMaxCommonIndex = function(a,b){
        var n =-1;
        for (var i = 0;i<Math.min(a.length, b.length);i++){
            if (a[i]===b[i]){
                n=i;
            }
        }
        return n;
    };

    grunt.file.expandFiles( this.file.src ).forEach(function(file){
            //find replacement string:
            srcPaths = file.split("/");
            maxCommonIndex = findMaxCommonIndex(srcPaths, destPaths);
            replacementString = dots(destPaths.length - 2) + srcPaths.slice(maxCommonIndex+1, -1).join("/")+"/" ;

            current = grunt.file.read(file);
            //the garbage after the comment on next line is to fix emacs syntax highlighting (doesn't parse the fact it's a regexp). 
            current = current.replace(/url\(([^"'\/])/g, "url("+replacementString+"$1"); // ")))); //replace relative non-quoted urls.
            current = current.replace(/url\(("|')([^\/])([^"']*)("|')/g, "url($1"+replacementString+"$2$3$4"); // replace relative quoted urls. 
            max+="\n/* Contents of "+file+" */\n"+current+"\n";
        });
    //console.log(max);
    var min = banner + require( "sqwish" ).minify( max, false );
    grunt.file.write( this.file.dest, min );
    grunt.log.writeln( "File '" + this.file.dest + "' created." );
    min_max( min, max );
  });

};
