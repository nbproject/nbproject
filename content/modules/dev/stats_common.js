/**
 * stats_common.js
 * common primitives for doing reports based on NB data 
 *
 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global NB$:true NB:true $:true alert:false prompt:false console:false*/
(function(GLOB){
    GLOB.stats={};
    GLOB.stats.previousPoint = null;
    GLOB.stats.dependencies = {};
    GLOB.stats.id2mtype = {};
    //util fcts: 
    var findExtrema = function(d, j){
                //j: column number
                var xmin =Number.MAX_VALUE,
                xmax = -Number.MAX_VALUE, 
                i;
                
                for (i=0;i<d.length;i++){
                    if (d[i][j]<xmin){
                         xmin = d[i][j];
                    }
                    if (d[i][j]>xmax){
                        xmax = d[i][j];
                    }
                }
                return [xmin, xmax];
            };
            
    GLOB.stats.__populateDefaultTableData = function(media, id){
        media.data = [];
        if (!(id in GLOB.report.data)){
            alert(id +" not found in GLOB.report.data and no data mapping provided for media: "+id);
            return;
        }
        if (!("labels" in media)){
            alert(id +" not labels provided and no explicit data mapping provided for media: "+id);
            return;
        }
        for (var i = 0;i<media.labels.length;i++){
            media.data.push({id: id, col: i});
        }
    };

    GLOB.stats.Dependency = function(media, id){
        this.unmet=0;
        this.deps ={};
        //is there data specified ? 
        if (!("data" in media)){ //use default 
            GLOB.stats.__populateDefaultTableData(media, id)    ;
        }
        else if (media.data.length===0){//number of column is unknown and determined by server response
            media.data=[{id: id}];
        }
        var data = media.data;
        var serie;
        for (var i in data){
            serie=data[i];
            if ("id" in serie){
                if (!(serie.id in this.deps)){
                    this.deps[serie.id]=true;
                    this.unmet++;
                }
            }
            else{
                if (!(id in this.deps)){ 
                    this.deps[id]=true;
                    this.unmet++;
                }
            }
        }
    };

    GLOB.stats.Dependency.prototype.dataAvailable = function(id){
        if (id in this.deps && this.deps[id]) {
            this.deps[id]=false;
            this.unmet--;
            return this.unmet;
        }
        return -1;
    };

    GLOB.stats.fillDependencies = function(){    
        var media = GLOB.report.media;
        for (var mtype in media){
            for (var id in media[mtype]){
                GLOB.stats.dependencies[id] = new GLOB.stats.Dependency(media[mtype][id], id);
                GLOB.stats.id2mtype[id] = mtype;
            }
        }
    };

    function nbcall(fctname, dict, callback, nowait){
        /*
        if (!(nowait)){
            document.body.style.cursor="wait";
        }
        */
        var auth_str = GLOB.conf.userinfo.guest ? "guest=1" : "ckey="+GLOB.conf.userinfo.ckey;        
        NB$.post(GLOB.conf.servers.rpc+"/stats/api?" + auth_str, {"f":  fctname, "a": JSON.stringify(dict)},callback, "json");
    }

    GLOB.stats.__fetchData = function(id, cb){
        var data = GLOB.report.data;
        var fctname = "__fct" in data[id] ? data[id].__fct : id;
        data[id].ID = id;
        nbcall(fctname, data[id], (cb===undefined)? GLOB.stats.onData : cb );
    };

    GLOB.stats.__setMappings = function(){
        var data = GLOB.report.data;
        var mf =  GLOB.report.mappings.fct;
        var md =  GLOB.report.mappings.data;
        var f = function (_md, _i){
            return function(_p){
                var p = _p.payload;
                if (p.data.length){
                    _md[_i][p.data[0][0]] = p.data[0][1];
                }
            };
        };
        for (var i in mf){
            md[i]={};
            for (var j in data){
                if (i in data[j] && (!(data[j][i] in md[i]))){
                    md[i][data[j][i]] = "untitled";
                    nbcall(mf[i].__fct, NB$.extend({}, mf[i].args, {"id": data[j][i]}),f(md, i));
                }    
            }
        }
    };


    GLOB.stats.__autopopulate = function(){    
        //auto-populate data for media that contain an "auto_data" field
        var M = GLOB.report.media;
        var D = GLOB.report.data;
        var loops, seriename, m;
        var idx=0; //suffix we add at the end of serie name, to guarantee uniqueness... (necessary in report9 w/ admin=0 and 1 for instance)
        for (var k in M){
            m = M[k];
            for (var i in m){
                if ("auto_data" in m[i]){
                    loops = GLOB.report.params[m[i].auto_data.loop].split(",");
                    m[i].data=[];
                    for (var j in loops){
                        seriename = m[i].auto_data.fct + "_" + loops[j] + "_" + (idx++);
                        m[i].data.push({id: seriename});
                        if (!(seriename in D)){
                            D[seriename] = {};
                            D[seriename][m[i].auto_data.loop] = loops[j];
                            D[seriename].__fct = m[i].auto_data.fct;
                            if ("options" in m[i].auto_data){
                                D[seriename].options = m[i].auto_data.options;
                            }
                            if ("params" in  m[i].auto_data){
                                for (var l in  m[i].auto_data.params){
                                    var param_name = m[i].auto_data.params[l];
                                    if (typeof param_name === "string"){
                                        D[seriename][param_name] = GLOB.report.params[param_name];
                                    }
                                    else if ((typeof param_name === "object") && (param_name instanceof Array)) { //use what's provided (should be an array
                                        D[seriename][param_name[0]] = param_name[1];
                                    }
                                    else{
                                        alert("["+param_name+"]: only string and array supported as params");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    GLOB.stats.run = function(){
        if (!("notoc" in GLOB.report.params)){
            GLOB.sections.makeToc();
        }
        GLOB.stats.__autopopulate();
        GLOB.stats.fillDependencies();
        GLOB.stats.__setMappings();
        var id, data = GLOB.report.data;
        for (id in data){
            GLOB.stats.__fetchData(id);
        }            
        var i=null; 
        for (i in GLOB.report.updates){
            break;
        }
        if (i!= null){
            var p = {};
            for (i in GLOB.report.updates){
                p[i]=GLOB.stats.onUpdate;
            }
            GLOB.observer.register(GLOB.conf.server+"/__RESPONDER", p);
        }
    };

    GLOB.pers.init = function () {
        if ("report" in GLOB){
            if (GLOB.report.conf.autobuild){
                GLOB.stats.run();        
            }
        }
        else{
            alert("missing GLOB.report module");
        }
    };
    
    GLOB.stats.onUpdate = function(evt){
        //    console.debug("onUpdate", evt);
        var U = GLOB.report.updates;
        if (evt.type in  U){
            var id_data =  U[evt.type].data;
            GLOB.stats.__fetchData(id_data, GLOB.stats.__tableUpdater);
        }
    };

    GLOB.stats.__tableUpdater = function(p){
        //    var updateList = NB$([]);
        var i,j,u;
        for (u in GLOB.report.updates){
            if (p.ID ===  GLOB.report.updates[u].data){
                var id_media = GLOB.report.updates[u].media;
                var $elt = NB$("#"+id_media);
                var M = GLOB.report.media.tables[id_media];
                var labels = M.labels;
                var data = M.data;
                var td;
                var O =  GLOB.stats.store.o;
                for (i=0;i<O[data[0].id].data.length;i++){
                    for (j=0;j<labels.length;j++){            
                        var col = data[j].col;
                        if (p.data[i][col]!== O[data[j].id].data[i][col]){
                            //  updated = true;
                            //console.debug("need to update:", labels[j], " for ", i);
                            td = NB$("tr:eq("+(i+1)+")", $elt).find("td:eq("+j+")");
                            //            updateList.add(td);
                            td.fadeTo(0, 0.1).addClass("updated").html(p.data[i][col]).fadeTo(1000, 1);
                        }
                    }
                }
                O[p.ID] = p;        
            }
        }   
        setTimeout(function(){NB$(".updated").removeClass("updated");}, 4000);
    };

    GLOB.stats.store = new GLOB.models.Store(false);

    GLOB.stats.onData = function(obj){
        var p = obj.payload;
        GLOB.stats.store.o[p.ID] = p;
        for (var id in GLOB.stats.dependencies){
            if (GLOB.stats.dependencies[id].dataAvailable(p.ID)===0){
                GLOB.stats.prepareData(id);
                GLOB.stats.createToolbox(id);
                GLOB.stats.render(id);
            }
        }   
    };

    GLOB.stats.prepareData = function(id){
        GLOB.stats.__data_preparers[GLOB.stats.id2mtype[id]](id);  
    };

    GLOB.stats.createToolbox = function(id){
        GLOB.stats.__toolboxes[GLOB.stats.id2mtype[id]](id);
    };


    GLOB.stats.render = function(id){
        GLOB.stats.__renderers[GLOB.stats.id2mtype[id]](id);
        if (id in GLOB.report.renderDone){
            GLOB.report.renderDone[id](id);
        }
    };
    GLOB.stats.expandTools = function(id){
        console.debug("TODO... expanding tools for "+id);
    };
    GLOB.stats.__toolboxes = {
        plots: function(id){
            var M = GLOB.report.media.plots[id];
            var $elt= NB$("#"+id);
            var $checkboxdiv = NB$("<div/>");
            for (var i in M.data){
                var l = "label" in M.data[i] ? M.data[i].label :  M.data[i].id;
                $checkboxdiv.append("<input type='checkbox' checked='checked' id='cb_"+ M.data[i].id+"'/> <label for='cb_"+M.data[i].id+"'>"+l+"</label><br/>");
            }
            var $tb = NB$("<div class='toolbox' id='tb_"+id+"'><a class='expandlink' href='javascript:GLOB.stats.expandTools(\""+id+"\")'>Options</a></div>");
            $tb.append($checkboxdiv);
            $elt.parent().append($tb);
            NB$("input", $tb).click(function(){
                    GLOB.stats.render(id, M);
                });
        }, 
        tables: function(id){

        }, 
        images: function(id){
    
        },
        text: function(id){
    
        }
    };
    GLOB.stats.__data_preparers = {
        plots: function(id){
            var $elt= NB$("#"+id);
            var M = GLOB.report.media.plots[id];
            if ("fct_label" in M){
                $elt.bind("plothover", function (event, pos, item) {
                        if (item) {
                            if (GLOB.stats.previousPoint !== item.datapoint) {
                                GLOB.stats.previousPoint = item.datapoint;
                                NB$("#tooltip").remove();
                                showTooltip(item.pageX,item.pageY,M.fct_label(item.datapoint[0],item.datapoint[1], item));
                            }
                        }
                        else {
                            NB$("#tooltip").remove();
                            GLOB.stats.previousPoint = null;            
                        }
                    });
            }
            //add labels if mappings exist: 
            var md =  GLOB.report.mappings.data;
            var D = GLOB.report.data;
            var i, j;
            for (i in md){
                for (j in M.data){
                    var serie = M.data[j];
                    if (i in D[serie.id] && (!("label" in serie))){
                        serie.label = md[i][D[serie.id][i]];
                    }
                    serie.color=Number(j);
                }
            }
            //replace default names: 
            if ((M.data.length === 1) && (!("id" in M.data[0]))){
                var d = M.data[0];
                d.data = GLOB.stats.store.o[id].data;
            }
            else{
                for (i in M.data){
                    M.data[i].data =  GLOB.stats.store.o[ M.data[i].id].data;
                }
            }
            //special processing for pie chart: 
            if ("series" in M.opts && "pie" in M.opts.series){
                M.data = M.data[0].data;
            }

        }, 
        tables: function(id){

        }, 
        images: function(id){
    
        },
        text: function(id){
    
        }
    };

    GLOB.stats.__compute_stats=function(id){
        var M = GLOB.report.media.plots[id];
        var statsdata=[];
        var pd = M.__plotobject.getData();
        for (var i in pd){
            var seriestats={};
            var serie = pd[i].data;
            var sum=0.0;
            var N = 0;
            var freq = 0;
            var avg = 0;
            var variance= 0;
            var j;
            //first pass: find mean
            for (j in serie){
                freq = serie[j][1];
                N+= freq;
                sum+=serie[j][0]*freq;
            }
            avg = sum/N;
            seriestats.avg = avg;
            //second pass: std error
            for (j in serie){
                freq = serie[j][1];
                variance+=freq*Math.pow(serie[j][0]-avg,2);    
            }
            seriestats.se = Math.sqrt(variance)/N;
            statsdata.push(seriestats);
        }
        GLOB.report.statsdata[id]=statsdata;
    };

    GLOB.stats.__plot_stats = function(id){
        var M = GLOB.report.media.plots[id];
        var statsdata=GLOB.report.statsdata[id];
        var PO =  M.__plotobject;
        var maxdata = PO.getAxes().yaxis.datamax;
        var pd = PO.getData();
        for (var i in statsdata){
            var serie = statsdata[i];
            var halfsize = 1.96*serie.se;  //we assume normal data blah blah blah...
            var lbound = PO.pointOffset({ x: serie.avg-halfsize, y: maxdata});
            var rbound = PO.pointOffset({ x: serie.avg+halfsize, y: maxdata});
            GLOB.stats.__plot_ci(PO.getCanvas().getContext("2d"), lbound.left,  rbound.left, lbound.top-3*Number(i)-5, pd[i].color);
        }    
    };

    GLOB.stats.__plot_ci = function(ctx,l,r,t,color){
        ctx.beginPath();
        ctx.moveTo(l, t-3);
        ctx.lineTo(l, t+3);
        ctx.moveTo(l, t);
        ctx.lineTo(r, t);
        ctx.moveTo(r, t-3);
        ctx.lineTo(r, t+3);
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    GLOB.stats.__renderers = {
        plots: function(id){
            var M = GLOB.report.media.plots[id]; 
            var data=[], i;
            var tb  = NB$("#tb_"+id);
            for (i=0;i< M.data.length;i++){
                if (NB$("#cb_"+M.data[i].id+":checked").length===1){
                    data.push(M.data[i]);
                }
            }
            //    $.plot(NB$("#"+id), M.data, M.opts);
            //            var initPlotParams = NB$.extend({}, {data: data}, M.opts), 

            //sacha: continue here

            var series = [];
            for (i=0;i<data.length;i++){
                series.push( data[i].data);
            }
            for (i=0;i< M.data.length;i++){                
                if ("lm" in GLOB.stats.store.o[M.data[i].id]){
                    //we have lin modeling for the data: plot lin modeling
                    var extrema = findExtrema(data[0].data, 0);

                    // var axes = M.__plotobject.getAxes();
                    var x_min =extrema[0],// axes.xaxis.datamin, 
                        x_max = extrema[1], //axes.xaxis.datamax, 
                        lm=GLOB.stats.store.o[M.data[i].id].lm;                    
                    //        initPlotParams = NB$.extend({}, {data: data}, M.opts), 
                    //                    lmParams = NB$.extend({}, {data: [[x_min, lm[0]+lm[1]*x_min], [x_max, lm[0]+lm[1]*x_max]] }, M.opts); 
                    series.push({data: [[x_min, lm[0]+lm[1]*x_min], [x_max, lm[0]+lm[1]*x_max]] });
                    //                    M.__plotobject = NB$.plot(NB$("#"+id),[ initPlotParams, lmParams]);
                }
            }

            //            M.__plotobject = NB$.plot(NB$("#"+id), data, M.opts);
            M.__plotobject = NB$.plot(NB$("#"+id), series, M.opts);

            if ("compute_stats" in M.opts){
                GLOB.stats.__compute_stats(id);
                GLOB.stats.__plot_stats(id);
            }
            
            
           
            
        }, 
        tables: function(id){
            var $elt= NB$("#"+id);
            var O = GLOB.stats.store.o;
            var M = GLOB.report.media.tables[id];       
            var labels;
            var data = M.data;
            var i,j,u;
            if (!("labels" in M)){
                M.labels = O[data[0].id].labels;
                GLOB.stats.__populateDefaultTableData(M, id); 
                //update data: 
                data   = M.data;
            }
            labels = M.labels;
            var table = NB$("<table class='media'/>"),
            facetpanel = NB$("<div class='facetpanel'/>"), 
            facet,
            tr = NB$("<tr/>"),
            headerLens = ("headerLens" in M) ? M.headerLens : function(j){return labels[j];};
            for (j in labels){
                tr.append("<th>"+headerLens(j,O[data[j].id] )+"</th>");
            }
            NB$("<thead>").append(tr).appendTo(table);
            var tbody = NB$("<tbody/>");
            var defaultLens0 = function(i,j){
                return O[data[j].id].data[i][data[j].col];
            };
            var lenses = [];
            //we let the user specify a default lens if he wishes
            var defaultLens = ("defaultLens" in M) ? M.defaultLens: defaultLens0;
            for (u in labels){
                lenses.push(("lenses" in M && M.lenses[u]!=null) ? M.lenses[u]: defaultLens);
            }
            for (i=0;i<O[data[0].id].data.length;i++){
                tr = NB$("<tr/>");
                for (j=0;j<labels.length;j++){
                    tr.append("<td>"+lenses[j](i,j, O[data[j].id])+"</td>");
                }
                tbody.append(tr);
            }
            var facets = M.facets || [], l_min, l_max, cnt_max;
        
            var fillBins = function(d,j, d_min, d_max, NBINS){
                var i, bins=[];
                for (i=0;i<NBINS;i++){
                    bins.push(0);
                }
                for (i=0;i<d.length;i++){
                    bins[Math.min(Math.floor(((d[i][j]-d_min)*NBINS)/(d_max - d_min)), NBINS-1)]++;
                }
                return bins;
            };
            for (j=0;j<facets.length;j++){
                if (facets[j] !== null){
                    facet = NB$("<div class='facet' align='left'/>");
                    facet.append("<div class='facet_hdr'>"+(M.labels[j]||"(no name)")+"</div>");
                    //for now we assume that is not null, we just want a distribution into facets[j] bins.  
                    //find min/max to get an idea of distribution. 
                    var extrema = findExtrema(O[data[j].id].data, j),
                        spread = extrema[1] - extrema[0],
                        NBINS = facets[j] || 10,
                        bins = fillBins(O[data[j].id].data, j, extrema[0],  extrema[1], NBINS);
                    cnt_max = Math.max.apply(null, bins);
                    //console.log("facets extrema: ", extrema, bins);
                    for (i=0;i<NBINS;i++){
                        l_min = extrema[0]+Math.floor(spread*i/NBINS);
                        l_max = extrema[0]+Math.floor(spread*(i+1)/NBINS)-1;
                        facet.append("<div class='facet_row'><div class='facet_fill' style='width:"+100*bins[i]/cnt_max+"%'/><a class='facet_a' href='#?l_min="+l_min+"&l_max="+l_max+"'>"+l_min+"-"+l_max+"</a><span class='facet_cnt'>"+bins[i]+"</span></div>");
                    }
                    facetpanel.append(facet);
                }
            }
            
            $elt.append(facetpanel);
            table.append(tbody).appendTo($elt);
        }, 
        images: function(id){

        }, 
        text: function(id){
            var $elt= NB$("#"+id);
            var t = GLOB.report.media.text[id];
            var row = GLOB.stats.store.o[t.data[0].id].data[0];
            //default lens is just to output the 1st element in the data array: 
            $elt.append("lens" in t ? t.lens(row):row[0]);
        }
    };

    function showTooltip(x, y, contents) {
        NB$('<div id="tooltip">' + contents + '</div>').css( {
                position: 'absolute',
                    display: 'none',
                    top: y + 5,
                    left: x + 5,
                    border: '1px solid #fdd',
                    padding: '2px',
                    'background-color': '#fee',
                    opacity: 0.80
                    }).appendTo("body").fadeIn(200);
    }
})(NB);