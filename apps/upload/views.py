"""
views.py - uploading file features

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""

import logging, json
from base import utils_response as UR
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from base import auth, annotations, models as M
from os.path import dirname, abspath
import os
import random, string
id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_upload.log_%s.log', filemode='a')

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
        annotations.addOwnership(id_source, id_ensemble, id_folder)
        REPOSITORY_DIR = "%s/%s" % (settings.HTTPD_MEDIA, "/pdf/repository")
        f2 = open("%s/%s" % (REPOSITORY_DIR, id_source,),"wb")    
        f2.write(f.read())
        f2.close()
        basedir = dirname(dirname(abspath(__file__)))
        #do the rest in the background, so server remains responsive                
        cmd = "(cd %s; python -m upload.jobs file_img %s >/tmp/uploadscript_%s.log 2>&1 &)" %(basedir, id_source,  id_log )
        logging.info(cmd)
        os.system(cmd)
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
