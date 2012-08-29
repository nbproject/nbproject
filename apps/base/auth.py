"""
utils_auth.py - Authentication and per-user rights-check routines

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
    
$ Id: $    
"""

import models as M
import random, string

def confirmInvite(id):
    invite = M.Invite.objects.filter(key=id)
    if len(invite) == 0: 
        return None
    invite = invite[0]
    membership = M.Membership.objects.filter(user=invite.user_id, ensemble=invite.ensemble_id)
    if len(membership) == 0: 
        membership = M.Membership()
        membership.user = invite.user
        membership.ensemble = invite.ensemble
        membership.admin = invite.admin
        membership.save()
    return invite
    
def invite2uid(id):
    invite = M.Invite.objects.filter(key=id)
    if len(invite) == 0:          
        return None
    return invite[0].user.id
  
def canReadFile(uid, id_source, req=None):
    try: 
        id_source = int(id_source)
    except ValueError:
        return False
    o = M.Membership.objects.filter(ensemble__in=M.Ensemble.objects.filter(ownership__in=M.Ownership.objects.filter(source__id=id_source,  deleted=False))).filter(user__id=uid,  deleted=False, guest=False)
    return len(o)>0 or canGuestReadFile(uid, id_source, req)

def canDownloadPDF(uid, id_source):
    try: 
        id_source = int(id_source)
    except ValueError:
        return False
    o = M.Membership.objects.filter(ensemble__in=M.Ensemble.objects.filter(ownership__in=M.Ownership.objects.filter(source__id=id_source))).filter(user__id=uid)
    return (len(o)>0 and (o[0].admin or o[0].ensemble.allow_download)) or canGuestDownloadPDF(id_source)

def canGuestReadFile(uid, id_source, req=None):
    o = M.Ownership.objects.get(source__id=id_source)
    e = M.Ensemble.objects.get(pk=o.ensemble_id)
    if o.ensemble.allow_guest and len(M.Membership.objects.filter(user__id=uid, ensemble=e))==0: 
        #add membership for guest user: 
        m = M.Membership()
        m.user_id = uid
        m.ensemble_id = e.id
        m.guest = True
        if e.section_assignment == M.Ensemble.SECTION_ASSGT_RAND:             
            #assign guest to a random section if there are sections, unless we find a pgid cookie that correponded to a existing section  
            sections =  M.Section.objects.filter(ensemble=e)
            if sections:
                if req is not None and "pgid" in req.COOKIES: 
                    prev_sections = M.Section.objects.filter(membership__user__id=int(req.COOKIES.get("pgid")), membership__ensemble__id=e.id)
                    if  len(prev_sections): 
                        m.section = prev_sections[0]
                if m.section is None: 
                    m.section = random.choice(sections)
        m.save()
    return o.ensemble.allow_guest

def canGuestDownloadPDF(id_source):
    o = M.Ownership.objects.get(source__id=id_source)
    return o.ensemble.allow_guest and o.ensemble.allow_download


def getGuest(ckey=None):
    if ckey is None:
        return createGuest()
    o = M.User.objects.get(confkey=ckey)
    return o if o is not None else createGuest()

def getCkeyInfo(ckey): 
    if ckey is None: 
        return None
    o = None
    try: 
        o = M.User.objects.get(confkey=ckey)
    except M.User.DoesNotExist: 
        pass
    if o is not None and o.valid is False and o.guest is False:
        #first login as a non-guest: mark that user as valid  
        o.valid = True
        o.save()    
    return o

def canAnnotate(uid, eid):
    """Need to be a either a member of a group or a registered user for a public group """
    o = M.Membership.objects.filter(ensemble__id=eid, user__id=uid)
    if len(o)>0:  
        return True
    #TODO registered user and public group ?
    e = M.Ensemble.objects.get(pk=eid)
    if e.allow_guest: 
        u = M.User.objects.get(pk=uid)
        return not u.guest         
    return False
     

def addUser(email, password, conf, valid=0, guest=0):
    o = M.User()
    o.email = email
    o.password = password
    o.confkey = conf
    o.valid = valid
    o.guest = guest
    o.save()  
    if o.guest:
        gh = M.GuestHistory(user=o)
        gh.save()         
    return o


def addInvite(key, id_user, id_ensemble, admin):
    o = M.Invite(key=key, user_id=id_user, ensemble_id=id_ensemble, admin=admin)
    o.save()
    

