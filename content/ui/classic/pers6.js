/*
 * pers.js
 * UI bindings for web-based mockup for pdf annotation
 * This module defines the namespace NB.msg
 * It requires the following modules:
 *		Module
 *		NB
 *		NB.mvc
 *		NB.pdf
 *		jquery
 *
Author 
    Sacha Zyto (sacha@csail.mit.edu) 

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
 *
 */

try{    
    Module.require("NB", 0.1);
    Module.require("NB.mvc", 0.1);
    Module.require("NB.pdf", 0.1);
    Module.createNamespace("NB.pers", 0.1);
}
catch (e){
    alert("[inbox] Init Error: "+e);
}

NB.pers.ensembles = null;
NB.pers.sources = null;
NB.pers.view1 = null;
NB.pers.view2 = null;

$(document).ready(function(){
	var payload={};
	payload.ensembles = [{'admin': 1, 'id': 33, 'name': 'c1'}, {'admin': 1, 'id': 32, 'name': 'My Files'}];
	payload.sources = [ {'numpages': 17, 'title': 'ln1.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id_source': 148, 'id': 148}, {'numpages': 20, 'title': 'l2.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id_source': 147, 'id': 147}, {'numpages': 20, 'title': 'ln3-1.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id': 146, 'id_source': 146},{'numpages': 10, 'title': 'lecture4.pdf', 'id_ensemble': 33, 'numx': 5, 'numy': 7, 'id_source': 200000, 'id': 200000} ];
	NB.pers.fillEnsembles(payload);
    });

NB.pers.fillEnsembles = function(payload){
    NB.debug("creating models");
    NB.pers.ensembles = new NB.mvc.collection("ensemble");
    NB.pers.sources = new NB.mvc.collection("source");

    NB.debug("creating views");
    NB.pers.view1 = new NB.pdf.sourceTreeView($("#TC")[0], "NB.pers.openPDF");
    NB.pers.view2 = new NB.pdf.ensembleSelectView($("#SEL")[0]);

    NB.pers.ensembles.register( NB.pers.view1 );
    NB.pers.sources.register( NB.pers.view1 );
    NB.pers.ensembles.register( NB.pers.view2 );

    NB.pers.ensembles.modify("create", payload, "ensembles");
    NB.pers.sources.modify("create", payload, "sources");

    NB.pers.docs = new NB.pdf.Docs();
   
    NB.pers.viewer = new NB.pdf.Viewer($("#Viewer")[0]);    
    NB.pers.docs.register(NB.pers.viewer);


};

NB.pers.sampleEnsembleAdd = function(){
    var payload = {};
    var id = (new Date).getTime();
    payload.ensembles = [{"admin": 1, "id": id, "name":id }];
    $("#DEBUG").append("adding ensemble "+id+"\n");
    NB.pers.ensembles.modify("add", payload, "ensembles");
};


NB.pers.sampleEnsembleDelete = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[0].id;
    payload.ensembles = [{"id": id}];
    $("#DEBUG").append("deleting ensemble "+id+"\n");
    NB.pers.ensembles.modify("delete", payload, "ensembles");
};


NB.pers.sampleEnsembleUpdate = function(){
    var payload = {};
    var id = NB.pers.ensembles.getItems()[1].id;
    payload.ensembles = [{"id": id, "name":"new name !!!", "admin":1}];
    $("#DEBUG").append("update ensemble "+id+"\n");
    NB.pers.ensembles.modify("update", payload, "ensembles");
};

NB.pers.openPDF = function(elt){
    var payload, id;
    if (elt.hasAttribute("id_source")){
	NB.debug("opening PDF given by " + elt);
	id = elt.getAttribute("id_source");
	payload = NB.pers.sources.get(id);
	NB.pers.docs.modify("open", payload);
	NB.pers.docs.modify("addnotes", {'strokes': [], 'links': [{'body': 'http://web.mit.edu/', 'xll': 71.003699999999995, 'xur': 256.572, 'yur': 727.04100000000005, 'page': 1, 'id_source': 147, 'S': '/URI', 'yll': 714.02499999999998, 'id': 123}, {'body': 'http://courses.csail.mit.edu/6.042/spring08', 'xll': 71.003699999999995, 'xur': 195.72300000000001, 'yur': 713.49199999999996, 'page': 1, 'id_source': 147, 'S': '/URI', 'yll': 700.476, 'id': 124}, {'body': 'http://people.csail.mit.edu/meyer/', 'xll': 71.003699999999995, 'xur': 176.13999999999999, 'yur': 699.94299999999998, 'page': 1, 'id_source': 147, 'S': '/URI', 'yll': 686.92700000000002, 'id': 125}, {'body': '[1, "88.1395", "82.9589"]', 'xll': 386.79300000000001, 'xur': 389.28399999999999, 'yur': 628.20100000000002, 'page': 1, 'id_source': 147, 'S': '/GoTo', 'yll': 613.51999999999998, 'id': 126}, {'body': '[1, "72", "349.652"]', 'xll': 180.023, 'xur': 195.65199999999999, 'yur': 287.67399999999998, 'page': 1, 'id_source': 147, 'S': '/GoTo', 'yll': 274.60899999999998, 'id': 127}, {'body': 'http://people.csail.mit.edu/meyer', 'xll': 163.886, 'xur': 250.654, 'yur': 80.667500000000004, 'page': 1, 'id_source': 147, 'S': '/URI', 'yll': 67.715999999999994, 'id': 128}], 'msgs': [{'body': 'hello', 'ctime': "'2009-01-20 22:48:59.507896'", 'top': '657', 'id_source': '147', 'type': 1, 'page': '1', 'left': '556','id': 78 }]} );
	//type following in console if page 4 loaded
	//	NB.pers.docs.modify("addnotes",{'strokes': [], 'links': [{'body': '[3, "72", "142.301"]', 'xll': 281.46800000000002, 'xur': 297.09699999999998, 'yur': 562.75699999999995, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 549.74099999999999, 'id': 131}, {'body': '[3, "72", "142.301"]', 'xll': 246.86699999999999, 'xur': 262.49599999999998, 'yur': 549.20699999999999, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 536.19200000000001, 'id': 132}, {'body': '[4, "72", "383.4"]', 'xll': 110.679, 'xur': 126.30800000000001, 'yur': 276.55799999999999, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 263.54199999999997, 'id': 133}, {'body': '[4, "72", "353.201"]', 'xll': 127.04300000000001, 'xur': 134.49000000000001, 'yur': 276.55799999999999, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 263.54199999999997, 'id': 134}, {'body': '[4, "72", "383.4"]', 'xll': 157.09700000000001, 'xur': 172.72499999999999, 'yur': 276.55799999999999, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 263.54199999999997, 'id': 135}, {'body': '[4, "72", "331.179"]', 'xll': 173.46000000000001, 'xur': 180.90700000000001, 'yur': 276.55799999999999, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 263.54199999999997, 'id': 136}, {'body': '[4, "72", "309.156"]', 'xll': 287.46100000000001, 'xur': 294.90800000000002, 'yur': 263.00900000000001, 'page': 4, 'id_source': 147, 'S': '/GoTo', 'yll': 249.99299999999999, 'id': 137}], 'msgs': []} );
    }
}


