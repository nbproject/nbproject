"""
views.py - uploading file features

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""

import logging
from base import utils_response as UR
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from base import auth, annotations, models as M
from os.path import dirname, abspath
import os
import random, string
from django.template.loader import render_to_string
from django.core.mail.message import EmailMessage
id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_upload.log_%s.log', filemode='a')

def insert_pdf_metadata(id, pdf_dir):
    import pyPdf, sys
    #insert metadata if not there: 
    filename = "%s/%s" % (pdf_dir, id)
    #this is where we test for good PDF: 
    numpages = 0
    h = 0
    w = 0
    ROTATE_KEY = "/Rotate"
    x0=y0=0
    try: 
        pdf_object = pyPdf.PdfFileReader(file(filename, "rb"))
        if pdf_object.isEncrypted and pdf_object.decrypt("")==0:
            print "PDF file encrypted with non-empty password: %s" % (filename,)
            return False
        numpages = pdf_object.getNumPages()
        p = pdf_object.getPage(0)
        box = p.trimBox
        hm = int(p.mediaBox.getUpperRight_y())
        wm = int(p.mediaBox.getUpperRight_x())
        ht = int(box.getUpperRight_y() - box.getLowerLeft_y())
        wt = int(box.getUpperRight_x() - box.getLowerLeft_x())
        rotation = 0 if ROTATE_KEY not in p else int(p[ROTATE_KEY]) 
        if wm<=wt or hm<=ht: #we have a doubt: use media_box         
            w = wm
            h = hm
        else: #seems ok to use trimbox
            w = wt
            h = ht
            x0 = box.getLowerLeft_x()
            y0 = box.getLowerLeft_y()
    except pyPdf.utils.PdfReadError: 
        print "PdfReadError for %s ! Aborting !!!" % (filename,)
        return False
    except: 
        print "OTHER PDF ERROR for %s - Skipping\nDetails: %s" % (filename,sys.exc_info()[0] )
        return False
    s = M.Source.objects.get(pk=id)
    s.numpages = numpages
    s.w = w 
    s.h = h 
    s.rotation = rotation
    s.x0 = x0
    s.y0 = y0
    #version is set up somewhere else, so it doesn't get called multiple times...    
    s.save()   
    return True

def process_page(id, page, res, scale, pdf_dir, img_dir, fmt):
    s = M.Source.objects.get(pk=id)
    if ( not s.numpages):
        insert_pdf_metadata(id, pdf_dir)
        #TODO: Handle error cases using return value from insert_pdf_metadata 
    s = M.Source.objects.get(pk=id)    
    d_ref = 72
    density = (int(res)*int(scale))/100   
    output_dir =  "%s/%s/%s" % (img_dir, res, scale)
    if not os.path.exists( "%s/%s" % (img_dir, res)):
        os.mkdir( "%s/%s" % (img_dir, res))        
    if  not os.path.exists( "%s/%s/%s" % (img_dir, res, scale)):
        os.mkdir( "%s/%s/%s" % (img_dir, res, scale))
    output_file = ("%s_"+fmt+".png") % (id, page)
    crop_params = ""
    if s.x0 > 0 or s.y0 > 0:
        crop_params = " -crop %sx%s+%s+%s " % (s.w*density/d_ref, s.h*density/d_ref,s.x0*density/d_ref,s.y0*density/d_ref)            
    #now try w/ mu.pdf: 
    src = "%s/%s" % (pdf_dir, id)
    cmd_rasterize = "mudraw -o %s/%s -r %s %s %s" % (output_dir, output_file, density, src, (page+1))
    cmd_crop =  "echo" if crop_params=="" else "nice convert -quality 100  %s  -density %s %s/%s %s/%s" % (crop_params, density,output_dir, output_file, output_dir, output_file)
    cmd = "(%s) && (%s)" % (cmd_rasterize, cmd_crop)
    print cmd
    retval =  os.system(cmd)
    return retval  

@csrf_exempt
def upload(req): 
    r = HttpResponse()
    f = req.FILES["file"]
    id_ensemble = req.GET["id_ensemble"]
    id_source = req.GET["id_source"]
    id_folder = req.GET.get("id_folder", None)
    uid = UR.getUserId(req);
    logging.info("upload uid=%s, id_source=%s, id_ensemble=%s, id_folder=%s" %  (uid,id_source,id_ensemble,id_folder))
    url = "http://%s:%s/%s?id_ensemble=%s" %("localhost", "8080",f.name, id_ensemble)
    payload = {"url": url, "id_source": id_source, "id_folder": id_folder }
    if auth.canInsertFile(uid, id_ensemble, id_folder):
        #the followong data will be deleted in utils_pdf if an PDF error happens later...
        annotations.createSource(uid, payload)
        ownership = annotations.addOwnership(id_source, id_ensemble, id_folder)
        source = ownership.source
        REPOSITORY_DIR = "%s/%s" % (settings.HTTPD_MEDIA, "/pdf/repository")
        f2 = open("%s/%s" % (REPOSITORY_DIR, id_source,),"wb")    
        f2.write(f.read())
        f2.close()                 
        if insert_pdf_metadata(id_source,  REPOSITORY_DIR):
            V = {"reply_to": settings.SMTP_REPLY_TO,
             "email": source.submittedby.email,
             "title": source.title,  
             "submitted": ownership.published, 
             "protocol": settings.PROTOCOL, 
             "hostname": settings.HOSTNAME, 
             "id_source": id_source, 
             "firstname": source.submittedby.firstname
             }
            msg = render_to_string("email/msg_pdfdone",V)
            email = EmailMessage(
                "The PDF file that you've submitted is now ready on NB.", 
                msg,
                settings.EMAIL_FROM,
                (V["email"], settings.SMTP_CC_USER ), 
                (settings.EMAIL_BCC, ))
            email.send()
        else:
            #send email that stg didn't work and remove that document.         
            V = {"reply_to": settings.SMTP_REPLY_TO,
                     "email": source.submittedby.email,
                     "source_id": id_source,
                     "title": source.title, 
                     "submitted": ownership.published, 
                     "support":  settings.SUPPORT_LINK,
                     "contact_email": settings.NBTEAM_EMAIL,
                     "firstname": source.submittedby.firstname
                     }
            ownership.delete()
            source.delete()
            msg = render_to_string("email/msg_pdferror",V)
            email = EmailMessage(
                "NB was unable to read a PDF file that you've submitted", 
                msg,  
                settings.EMAIL_FROM,
                (V["email"], settings.SMTP_CC_PDFERROR ), (settings.EMAIL_BCC, ))
            email.send()
        r.content =  UR.prepare_response({})
    else: 
        r.content =  UR.prepare_response({}, 1, "NOT ALLOWED to insert a file to this group")
    return r

@csrf_exempt
def update(req): 
    r = HttpResponse()
    f = req.FILES["file"]
    id_source = req.GET["id_source"]
    uid = UR.getUserId(req);
    logging.info("update uid=%s, id_source=%s" %  (uid,id_source))
    if auth.canUpdateFile(uid, id_source):
        s = M.Source.objects.get(pk=id_source)
        o = M.Ownership.objects.get(source=s)
        sv = M.SourceVersion(title=s.title, submittedby=s.submittedby, numpages=s.numpages, w=s.w, h=s.h, rotation=s.rotation, version=s.version, published=o.published)         
        sv.save()
        tmpfile_name =  "/tmp/update_%s" % ("".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,8)]),)
        f2 = open(tmpfile_name,"wb")    
        f2.write(f.read())
        f2.close()
        basedir = dirname(dirname(abspath(__file__)))
        #do the rest in the background, so server remains responsive                
        cmd = "(cd %s; python -m upload.jobs file_update %s %s >/tmp/updatescript_%s.log 2>&1 &)" %(basedir, id_source, tmpfile_name,   id_log )
        logging.info(cmd)
        os.system(cmd)
        r.content =  UR.prepare_response({})
    else: 
        r.content =  UR.prepare_response({}, 1, "NOT ALLOWED to update a file to this group")
    return r
