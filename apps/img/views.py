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
from upload.views import process_page
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
    page = int(req.GET["page"])-1
    page_str =  settings.IMG_FMT_STRING %  (page,)
    filename = req.META["PATH_INFO"].rstrip('/')
    filename = "%s_%s.png" % (filename, page_str)
    response = None
    try: 
        response = serve(req, filename,settings.HTTPD_MEDIA_CACHE)
        return response
    except Http404: 
        #let's generate on demand
        try: 
            pdf_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR)
            img_dir =  "%s/%s" % (settings.HTTPD_MEDIA_CACHE,settings.CACHE_DIR)
            process_page(id_source, page,  res, scale, pdf_dir, img_dir, settings.IMG_FMT_STRING)
            response = serve(req, filename,settings.HTTPD_MEDIA_CACHE)
            return response
        except Http404:             
            basedir = dirname(dirname(dirname(abspath(__file__))))
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
        #- the filename only contains ascii characters, so that we don't get an UnicodeEncodeError since the 
        #  filename is part of the response headers and that HTTP response headers can only contain ascii characters. 
        filename = ""
        try:
            filename = M.Source.objects.get(pk=id_source).title.partition(".pdf")[0].encode("ascii").replace(" ", "_")
        except UnicodeEncodeError: 
            filename = id_source
        filename = "%s%s%s" % (filename, qual, ".pdf")        
        response['Content-Disposition'] = "attachment; filename=\"%s\"" % (filename, )
        signals.file_downloaded.send("file", req=req, uid=uid, id_source=id_source, annotated=annotated)
        return response
    except Http404: 
        logging.info("missing "+id_source)
        return HttpResponse("Error - No such file: #%s %s" % (id_source, qual) )

def add_allcomments_sheet(source_id, workbook): 
    import datetime
    epoch = datetime.datetime.utcfromtimestamp(0)
    comments = M.Comment.objects.select_related("location").filter(deleted=False, moderated=False, type__gt=1, location__source__id=source_id).order_by("location__page", "location__id", "id")
    s_c = workbook.add_sheet("comments")
    #Header row: 
    row=0
    col=0
    s_c.write(row, col,"PAGE")
    col+=1
    s_c.write(row, col,"LOCATION_ID")
    col+=1
    s_c.write(row, col,"COMMENT_ID")
    col+=1
    s_c.write(row, col,"PARENT_ID")
    col+=1       
    s_c.write(row, col,"SECTION_ID")
    col+=1       
    s_c.write(row, col,"AUTHOR_ID")
    col+=1
    s_c.write(row, col,"CTIME")
    col+=1
    s_c.write(row, col,"BODY")
    #Data Rows: 
    for j in xrange(0, len(comments)):
        rec = comments[j]
        ctime = rec.ctime.replace(tzinfo=None)-epoch
        row+=1
        col=0
        s_c.write(row, col,rec.location.page)
        col+=1
        s_c.write(row, col,rec.location_id)
        col+=1
        s_c.write(row, col,rec.id)
        col+=1
        s_c.write(row, col,rec.parent_id)
        col+=1
        s_c.write(row, col,rec.location.section_id)
        col+=1
        s_c.write(row, col, rec.author_id)
        col+=1
        s_c.write(row, col, ctime.seconds + 3600*24*ctime.days)
        col+=1
        s_c.write(row, col, rec.body)

def add_labeledcomments_sheet(uid, id_ensemble, workbook): 
    lcs = M.LabelCategory.objects.filter(ensemble__id=id_ensemble).order_by("id")
    lcs_ids = list(lcs.values_list('id', flat=True))
    cls = M.CommentLabel.objects.select_related("comment","comment__location").filter(category__in=lcs, grader__id=uid).order_by("comment__location__source__id", "comment__id", "category__id")
    if len(cls)>0:
        s_lc = workbook.add_sheet("labeled_comments")
        #Header row: 
        row=0
        col=0
        s_lc.write(row, col,"SOURCE_ID")
        col+=1
        s_lc.write(row, col,"COMMENT_ID")
        col+=1
        s_lc.write(row, col,"PARENT_ID")
        col+=1
        s_lc.write(row, col,"LOCATION_ID")
        col+=1
        s_lc.write(row, col,"AUTHOR_ID")
        col+=1
        s_lc.write(row, col,"BODY")
        for i in xrange(0,len(lcs)):
            col+=1
            s_lc.write(row, col,"%s - [0:%s]" %(lcs[i].name, lcs[i].pointscale))       
        #Data Rows: 
        previous_comment_id=0
        for j in xrange(0, len(cls)):
            rec = cls[j]
            if previous_comment_id == rec.comment.id:
                #We just need to complete the data that we missed on the previous row. 
                col_grade = col+lcs_ids.index(rec.category_id) #move to the column for the next category for which we have data
                s_lc.write(row, col_grade, rec.grade)
            else: 
                row+=1
                col=0
                s_lc.write(row, col,rec.comment.location.source_id)
                col+=1
                s_lc.write(row, col,rec.comment.id)
                col+=1
                s_lc.write(row, col,rec.comment.parent_id)
                col+=1
                s_lc.write(row, col,rec.comment.location_id)
                col+=1
                s_lc.write(row, col, rec.comment.author_id)
                col+=1
                s_lc.write(row, col, rec.comment.body)
                col+=1
                col_grade = col+lcs_ids.index(rec.category_id) #move to the column for the next category for which we have data
                s_lc.write(row, col_grade, rec.grade) 
            previous_comment_id = rec.comment.id

