/*
 * files.js:
 * This module defines the namespace Files
 * It requires the following modules:
 *        Module
 *        NB
 *        jquery
 *
 *
 Author
 cf AUTHORS.txt

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true alert:true NB:true*/

define(['require','concierge','pers','conf','duplicatewizard','filterwizard','moment','jquery',
	'hbs!templates_dir/file_dialogs','hbs!templates_dir/invite_users_dialog',
	'hbs!templates_dir/edit_assignment_dialog'],
       function(require,concierge,Pers,Conf,duplicatewizard,filterwizard,moment,$,
		file_dialogs,invite_users_dialog,edit_assignment_dialog) {

  //require auth
  if (NB$) {
    $ = NB$;
  }

  var Files = {};

  Files.currentEnsemble = 0;
  Files.currentFolder = 0;
  Files.model = null;
  Files.labelfields = { file: 'title', folder: 'name' };
  Files.set_model = function (model) {
    Files.model = model;
    var $util_window = $.concierge.get_component('get_util_window')();
    $util_window.append(file_dialogs);
    $util_window.append(invite_users_dialog);
    $util_window.append(edit_assignment_dialog);
  };

  // Returns 'file', 'html', or 'youtube' depending on the selected upload type ('' if there is an error)
  function getUploadType() {
    if (document.getElementById('file_select').checked) {return 'file';}

    if (document.getElementById('html_select').checked) {return 'html';}

    if (document.getElementById('youtube_select').checked) {return 'youtube';}

    return '';
  }

  function updateVisibility(e) {
    if (getUploadType() === 'file') {
      $('#add_file_div').css('display', 'inline');
      $('#add_html_div').css('display', 'none');
      $('#add_youtube_div').css('display', 'none');
    }

    if (getUploadType() === 'html') {
      $('#add_file_div').css('display', 'none');
      $('#add_html_div').css('display', 'inline');
      $('#add_youtube_div').css('display', 'none');
    }

    if (getUploadType() === 'youtube') {
      $('#add_file_div').css('display', 'none');
      $('#add_html_div').css('display', 'none');
      $('#add_youtube_div').css('display', 'inline');
    }
  }

  Files.addFile = function (id_ensemble, id_folder) {
    Files.currentEnsemble = id_ensemble;
    Files.currentFolder = id_folder;

    $("input[name='upload_type']").on('change', updateVisibility);

    var foldername = (id_folder === null) ? '' : Files.model.o.folder[Files.currentFolder].name;
    $('#add_file_ensemble').html("<option id_ensemble='" + Files.currentEnsemble + "'>" + Pers.store.o.ensemble[Files.currentEnsemble].name + '</option>').attr('disabled', 'disabled');
    $('#add_file_folder').html("<option id_folder='" + Files.currentFolder + "'>" + foldername + '</option>').attr('disabled', 'disabled');
    $('#add_file_html').attr('href', '/addhtml/' + Files.currentEnsemble);
    $('#add_file_youtube').attr('href', '/addyoutube/' + Files.currentEnsemble);

    $('#add_file_dialog').dialog({
      title: 'Add a File...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          $.concierge.get_component('source_id_getter')({}, Files.proceedUpload);
          $.I('Uploading in progress...');
        },
      },
    });
    $('#add_file_dialog').dialog('open');
  };

  Files.proceedUpload = function (payload) {
    console.log('Upload Type:');
    console.log(getUploadType());

    // Handle HTML and YouTube uploads
    if (getUploadType() === 'html') {
      console.log('HTML Upload');
      $('#html_upload_form')
          .attr('action', '/addhtml/' + Files.currentEnsemble)
          .submit()[0]
          .reset();
    } else if (getUploadType() === 'youtube') {
      console.log('YouTube Upload');
      $('#youtube_upload_form')
          .attr('action', '/addyoutube/' + Files.currentEnsemble)
          .submit()[0]
          .reset();
    } else {
      console.log('File Upload');

      // we need a way to pass the id_ensemble and id_folder: we do it in the URL
      var folder_fragment = (Files.currentFolder === null) ? '' : '&id_folder=' + Files.currentFolder;
      var newauth = ('ckey' in Conf.userinfo) ? '&ckey=' + Conf.userinfo.ckey : '';
      $('#file_upload_form')
         .attr('action', Conf.servers.upload + '/pdf3/upload?id_ensemble=' + Files.currentEnsemble + '&id_source=' + payload.id_source + folder_fragment + newauth)
         .submit()[0]
         .reset();

      //$.I("File added to remote repository");
    }

    $('#add_file_dialog').dialog('destroy');

    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function () {
      //NOTE (important !)
      $.I('NB is processing your file... You should receive an email once your file is available on NB.');
      var payload_objects = { types:['files'],  id: payload.id_source };
      if ('id_ensemble' in Pers.params) {
        payload_objects['payload'] = { id_ensemble: Pers.params.id_ensemble };
      }

      Pers.call('getObjects', payload_objects, function (p) {
        Pers.store.add('file', p.files);
      });
    }, 3000);
  };

  Files.update_file = function (id) {
    var $filename = $('#update_file_name');
    $filename.html(Files.model.o.file[id].title);
    $('#update_file_dialog').dialog({
      title: 'Update a PDF File...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          var form = $('#file_update_form')[0];
          var newauth = ('ckey' in Conf.userinfo) ? '&ckey=' + Conf.userinfo.ckey : '';
          form.setAttribute('action', Conf.servers.upload + '/pdf3/upload/update?id_source=' + id + newauth);
          form.submit();
          $.I('Updating in progress...');
          $(this).dialog('destroy');
        },
      },
    });
    $('#update_file_dialog').dialog('open');
  };

  Files.proceedUpdate = function (payload) {
    var form = $('#file_upload_form')[0];

    // we need a way to pass the id_ensemble and id_folder: we do it in the URL
    var folder_fragment = (Files.currentFolder === null) ? '' : '&id_folder=' + Files.currentFolder;
    form.setAttribute('action', Conf.servers.upload + '/pdf3/upload?id_ensemble=' + Files.currentEnsemble + '&id_source=' + payload.id_source + folder_fragment);
    form.submit();

    //$.I("File updateed to remote repository");
    $('#update_file_dialog').dialog('destroy');

    //SACHA TODO: Fix this when we setup connectionIds
    window.setTimeout(function () {
      //NOTE (important !)
      $.I('NB is processing your file... You should receive an email once your file has been updated.');
      var payload_objects = { types:['files'],  id: payload.id_source };
      if ('id_ensemble' in Pers.params) {
        payload_objects['payload'] = { id_ensemble: Pers.params.id_ensemble };
      }

      Pers.call('getObjects', payload_objects, function (p) {
        Pers.store.add('file', p.files);
      });
    }, 3000);
  };

  Files.inviteUsers = function (id_ensemble) {
    Files.currentEnsemble = id_ensemble;
    var className = Pers.store.o.ensemble[Files.currentEnsemble].name;
    $('#invite_users_ensemble').html("<option id_ensemble='" + Files.currentEnsemble + "'>" + className + '</option>').attr('disabled', 'disabled');
    var subscribeLink = Pers.server_url + "/subscribe?key=" + Pers.store.o.ensemble[Files.currentEnsemble].invitekey;
    $("#invite_users_dialog .subscribe-link").attr("href", subscribeLink);
    $("#invite_users_dialog .subscribe-link").html(subscribeLink);

    var sections_html = "<option value='None'>None</option>";
    var sections = Pers.store.get('section', { id_ensemble:Files.currentEnsemble }).items;

    for (var key in sections) {
      if (sections.hasOwnProperty(key)) {
        var section = sections[key];
        sections_html += "<option value='" + section.ID + "'>" + section.name + '</option>';
      }
    }

    $('#invite_users_section').html(sections_html);
    $('#invite_users_dialog').dialog({
      title: 'Send Invitation for ' + className,
      width: 550,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          var to = $('#invite_users_emails')[0].value;
          var msg = $('#invite_users_msg')[0].value;
          var admin = $('#invite_users_admin:checked').length;
          var section = $('#invite_users_section').val();
          $.concierge.get_component('invite_users')({ id_ensemble: id_ensemble, id_section: section, to: to, msg: msg, admin: admin }, function () {$.I('Your invitation has been sent !');});

          $(this).dialog('destroy');
        },
      },
    });
    $('#invite_users_dialog').dialog('open');
    $('#invite_users_dialog a').blur();
  };

  Files.addFolder = function (id_ensemble, id_folder) {
    Files.currentEnsemble = id_ensemble;
    Files.currentFolder = id_folder;
    var foldername = (id_folder === null) ? '' : Files.model.o.folder[Files.currentFolder].name;
    $('#add_folder_ensemble').html("<option id_ensemble='" + Files.currentEnsemble + "'>" + Pers.store.o.ensemble[Files.currentEnsemble].name + '</option>').attr('disabled', 'disabled');

    //    $("#add_file_folder").html("<option id_folder='"+Files.currentFolder+"'>"+Pers.store.o.folder[Files.currentFolder].name+"</option>").attr("disabled", "disabled");
    $('#add_folder_folder').html("<option id_folder='" + Files.currentFolder + "'>" + foldername + '</option>').attr('disabled', 'disabled');

    $('#add_folder_dialog').dialog({
      title: 'Add a Folder...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          $.concierge.get_component('add_folder')({ id_parent: id_folder, id_ensemble: id_ensemble, name: $('#add_folder_name')[0].value }, function (p) {
            Files.model.add('folder', p);$.I('folder added');
          });

          $(this).dialog('destroy');
        },
      },
    });
    $('#add_folder_dialog').dialog('open');
  };

  Files.edit_assignment = function (id) {
    var f =  Files.model.o.file[id];

    //controls:
    var assignment_ref = f.assignment ? '1' : '0';
    var checkboxes = $('input[name=is_assignment]');
    var f_checkbox = function () {
      var v = checkboxes.filter(':checked')[0].value;
      $('#assignment_due')[v === '1' ? 'show' : 'hide']();
    };

    checkboxes.click(f_checkbox);
    checkboxes.filter('[value=' + assignment_ref + ']')[0].checked = 'true';
    f_checkbox();
    if (f.due != null) {
      var dueDateObject = moment(f.due);
      $('#due_date')[0].value = dueDateObject.format("MM/DD/YYYY");
      $('#due_time')[0].value = dueDateObject.format("HH:mm a");
    }

    $('#edit_assignment_dialog').dialog({
      title: 'Assignment Properties for ' + $.E(f.title),
      width: 500,
      height: 400,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          var v_date = $('#due_date')[0].value;
          var v_time = $('#due_time')[0].value;

          //TODO: validate form
          var due_datetime = null;
          if(v_date){
            var dateTimeObject = moment(v_date + ' ' + v_time, 'MM/DD/YYYY HH:mm a');
            due_datetime = dateTimeObject.format(); // Returns ISO 8601 datetime format e.g. "2014-09-08T08:02:17-05:00"
          }
          $.concierge.get_component('edit_assignment')({ id: id, assignment:  $('input[name=is_assignment]:checked')[0].value === '1', due:due_datetime }, function (p) {
            Files.model.add('file', p.files);
            $.I('Changes Saved');
          });

          $(this).dialog('destroy');
        },
      },
    });
    $('#edit_assignment_dialog').dialog('open');
    $('#due_date').calendricalDate({ usa: true,  isoTime: true, two_digit_mdh: true });
    $('#due_time').calendricalTime({ usa: true,  isoTime: true, two_digit_mdh: true, meridiemUpperCase: true });

  };

  Files.rename_file = function (id, item_type) {
    var $filename = $('#rename_file_name');
    var o =  (item_type === 'file') ? Files.model.o.file[id] : Files.model.o.folder[id];
    $filename[0].value =  o[Files.labelfields[item_type]];
    $('#rename_file_dialog').dialog({
      title: 'Rename ' + item_type + '...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          $.concierge.get_component('rename_file')(
              { item_type: item_type, id: id, title:  $filename[0].value },
                function (p) {
                  Files.model.add(item_type, p[item_type + 's']);
                  $.I(item_type + ' renamed');
                });

          $(this).dialog('destroy');
        },
      },
    });
    $('#rename_file_dialog').dialog('open');
    $filename.focus();
  };

  Files.duplicate_file = function (id, item_type) {
    if (item_type !== 'file') {
      return;
    }

    var o = Files.model.o.file[id];
    var $dialog = $('#duplicate_file_dialog');
    $dialog.empty();
    $dialog.duplicateWizard({
      admin: true,
      file_id: id,
      callbacks: {
        onOk: function () {
          $dialog.dialog('destroy');
          $dialog.duplicateWizard('destroy');
        },

        onCancel: function () {
          $dialog.dialog('destroy');
          $dialog.duplicateWizard('destroy');
        },

        onSubmit: function () {
          $dialog.dialog('destroy');
          $dialog.duplicateWizard('destroy');
        },
      },
    });
    $dialog.duplicateWizard('set_model', Pers.store);

    $dialog.dialog({
      title: 'Duplicate file',
      buttons: {},
      width: 700,
      height: 320,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
    });
    $dialog.dialog('open');

  };

  Files.delete_file = function (id, item_type) {
    var m = Pers.store;
    if (item_type === 'folder' && (!m.get('file', { id_folder: id }).is_empty() || !m.get('folder', { id_parent: id }).is_empty())) {
      alert("This folder isn't empty. You can only delete folders that are empty.");
      return;
    }

    var $filename = $('#delete_' + item_type + '_name');
    var o =  (item_type === 'file') ? Files.model.o.file[id] : Files.model.o.folder[id];
    $filename.text(o[Files.labelfields[item_type]]);
    $('#delete_' + item_type + '_dialog').dialog({
      title: 'Delete ' + item_type + '...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          $.concierge.get_component('delete_file')({ id: id, item_type: item_type }, function (P) {
            Files.model.remove(item_type, P['id']);$.I(item_type + ' deleted');
          });

          $(this).dialog('destroy');
        },
      },
    });
    $('#delete_' + item_type + '_dialog').dialog('open');
  };

  Files.__abspath = function (id_folder) {
    var m = Files.model;
    var f = m.o.folder[id_folder];
    var id_parent = f.id_parent;
    var s = f.name;
    var p;
    while (id_parent !== null) {
      p = m.o.folder[id_parent];
      s = p.name + '/' + s;
      id_parent = p.id_parent;
    }

    s = Files.model.o.ensemble[f.id_ensemble].name + '/' + s;
    return s;
  };

  Files.__isDirOrParent = function (id_a, id_b) {
    //returns true is a === b or is a is a parent of b
    var folders = Files.model.o.folder;
    var d = folders[id_b];
    while (d.id_parent !== null) {
      if (d.ID === id_a) {
        return true;
      }

      d = folders[d.id_parent];
    }

    return id_a === d.ID;
  };

  Files.__generate_folders = function (id_ensemble, id_sel, id_exclude) {
    var subfolders  = Files.model.get('folder', { id_ensemble:id_ensemble });
    var sel_str = (id_sel == null) ? " selected='selected' " : ' ';
    var s = '<option ' + sel_str + " id_item='0'>" + Files.model.o.ensemble[id_ensemble].name + '</option>';
    for (var i in subfolders.items) {
      if (id_exclude === undefined || (!Files.__isDirOrParent(parseInt(id_exclude, 10), parseInt(i, 10)))) {
        sel_str = (i === id_sel) ? " selected='selected' " : ' ';
        s += '<option ' + sel_str + " id_item='" + i + "'>" + Files.__abspath(i) + '</option>';
      }
    }

    return s;
  };

  Files.move_file = function (id, item_type) {
    var $filename = $('#move_file_name');
    var o =  (item_type === 'file') ? Files.model.o.file[id] : Files.model.o.folder[id];
    $filename.text(o[Files.labelfields[item_type]]);
    var $select = $('#move_file_select');
    $select.html(Files.__generate_folders(o.id_ensemble, o.id_folder || o.id_parent, (item_type === 'file') ? undefined : id));
    $('#move_file_dialog').dialog({
      title: 'Move ' + item_type + '...',
      width: 390,
      modal: true,
      position: { my: "top", at: "top+80", of: window },
      open: function(event, ui) {
        // Ensures that clicking outside the modal closes it. Ref: http://stackoverflow.com/a/4325673/978369
        $('.ui-widget-overlay').bind('click', function() {
          $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close');
        });
      },
      buttons: {
        Cancel: function () {
          $(this).dialog('close');
        },

        Ok: function () {
          $.concierge.get_component('move_file')({ id: id, item_type: item_type, dest:  parseInt($select.children(':selected').attr('id_item'), 10) || null }, function (p) {
            Files.model.add(item_type, p[item_type + 's']);$.I(item_type + ' moved');
          });

          $(this).dialog('destroy');
        },
      },
    });
    $('#move_file_dialog').dialog('open');
  };

  return Files;

});
