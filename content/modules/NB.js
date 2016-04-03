/**
 * NB.js: Main module file
 *
Author
    cf AUTHORS.txt

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

 */
var NB;

if (NB && (typeof NB !== 'object')) {
  alert("Error: NB already exists and isn't an object!");
}

NB = {};

NB.log = function () {
  if (window.console) {
    console.log(arguments);
  }
};

NB.warn = function () {
  if (window.console) {
    console.warn(arguments);
  }
};

NB.error = function () {
  if (window.console) {
    console.error(arguments);
  }
};

NB.len = function (o) {
  var i = 0;
  for (i in o) {
    i++;
  }

  return i;
};