def add_count_sheets(id_ensemble, workbook): 
    a  = annotations.get_stats_ensemble({"id_ensemble": id_ensemble})    
    files = a["files"]
    stats = a["stats"]
    users = a["users"]
    sections = a["sections"]
  
    s_wd = workbook.add_sheet("word_count")
    s_ch = workbook.add_sheet("char_count")
    s_cm = workbook.add_sheet("comments_count")

    # Default order: file id and user email 
    file_ids = sorted(files)
    user_ids = sorted(users, key=lambda o:users[o]["email"]) 

    row=0
    col=0
    s_wd.write(row, col, "WORDS")
    s_ch.write(row, col, "CHARACTERS")
    s_cm.write(row, col, "COMMENTS")
    col+=1
    s_wd.write(row, col, "SECTION")
    s_ch.write(row, col, "SECTION")
    s_cm.write(row, col, "SECTION")
    col+=1
    val = None
    for f in file_ids: 
        val = files[f]["title"]
        s_wd.write(row, col, val)
        s_ch.write(row, col, val)
        s_cm.write(row, col, val)
        col+=1
    row+=1
    for u in user_ids: 
        col=0
        val = users[u]["email"]
        s_wd.write(row, col, val)
        s_ch.write(row, col, val)
        s_cm.write(row, col, val)
        col+=1
        val = "" if  users[u]["section_id"] is None else  sections[users[u]["section_id"]]["name"] 
        s_wd.write(row, col, val)
        s_ch.write(row, col, val)
        s_cm.write(row, col, val)
        col+=1
        for f in file_ids: 
            stat_id = "%s_%s" % (u,f)
            s_wd.write(row, col, stats[stat_id]["numwords"] if stat_id in stats else "")
            s_ch.write(row, col, stats[stat_id]["numchars"] if stat_id in stats else "")
            s_cm.write(row, col, stats[stat_id]["cnt"] if stat_id in stats else "")
            col+=1
        row+=1
    return a 


def __socialgraph_helper(users, data, s, label): 
    user_ids = sorted(users, key=lambda o:users[o]["email"])
    #Header row: 
    row=0
    col=0
    s.write(row, col,label)     
    col+=1
    for id1 in user_ids: 
        #val = users[id1]["email"]
        val = id1
        s.write(row, col, val)
        col+=1
    row+=1    
    #now real data: 
    for id2 in user_ids: 
        col=0
        #val = users[id2]["email"]
        val = id2
        s.write(row, col, val)
        col+=1
        for id1 in user_ids: 
            id = "%s_%s" % (id2, id1)
            if id in data: 
                val = data[id]["cnt"]
                s.write(row, col, val)
            col+=1            
        row+=1    

def add_socialgraph_sheets(id_ensemble, users, workbook): 
    a  = annotations.get_social_interactions(id_ensemble)
    __socialgraph_helper(users, 
                         a["oneway"], 
                         workbook.add_sheet("interaction_oneway"),
                         'replier \ initiator')
    __socialgraph_helper(users, 
                         a["twoway"], 
                         workbook.add_sheet("interaction_twoway"),
                         'pos2 \ pos1,3')

