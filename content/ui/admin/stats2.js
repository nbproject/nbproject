/*
 * stats2.js: stats data
 *
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true*/

(function(GLOB){
    //    GLOB.report.conf.autobuild = false;
  GLOB.report.mappings.fct["id_ensemble"] = {__fct: "get_label", args: {type: "ensemble"}};
	GLOB.report.data = {
	};
	var o_1 = GLOB.report.options.evol_1;
	var c_1 = GLOB.report.captions.f_date_y;
	var c_xy = GLOB.report.captions.f_x_y;
	GLOB.report.media.plots = {
	a2:{
		auto_data: {fct: "authored_by_day", loop: "id_ensemble"},
		opts:o_1, 
		fct_label : c_1
	}, 
	reply1:{
		auto_data: {fct: "percentage_reply_by_day", loop: "id_ensemble"},
		opts:o_1, 
		fct_label : c_1
	}, 
	pages_by_day: {
		auto_data: {fct: "pages_by_day", loop: "id_ensemble"},
		opts: GLOB.report.options.evol_bars, 
		fct_label : c_xy
	}, 
	distribution_first_minute:{
		auto_data: {fct: "distribution_first_minute", loop: "id_ensemble"},
		opts: GLOB.report.options.bars1, 
		fct_label : c_xy
	},
	distribution_first_hour:{
		auto_data: {fct: "distribution_first_hour", loop: "id_ensemble"},
		opts: GLOB.report.options.bars1, 
		fct_label : c_xy
	}
	};

})(NB);
