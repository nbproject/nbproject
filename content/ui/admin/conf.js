/**
 * conf.js
 * Configuration Parameters for NB api
 * This module defines the namespace Conf
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*NBal  NB:true*/

define(function() {
  Conf = {};
  Conf.servers = {
    rpc: '',
    img: '',
    upload: '',

  };

  /*************************************************************************************
   * Replace "" (right below) with your invite key if you'd live to be automatically authenticated
   ************************************************************************************/
  Conf.identity = '';
  return Conf;
});
