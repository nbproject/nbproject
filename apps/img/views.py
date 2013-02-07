# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
import  os, sys, logging, string, random
from django.conf import settings
from django.views.static import serve
from django.http import Http404
from base import annotations
from base import utils_response as UR
from base import auth, models as M, signals
from os.path import dirname, abspath


id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_img_%s.log' % ( id_log,), filemode='a')

def on_file_download(sender, **payload): 
    o = M.FileDownload(user_id=payload["uid"], source_id=payload["id_source"], annotated=payload["annotated"])
    o.save()
    
if settings.MONITOR.get("FILE_DOWNLOAD", False): 
    signals.file_downloaded.connect(on_file_download, weak=False)

def serve_img(req, res, scale, id_source):
    #print "img request of page %s of file %s at res %s and scale %s w/ invite_key=%s and req=%s" % (req.GET["page"], id_file, res, scale, req.GET["invite_key"], req  )
    #TODO: check permissions. 
    uid = UR.getUserId(req);
    if not auth.canReadFile(uid, id_source): 
        return HttpResponse("Error: You don't have credentials to see this file %s " % (id_source,))
    page_str =  settings.IMG_FMT_STRING %  (int(req.GET["page"])-1,)
    filename = req.META["PATH_INFO"].rstrip('/')
    filename = "%s_%s.png" % (filename, page_str)
    response = None
    try: 
        response = serve(req, filename,settings.HTTPD_MEDIA)
        return response
    except Http404: 
        logging.info("missing "+filename)
        basedir = dirname(dirname(dirname(abspath(__file__))))
        #basedir =  sys.modules["servers"].__path__[0].rpartition("/")[0]
        #TODO: would be better to do a redirect to the not_available page
        f = open("%s/content/data/icons/png/not_available.png" % basedir)
        s = f.read()
        f.close()
        return HttpResponse(s)


def serve_doc(req, id_source, annotated=False): 
    serve_dir =  settings.ANNOTATED_DIR if annotated else  settings.REPOSITORY_DIR
    qual = "_annotated" if annotated else  ""
    uid = UR.getUserId(req)
    if not auth.canDownloadPDF(uid, id_source): 
        return HttpResponse("Error: You don't have credentials to see file #%s" % (id_source, ))
    try:   
        response = serve(req, id_source,"%s/%s" % (settings.HTTPD_MEDIA, serve_dir))
        response["Content-Type"]='application/pdf'
        #the following makes sure that: 
        #- the downloaded file name always ends up w/ '.pdf'
        #- it conatains the qualif. '_annotated' if it's... er... well.... annotated : )        
        filename = "%s%s%s" % (M.Source.objects.get(pk=id_source).title.partition(".pdf")[0], qual, ".pdf")        
        response['Content-Disposition'] = "attachment; filename=%s" % (filename, )
        signals.file_downloaded.send("file", req=req, uid=uid, id_source=id_source, annotated=annotated)
        return response
    except Http404: 
        logging.info("missing "+id_source)
        return HttpResponse("Error - No such file: #%s %s" % (id_source, qual) )

def serve_grades_spreadsheet(req, id_ensemble): 
    uid = UR.getUserId(req)
    if not auth.canSeeGrades(uid, id_ensemble):
        return HttpResponse("Error: You don't have credentials to see grades for class %s" % (id_ensemble,))
    a  = annotations.get_stats_ensemble({"id_ensemble": id_ensemble})    
    files = a["files"]
    stats = a["stats"]
    users = a["users"]
        
    import xlwt
    wbk = xlwt.Workbook()
    s_wd = wbk.add_sheet("word_count")
    s_ch = wbk.add_sheet("char_count")
    s_cm = wbk.add_sheet("comments_count")
    file_ids = files.keys()
    user_ids = users.keys()
    row=0
    col=0
    s_wd.write(row, col, "WORDS")
    s_ch.write(row, col, "CHARACTERS")
    s_cm.write(row, col, "COMMENTS")
    col+=1
    for f in file_ids: 
        s_wd.write(row, col, files[f]["title"])
        s_ch.write(row, col, files[f]["title"])
        s_cm.write(row, col, files[f]["title"])
        col+=1
    row+=1
    for u in user_ids: 
        col=0
        s_wd.write(row, col, users[u]["email"])
        s_ch.write(row, col, users[u]["email"])
        s_cm.write(row, col, users[u]["email"])
        col+=1        
        for f in file_ids: 
            stat_id = "%s_%s" % (u,f)
            s_wd.write(row, col, stats[stat_id]["numwords"] if stat_id in stats else "")
            s_ch.write(row, col, stats[stat_id]["numchars"] if stat_id in stats else "")
            s_cm.write(row, col, stats[stat_id]["cnt"] if stat_id in stats else "")
            col+=1
        row+=1
    import datetime
    a = datetime.datetime.now()
    fn = "stats_%s_%04d%02d%02d_%02d%02d.xls" % (id_ensemble,a.year, a.month, a.day, a.hour, a.minute)
    wbk.save("/tmp/%s" %(fn,))
    response = serve(req, fn,"/tmp/")
    os.remove("/tmp/%s" %(fn,))
    response["Content-Type"]='application/vnd.ms-excel'   
    response['Content-Disposition'] = "attachment; filename=%s" % (fn, )
    return response
