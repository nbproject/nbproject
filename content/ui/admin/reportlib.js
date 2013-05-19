/*
 * reportlib.js: available report sections. 
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
    GLOB.report.library = {};
    var O = GLOB.report.options, C = GLOB.report.captions;
    GLOB.report.library.plots = {
        a2:{
            caption: "Number of notes authored per day", 
            auto_data: {fct: "authored_by_day", loop: "id_ensemble", options:{lm:{scalefactor: 1000*3600/24}}},
            opts:O.evol_1, //NB$.extend({}, O.evol_1, {compute_stats: true}), 
            fct_label : C.f_date_y
        }, 
        reply1:{
            caption: "Percentage of replies per day", 
            auto_data: {fct: "percentage_reply_by_day", loop: "id_ensemble"},
            opts:O.evol_1, 
            fct_label : C.f_date_y
        },
        pages_by_day:{
            caption: "Number of pages seen per day", 
            auto_data: {fct: "pages_by_day", loop: "id_ensemble"},
            opts: GLOB.report.options.evol_bars, 
            fct_label : C.f_x_y
        }, 
        distribution_first_minute:{
            caption: "Distribution of number of pages read during the 1st minute (x-axis: seconds spent on a page)", 
            auto_data: {fct: "distribution_first_minute", loop: "id_ensemble"},
            opts: GLOB.report.options.bars1, 
            fct_label : C.f_x_y
        }, 
        distribution_first_hour:{
            caption: "Distribution of number of pages read during the 1st hour (x-axis: minutes spent on a page)", 
            auto_data: {fct: "distribution_first_hour", loop: "id_ensemble"},
            opts: GLOB.report.options.bars1, 
            fct_label : C.f_x_y
        }
    };
})(NB);
