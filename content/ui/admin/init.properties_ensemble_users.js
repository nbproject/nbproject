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

define(function(require) {
  var $               = require('jquery');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  require('tablesorter');

  Pers.init = function () {
    $(".nb-viewport").append("<div class='nb-widget-body'></div>");
    var url_parts = window.location.href.toString().split("/");
    var class_id = url_parts[url_parts.length - 1];

    var payload = {
    	"payload":{"id_ensemble":class_id},
    	"types":["sections", "all_members", "ensembles"]};
    var cb = function(p) {
      var obj = {
        "ensemble": p.ensembles[class_id],
        "memberships": p.all_members.registered,
        "pendinginvites": p.all_members.pending_invitation,
        "pendingconfirmations": p.all_members.pending_email_confirmation,
        "deleted_memberships": p.all_members.deleted,
        "sections": p.sections
      };
      $(".nb-widget-body").append(require('hbs!templates_dir/properties_ensemble_users')(obj));
      setPageHandlers();
    };
    Pers.call('getObjects', payload, cb);
  };


  function setPageHandlers() {
    $("select[name=section_id]").change(function(){
      var membership_id = $(this).attr("data_membership_id");
      var section_id = $(this).val();
      $.post(
        "?action=setsection&membership_id=" + membership_id,
        {section_id: section_id} );
    });
    var config = {
      headers:{
        0: {sorter: "text"},
        1: {sorter: "text"},
        2:{sorter: "email"},
        3:{sorter: false},
        4:{sorter: false},
        5:{sorter: false}
      },
      ignoreCase: true,
      sortReset: true
    };
    $('#reg').tablesorter(config);
    $('#pendingInvites').tablesorter({headers:{1:{sorter:false}, 2:{sorter:false}}});
    $('#pendingConf').tablesorter(config);
    $('#deleted').tablesorter(config);
  }

});
