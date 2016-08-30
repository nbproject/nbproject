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
  var jquery_ui = require('jquery_ui');
  var Pers            = require('pers');
  var Handlebars     = require('handlebars');
  require("datatables");
  require("datatables_select");
  require("jquery-csv");
  var sectionsMap = {} // Maps of lowercase section names to actual name
  var newSections = [];
  var updatedSections = [];

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
      for(var s in p.sections){
        if(p.sections.hasOwnProperty(s)){
          var sectionName = p.sections[s]["name"].trim();
          sectionsMap[sectionName.toLowerCase()] = sectionName;
        }
      }

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
          {
            "targets": 5,
            // Hide the ID column and disable search on this column.
            "visible": false,
            "bSearchable": false,
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

    $("select[name='section_id']").change(function() {
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
      if(!$(".create-section-form").hasClass("hide")){
        $("#new-section-name").focus();
      }
    });

    $(".download-csv").click(function(e){
      e.preventDefault();
      var dataArray = $('#listing').DataTable().rows().data();
      for(var i = 0; i < dataArray.length; i++) {
        // Retain only the columns we care about exporting i.e. First name, Last name, email and section
        dataArray[i] = [dataArray[i][0], dataArray[i][1], dataArray[i][2], dataArray[i][4]];
      }
      dataArray.unshift(["First Name", "Last Name", "E-mail Address", "Section"]);
      var csvString = $.csv.fromArrays(dataArray);

      // Download as CSV. Code source: http://stackoverflow.com/a/17564369/978369
      var link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
      var fileName = $(".section-heading").text() + ".csv";
      fileName = fileName.replace(/\s/g, "_");
      link.download = fileName;
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data file named "my_data.csv".
    });

    $(".upload-csv").click(function(e){
      e.preventDefault();
      $("#csv-uploader").click();
    });

    $("button.cancel").click(function(e){
      $('.ui-widget-overlay').click(); // Close the popup dialog
    });

    $("button.save").click(function(e){
      $('.ui-widget-overlay').click(); // Close the popup dialog
      $.I("Saving <img src='/content/ui/classic/data/icons/gif/loader2.gif' class='save-loader'>", true, 300000);
      // If something goes wrong $("div.ui-view-popup").hide();
      // Todo: Start here: Save the data then reload the page.
      $.ajax({
        type: "POST",
        url: "?action=reassign_many",
        data: JSON.stringify({"new_sections": newSections, "updated_sections": updatedSections}),
        success: function(p){
          if(p.error_message){
            $("div.ui-view-popup").hide();
            alert(p.error_message);
          } else {
            $("div.ui-view-popup").hide();
            location.reload(); // Reload the page to show the updated records.
          }
        },
        error: function (request, status, error) {
          $.L(request.responseText);
          alert("An error occurred: " + request.responseText);
          $("div.ui-view-popup").hide();
        }
      });
      $.L(newSections);
      $.L(updatedSections);
    });

    $("#csv-uploader").change(function(evt){
      // Most of this code is from https://cmatskas.com/importing-csv-files-using-jquery-and-html5/
      if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser. Try updating your browser.');
      } else {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
          var csvData = event.target.result;
          data = $.csv.toArrays(csvData);
          if (data && data.length > 0) {
            dataIndices = getDataIndices(data);
            if(!dataIndices.isFileValid) {
              alert('Error! Could not process the file. Please upload a CSV file that has a header row with "email" and "section" as column headings.');
              return;
            }
            var headerRow = dataIndices.headerRow;
            var emailCol = dataIndices.emailCol;
            var sectionCol = dataIndices.sectionCol;
            // Remove all rows with indices <= the header row
            for(var i = 0; i <= headerRow; i++) {
              data.shift();
            }
            var oldData = $('#listing').DataTable().rows().data();
            var rawUpdatedSections = processNewAndUpdatedSections(null, oldData, 0, 1, 2, 4, 5, data, emailCol, sectionCol);

            // New sections to be created.
            $("#new-sections-from-csv").empty();
            for(var i = 0; i < newSections.length; i++) {
              $("#new-sections-from-csv").append("<span>" + newSections[i] + "</span>");
            }
            $("#new-sections-count").text(newSections.length);

            // Rows to be edited.
            $("#updated-sections-count").text(rawUpdatedSections.length);
            $("#updated-listing").DataTable().destroy();  // Destroy pre-existing table
            $("#updated-listing").DataTable({
              // The dom setting below specifies the layout of various elements in the table and adds the listing-filter class
              // to the div containing the search box. For more details, see https://datatables.net/reference/option/dom#Styling
              "dom": '<"updated-listing-filter"f>t',
              "oSearch": {"bSmart": false}, // Only do exact match in searches.
              language: { // This replaces the label of the search field with a placeholder. For more details, see https://datatables.net/reference/option/language.searchPlaceholder
                  search: "_INPUT_",
                  searchPlaceholder: "Search or Filter..."
              },
              data: rawUpdatedSections
            });

            if(newSections.length === 0 && rawUpdatedSections.length === 0) {
              $("button.save").hide();
            } else {
              $("button.save").show();
            }

            /*
             * Disable auto focus before opening the dialog. That way, the first button won't have focus when the dialog opens.
             Source: http://stackoverflow.com/questions/9816299/unable-to-remove-autofocus-in-ui-dialog
            */
            $.ui.dialog.prototype._focusTabbable = function(){};

            $("#sections-update").dialog({
              width: 900,
              height: 550,
              modal: true,
              show: { effect: "blind", duration: 200, direction: "down"},
              title: "Update Sections",
              position: { my: "top", at: "top+40", of: window },
              open: function(event, ui) {
                // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
                $('.ui-widget-overlay').bind('click', function() {
                  $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
                });
              },
            });

          } else {
              alert('No data to import!');
          }
        };
        reader.onerror = function() {
          alert('Unable to read ' + file.fileName);
        };
      }
      $('input[type="file"]').val(null); // Clear file input to ensure it works again if the user retries without refreshing the page.
    });

    function processNewAndUpdatedSections(sections, oldData, oldFirstNameCol, oldLastNameCol, oldEmailCol, oldSectionCol, oldIDCol, newData, newEmailCol, newSectionCol) {
      // This function sets two fields (newSections and updatedSections) and returns a 2-D array which represents the
      // table rows that will be displayed for each student's section that will be updated. This code is a lot more
      // complicated than it's meant to be simply because the server is case sensitive about section names (which seems
      // like a mistake we may have to keep supporting) while I want the CSV upload process to be case-insensitive.
      var oldDataMap = {}; // Map of email:{section: sectionName, userID: userID}
      for(var i = 0; i < oldData.length; i++) {
        var userEmail = oldData[i][oldEmailCol];
        oldDataMap[userEmail] = oldData[i];
      }
      var newSectionsMap = {} // Maps of lowercase section names to actual name. This ensures case match in all rows with case variation but the same section name.
      newSections = [];
      updatedSections = [];
      var updatedSectionsArray = [];
      for(var i = 0; i < newData.length; i++) {
        var email = newData[i][newEmailCol];
        if(!oldDataMap.hasOwnProperty(email)){ // Skip email that does not belong to registered users.
          continue;
        }
        var oldData = oldDataMap[email];
        var newSection = newData[i][newSectionCol];
        if(newSection.toLowerCase() !== oldData[oldSectionCol].toLowerCase()) {
          var oldDataCopy = oldData.slice();
          if(sectionsMap.hasOwnProperty(newSection.toLowerCase())) {
            // This replacement gets rid of variation in upper or lower cases.
            newSection = sectionsMap[newSection.toLowerCase()]
            oldDataCopy[oldSectionCol] = newSection;
          } else { // New Section
            if(!newSectionsMap.hasOwnProperty(newSection.toLowerCase())) {
              newSectionsMap[newSection.toLowerCase()] = newSection;
              newSections.push(newSection);
            }
            oldDataCopy[oldSectionCol] = newSectionsMap[newSection.toLowerCase()];
          }
          // Only add first name, last name, email, and section to data that will be displayed in table
          updatedSectionsArray.push([oldDataCopy[oldFirstNameCol], oldDataCopy[oldLastNameCol],
            oldDataCopy[oldEmailCol], oldDataCopy[oldSectionCol]]);
          // Only add user ID and section name to data that will be sent to the server.
          updatedSections.push({"user_id": oldDataCopy[oldIDCol], "section": newSection});
        }
      }  // for loop
      return updatedSectionsArray;
    }

    // Method that checks that the browser supports the HTML5 File API. Source: https://cmatskas.com/importing-csv-files-using-jquery-and-html5/
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
        }
        return isCompatible;
    }

    // This function expects to receive a 2-D array with each row representing a row from the CSV file. It returns a
    // json of format: {headerRow: 0, emailCol: 2, sectionCol: 3, isFileValid: true}
    function getDataIndices(data) {
      // Find the indices of the header row, email column and section column.
      var headerRow = -1;
      var emailCol = -1;
      var sectionCol = -1;
      var isFileValid = true;
      for(var i = 0; i < data.length; i++){
        for(var j = 0; j < data[i].length; j++) {
          if(data[i][j].toLowerCase().search("mail") !== -1) {
            emailCol = j;
            continue;
          }
          if(data[i][j].toLowerCase().search("section") !== -1) {
            sectionCol = j;
            continue;
          }
        }
        if(emailCol !== -1 && sectionCol !== -1) {
          headerRow = i;
          break;
        } else {
          // Reset both columns if only one was found
          emailCol = -1;
          sectionCol = -1;
        }
      }
      if(headerRow == -1) {
        isFileValid = false;
      }
      return {headerRow: headerRow, emailCol: emailCol, sectionCol: sectionCol, isFileValid: isFileValid}
    }

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
