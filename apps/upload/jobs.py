"""
jobs.py - pdf rasterization routines

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
import sys,os
import datetime
if "" not in sys.path: 
    sys.path.append("")
if "DJANGO_SETTINGS_MODULE" not in os.environ: 
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings
from base import utils, models as M
import glob, json,   pyPdf, shutil, re, random, string, logging
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from os.path import dirname, abspath

id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_utils_pdf_%s.log' % ( id_log,), filemode='a')


def process_file(id, res, scales, pdf_dir, img_dir, fmt):
    #insert metadata if not there: 
    filename = "%s/%s" % (pdf_dir, id)
    #this is where we test for good PDF: 
    numpages = 0
    h = 0
    w = 0
    do_crop = True
    ROTATE_KEY = "/Rotate"
    try: 
        pdf_object = pyPdf.PdfFileReader(file(filename, "rb"))
        numpages = pdf_object.getNumPages()
        p = pdf_object.getPage(0)
        box = p.trimBox
        hm = int(p.mediaBox.getUpperRight_y())
        wm = int(p.mediaBox.getUpperRight_x())
        ht = int(box.getUpperRight_y() - box.getLowerLeft_y())
        wt = int(box.getUpperRight_x() - box.getLowerLeft_x())
        rotation = 0 if ROTATE_KEY not in p else int(p[ROTATE_KEY]) 
        if wm<=wt or hm<=ht: #we have a doubt: use media_box
            do_crop = False
            w = wm
            h = hm
        else: #seems ok to use trimbox
            w = wt
            h = ht
    except pyPdf.utils.PdfReadError: 
        print "PdfReadError for %s ! Aborting !!!" % (filename,)
        return False
    s = M.Source.objects.get(pk=id)
    s.numpages = numpages
    s.w = w 
    s.h = h 
    s.rotation = rotation
    #version is set up somewhere else, so it doesn't get called multiple times...    
    s.save()    
    #if "100" not in scales:
    #    assert False, "100 should be in scales for resolution %s, which only contains %s " % (res,scales)
    d_ref = 72
    for i in xrange(0,numpages):
        for scale in scales: 
            pageno = fmt % (i,)
            density = (int(res)*int(scale))/100   
            output_dir =  "%s/%s/%s" % (img_dir, res, scale)
            output_file = ("%s_"+fmt+".png") % (id, i)
            crop_params = " -crop %sx%s+%s+%s " % (w*density/d_ref, h*density/d_ref,box.getLowerLeft_x()*density/d_ref,box.getLowerLeft_y()*density/d_ref) if do_crop else ""            
            #now try w/ mu.pdf: 
            src = "%s/%s" % (pdf_dir, id)
            cmd_rasterize = "nice pdfdraw -o %s/%s -r %s -b 8 %s %s" % (output_dir, output_file, density, src, (i+1))
            #cmd = "nice convert -quality 100  %s  -density %s %s/%s[%s] %s/%s/%s/%s_%s.png" % (crop_cmd, density,  pdf_dir, id,i, img_dir, res,scale,  id, pageno)            
            cmd_crop =  "echo" if crop_params=="" else "nice convert -quality 100  %s  -density %s %s/%s %s/%s" % (crop_params, density,output_dir, output_file, output_dir, output_file)
            cmd = "(%s) && (%s)" % (cmd_rasterize, cmd_crop)
            print cmd
            retval =  os.system(cmd)
    return True        

def update_rotation(*t_args):
    """
    Updates rotation info of existing PDFs in the database
    usage: utils_pdf update_rotation start_at_id [alternate_repository_dir] 
    NOTE: This only takes the 1st page into consideration 
    """
    ROTATE_KEY = "/Rotate"
    if len(t_args)>0:
        args=t_args[0]
        DB = db.Db()
        if (len(args)<1): 
            print "usage: utils_pdf update_rotation start_at_id [alternate_pdf_dir] "
            return
        start_at_id  =  args[0] if len(args)>=1 else 1
        rep_dir =  args[1] if len(args)==2 else "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR)

        if not os.path.exists(rep_dir): 
            print "this repository dir doesn't exist: %s" % (rep_dir,)
            return 
        rows = DB.getRows("select id from source where id >= ? order by id", (start_at_id, ))
        for r in rows: 
            id =  r[0]
            filename = "%s/%s" % (rep_dir, id)
            if os.path.exists(filename): 
                try: 
                    pdf_object = pyPdf.PdfFileReader(file(filename, "rb"))
                    p = pdf_object.getPage(0)
                    if ROTATE_KEY in p: 
                        r = int(p[ROTATE_KEY])
                        #print "found rotation=%d in %s" % (r, id)
                        DB.doTransaction("update pdf_data set  rotation=? where id_source = ?", (r, id))
                        print id, 
                except pyPdf.utils.PdfReadError: 
                    print "\nPdfReadError for %s - Skipping" % (filename,)
                except: 
                    print "\nOTHER ERROR for %s - Skipping" % (filename, )
            else: 
                print "\n%s not in repository" %(filename, )

def update_dims(*t_args):
    """
    Updates dimensions of existing PDFs in the database
    usage: utils_pdf update_dims  start_at_id [alternate_repository_dir] 
    NOTE: This only takes media_box into consideration (so that we keep the compatibility w/ existing annotations)
    """
    print "DO NOT USE w/ pdfs uploaded after 20111117, as this will break the compatibility w/ existing annotations (since we've switched between mediabox and trimbox on 20111117)"
    return
    if len(t_args)>0:
        args=t_args[0]
        DB = db.Db()
        if (len(args)<1): 
            print "usage: utils_pdf update_dims  start_at_id [alternate_pdf_dir] "
            return
        start_at_id  =  args[0] if len(args)>=1 else 1
        rep_dir =  args[1] if len(args)==2 else "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR)

        if not os.path.exists(rep_dir): 
            print "this repository dir doesn't exist: %s" % (rep_dir,)
            return 
        rows = DB.getRows("select id from source where id >= ? order by id", (start_at_id, ))
        for r in rows: 
            id =  r[0]
            filename = "%s/%s" % (rep_dir, id)
            if os.path.exists(filename): 
                try: 
                    pdf_object = pyPdf.PdfFileReader(file(filename, "rb"))
                    p = pdf_object.getPage(0)
                    box = p.trimBox
                    #h = int(box.getUpperRight_y() - box.getLowerLeft_y())
                    #w = int(box.getUpperRight_x() - box.getLowerLeft_x())
                    h = int(p.mediaBox.getUpperRight_y())
                    w = int(p.mediaBox.getUpperRight_x())
                    DB.doTransaction("update pdf_data set  nrows=? ,ncols=? where id_source = ?", (h, w, id))
                    print id, 
                except pyPdf.utils.PdfReadError: 
                    print "\nPdfReadError for %s - Skipping" % (filename,)
                except: 
                    print "\nOTHER ERROR for %s - Skipping" % (filename, )
            else: 
                print "\n%s not in repository" %(filename, )

def file_update(*t_args):
    """
    Updates a existing file with a new file. 
    """
    if len(t_args)>0:
        args=t_args[0]
        if len(args)<2:  
            print "usage: utils_pdf file_update id_source filename"
            return 
        id_source = args[0]
        filename = args[1]
        #copy old file
        rep_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR)
        archive_dir =  "%s/%s" % (rep_dir, "archive")
        if not os.path.exists(archive_dir):
            os.mkdir(archive_dir)
        o = M.Ownership.objects.get(source__id=id_source)
        o.published = datetime.datetime.now()
        o.save()        
        shutil.move("%s/%s" % (rep_dir, id_source), "%s/%s_%s" % (archive_dir, id_source, o.source.version))
        shutil.copy2(filename,"%s/%s" % (rep_dir, id_source))
        regenerate_file((id_source,))


def split_chapters(*t_args):
    """
    Split a large pdf into chunks (i.e. chapters)
    """    
    if len(t_args)>0:
        args=t_args[0]
        if len(args)<1:  
            print "usage: utils_pdf split_chapters configfile"
            return 
        from pyPdf import PdfFileWriter, PdfFileReader
        f = open(args[0])
        P = json.loads(f.read())
        f.close()
        input = PdfFileReader(file(P["source"], "rb"))
        i0 =  P["first_chapter_index"]
        ends = P["chapters_ends"]
        for i in xrange(0, len(ends)): 
            ch_num = i0+i
            fmt = P["chapter_fmt"] % (ch_num, )
            output = PdfFileWriter()
            if not os.path.exists(P["outputdir"]): 
                os.mkdir( P["outputdir"])
            fn_out = "%s/%s%s" % (P["outputdir"], P["chapter_prefix"], fmt)
            j0 = P["firstpage"] if i==0 else ends[i-1]
            for j in xrange(j0, ends[i]): 
                output.addPage(input.getPage(j))
            outputStream = file(fn_out, "wb")
            output.write(outputStream)
            outputStream.close()
            print "wrote %s" % (fn_out,)
                
        
def upload_chapters(*t_args):
    """
    upload chapters in a bulk fashion
    """    
    if len(t_args)>0:
        args=t_args[0]
        if len(args)<1:  
            print "usage: utils_pdf upload_chapters configfile"
            return 
        DB = db.Db()
        f = open(args[0])
        P = json.loads(f.read())
        f.close()
        i0 =  P["first_chapter_index"]
        ends = P["chapters_ends"]
        fmt2 = settings.IMG_FMT_STRING
        resolutions = P["RESOLUTIONS"] if "RESOLUTIONS" in P else settings.RESOLUTIONS
        rep_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.RESTRICTED_REPOSITORY_DIR) if P["restricted"] else "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR) 
        cache_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.CACHE_DIR)
        for i in xrange(0, len(ends)): 
            ch_num = i0+i
            fmt = P["chapter_fmt"] % (ch_num, )
            title = "%s%s" % ( P["chapter_prefix"], fmt)
            fn = "%s/%s" % (P["outputdir"], title)
            id_source = DB.getVal(""" select nextval('source_id_seq') """,())
            DB.doTransaction("""insert into source(id, scheme,dn,port, path, query, submittedby) values (?, ?, ?, ?, ?, ?, ?)""", (id_source, "http", "localhost","8080","/%s" %(title,), "id_ensemble=%s" % (P["id_ensemble"], ), None))
            DB.doTransaction("insert into ownership(id_source, id_ensemble) values (?,?)", (id_source,P["id_ensemble"]))
            shutil.copy2(fn,"%s/%s" % (rep_dir, id_source))
            for res in resolutions:
                if process_file(id_source, res, resolutions[res],rep_dir, cache_dir, fmt2, DB): 
                    print "%s: success ! " % (id_source, )
                else: 
                    print "%s: failed ! " % (id_source, )
                   
def process_next(args=[]):     
    #are there any running tasks ?    
    in_process = M.Processqueue.objects.filter(started__isnull=False, completed=None)
    if in_process.count() == 0: #queue is available for processing  
        #get 1st task that needs to be run
        tasks = M.Processqueue.objects.filter(started=None)
        if tasks.count()==0:  
            print "process_next - nothing to do"
            return
        task = tasks[0]
        task.started=datetime.datetime.now()
        task.save()
        id_source = task.source_id
        resolutions={}
        if len(args)>1:
            resolutions[args[1]]={"100": None}
        else:
            resolutions = settings.RESOLUTIONS
        rep_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR)
        cache_dir =  "%s/%s" % (settings.HTTPD_MEDIA,settings.CACHE_DIR)
        fmt = settings.IMG_FMT_STRING
        for res in resolutions:
            if not os.path.exists( "%s/%s" % (cache_dir, res)):
                os.mkdir( "%s/%s" % (cache_dir, res))
            for scale in resolutions[res]:
                if  not os.path.exists( "%s/%s/%s" % (cache_dir, res, scale)):
                    os.mkdir( "%s/%s/%s" % (cache_dir, res, scale))
            print "about to regenerate %s" %(id_source,)
            if not process_file(id_source, res, resolutions[res],rep_dir, cache_dir, fmt): 
                print "Error happened with pdf: deleting %d from records " %(id_source,)
                V = {"reply_to": settings.SMTP_REPLY_TO,
                     "email": task.source.submittedby.email,
                     "source_id": task.source.id,
                     "title": task.source.title, 
                     "submitted": task.submitted, 
                     "support":  settings.SUPPORT_LINK,
                     "contact_email": settings.NBTEAM_EMAIL,
                     "firstname": task.source.submittedby.firstname
                     }
                task.delete()
                M.Ownership.objects.get(source__id=id_source).delete()
                M.Source.objects.get(pk=id_source).delete()
                msg = render_to_string("email/msg_pdferror",V)
                email = EmailMessage("NB was unable to read a PDF file that you've submitted", msg,  "NB Notifications <no-reply@notabene.csail.mit.edu>", 
                (V["email"], settings.SMTP_CC_PDFERROR ), (settings.EMAIL_BCC, ))
                email.send()
                print msg                
                return 
        #mark that processing is done:
        task.completed = datetime.datetime.now()
        task.save()
        s = task.source
        s.version = s.version+1
        s.save()
        V = {"reply_to": settings.SMTP_REPLY_TO,
             "email": task.source.submittedby.email,
             "title": task.source.title,  
             "submitted": task.submitted, 
             "protocol": settings.PROTOCOL, 
             "hostname": settings.HOSTNAME, 
             "id_source": id_source, 
             "firstname": task.source.submittedby.firstname
             }
        msg = render_to_string("email/msg_pdfdone",V)
        email = EmailMessage("The PDF file that you've submitted is now ready on NB.", msg,  "NB Notifications <no-reply@notabene.csail.mit.edu>", 
                (V["email"], settings.SMTP_CC_USER ), (settings.EMAIL_BCC, ))
        email.send()
        try: 
            print msg
        except UnicodeEncodeError: 
            print "not displaying msg b/c of unicode issues"                   
        #are there still tasks needing to be run ?
        tasks = M.Processqueue.objects.filter(started=None)        
        if tasks.count() != 0:  
            new_id_source = tasks[0].source.id
            basedir = dirname(dirname(abspath(__file__)))                        
            cmd = "(cd %s; python -m upload.jobs file_img %s >> /tmp/uploadscript.log 2>&1 &)" %(basedir, new_id_source)
            logging.info(cmd)
            os.system(cmd)                       
        else: 
            print "PDF queue is now empty"
    else: 
        print "PDF task already running (%s)." % (in_process[0].id, )

def regenerate_file(*t_args):
    """
    (re)-generates the images for a given file
    """
    if len(t_args)>0:
        args=t_args[0]
        if len(args)==0:  
            print "Missing id_source"
            return
                 
        id_source = args[0]
        #Add new source to the queue if not present or present and finished:
        o = M.Processqueue.objects.filter(source__id=id_source, completed=None)
        if o.count()==0: 
            o = M.Processqueue(source_id=id_source)
            o.save()             
        process_next(args)

if __name__ == "__main__" :
    ACTIONS = {
        "file_img": regenerate_file, 
        "file_update": file_update, 
        "update_dims": update_dims, 
        "split_chapters": split_chapters,
        "upload_chapters": upload_chapters,
        "update_rotation": update_rotation

        }
    utils.process_cli(__file__, ACTIONS)
