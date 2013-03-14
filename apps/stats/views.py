# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
import  json, sys
from django.views.decorators.csrf import csrf_exempt
from base import  utils_response as UR
import logging, random, string
id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_stats_%s.log' % ( id_log,), filemode='a')

__EXPORTS = [
    "popular_groups2", 
    ]

def test1(req): 
    return render_to_response("web/stats1.html", {})

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
    from base import db
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
e.id  from base_comment c, base_location l, base_ensemble e where  e.id=l.ensemble_id and l.id=c.location_id and c.ctime>? group by e.name, e.id ) as v2 order by total
""", (P["after"],))
    output["data"] = data
    return UR.prepare_response(output)