def createGuest():
    key                 = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,20)])
    email               = "guest_%s@nb.test" % (key, )
    passwd              = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,4)])
    id                  = addUser(email,passwd, key, 0, 1)
    i                   = {}
    i["id_user"]        = id
    i["email"]          = email
    i["password"]       = passwd
    i["id_channel"]     = 0
    i["admin"]          = 0
    i["valid"]          = 0
    i["guest"]          = 1
    i["ckey"]          = key
    return i

def getGuestCkey(): 
    return createGuest()["ckey"]

def user_from_email(email):
    users =  M.User.objects.filter(email=email)
    return users[0] if len(users)==1 else None
         
def checkUser(email, password):
    users = M.User.objects.filter(email=email.strip().lower(), password=password, valid=1, guest=0)
    return users[0] if len(users)==1 else None

def canAddFolder(uid, id_ensemble, id_parent=None): 
    return canInsertFile(uid, id_ensemble, id_parent)

def canInsertFile(uid, eid, id_folder=None):
    """need to be an admin on that membership, and the folder (if not None) needs to be in this membership"""
    m = M.Membership.objects.get(ensemble__id=eid, user__id=uid)
    if id_folder is None: 
        return m.admin
    else: 
        f = M.Folder.objects.get(pk=id_folder)
        return f.ensemble_id == int(eid) and m.admin
    
def canRenameFile(uid, id): 
    """need to be an admin on the ensemble that contains that file"""
    o = M.Ownership.objects.filter(source__id=id)
    e = M.Ensemble.objects.filter(ownership__in=o)
    m = M.Membership.objects.filter(user__id=uid, ensemble__in=e)
    return m.count()>0 and m[0].admin

def canRenameFolder(uid, id): 
    """need to be an admin on the ensemble that contains that folder"""
    e = M.Folder.objects.get(pk=id).ensemble     
    m = M.Membership.objects.filter(user__id=uid, ensemble=e)
    return m.count()>0 and m[0].admin


def canEditAssignment(uid, id): 
    return canRenameFile(uid, id)

def canDeleteFile(uid, id): 
    return canRenameFile(uid, id)

def canMoveFile(uid, id): 
    return canRenameFile(uid, id)

def canUpdateFile(uid, id): 
    return  canRenameFile(uid, id)

def canSendInvite(uid, eid):
    """need to be an admin on that membership"""
    m = M.Membership.objects.filter(user__id=uid, ensemble__id=eid)
    return m.count() > 0 and m[0].admin

def canEditEnsemble(uid, eid):
    return canSendInvite(uid, eid)

def canSeeGrades(uid, eid):
    return canSendInvite(uid, eid)

def canGrade(uid, id_source, id_student):
    """Need to be admin on ensemble that contains file and student needs to be a member of that ensemble"""
    o = M.Ownership.objects.filter(source__id=id_source)
    e = M.Ensemble.objects.filter(ownership__in=o)
    m = M.Membership.objects.filter(user__id=uid, ensemble__in=e)
    m2 = M.Membership.objects.filter(user__id=id_student, ensemble__in=e)
    return m.count()>0 and m[0].admin and m2.count()>0
 
def isMember(user_id, ensemble_id):
    return M.Membership.objects.filter(user__id=user_id, ensemble__id=ensemble_id).count() != 0
    
def canEdit(uid, id_ann):
    #uid need to be comment owner and there need to be no dependent non-deleted comment
    o = M.Comment.objects.get(pk=id_ann)
    return o.author_id==uid and M.Comment.objects.filter(parent=o, deleted=False).count()==0
    
def canDelete(uid, id_ann):    
    return canEdit(uid, id_ann)

def canMarkThread(uid, id_location):
    #user needs to be able to read root comment in that location
    location = M.Location.objects.get(pk=id_location)
    root_comment = M.Comment.objects.get(parent=None, location=location)
    if root_comment.author_id == uid: 
        return True
    m = M.Membership.objects.filter(ensemble = location.ensemble, user__id=uid)
    return m.count()>0 and (root_comment.type>2 or (m[0].admin and root_comment.type>1)) 
    
 
def log_guest_login(ckey, id_user):
    guest = M.User.objects.get(confkey=ckey)
    glh = M.GuestLoginHistory(user_id=id_user, guest=guest)
    glh.save()
