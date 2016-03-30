/**
 * conf.js
 * Configuration Parameters for NB api
 * This module defines the namespace NB.conf
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global  NB:true*/

(function (GLOB) {
  GLOB.conf = {};
  GLOB.conf.servers = {
    rpc: '',
    img: '',
    upload: '',

  };

  /*************************************************************************************
   * Replace "" (right below) with your invite key if you'd live to be automatically authenticated
   ************************************************************************************/
  GLOB.conf.identity = '';
})(NB);
