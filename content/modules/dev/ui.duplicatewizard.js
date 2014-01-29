/* duplicatewizard Plugin
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *
*/
/*global jQuery:true NB$:true */
(function($) {
    var $str        = "NB$" in window ? "NB$" : "jQuery";
    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {
            $.ui.view.prototype._create.call(this);
            var self = this;
            self.element.addClass("duplicateWizard");
            self._model = null;
            self._render();
        },
        _defaultHandler: function(evt){
            this._render();
        },
        __model_dependents: [],
        _render: function(){
            var self=this;
            if (self.option.files === null) {
                return;
            }

            self.element.empty();
            self.__model_dependents = [];

            var current_step = 1;

            /// Element Structure:
            /// * Header $h
            /// * Error Message(s) $e
            /// * Wizard Steps $wizard
            ///    o Step 1
            ///       - Description $d1
            ///       - New File Name
            ///       - FilesView
            ///    o Step 2
            ///       - FilterWizard
            ///    o Step 3
            ///       - Description $d
            ///       - ThreadSelect
            /// * Buttons $b
            ///    o $next
            ///    o $cancel

            var $h = $("<h2>Duplicate File</h2>");
            var $e = $("<p>").addClass("error-message");
            var $wizard = $("<div>").addClass("wizard-steps");
            var $b = $("<div>").addClass("wizard-buttons");

            var $next = $("<input type=\"button\" value=\"Next\" />");
            var $cancel = $("<input type=\"button\" value=\"Cancel\" />");
            $b.append($next).append($cancel);

            // Step 1:
            var $step1 = $("<div>").addClass("wizard-step").attr("wizard-step", "1").addClass("current");
            var $desc1 = $("<p>").addClass("item-description").text("Please enter the desired file name and location for the duplicate file.");
            var $fileNameLabel = $("<label>").attr("for", "filename").text("File Name: ");
            var $fileName = $("<input>").attr("type", "text").attr("name", "filename");
            var target_location_id = null;
            var target_location_type = null;
            var $filesView = $("<div style='height: 300px;'>");
            $filesView.treeView({
                admin: self.options.admin,
                callbacks: {
                    folder: function(payload) {
                        target_location_id = payload.value;
                        target_location_type = payload.type;
                    },
                    ensemble: function(payload) {
                        target_location_id = payload.value;
                        target_location_type = payload.type;
                        // TODO: - merge two callback functions
                    }
                }
            });
            self.__model_dependents.push( {m: $filesView, f: $filesView.treeView} );

            $step1.append($desc1).append($fileNameLabel).append($fileName).append($filesView);

            // Step 2:
            var $step2 = $("<div>").addClass("wizard-step").attr("wizard-step", "2");
            var $filterView = $("<div>"); // TODO: filterView here
            var filter_args = null;
            $filterView.filterWizard({
                callbacks: {
                    fireEvent: function(n, r, type) {
                        filter_args = {n: n, r: r, type: type};
                        $.concierge.get_component("advanced_filter")({
                                id_source: self.options.file_id,
                                n: n,
                                r: r,
                                type: type
                            },
                            function(result) {
                                $threadSelect.threadselect("set_locs", result.locs);
                                $next.removeAttr("disabled").click();
                            }
                        );

                    }
                }
            });
            self.__model_dependents.push( {m: $filterView, f: $filterView.filterWizard } );

            $step2.append($filterView);

            // Step 3:
            var $step3 = $("<div>").addClass("wizard-step").attr("wizard-step", "3");
            var $threadSelect = $("<div>");
            $threadSelect.threadselect({
                callbacks: {
                    onOk: function(locs) {
                        self.locs = locs;
                        $next.removeAttr("disabled").click();
                    }
                }
            });
            $step3.append($threadSelect);

            // Confirmation
            var $step4 = $("<div>").addClass("wizard-step").attr("wizard-step", "4");
            var $s4h1 = $("<h3>").text("What to import?");
            var $s4d1 = $("<p>").text(
                "Please select whether you want to import only the " +
                "comment of the annotations you selected, or to import " +
                "the entire thread for each selected annotation.");
            var $importType = $("<select>").
                append("<option value='all' selected='selected'>Import entire thread</option>").
                append("<option value='top'>Import top comment only</option>");
            var $s4h2 = $("<h3>").text("Note");
            var $confirmation = $("<p>").text(
                "The selected file, along with the selected annotations " +
                "will be duplicated when you proceed with this step."
            );
            $step4.append($s4h1).append($s4d1).append($importType).append($s4h2).append($confirmation);

            $wizard.append($step1).append($step2).append($step3).append($step4);
            self.element.append($h).append($e).append($wizard).append($b);

            $next.click(function() {

                // if done:
                if (current_step === 1) {
                    // Validate Inputs
                    if ($fileName.val() === "" ||
                        target_location_id === null ||
                        target_location_type === null) {
                        return;
                    }
                    self.target_filename = $fileName.val();
                    self.target_location_id = target_location_id;
                    self.target_location_type = target_location_type;
                    $next.attr("disabled", "disabled");

                } else if (current_step === 2) {
                    self.filter_args = filter_args;
                    $next.attr("disabled", "disabled");
                } else if (current_step === 3) {
                    
                } else if (current_step === 4) {

                    self.import_type = $importType.val();

                    // Step 1: Duplicate the file
                    $.concierge.get_component("copy_file")({
                        source_id: self.options.file_id,
                        target_name: self.target_filename,
                        target_id: self.target_location_id,
                        target_type: self.target_location_type
                    }, function(copy_result) {
                        // Step 2: Duplicate the annotations
                        $.concierge.get_component("bulk_import_annotations")({
                            locs_array: self.locs,
                            from_source_id: self.options.file_id,
                            to_source_id: copy_result.id_source,
                            import_type: self.import_type
                        }, function(import_result) {
                            //
                        });
                    });

                    if (self.options.callbacks.onSubmit) {
                        self.options.callbacks.onSubmit();
                    }
                }

                $(".wizard-step[wizard-step=" + current_step + "]").removeClass("current");
                current_step += 1;
                $(".wizard-step[wizard-step=" + current_step + "]").addClass("current");


            });

            $cancel.click(function() {
                // reset vars, etc.
                if (self.options.callbacks.onCancel) {
                    self.options.callbacks.onCancel();
                }
            });

        },
        set_model: function(model){
            var self=this;
            self._model = model;
            model.register(
                $.ui.view.prototype.get_adapter.call(this),
                {
                    file: null,
                    folder: null,
                    file_stats: null,
                    replyrating: null,
                    question: null
                });

            self.__model_dependents.forEach(function(o){
                o.f.call(o.m, "set_model", model);
            });

        },
        update: function(action, payload, items_fieldname){

        }
    });

    $.widget("ui.duplicateWizard",V_OBJ );
    $.ui.duplicateWizard.prototype.options = {
	listens: {
	},
	admin: false,
        file_id: null,
        callbacks: {
            onOk: null,
            onCancel: null
        }
    };
})(jQuery);
