"""
jobs.py - pdf processing

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

    For the functions that generate the ConTeXt output (i.e. grouped under process_file): 
    Copyright 2010 Sanjoy Mahajan - with modifications from Sacha Zyto
    License: GNU Affero GPL v3 or, at your option, any subsequent
    version published by the Free Software Foundation.
    See the LICENSE file in this directory for a copy of v3, or
    <http://www.gnu.org/licenses/agpl.html> for the current version
"""
import sys,os
import datetime
if "." not in sys.path: 
    sys.path.append(".")
if "DJANGO_SETTINGS_MODULE" not in os.environ: 
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings
from base import utils, models as M, annotations, utils_response as UR
import glob, json,   pyPdf, shutil, re, random, string, logging
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_processing_pdf_%s.log' % ( id_log,), filemode='a')


def process_file(id_source): 
    from processing.tex_template import tex_header
    from pyPdf import PdfFileReader
    from numpy import array
    logging.info("begin %s" % (id_source, ))
    OUTPUT = []
    S = {}
    locations, comments  = annotations.getPublicCommentsByFile(id_source)
    repfile   = "%s/%s/%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR, id_source)
    if not  os.path.exists(repfile):
        logging.warning("%s not found. Skipping..." % (repfile, ))
        return 
    srcfile   = "/tmp/orig_%s.pdf" % (id_source, )
    if not os.path.exists(srcfile):
        os.symlink(repfile, srcfile)
    pdf       = PdfFileReader(file(srcfile, "rb"))
    trim_box  = pdf.pages[0].trimBox # Sacha's coordinate system now uses this box
    crop_box  = pdf.pages[0].cropBox  # ConTeXt's page inclusion uses this box
    fudge     = (int(trim_box[2])-int(trim_box[0]))/612.0 # for the assumption of 612bp width
    bp_per_pixel = 72.0/150 * fudge

    roots       = {}
    children_of = {}

    for k in comments:
        node = int(k)
        parent = comments[k]['id_parent']
        if parent:
            if parent not in children_of:
                children_of[parent] = []
            children_of[parent].append(node)
        else:
            loc_id      = comments[node]['ID_location']
            loc         = locations[loc_id]
            if loc['page'] != 0:
                loc['center_x'] = loc['left'] + loc['w']/2.0
                loc['center_y'] = loc['top']  + loc['h']/2.0
            else:
                loc['center_x'] = None
                loc['center_y'] = None
            roots[node] = loc

    def oneline(s):
        return s.replace('\n', ' ')

    def texify(s):
        s = s.strip()
        patterns = [(r'\\', r'\\\\'),
                    (r'%', r'\%'), (r'\$', r'\$'), ('_', r'\_'), (r'\&', r'\&'),
                    (r'\^', r'\^\\null{}'), (r'#', r'\#'), (r'\|', r'$|$')]
        for p in patterns:
            s = re.sub(p[0], p[1], s)
        return s

    def rect2array(rect):
        return array(rect.lowerLeft+rect.upperRight, dtype=float)

    def rectangle_height(rect):
        return rect.upperRight[1]-rect.lowerLeft[1]

    S["last_page"] = -1
    def print_child(n, levels=0):
        body     = comments[n]['body']
        loc_id   = comments[n]['ID_location']
        location = locations[loc_id]
        page     = int(location['page'])
        if levels == 0 and page > S["last_page"]:
            OUTPUT.append('\n%% Comments on page %d of %s [%s]' % (page,
                                                           "myfile",
                                                           os.path.basename(srcfile)))
            if page == 0:
                sectitle = 'Global comments'
            else:
                sectitle = 'Comments on page %d' % page
            OUTPUT.append(r'\title{%s} \def\whatpage{%d}' % (sectitle, page))
            S["last_page"] = page
        if comments[n]['admin'] == 1:
            me = 1
        else:
            me = 0
        msg = '\n'+r'\comment{note-%s}{%d}{%s}{%d}{%d}' % (n, levels, texify(body), me, int(n))
        OUTPUT.append(unicode(msg).encode("utf-8"))
        if levels == 0 and page != 0:  # a root comment not on page 0 needs callout
            root = roots[n]
            # Sacha's coords are from top left corner, relative to TrimBox
            # but in pixels (not postscript points).
            # evaluate comment_box_px, with this coord system, as [llx lly w h]
            comment_box_px = array([root['left'],
                                    root['top']+root['h'],
                                    root['w'],
                                    root['h']])
            comment_box_bp = comment_box_px * bp_per_pixel
            # convert y coordinate to use bottom edge of trim_box as y=0
            comment_box_bp[1] = int(rectangle_height(trim_box))-int(comment_box_bp[1])
            # convert to coordinates relative to CropBox
            comment_box_bp[0:2] += (rect2array(trim_box)-rect2array(crop_box))[0:2]
            OUTPUT.append('\setpospxywhd{note-%d-dest}{1}' % n)
            OUTPUT.append('{%fbp}{%fbp}{%fbp}{%fbp}{0pt}' % tuple(comment_box_bp))
            OUTPUT.append('''\startpositionoverlay{callouts}
    \setMPpositiongraphic{note-%d}{callout}{to=note-%d-dest}
    \stoppositionoverlay''' % (n, n))
        if n in children_of:
            for k in sorted(children_of[n]):
                print_child(k, levels+1)

    def cmp(a,b):
        if roots[a]['page'] == 0 and roots[b]['page'] == 0:
            return a-b              # order by comment id
        for key in ['page', 'center_y', 'center_x']:
            if roots[a][key] != roots[b][key]:
                return int(1e6*roots[a][key] - 1e6*roots[b][key])
        return 0

    tex_params = {'crop_wd': crop_box[2]-crop_box[0],
                  'crop_ht': crop_box[3]-crop_box[1],
                  'srcfile': srcfile
                  }

    OUTPUT.append( tex_header % tex_params)
    OUTPUT.append( '\n\\starttext')
    for root_id in sorted(roots, cmp):
        print_child(root_id, 0)
    OUTPUT.append( '\n\\stoptext')    
    texfile = "/tmp/%s.tex" % (id_source, )
    f = open(texfile, "w")
    f.write("\n".join(OUTPUT))
    f.close()
    cmd = "(cd /tmp; texexec --timeout=120 %s; mv %s.pdf %s/%s/%s)" % (texfile, id_source, settings.HTTPD_MEDIA, settings.ANNOTATED_DIR, id_source)
    os.system(cmd)
    logging.info("end %s" % (id_source, ))

def generate_latest(*t_args): 
    from django.db.models import Max
    latestCtime = M.Comment.objects.all().aggregate(Max("ctime"))["ctime__max"]
    latestNotif = M.Notification.objects.get(type="richpdf")
    sources = UR.qs2dict(M.Comment.objects.select_related("location").filter(type=3, ctime__gt=latestNotif.atime),{"ID": "location.source_id"} ,"ID" )
    for s in sources:
        process_file(s)
    latestNotif.atime = latestCtime
    latestNotif.save()

def generate_file(*t_args):
    """
    (re)-generates the annotated PDF for a given file
    """
    if len(t_args)>0:
        args=t_args[0]
        if len(args)==0:  
            print "Missing id_source"
            return 
        id_source = args[0]
        process_file(id_source)

if __name__ == "__main__" :
    ACTIONS = {
        "generate_file": generate_file, 
        "latest": generate_latest, 
        }
    utils.process_cli(__file__, ACTIONS)









