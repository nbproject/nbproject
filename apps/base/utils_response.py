"""
utils_response.py - Authentication and per-user rights-check routines

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
    
$ Id: $    
"""
import json, urllib
import auth as auth
from django.template import Template, Context

CID = 0;

class Expression:
    #TODO: We could extend this using templates if necessary
    def __init__(self, o):
        self.o = o
    def eval(self, V=None):
        return self.o

def prepare_response(payload, *args):
    status={}
    if len(args)==0: # by default, assume everything went okay
        status["errno"] = 0
        status["msg"] = "OK"
        status["CID"] = str(CID)
    if len(args)==1:
        status["errno"] = args[0]
        status["msg"] = "[ERROR] UNKNOWN ERROR - check server log, errno=%s" % (args[0],)
        status["CID"] = str(CID)

    if len(args)==2:
        status["errno"] = args[0]
        status["msg"] =  args[1]  
        status["CID"] = str(CID)
    return json.dumps({"payload":payload,"status": status})

def getUserId(req):
    if req.GET.get("invite_key", None) == "GUEST":
        return auth.getGuest(req.COOKIES.get("ckey", None)).id
    if "ckey" in req.GET: 
        return auth.getGuest(req.GET["ckey"]).id
    if "ckey" in req.COOKIES:
        u = auth.getGuest(req.COOKIES["ckey"])
        try:
            return u.id
        except AttributeError: #just a dict
            return  u["id_user"].id   
    if "guest" in req.GET:
        return  getUserInfo(req, True).id  
    return None


def getUserInfo(req, allow_guest=False, extra_confkey_getter=None): 
    try:
        u_in        = json.loads(urllib.unquote(req.COOKIES.get("userinfo", urllib.quote("{}")))) or {}
    except:
        u_in        = {}
    ckey        = req.GET.get("ckey") or req.COOKIES.get("ckey", None) or (u_in["ckey"] if "ckey" in u_in else None) or (extra_confkey_getter(req) if extra_confkey_getter is not None else None)
    if ckey is None and allow_guest:         
        ckey = auth.getGuestCkey()
    info = auth.getCkeyInfo(ckey)
    if info is None and allow_guest: #there was a wrong ckey to start with, assign a guest one
        ckey = auth.getGuestCkey()
        info = auth.getCkeyInfo(ckey)
    if (info is None or info.guest) and extra_confkey_getter is not None:
        #check again: maybe it's a use logged in w/ external credentials, so we want srg better than guest login !         
        ckey2 = extra_confkey_getter(req)        
        if ckey2 is not None:
            newinfo = auth.getCkeyInfo(ckey2)
            if ckey is not None: 
                auth.log_guest_login(ckey, newinfo.id)            
            info = newinfo
    return info


def qs2dict(qs, names=None, pk="id"):
    """Converts a QuerySet into a a dictionary"""
    output = {}     
    pk2 = pk if (names is None or names.get(pk, None) is None) else names.get(pk, pk)    
    for r in qs:
        rel_obj = r
        for i in pk2.split("."):
            rel_obj = getattr(rel_obj, i)            
        output[rel_obj] = model2dict(r, names)
    return output

def model2dict(data, names=None, pk=None):
    #loosely inspired from http://code.google.com/p/dojango/source/browse/trunk/dojango/util/__init__.py#146
    if data is None: 
        return None if pk is None else {}
    o={}        
    if names is None: 
        for field in data._meta.fields:
            k = field.attname
            o[k] = getattr(data, k)
            if hasattr(o[k], "isoformat"): #needed to serialize datetimes 
                o[k] = o[k].isoformat()
    else: 
        for (k,v) in names.iteritems():
            if v is None: 
                o[k] = getattr(data, k)
            elif isinstance(v,Expression): 
                o[k] = v.eval()
            elif isinstance(v, Template): 
                o[k] = v.render(Context({"V": data}))
            else: 
                rel_obj = data
                for i in v.split("."):
                    rel_obj = getattr(rel_obj, i) if rel_obj is not None else None
                o[k] = rel_obj 
            #TODO: replace by .extra() or by if type(X)==datetime.datetime    
            if hasattr(o[k], "isoformat"): #needed to serialize datetimes 
                o[k] = o[k].isoformat()
    if pk is None: 
        return o
    else: 
        # a pk has been given: return a dict containing that 1 entry: {pk: object}
        return dict( ((o[pk], o),) ) 
        



def extractIndexedObjects(objs_in, names, pk): 
    """Takes the result of an indexobjects dict and, extracts some sub_objects from it (the ones in "names"), and indexes them by "pk" """
    objs_out = {}
    for i in objs_in: 
        o = objs_in[i]
        o_out = {}
        for (k,v) in names.iteritems(): 
            o_out[k] = o[k if v is None else v]
        objs_out[o[pk]] = o_out
    return objs_out



