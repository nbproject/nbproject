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
  require("datatables");
  require("datatables_select");

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

      // Initialize the datatable.
      $("#listing").DataTable({
        // The dom setting below specifies the layout of various elements in the table and adds the listing-filter class
        // to the div containing the search box. For more details, see https://datatables.net/reference/option/dom#Styling
        "dom": '<"listing-filter"f>t',
        "oSearch": {"bSmart": false}, // Only do exact match in searches.
        language: { // This replaces the label of the search field with a placeholder. For more details, see https://datatables.net/reference/option/language.searchPlaceholder
            search: "_INPUT_",
            searchPlaceholder: "Search or Filter..."
        },
        "columnDefs": [
          { // Disable sorting and filtering on the 4th column (The index starts at 0)
            "targets": 3,
            "orderable": false,
            "bSearchable": false,
          },
          {
            "targets": 4,
            // Hide the 5th column. Although invisible, it is added to enable filtering by section because this
            // column will contain the section as plain text instead of a select element (i.e. dropdown). I couldn't
            // figure out an easy way to make the datatable search box work with the select element in the visible Section column
            "visible": false,
          },
        ]

      });
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

    $("select[name='section_id'").change(function() {
      var optionSelected = $("option:selected", this);
      var sectionId = optionSelected.val();
      var sectionName = optionSelected.text();
      var membershipId = $(this).attr("data-membership-id");
      $.post("?action=reassign&json", {section_id: sectionId, membership_id: membershipId}, function(data) {
        var e= data.error_message;
        if (e != "") {
          alert("Operation failed: " + e + " Please try to reload your page before doing anything else.");
          return;
        } else {
          // Update the invisible column (index 4) with the new section name to ensure filtering works well with the update.
          var $rowSelector = "[data-membership-id=" + membershipId + "]";
          $('#listing').DataTable().cell($rowSelector, 4).data(sectionName);
        }
      });
    });

    $(".create-section-toggle").click(function(e){
      e.preventDefault();
      $("p.error-message").text("");
      $(".create-section-form").toggleClass("hide");
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
            $("p.error-message").text("");
          }
        });
        return false;
    });

    $("#create-section-form").submit(function(e){
      // Prevent page redirection in the form submission. This helps ensure that we can display the error
      // message if there's in an error when trying to create a section.
      // Reference: http://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
      e.preventDefault();
      if(!$("#new-section-name").val().trim()){
        $("p.error-message").text("Section name should not be empty");
        return;
      }
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
