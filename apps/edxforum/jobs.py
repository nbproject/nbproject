import json, re,sys,os,datetime
if "" not in sys.path: 
    sys.path.append("")
if "DJANGO_SETTINGS_MODULE" not in os.environ: 
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings
from base import utils
import models as M

def try_add_comment(x, o, cnt): 
    newcnt = cnt
    try:
        c = M.Comment.objects.get(oid=x["_id"]["$oid"])
        return cnt
    except M.Comment.DoesNotExist: 
        if  "parent_id" in x: 
            try: 
                c = M.Comment.objects.get(oid=x["parent_id"]["$oid"])
            except M.Comment.DoesNotExist: 
                x2 = (obj for obj in o if obj["_type"]=="Comment" and obj["_id"]["$oid"]==x["parent_id"]["$oid"]).next()
                newcnt+=try_add_comment(x2, o, cnt)
        c = M.Comment()
        c.oid = x["_id"]["$oid"]
        c.anonymous = x["anonymous"]
        c.anonymous_to_peers = x["anonymous_to_peers"]
        c.author = M.Author.objects.get(edxid=int(x["author_id"]))
        c.commentthread = M.CommentThread.objects.get(oid=x["comment_thread_id"]["$oid"])
        c.parent =  M.Comment.objects.get(oid=x["parent_id"]["$oid"]) if "parent_id" in x else M.Comment.objects.get(oid=c.commentthread.oid)
        c.body = x["body"]
        c.ctime = datetime.datetime.fromtimestamp(int(x["created_at"]["$date"])/1000)
        c.save()
        return newcnt+1

def do_forum(*t_args):
    if len(t_args)>0:
        args=t_args[0]
        if (len(args)<1): 
            print "usage: jobs.py forum forum_file"
            return
    filename = args[0]
    f = open(filename)
    s = f.read()
    s = "["+s[:-1]+"]"
    s = re.sub("\n{", ",{", s)
    f.close()
    o= json.loads(s)
    
    #First courses: 
    print "Begin courses";i=0
    courses = set((obj["course_id"] for obj in o if obj["_type"]=="CommentThread"))
    for x in courses: 
        if len(M.Course.objects.filter(name=x))==0:
            m = M.Course()
            m.name = x
            m.save()
            i+=1
    print "%d courses done" %(i,)

    #Then Authors: 
    print "Begin authors";i=0
    author_ids = set((int(obj["author_id"]) for obj in o))
    for x in author_ids: 
        if len(M.Author.objects.filter(edxid=x))==0:
            m = M.Author()
            m.edxid = x
            m.save()
            i+=1
    print "%d authors done" %(i,)

    #Now threads: 
    print "Begin threads";i=0
    threads = (obj for obj in o if obj["_type"]=="CommentThread")
    for x in threads: 
        m = M.CommentThread()
        m.oid = x["_id"]["$oid"]
        m.title = x["title"]
        m.course = M.Course.objects.filter(name=x["course_id"])[0]
        m.save()
        #initial comment: 
        c = M.Comment()
        c.oid = m.oid
        c.anonymous = x["anonymous"]
        c.anonymous_to_peers = x["anonymous_to_peers"]
        c.author = M.Author.objects.get(edxid=int(x["author_id"]))
        c.commentthread = m
        c.body = x["body"]
        c.ctime = datetime.datetime.fromtimestamp(int(x["created_at"]["$date"])/1000)
        c.save()
        i+=1
    print "%d threads done" %(i,)

    #and now comments: 
    comments =  (obj for obj in o if obj["_type"]=="Comment")
    print "Begin comments";i=0
    for x in comments:
        i+=try_add_comment(x, o, 0)
    print "%d comments done" %(i,)
    print "SUCCESS: %s" %(filename,)

if __name__ == "__main__": 
   ACTIONS = {
        "forum": do_forum,
        }
   utils.process_cli(__file__, ACTIONS)