def spreadsheet_cluster(req, id_ensemble): 
    uid = UR.getUserId(req)
    if not auth.canSeeGrades(uid, id_ensemble):
        return HttpResponse("Error: You don't have credentials to see grades for class %s" % (id_ensemble,))
    import xlwt, json
    workbook = xlwt.Workbook()
    a  = annotations.get_social_interactions_clusters(id_ensemble)
    ensemble = M.Ensemble.objects.get(pk=id_ensemble)
    clusters = json.loads(ensemble.metadata)["groups"]
    ### info sheet ###
    s = workbook.add_sheet("information")
    row=0
    col=0
    for i in xrange(0, len(clusters)): 
        cluster = clusters[i]
        s.write(row, col, "cluster")
        col +=1
        s.write(row, col, i)
        col = 0
        row+=1
        s.write(row, col, "sources")
        s.write(row, col+1, "id")
        s.write(row, col+2, "title")
        s.write(row, col+3, "class")
        row+=1
        for source_id  in cluster["source"]:
            col = 0
            source = M.Source.objects.get(pk=source_id)
            s.write(row, col+1, source_id)
            s.write(row, col+2, source.title)
            s.write(row, col+3, source.ownership_set.all()[0].ensemble.name)
            row+=1
        col = 0
        s.write(row, col, "buddy groups")
        s.write(row, col+1, "group id")
        s.write(row, col+2, "user id")
        s.write(row, col+3, "firstname")
        s.write(row, col+4, "lastname")
        s.write(row, col+5, "email")
        row+=1
        for j in xrange(0, len(cluster["buddylists"])):
            for user_id in cluster["buddylists"][j]:
                user = M.User.objects.get(pk=user_id)
                s.write(row, col+1, j)
                s.write(row, col+2, user_id)
                s.write(row, col+3, user.firstname)
                s.write(row, col+4, user.lastname)
                s.write(row, col+5, user.email)
                row+=1
        row+=1
    ##data sheets:
    for i in xrange(0, len(clusters)):
        data = a[i] 
        cluster = clusters[i]
        user_ids = []
        for buddylist in cluster["buddylists"]:
            user_ids.extend(buddylist)          
        s = workbook.add_sheet("cluster %s" %(i,))         
        #Header row: 
        row=0
        col=0
        s.write(row, col,"replier \ initiator")     
        col+=1
        for id1 in user_ids:         
            val = id1
            s.write(row, col, val)
            col+=1
        row+=1    
        #now real data: 
        for id2 in user_ids: 
            col=0        
            val = id2
            s.write(row, col, val)
            col+=1
            for id1 in user_ids: 
                id = "%s_%s" % (id2, id1)
                if id in data: 
                    val = data[id]["cnt"]
                    s.write(row, col, val)
                col+=1            
            row+=1    

    import datetime
    a = datetime.datetime.now()
    fn = "stats_cluster_%s_%04d%02d%02d_%02d%02d.xls" % (id_ensemble,a.year, a.month, a.day, a.hour, a.minute)
    workbook.save("/tmp/%s" %(fn,))
    response = serve(req, fn,"/tmp/")
    os.remove("/tmp/%s" %(fn,))
    response["Content-Type"]='application/vnd.ms-excel'   
    response['Content-Disposition'] = "attachment; filename=%s" % (fn, )
    return response

def serve_grades_spreadsheet(req, id_ensemble): 
    uid = UR.getUserId(req)
    if not auth.canSeeGrades(uid, id_ensemble):
        return HttpResponse("Error: You don't have credentials to see grades for class %s" % (id_ensemble,))
    import xlwt
    wbk = xlwt.Workbook()

    #first, generate the sheets with comment, words, char counts: 
    stats = add_count_sheets(id_ensemble, wbk)
 
    #now add a sheet for labeled comments if there are any: 
    add_labeledcomments_sheet(uid, id_ensemble, wbk)
    
    #now add sheets for the social graph
    # FIXME: this is broken for ensemble 6010 on nb.mit.edu. Disabling for now. 
    # https://github.com/nbproject/nbproject/issues/199
    #add_socialgraph_sheets(id_ensemble, stats["users"], wbk)

    import datetime
    a = datetime.datetime.now()
    fn = "stats_%s_%04d%02d%02d_%02d%02d.xls" % (id_ensemble,a.year, a.month, a.day, a.hour, a.minute)
    wbk.save("/tmp/%s" %(fn,))
    response = serve(req, fn,"/tmp/")
    os.remove("/tmp/%s" %(fn,))
    response["Content-Type"]='application/vnd.ms-excel'   
    response['Content-Disposition'] = "attachment; filename=%s" % (fn, )
    return response



def spreadsheet_comments(req, id_source): 
    uid = UR.getUserId(req)
    if not auth.canDownloadFileComments(uid, id_source):
        return HttpResponse("Error: You don't have credentials to download comment for that file %s" % (id_source,))
    import xlwt
    wbk = xlwt.Workbook()

    #now add a sheet for labeled comments if there are any: 
    add_allcomments_sheet(id_source, wbk)
    
    import datetime
    a = datetime.datetime.now()
    fn = "comments_%s_%04d%02d%02d_%02d%02d.xls" % (id_source, a.year, a.month, a.day, a.hour, a.minute)
    wbk.save("/tmp/%s" %(fn,))
    response = serve(req, fn,"/tmp/")
    os.remove("/tmp/%s" %(fn,))
    response["Content-Type"]='application/vnd.ms-excel'   
    response['Content-Disposition'] = "attachment; filename=%s" % (fn, )
    return response
