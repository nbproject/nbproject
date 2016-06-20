/*
 * step21.js:
 * Requires the following modules:
 *        Module
 *        NB
 *        NB.auth
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global unescape:true NB:true NB$:true jQuery:true alert:false*/

define(function(require) {
  var $               = require('jquery');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  require('tablesorter');

  Pers.init = function () {
    // $(".nb-widget-body").append(require('hbs!templates_dir/welcome')());
    var url_parts = window.location.href.toString().split("/");
    var class_id = url_parts[url_parts.length - 1];
    console.log(">>>k Todo: delete these next 2 lines below");
    console.log(class_id);
    class_id = 5;

    var payload = {
      "payload":{"id_ensemble":class_id},
      "types":["sections", "all_members", "ensembles"]};
    var cb = function(p) {
    	$.L(p);
    	$.L(p.ensembles[class_id]);
      var obj = {
        "ensemble": p.ensembles[class_id],
        "memberships": p.all_members.registered,
        "pendinginvites": p.all_members.pending_invitation,
        "pendingconfirmations": p.all_members.pending_email_confirmation,
        "deleted_memberships": p.all_members.deleted,
        "sections": p.sections
      };
      console.log(obj);
    	$(".nb-widget-body").append(require('hbs!templates_dir/properties_ensemble_users')(obj));
    };
    Pers.call('getObjects', payload, cb);
  };

});
