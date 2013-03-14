/*
 * report.js: Template for online reports. 
 *
 Author 
 cf AUTHORS.txt 
 
 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true*/

(function(GLOB){
    var skel = {
    data:{}, 
    media:{
        plots : {}, 
        tables:  {},
        text: {},    
        images: {}
    }, 
    collections:{},
    options: {
        xy_plot: {
        points: { show: true }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true }
        }, 
        evol_1: { 
        xaxis: {mode: "time"}, 
        lines: { show: true }, 
        points: { show: true }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true }
        }, 
        bars1:{
        bars: { show: true }, 
        points: { show: false }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true },
        series: {stack: true}
        },
        bars_nostack: {
        bars: { show: true }, 
        points: { show: false }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true },
        series: {stack: false}
        }, 
        hist1:{
        bars: { show: true }, 
        points: { show: false }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true },
        compute_stats: true,
        series: {stack: true}
        },
        evol_bars:{
        bars: { show: true }, 
        points: { show: false }, 
        selection: { mode: "xy" },   
        grid: { hoverable: true, clickable: true },
        xaxis: {mode: "time"}, 
        series: {stack: true}
        }, 
        pie1:{
        series: {
            pie: {
            show: true
            }
                }, 
        grid: {
            hoverable: true,
            clickable: true
        }
        }
    }, 
    captions: {
        f_date_y :  function(x,y){return (new Date(x)).toDateString()+": "+y;}, 
        f_x_y: function(x,y){return (x+": "+y);}
       
    }, 
    updates: {}, 
    renderDone:{}, 
    params:{}, 
    conf:     {autobuild: true}, 
    metadata: {}, 
    mappings:{fct:{}, data:{}}, 
    statsdata:{}
    };
    
    var i, a,
        s = document.location.search, 
        params = {};
    GLOB.report = {};
    for (i in skel){
        GLOB.report[i] = skel[i];
    }
    
    //by default params is filled with URL parameters: 
    if (s !== ""){    
        s = s.substring(1).split("&");
        for (i in s){
            a = s[i].split("=");
            params[a[0]] = a[1];
        }
    }
    GLOB.report.params = params;

    /*In your report file, you just need to oveeride it w/ the values you need For instance: 
      GLOB.report.data = {
    authored_by_day: {id_ensemble: 856},                <-- note no __fct needed: radar assumes 'authored_by_day'
    byday_6042: {__fct: "authored_by_day", id_ensemble: 736}
      };
      
      ----- example of plot structure
      GLOB.report.media.plots = {
      authored_by_day: {
        data:[{label:"NB"} ],    <-- note that no id requires: assumed we shoudl use the data called 'authored_by_day'
        opts:o1, 
        fct_label : l1
        }, 
    a2:{
    data: [ {id: "authored_by_day",  label: "6.055"}, {id: "byday_6042",  label: "6.042"}],
    opts:o1, 
    fct_label : l1
    },
    reply1:{
    data: [ {id: "pcent_replies_6055",  label: "6.055"}, {id: "pcent_replies_6042",  label: "6.042"}],
    opts:o1, 
    fct_label : l1
    }
    };
    */
    })(NB);
