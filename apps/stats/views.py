# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
import  json, sys
from django.views.decorators.csrf import csrf_exempt
from base import  utils_response as UR
import logging, random, string
import models as M
from base import db

id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_stats_%s.log' % ( id_log,), filemode='a')

__EXPORTS = [
    "report"
    "popular_groups2", 
    "distribution_first_hour",
 "distribution_first_minute", 
"report", 
"get_label", 
    "pages_by_day", 
    "authored_by_day", 
"percentage_reply_by_day",
"distribution_thread_length",
"distribution_thread_numauthors", 
"distribution_inside_discussion",
"numthreads_student_admin",
"faculty_reuse", 
"comments_per_student_vs_class_size",
"comments_per_week"
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


def report(P, req): 
    output = {}
    report_id = int(P["id"])
    report = M.Report.objects.get(pk=report_id)
    output["sections"] = UR.qs2list(report.sectionunit_set.all().order_by("position"), {"name": "section.name", "description": "section.description"} );
    return UR.prepare_response(output)

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

def buildquery(opts, loop_opts, P):
    P_opts =  P.get("options",{})
    output = {}
    for k,v in opts.iteritems(): 
        for i in xrange(0, len(v)): 
            output["%s_%s"%(k,i)] = v[i] if k in P_opts else ""
    for k,v in loop_opts.iteritems():
        for i in xrange(0, len(v)): 
            output["%s_%s"%(k,i)] = v[i] if k in P and P[k]!="0" else ""
    return output

def buildparams(params, opts,loop_opts, P): 
    P_opts =  P.get("options",{})
    output = []
    for x in params: 
        if type(x)==str and x.startswith("%"):
            k = x[1:]
            if k in P_opts: 
                output.append(P_opts[k])
            elif k in P and k in loop_opts and P[k]!="0":
                output.append(P[k])
        else:
            output.append(x)
    return output

def pages_by_day(P, req):
    output = {"ID": P["ID"]}
    opts = {"admin":  ["and m.admin=?"], 
            "after":  ["and h.ctime>?"]}
    loop_opts = {"id_ensemble": ["and m.ensemble_id=?"]}
    query = """select 1000*extract(epoch from date_trunc('day', h.ctime)) as date,
count(h.*) as total 
from base_pageseen h, base_session sh,  base_membership m , base_ownership o 
where session_id is not null and h.session_id = sh.id and sh.user_id = m.user_id %(admin_0)s %(after_0)s and m.ensemble_id = o.ensemble_id and h.source_id = o.source_id %(id_ensemble_0)s
group by date
order by date;""" % buildquery(opts, loop_opts, P)
    params = buildparams(["%admin", "%after", "%id_ensemble"], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)


#
#
#def distribution_thread_length(P, req):
#    output = {"ID": P["ID"]}
#    opts = {"ensemble":  ["and ensemble_id in (?,)"]}
#    query = """
#select numcomments, count(location_id) from (select count(cid) as numcomments, lid as location_id, eid as ensemble_id from v_comment group by eid, lid )as v_discuss where true %(ensemble_0)s group by numcomments order by numcomments
#""" % buildquery(opts,P.get("options",{}))
#    params =  buildparams(["%ensemble"], opts, P.get("options", {}))
#    output["data"]  =  db.Db().getRows(query, params)
#    return UR.prepare_response(output)
#


#
#def distribution_thread_length(P, req):
#    output = {"ID": P["ID"]}
#    output["data"]  =  db.Db().getRows("""
#select numcomments, count(location_id) from (select count(cid) as numcomments, lid as location_id, eid as ensemble_id from v_comment group by eid, lid )as v_discuss where ensemble_id=? group by numcomments order by numcomments
#""", (P["id_ensemble"],))    
#    return UR.prepare_response(output)
#


def distribution_thread_length(P, req):
    output = {"ID": P["ID"]}
    opts = {}
    loop_opts = {"id_ensemble": ["and ensemble_id=?"]}
    query = """select numcomments, count(location_id) from (select count(cid) as numcomments, lid as location_id, eid as ensemble_id from v_comment group by eid, lid )as v_discuss where true %(id_ensemble_0)s group by numcomments order by numcomments""" % buildquery(opts, loop_opts, P)
    params = buildparams(["%id_ensemble"], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)

def distribution_thread_numauthors(P, req):
    output = {"ID": P["ID"]}
    opts = {}
    loop_opts = {"id_ensemble": ["and ensemble_id=?"]}
    query = """select numauthors, count(location_id) from (select count(distinct uid) as numauthors, lid as location_id, eid as ensemble_id from v_comment group by eid, lid )as v_discuss where true %(id_ensemble_0)s group by numauthors order by numauthors
""" % buildquery(opts, loop_opts, P)
    params = buildparams(["%id_ensemble"], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
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

#
#def distribution_inside_discussion(P, req):
#    output = {"ID": P["ID"]}
#    opts = {}
#    loop_opts = {}
#    query = """select numcomments, count(location_id) from (select count(cid) as numcomments, lid as location_id, eid as ensemble_id from v_comment group by eid, lid )as v_discuss where true %(id_ensemble_0)s group by numcomments order by numcomments""" % buildquery(opts, loop_opts, P)
#    params = buildparams([], opts, loop_opts, P)
#    output["data"]  =  db.Db().getRows(query, params)
#    return UR.prepare_response(output)
#

def numthreads_student_admin(P,req): 
    output = {"ID": P["ID"]}
    opts = {"initthread":  ["*cast(pid is null as integer)"]}
    loop_opts = {}
    query = """select sum(cast(admin=true as integer)%(initthread_0)s) as numcomments_admin,  sum(cast(admin=false as integer)) as numcomments_student, eid from v_comment c, base_membership m where m.ensemble_id = c.eid and m.user_id = c.uid group by eid""" % buildquery(opts, loop_opts, P)
    params = buildparams([], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)

def faculty_reuse(P,req): 
    output = {"ID": P["ID"]}
    opts = {}
    loop_opts = {}
    query = """
select termsused, count(termsused) from  (select email, count(taughtwhen) as termsused from ( select email, year|| term as taughtwhen from (select k.* as ensemble_id, v.email  from karger_v_stats k , (select email, eid from v_membership where mid in (select min(mid) from v_membership where admin=true group by eid)) as v  where k.ensemble_id=v.eid and n_authors>1 and num_comments>99  and email not like ? order by num_comments desc) as v67 group by email, year ||term order by email) as v897 group by email) as v4390 group by termsused order by termsused""" % buildquery(opts, loop_opts, P)
    params = buildparams(['planet%'], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)

def comments_per_student_vs_class_size(P,req):
    output = {"ID": P["ID"]}
    opts = {"over": [" and num_comments>?"]}
    loop_opts = {}
    query = """
select n_authors, cast(comments_per_author as integer)  from  karger_v_stats where true %(over_0)s""" % buildquery(opts, loop_opts, P)
    params = buildparams(["%over"], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)


def comments_per_week(P,req):
    output = {"ID": P["ID"]}
    opts = {}
    loop_opts = {"id_ensemble": ["and eid=?"]}
    query = """select numweeks, count(cid) from (select c1.cid, c1.eid, cast(extract(epoch from (c1.ctime-c0.ctime))/(3600*24*7) as integer) as numweeks from v_comment c1, (select min(ctime) as ctime, eid from v_comment group by eid) as c0 where c0.eid=c1.eid) as v2 where numweeks<30 %(id_ensemble_0)s group by numweeks order by numweeks""" % buildquery(opts, loop_opts, P)
    params = buildparams(["%id_ensemble"], opts, loop_opts, P)
    output["data"]  =  db.Db().getRows(query, params)
    return UR.prepare_response(output)

