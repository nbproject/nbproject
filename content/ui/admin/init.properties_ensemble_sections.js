/*
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

  Pers.init = function () {
    var url_parts = window.location.href.toString().split("/");
    var class_id = url_parts[url_parts.length - 1];

    var payload = {
    	"payload":{"id_ensemble":class_id},
    	"types":["sections", "ensembles", "section_participants"]};
    var cb = function(p) {
      var obj = {
        "ensemble": p.ensembles[class_id],
        "sections": p.sections,
        "class_sections": p.section_participants.class_sections,
        "no_section": p.section_participants.no_section,
        "error_message": p.error_message
      };
      $(".nb-widget-body").append(require('hbs!templates_dir/properties_ensemble_sections')(obj));
      setPageHandlers();
    };
    Pers.call('getObjects', payload, cb);
  };

  function setPageHandlers() {
    $(".student-record").each(function() {
      $(this).draggable({
        helper: function() { return $("<div>").addClass("student-record-helper").attr("data-membership-id", $(this).attr("data-membership-id")).text($(this).attr("data-user-firstname") ); } ,
        revert: "invalid",
        start: function(even, ui) {
          $(".section-assign").addClass("active");
        },
        stop: function(event, ui) {
          $(".section-assign").removeClass("active");
        },
      });
    });

    $(".section-assign").each(function() {
      $(this).droppable({
        drop: function(event, ui) {
          if ( $(this).find("tr[data-membership-id=" + ui.draggable.attr("data-membership-id") + "]").length > 0) return;
          if ( $(this).find("table").length == 0) {
            // create new table
            $(this).find("div").remove();
            $(this).append("<table><thead><th>First Name</th><th>Last Name</th><th>E-mail Address</th></thead><tbody></tbody></table>");
          }
          var membership = ui.draggable.attr("data-membership-id");
          var section = $(this).attr("data-section");
          $(this).find("tbody").append(ui.draggable);
          $.post("?action=reassign&json", {section_id: section, membership_id: membership}, function(data) {
            var e= data.error_message;
            if (e != "") alert("Operation failed: " + e + " Please try to reload your page before doing anything else.");
          });
        },
      });
    });

    $("a.delete-link").click(function(){
      var section_id = $(this).attr("data-section-id");
      $.post(
        "?action=delete&section_id=" + section_id,
        {}, function(p){
          if(p.error_message){
            $(".error-message").text(p.error_message);
          } else {
            $(".section-" + section_id + "-info").remove();
          }
        });
        return false;
    });

    $("#create-section-form").submit(function(e){
      // Prevent page redirection in the form submission. This helps ensure that we can display the error
      // message if there's in an error when trying to create a section.
      // Reference: http://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
      e.preventDefault();
      var url=$(this).closest('form').attr('action');
      var data=$(this).closest('form').serialize();
      $.ajax({
        url:url,
        type:'post',
        data:data,
        success:function(p){
          if(p.error_message){
            $(".error-message").text(p.error_message);
          } else {
            location.reload(); // Reload the page to show the new section
          }
        }
      });
    });
  }

});
