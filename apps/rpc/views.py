"""
views.py - xmlrpc request manager

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
from base import annotations
import  json, sys, datetime, time
from base import  auth, signals, constants, models as M, utils_response as UR
#TODO import responder
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.template.loader import render_to_string
import logging, random, string
import urllib
id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_rpc_%s.log' % ( id_log,), filemode='a')
SLEEPTIME = 0.1
#The functions that are allowed to be called from a http client
__EXPORTS = [
    "getObjects", 
    "getParams", 
    "getNotes",
    "saveNote", 
    "editNote", 
    "deleteNote", 
    "getStats",
    "getMyNotes", 
    "getGuestFileInfo", 
    "markNote", 
    "request_source_id",
    "log_history",
    "remote_log",
    "getGradees", 
    "edit_assignment",
    "get_location_info", 
    "get_comment_info", 
    "save_settings", 
    "approveNote", 
    "editPoll", 
    "getMembers",
    "sendInvites", 
    "passwordLost", 
    "presearch",
    "get_stats_ensemble", 
    "add_folder", 
    "add_ensemble", 
    "rename_file", 
    "delete_file", 
    "move_file", 
    "register_user", 
    "login_user", 
    "set_grade_assignment", 
    "markThread", 
    "getPending", 
    "rate_reply"
    ]
__AVAILABLE_TYPES = set(["folders", "ensembles", "files", "assignments", "marks", "settings", "file_stats", "ensemble_stats", "polls", "choices", "responses", "polls_stats", "ensemble_stats2"])
__AVAILABLE_PARAMS = ["RESOLUTIONS", "RESOLUTION_COORDINATES"]
__AVAILABLE_STATS = ["auth", "newauth", "question", "newquestion", "unclear", "newunclear","auth_group", "newauth_group", "question_group", "newquestion_group", "unclear_group", "newunclear_group", "auth_grader", "newauth_grader", "auth_admin", "newauth_admin", "unanswered", "auth_everyone", "newauth_everyone", "favorite", "newfavorite", "search", "collection" ]


def on_register_session(sender, **payload): 
    req = payload["req"]
    #print req.META
    uid =  UR.getUserInfo(req, True).id
    p={}
    p["ctime"] = payload["cid"]
    p["ip"]     = req.META["REMOTE_ADDR"] if "REMOTE_ADDR" in req.META else None
    annotations.register_session(uid, p)
signals.register_session.connect(on_register_session, weak=False)

def __parseEntities_str(s, delimiter):
    if delimiter in s: 
        return [x.strip().lower() for x in s.split(delimiter)]
    return [s.strip().lower()]

def __parseEntities_list(a, delimiter): 
    o = []
    for s in a: 
        o.extend(__parseEntities_str(s, delimiter))
    return o

def parseEntities(x, d): 
    o = x
    if type(d)==list: 
        for delimiter in d: 
            o = parseEntities(o, delimiter)
        return o
    else: 
        delimiter = d
        if type(x)==list: 
            return __parseEntities_list(x,delimiter)
        return __parseEntities_str(x,delimiter)

def rate_reply(P,req):
    uid = UR.getUserId(req);
    status = P["status"]
    tm = M.ThreadMark.objects.get(pk=P["threadmark_id"])
    previous_accepted_ratings = M.ReplyRating.objects.filter(threadmark=tm, status__gt=M.ReplyRating.TYPE_UNRESOLVED)
    if tm.user_id == uid:
        rr = M.ReplyRating()
        rr.status = status
        rr.threadmark = tm
        rr.comment_id = P["comment_id"]
        rr.save()
        if status: 
            tm.active = status==M.ReplyRating.TYPE_UNRESOLVED and previous_accepted_ratings.count()==0 
            tm.save()
        return UR.prepare_response({"replyrating": {rr.id: UR.model2dict(rr)}})
    return UR.prepare_response({}, 1,  "NOT ALLOWED")      

    
def sendInvites(payload, req): 
    from django.core.mail import EmailMessage
    uid = UR.getUserId(req);
    id_ensemble = payload["id_ensemble"]
    admin = 0 if "admin" not in payload else payload["admin"]
    if not auth.canSendInvite(uid,id_ensemble):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")      
    #extract emails in a somewhat robust fashion (i.e. using several possible delimiters)
    emails = parseEntities(payload["to"], [",", "\n", " "])
    #remove spurious stuff: strings that don't have an "@" and trailings "<" and ">" characters, 
    #because some emails the following format: John Doe <john.doe@example.com>     
    emails = [o.replace("<", "").replace(">", "") for o in emails if "@" in o]          
    logging.info("to: %s, extracted: %s" %  (payload["to"], emails))
    #add new users to DB w/ pending status
    for email in emails:       
        user         = auth.user_from_email(email)
        password=""
        if user is None:
            #in practice, ckey not used: user clicks on link that has an invite_key
            ckey        =  "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,32)])
            password    = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,4)])
            user     = auth.addUser(email, password, ckey)
        invite_key      = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,50)])
        auth.addInvite(invite_key, user.id, id_ensemble, admin)
        link = "http://%s/confirm_invite?invite_key=%s" % (settings.HOSTNAME, invite_key,)
        ensemble = M.Ensemble.objects.get(pk=id_ensemble)
        p = {"name": ensemble.name, "description": ensemble.description, "link": link, "contact": user.firstname if user.firstname != None else user.email }
        if payload["msg"] != "": 
            p["msg_perso"] = payload["msg"]
        if password != "": 
            p["password"] = password
            p["email"] = email
        msg = render_to_string("email/msg_invite",p)
        e = EmailMessage("You're invited on the %s channel !" % (p["name"],), 
                         msg, 
                         "NB Notifications <no-reply@notabene.csail.mit.edu>",
                         (email, ), 
                         (settings.SMTP_CC_USER,))
        e.send()
        time.sleep(SLEEPTIME) #in order not to stress out the email server
    return UR.prepare_response({"msg": "Invite for %s sent to %s" % (ensemble.name, emails,)})
       
def register_user(P, req):
    users = M.User.objects.filter(email=P["email"].strip().lower())
    if users.count() != 0:            
        return UR.prepare_response({}, 1,"A user with this email already exists - please choose another email.")
    user= auth.getGuest(P["ckey"])
    P["ckey"] = annotations.register_user(user.id, P) #returns a new confkey.       
    p2 = {"tutorial_url": settings.GUEST_TUTORIAL_URL, "conf_url": "%s?ckey=%s" %(req.META.get("HTTP_REFERER","http://%s" % settings.NB_SERVERNAME), P["ckey"])}
    from django.core.mail import EmailMessage
    p2.update(P)
    msg = render_to_string("email/confirm_guest_registration",p2)
    email = EmailMessage(
                "Welcome to NB, %s !" % (p2["firstname"], ),
                msg,  
                "NB Notifications <no-reply@notabene.csail.mit.edu>", 
                (P["email"], ), 
                (settings.EMAIL_BCC, ))
    email.send()
    #__send_email([P["email"], settings.SMTP_CC_USER], tpl.render(c))
    return UR.prepare_response({"uid": user.id})

def login_user(P,req):
    email = P["email"] if "email" in P else None
    password = P["password"] if "password" in P else None
    if email is None or password is None: 
        return UR.prepare_response({"ckey": None})      
    user = auth.checkUser(email, password)
    if user is None: 
        return UR.prepare_response({"ckey": None})      
    u_in        = json.loads(urllib.unquote(req.COOKIES.get("userinfo", urllib.quote('{"ckey": ""}'))))
    if "ckey" in u_in and u_in["ckey"] != "" and u_in["ckey"] != user.confkey:  
        #log that there's been an identity change
        auth.log_guest_login(u_in["ckey"], user.id)
    return UR.prepare_response({"ckey": user.confkey}) #this is what's needed for the client to set a cookie and be authenticated as the new user ! 

#def on_register_session(payload): 
#    req = payload["req"]
#    #print req.META
#    uid =  UR.getUserId(req)
#    p={}
#    p["ctime"] = payload["cid"]
#    p["client"] = req.META["REMOTE_HOST"] if "REMOTE_HOST" in req.META else None
#    p["ip"]     = req.META["REMOTE_ADDR"] if "REMOTE_ADDR" in req.META else None
#    p["referer"]= req.META["referer"]     if "referer"     in req.META else None
#    #TODO HISTORY
#    #annotations.registerSession(uid, p)

def on_delete_session(payload, s): 
    req = s["request"]
    #print payload
    #print req.getConnectionId()
    p={}
    p["id"] = req.getConnectionId()
    if p["id"] != 0:
        p["lastActivity"] =  s["lastActivity"]
        p["reason"] =  payload["reason"]
        annotations.endSession(p)
    else:
        pass
        #print "can't delete a session whose id is 0 ! "


def on_reactivate(ids, connections): 
    #for id in ids:
    p=[]
    for id in ids: 
        p.append(connections[id]["lastActivity"])
        p.append(id)
    annotations.reactivateSession(p)


def getParams(payload, req):
    o={}
    for p in payload["name"]:
        if p in __AVAILABLE_PARAMS:
            o[p] = constants.__dict__[p]
    if UR.CID != 0 and "clienttime" in payload:
        try: 
            s = M.Session.objects.get(ctime=UR.CID)
            s.clienttime = datetime.datetime.fromtimestamp((payload["clienttime"]+0.0)/1000)
            s.save()
        except M.Session.DoesNotExist:
            pass    
    return UR.prepare_response({"value": o})


def presearch(payload, req):
    #cid = req.getConnectionId()
    cid = UR.CID
    uid = UR.getUserId(req);
    id_search = annotations.save_presearch(cid, payload)
    output = annotations.presearch(uid, id_search, payload) #{"total": 130, "items": "blahblah"}
    return UR.prepare_response(output)

def getGuestFileInfo(payload, req):
    if "id_source" not in payload: 
        return UR.prepare_response({}, 1, "missing id_source  !")
    id_source = payload["id_source"]
    output =  annotations.get_guestfileinfo(id_source)
    for i in output["ensembles"]: 
        if  not (output["ensembles"][i]["allow_guest"] or  auth.isMember(UR.getUserId(req), i)): 
            return  UR.prepare_response({}, 1, "not allowed: guest access isn't allowed for this file.")
    return UR.prepare_response(output)



def getObjects(payload, req):
    #
    # CAUTION !!!
    # getObjects is handy, but doesn't perform per-user authentication
    # hence, don't use it to get non-public info, such as notes etc...
    #
    #TODO cid = req.getConnectionId()
    uid = UR.getUserId(req);
    types = __AVAILABLE_TYPES.intersection(set(payload["types"]))
    output = {}
    p2 = payload["payload"] if "payload" in payload else {}
    for t in types:
        output[t] = getattr(annotations, "get_"+t)(uid, p2)
    return UR.prepare_response(output)

def save_settings(payload, req): 
    uid = UR.getUserId(req);
    if uid is None:
        return UR.prepare_response({}, 1,  "NOT ALLOWED")      
    else:         
        return UR.prepare_response({"settings": annotations.save_settings(uid, payload)})

    
def getGradees(payload, req): 
    uid = UR.getUserId(req)
    output={"gradees": annotations.getGradees(uid)}
    return UR.prepare_response(output)
    

def editPoll(payload, req): 
    uid = UR.getUserId(req)
    if uid is None or ("id_poll" not in payload) or not annotations.canEditPoll(uid, payload["id_poll"]):
        return UR.prepare_response({}, 1, "NOT ALLOWED")
    annotations.editPoll(uid, payload)
    return UR.prepare_response({})



def getNotes(payload, req):
    uid = UR.getUserId(req)
    output = {}
    if "file" in payload: #access by file
        after = payload.get("after", None)
        id_source = payload["file"]
        if auth.canReadFile(uid, id_source, req):
            #output["notes"] = annotations.getNotesByFile(id_source, uid)
            output["file"] = id_source
            output["locations"], output["comments"], output["threadmarks"] = annotations.getCommentsByFile(id_source, uid, after)
            #TODO: 
            #output["links"] = annotations.get_links(uid, {"id_source": id_source})
            output["seen"] = annotations.getSeenByFile(id_source, uid)
        else:
            return UR.prepare_response({}, 1, "NOT ALLOWED")
    return UR.prepare_response(output)

def saveNote(payload, req): 
    uid = UR.getUserId(req)
    if not auth.canAnnotate(uid,  payload["id_ensemble"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED") 
    payload["id_author"] = uid
    retval = {}
    a = annotations.addNote(payload)
    tms = {}
    for mark in payload["marks"]:
        tm = M.ThreadMark()
        tm.type = [c[0] for c in tm.TYPES if c[1]==mark][0]
        tm.user_id = uid         
        tm.comment=a
        tm.location_id=a.location_id
        tm.save()
        tms[tm.id] = UR.model2dict(tm)  
    retval["locations"] = annotations.getLocation(a.location_id)
    retval["comments"] = annotations.getComment(a.id, uid)
    retval["threadmarks"] =  tms
    return UR.prepare_response(retval)
    #TODO responder.notify_observers("note_saved", payload,req)

def editNote(payload, req): 
    uid = UR.getUserId(req)
    if not auth.canEdit(uid,  payload["id_comment"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else:
        annotations.editNote(payload)
    #no need to worry about threadmarks: they can't be changed from an "edit-mode" editor        
    return UR.prepare_response({"comments":  annotations.getComment(payload["id_comment"], uid)})

def deleteNote(payload, req): 
    uid = UR.getUserId(req)
    #print "trying  to delete %s" %( payload["id_comment"],)
    if not auth.canDelete(uid,  payload["id_comment"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else:
        annotations.deleteNote(payload)
        return UR.prepare_response({"id_comment": payload["id_comment"] })

def getPending(payload, req):
    uid = UR.getUserId(req)
    output = annotations.getPending(uid, payload)
    return UR.prepare_response(output)
  


def getMyNotes(payload, req): 
    uid = UR.getUserId(req)
    if uid is None or payload.get("query") not in __AVAILABLE_STATS: 
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else:
        output= getattr(annotations, "get_comments_"+payload.get("query"))(uid, payload)
        #referer = None if "referer" not in req.META else  req.META["referer"]
        #TODO annotations.addCollageHistory(uid, referer, query)        
        return UR.prepare_response(output)

def getStats(payload, req): 
    uid = UR.getUserId(req)
    if uid is None: 
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else:
        return UR.prepare_response(annotations.get_stats(uid))


def getStats2(payload, req): 
    uid = UR.getUserId(req)
    if uid is None: 
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else:
        return UR.prepare_response(annotations.get_stats2(uid))



def getMembers(payload, req): 
    uid = UR.getUserId(req)
    if "id_ensemble" in payload: 
        if auth.canGetMembers(uid, payload["id_ensemble"]): 
            return UR.prepare_response(annotations.get_members(payload["id_ensemble"]))
    return UR.prepare_response({}, 1,  "NOT ALLOWED")


def markThread(payload, req):
    uid = UR.getUserId(req)
    id_location =  payload["id_location"]
    if not auth.canMarkThread(uid,id_location ):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else: 
        mark = annotations.markThread(uid, payload);
        tms = {}
        tms[mark["id"]] = mark                
        p = {"threadmarks": tms}
        return UR.prepare_response(p)

def markNote(payload, req):
    uid = UR.getUserId(req)
    id_comment =  payload["id_comment"]
    if not auth.canMark(uid,id_comment ):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else: 
        annotations.markNote(uid, payload);        
        comments = annotations.getComment(id_comment,uid)
        p = {"locations":annotations.getLocation(comments[int(id_comment)]["ID_location"]), "marks": annotations.getMark(uid, payload), "comments": comments}
        return UR.prepare_response(p)

def approveNote(payload, req):
    uid = UR.getUserId(req)
    id_comment =  payload["id_comment"]
    if not auth.canApprove(uid,id_comment ):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    else: 
        annotations.approveNote(uid, payload);        
        p = {"comments":annotations.getComment(id_comment,uid) }
        return UR.prepare_response(p)
        annotations.addApproveHistory(uid, payload)

def passwordLost(payload, req):
    email =  payload["email"].strip().lower()
    user = auth.user_from_email(email)
    if user is not None:     
        from django.core.mail import EmailMessage  
        p={"firstname": user.firstname, "email": email, "password": user.password, "directurl": "%s://%s/?ckey=%s" % (settings.PROTOCOL, settings.HOSTNAME, user.confkey)}
        msg = render_to_string("email/password_reminder",p)
        e = EmailMessage(
                "Password reminder for your NB account",
                msg,  
                "NB Password Reminder Bot <no-reply@notabene.csail.mit.edu>", 
                (email, ), 
                (settings.SMTP_CC_LOSTPASSWORD, ))
        e.send()     
        return UR.prepare_response({"email": email})
    return UR.prepare_response({"email": email}, 1,  "USER NOT FOUND")

def __send_email(recipients, msg): 
    import smtplib
    session =  smtplib.SMTP(settings.SMTP_SERVER)
    smtpresult = session.sendmail(settings.SMTP_USER, recipients, msg)
    time.sleep(SLEEPTIME)
    if smtpresult:
        errstr = ""
        for recip in smtpresult.keys():
            errstr = """Could not delivery mail to: %s Server said: %s %s %s""" % (recip, smtpresult[recip][0], smtpresult[recip][1], errstr)
            logging.error(errstr)
        raise smtplib.SMTPException, errstr

def rename_file(P, req): 
    #this methos is used to rename both files and folders. 
    uid = UR.getUserId(req)
    if not auth.canRenameFile(uid, P["id"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    return UR.prepare_response({P["item_type"]+"s": annotations.rename_file(uid, P)})

def delete_file(P, req): 
    uid = UR.getUserId(req)
    if not auth.canDeleteFile(uid, P["id"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    return UR.prepare_response({"id": annotations.delete_file(uid, P)}) #special form since file isn't in there anymore

def move_file(P,req): 
    uid = UR.getUserId(req)
    if not auth.canMoveFile(uid, P["id"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    return UR.prepare_response({"files": annotations.move_file(uid, P)})

def add_ensemble(payload, req): 
    uid = UR.getUserId(req)
    if uid is None: 
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    id = annotations.create_ensemble(uid,  payload)
    return UR.prepare_response(annotations.get_ensembles(uid, {"id": id}))


def add_folder(payload, req): 
    uid = UR.getUserId(req)
    id_ensemble = payload["id_ensemble"]
    id_parent = payload["id_parent"]
    if not auth.canAddFolder(uid, id_ensemble, id_parent):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    id_folder = annotations.create_folder(id_ensemble, id_parent, payload["name"])
    return UR.prepare_response(annotations.get_folders(uid, {"id": id_folder}))


def edit_assignment(P, req): 
    uid = UR.getUserId(req)    
    if not auth.canEditAssignment(uid, P["id"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    return UR.prepare_response({"files": annotations.edit_assignment(uid, P)})



def request_source_id(payload, req):
    uid = UR.getUserId(req);
    if uid is None: 
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    logging.info("[request_source_id]: %s" %(payload,) )
    return UR.prepare_response({"id_source":annotations.createSourceID()})
 
def remote_log(payload,req): 
     #deprecated. Here only for compatibility
     return log_history(payload, req)

def log_history(payload, req):
    uid =  UR.getUserInfo(req, True).id
    if uid is None: 
        #SACHA TODO: LOG this.
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    cid = UR.CID
    if cid == 0:        
        return  UR.prepare_response({}, 1, "CID MOST BE NONZERO")
    session, previous_activity = annotations.markActivity(cid)
    if session is None: 
        return  UR.prepare_response({}, 1, "SESSION NOT FOUND")
    id_session = session.id
    output={}
    if "seen" in payload and cid != 0: 
        annotations.markCommentSeen(uid, id_session, payload["seen"])
    if "page" in payload and cid != 0: 
        annotations.markPageSeen(uid, id_session,  payload["page"])
    if "idle" in payload and cid != 0: 
        annotations.markIdle(uid,  id_session, payload["idle"])        
    if "__return" in payload and cid != 0:
        R = payload["__return"]
        if R["type"] == "newNotesOnFile": 
            id_source = R["a"]["id_source"]
            if auth.canReadFile(uid, id_source):
                output["locations"], output["comments"], output["threadmarks"] = annotations.getCommentsByFile(id_source, uid, previous_activity)
        elif R["type"] == "newPending":
            #for now, we retrieve all the pending stuff. 
            output = annotations.getPending(uid, payload)
    return UR.prepare_response(output)
  
def get_location_info(payload, req): 
    id = payload["id"]
    uid = UR.getUserId(req);
    #SACHA TODO: check I'm allowed to know this
    retval={}
    retval["locations"] = annotations.getLocation(id)
    if "org" in payload:
        annotations.logDirectURL(uid, id, payload["org"])
    return UR.prepare_response(retval)


def get_comment_info(payload, req): 
    id = int(payload["id"])
    uid = UR.getUserId(req);
    #SACHA TODO: check I'm allowed to know this
    retval={}
    comments = annotations.getComment(id, uid)
    id_location = comments[id]["ID_location"]
    retval["comments"] = {id: {"ID": id, "ID_location": id_location}} #share only what's needed
    #print retval["comments"]
    retval["locations"] = annotations.getLocation( id_location)
    if "org" in payload:
        annotations.logDirectURL(uid, id, payload["org"])
    return UR.prepare_response(retval)


def get_stats_ensemble(payload, req): 
    uid = UR.getUserId(req)
    id_ensemble = payload["id_ensemble"]
    if not auth.canSeeGrades(uid, id_ensemble):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    retval = annotations.get_stats_ensemble(payload)
    return UR.prepare_response(retval)


def set_grade_assignment(P, req):
    uid = UR.getUserId(req)
    if not auth.canGrade(uid, P["id_source"], P["id_user"]):
        return UR.prepare_response({}, 1,  "NOT ALLOWED")
    retval = {}
    retval["grades"] = annotations.set_grade_assignment(uid, {"id_source": P["id_source"], "id_user":  P["id_user"], "grade": P["grade"]})
    return UR.prepare_response(retval)

    
    
@csrf_exempt
def other(req):
    print "nb django doesn't have an URLconf for this yet: %s" % req.method

@csrf_exempt
def run(req):    
    r = HttpResponse()
    r["Access-Control-Allow-Origin"]="*"
    if req.method == "OPTIONS" or len(req.POST)==0: #FF3 trying to check if Cross Site Request allowed. 
        #print "options request"
        return r
    else: 
        #rpc request:
        #if settings.ENABLE_REMOTE_DEBUGGING: 
        #    import pydevd; pydevd.settrace()
        fctname = req.POST["f"]
        payload = json.loads(req.POST["a"])
        cid = req.POST["cid"]
        if cid == "0" or cid == 0: 
            cid = datetime.datetime.now()
            signals.register_session.send("rpc", cid=cid,req=req)            
        UR.CID = cid
        MODULE = sys.modules[__name__]
        if  fctname in __EXPORTS:
            r.content = getattr(MODULE, fctname)(payload, req)
            return r
        else:
            assert False, "[PDF] method '%s' not found in __EXPORTS" %  fctname
            r.content = UR.prepare_response({}, 1,"[PDF] method '%s' not found in __EXPORTS" %  fctname)
            return r
