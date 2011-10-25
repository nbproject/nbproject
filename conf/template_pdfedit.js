
print("in script");
//var p = loadPdf("/var/local/home/sacha/Desktop/ln3.pdf");
var p = loadPdf("$(PDF_FILE)");
var N = p.getPageCount();

//SACHA TODO: Didn't find a straightforward way to tell which Page a dictionary belongs (needed to find page number), so we do the follwoing: 
var CONTENT2PAGE = init_content2page(p);


var i;
var o = {};
o.N = N;
o.pages = [];
o.dests = findDestinations(p);
for (i=1;i<=N;i++){
    print("Annotations for page "+i+"/"+N);
    o.pages.push(processPage(p.getPage(i)));
}
print("__SZ_BEGIN__"+serialize(o, 0)+"__SZ_END__");

function countKeys(o){
    var count = 0;
    var k;
    for (k in o) {
	count++;
    }
    return count;
}

function indent(n){
    var i;
    var s="";
    for (i=0;i<n;i++){
	s+="  ";
    }
    return s;
}

function serialize(o, l){
    var i, s, cnt, N, L;
    L = indent(l);
    if ((typeof o == "number") || (typeof o == "boolean")) {
	return L + o;
    }
    if (typeof o == "string") {
	return L + '"'+o+'"';
    }
    if (typeof o == "object"){
	if (o instanceof Array){
	    s = L+"[\n";
	    for (i=0;i<o.length;i++){
		s+=serialize(o[i], Number(l)+1);		
		if (i<o.length-1){
		    s+=",\n";
		}
	    }
	    s+="\n"+L+"]";
	    return s;
	}
	else{ //just plain object
	    cnt=0;
	    N = countKeys(o);
	    s=L+"{\n";
	    for (i in o){		
		s+=L+'"'+i+'":'+serialize(o[i], Number(l)+1);
		if (cnt<N-1){
		    s+=",\n";
		}
		cnt++;	
	    }
	    s+="\n"+L+"}";
	    return s;
	}
	print ("could not serialize" +o);
    }
}


function processAnnotations(dict){
    var AA = [];
    if (dict.exist("Annots")){
	var a, rect, j,s;
	var aa = dict.child("Annots");
	var i;
	for (i=0;i<aa.count();i++){
	    var A = {};
	    a = aa.property(i).ref();
	    rect = a.property("Rect");
	    A.Rect = [];
	    for (j=0;j<rect.count();j++){
		A.Rect.push(rect.property(j).getText()); 
	    }
	    
	    A.S = a.child("A").property("S").getText();
	    
	    if (A.S == "/URI"){
		A.body = a.child("A").property("URI").getText();
	    }
	    else if (A.S == "/GoTo"){
		A.body = a.child("A").property("D").getText();
	    }
	    
	    AA.push(A);

	}
    }
    return AA;
}


function findDestinations(p){
    var i;
    var d = {};
    var dest;
    //var a = p.getDictionary().child("Names").child("Dests").child("Kids").child("0").child("Names");
    var a = p.getDictionary().child("Names").child("Dests").child("Kids").child("0").child("Kids").child("0").child("Names");
    var content_ref; 
    for (i=0; i<a.count(); i+=2){
	dest =  a.child(i+1).child("D");
	
	content_ref = dest.child(0).property("Contents").getText();
	//d[a.child(i).getText()] = [ dest.child(2).getText(), dest.child(3).getText()];

		d[a.child(i).getText()] = [CONTENT2PAGE[content_ref], dest.child(2).getText(), dest.child(3).getText()];
	
    }
    return d;
}

function init_content2page(p){
    var o={};
    var i;
    for (i=1;i<=p.getPageCount();i++){
	o[p.getPage(i).getDictionary().property("Contents").getText()] = i;
    }
    return o;
}

function processPage(page){
    var p = {};    
    var d = page.getDictionary();
    p.Annots = processAnnotations(d);
    return p;
}
