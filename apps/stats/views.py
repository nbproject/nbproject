# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
import  json, sys
from django.views.decorators.csrf import csrf_exempt
from base import  utils_response as UR
import logging, random, string
from base import db

id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_stats_%s.log' % ( id_log,), filemode='a')

__EXPORTS = [
    "popular_groups2", 
    "distribution_first_hour",
 "distribution_first_minute", 

"get_label", 
    "pages_by_day", 
    "authored_by_day", 
"percentage_reply_by_day",
    ]

#"desc" should be a valid SQL clause for a "select"
#"rel" should be a valid SQL clause for a "from". only needed if no natural mapping between type and relation. 
__LABELS = {
"ensemble": {"desc": "name", "rel": "base_ensemble"}
}

def test1(req): 
    return render_to_response("web/stats1.html", {})

def test2(req): 
    return render_to_response("web/stats2.html", {})


def viewer(req): 
    return render_to_response("stats/web/statsviewer.html", {})

def transpose(a):
    ta=[]
    for j in xrange(0, len(a[0])):
        row=[]
        for i in xrange(0, len(a)):
            row.append(a[i][j])
        ta.append(row)
    return ta
  

@csrf_exempt
def api(req):    
    r = HttpResponse()
    r["Access-Control-Allow-Origin"]="*"
    try: 
        if req.method == "OPTIONS" or len(req.POST)==0: #FF3 trying to check if Cross Site Request allowed. 
            return r
        else: 
        #rpc request:
            fctname = req.POST["f"]
            payload = json.loads(req.POST["a"])
            MODULE = sys.modules[__name__]
            if  fctname in __EXPORTS:
                r.content = getattr(MODULE, fctname)(payload, req)
                return r
            else:
                assert False, "[stats] method '%s' not found in __EXPORTS" %  fctname
                r.content = UR.prepare_response({}, 1,"[stats] method '%s' not found in __EXPORTS" %  fctname)
                return r
    except IOError: 
        logging.error("[stats] IOError")
        r.content = UR.prepare_response({}, 1,"I/O Error")
        return r


def popular_groups2(P, req): 
    output = {"ID": P["ID"]}
    data = db.Db().getRows("""
select id, name, number_threads as n_threads, total as n_notes, number_authors  as n_authors from (
 select 
count(c.id) as total, 
sum(cast(now()-c.ctime<'1 week' as integer)) as total_last_week, 
sum(cast(c.type=3 as integer)) as total_class,
sum(cast(c.type=2 as integer)) as total_staff, 
sum(cast(c.type=1 as integer)) as total_private,
sum(cast(c.signed as integer)) as signed, 
count(distinct c.author_id) as number_authors, 
count(distinct c.location_id) as number_threads, 
e.name, 
e.id  from base_comment c, base_location l, base_ensemble e where  e.id=l.ensemble_id and l.id=c.location_id and c.ctime>? group by e.name, e.id ) as v2 order by total desc limit 50
""", (P["after"],))
    output["data"] = data
    return UR.prepare_response(output)

def distribution_first_hour(P, req): 
    output = {"ID": P["ID"]}
    output["data"]  =  db.Db().getRows("""
select floor(extract( epoch from tcorrected)/60) as bin, log(count(*)) from tpage2 where tcorrected > '5 seconds' and tcorrected < '1 hour'   and ensemble_id=? group by bin order by bin
""", (P["id_ensemble"],))    
    return UR.prepare_response(output)

def get_label(P, req):
    output = {}
    objtype = P["type"]
    if objtype not in __LABELS: 
        msg =  "%s not in __LABELS" % (objtype,)
        print msg
        req.reply({}, 1, msg)
        return
    L = __LABELS[objtype]
    S = L["desc"]
    F = L["rel"] if "rel" in L else objtype        
    output["data"] = [] if type(P["id"]) not in (str, unicode) else  db.Db().getRows( "select id, %s from %s where id = ?" % (S,F), (P["id"],))
    return UR.prepare_response(output)

def pages_by_day(P, req):
    output = {"ID": P["ID"]}
    if "admin" in P: 
        output["data"] = db.Db().getRows("""
select 1000*extract(epoch from date_trunc('day', h.ctime)) as date,
count(h.*) as total 
from base_pageseen h, base_session sh,  base_membership m , base_ownership o 
where session_id is not null and h.session_id = sh.id and sh.user_id = m.user_id and m.admin=? and m.ensemble_id = o.ensemble_id and h.source_id = o.source_id  and m.ensemble_id = ? 
group by date
order by date;
""", (P["admin"],P["ensemble_id"]))
    else:         
        output["data"]  =  db.Db().getRows("""
select 1000*extract(epoch from date_trunc('day', h.ctime)) as date,
count(h.*) as total 
from  base_pageseen h, base_session sh, base_membership m, base_ownership o
where h.session_id is not null and h.session_id = sh.id and sh.user_id = m.user_id and m.ensemble_id = o.ensemble_id and h.source_id = o.source_id  and m.ensemble_id = ? 
group by date
order by date;
""", (P["id_ensemble"],))   
    return UR.prepare_response(output)

def authored_by_day(P, req):
    output = {"ID": P["ID"]}
    r = db.Db().getRows("""
select 1000*extract(epoch from date_trunc('day', ctime)) as date,
count(id) as total 
from base_v_comment 
where ensemble_id=?
group by  date
order by date;
""", (P["id_ensemble"],))
    output["data"] = r;
    if "options" in P and "lm" in P["options"]: 
        import rpy2.robjects as robjects
        tr = transpose(r)
        R = robjects.r
        scalefactor =  P["options"]["lm"]["scalefactor"] if "scalefactor" in  P["options"]["lm"] else 1
        tr0 = [int(x/scalefactor) for x in tr[0]] if "scalefactor" in  P["options"]["lm"] else tr[0]
        Ensemble = robjects.IntVector(tr0)
        Value = robjects.IntVector(tr[1])
        robjects.globalenv["Value"] = Value
        robjects.globalenv["Ensemble"] = Ensemble
        lm1 = R.lm("Value ~ Ensemble")
        #print R.summary(lm1)
        c = lm1.rx2("coefficients")
        output["lm"] = [c[0], c[1]/scalefactor]
    return UR.prepare_response(output)

def percentage_reply_by_day(P, req):
    output = {"ID": P["ID"]}
    output["data"] = db.Db().getRows("""
select date, 100*replies/total from (
        select 1000*extract(epoch from date_trunc('day', ctime)) as date,
        sum(cast(parent_id is not null as integer)) as replies, 
        count(id) as total 
        from base_v_comment 
        where ensemble_id=?  
        group by  date
        order by date
) as V where total > 0
""", (P["id_ensemble"],))
    return UR.prepare_response(output)

def distribution_first_minute(P, req):
    output = {"ID": P["ID"]}
    output["data"]  =  db.Db().getRows("""
select floor(extract( epoch from tcorrected)) as bin, count(*) from tpage2 where tcorrected < '60 seconds'  and ensemble_id=? group by bin order by bin
""", (P["id_ensemble"],))    
    return UR.prepare_response(output)
