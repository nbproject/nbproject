/**
 * auth.js: Convenience fcts for AUTH manipulation
 * see: http://www.elated.com/articles/javascript-and-cookies
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

*/

(function (GLOB) {
  GLOB.auth = {};
  GLOB.auth.set_cookie = function (name, value, expires_year, expires_month, expires_day, path, domain, secure) {
    var cookie_string = name + '=' + escape(value);

    if (expires_year)  {
      var expires = new Date(expires_year, expires_month, expires_day);
      cookie_string += '; expires=' + expires.toGMTString();
    }

    if (path) {
      cookie_string += '; path=' + escape(path);
    } else {
      cookie_string += '; path=/';
    }

    if (domain) {
      cookie_string += '; domain=' + escape(domain);
    }

    if (secure) {
      cookie_string += '; secure';
    }

    document.cookie = cookie_string;
  };

  GLOB.auth.delete_cookie = function (cookie_name, path) {
    document.cookie = cookie_name
      + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path='
      + (path ? escape(path) : '/')
      + ';';
  };

  GLOB.auth.get_cookie = function (cookie_name) {
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results) {
      return (unescape(results[2]));
    }    else {
      return null;
    }
  };
})(NB);
