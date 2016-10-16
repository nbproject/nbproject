# Create your views here.
import json
import logging
import random
import string
import urllib
from random import choice

from base import auth, signals, annotations, doc_analytics, utils_response as UR, models as M
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.core.mail.message import EmailMessage
from django.http import HttpResponseRedirect, HttpResponse
from django.http import JsonResponse
from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.utils.html import escape

import base.forms as forms
from django_remote_forms.forms import RemoteForm

id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
id_log = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,10)])
logging.basicConfig(level=logging.DEBUG,format='%(asctime)s %(levelname)s %(message)s', filename='/tmp/nb_pages_%s.log' % ( id_log,), filemode='a')


def on_serve_page(sender, **payload):
    req = payload["req"]
    uid = payload["uid"]
    #print req.META
    #uid =  UR.getUserInfo(req, True)["id"]
    p={}
    p["client"] = req.META.get("REMOTE_HOST", None)
    p["ip"]     = req.META.get("REMOTE_ADDR", None)
    p["referer"]= req.META.get("HTTP_REFERER", None)
    p["path"]   = req.get_full_path()
    annotations.page_served(uid, p)
if settings.MONITOR.get("PAGE_SERVED", False):
    signals.page_served.connect(on_serve_page, weak=False)


def __extra_confkey_getter(req):
    if req.user.is_authenticated():
        try:
            o = M.User.objects.get(email=req.user.email)
            return o.confkey
        except M.User.DoesNotExist:
            return None
    return None

def __serve_page(req, tpl, allow_guest=False, nologin_url=None, content_type=None):
    """Serve the template 'tpl' if user is in DB or allow_guest is True. If not, serve the welcome/login screen"""
    o           = {} #for template
    user       = UR.getUserInfo(req, allow_guest, __extra_confkey_getter)
    if user is None:
        redirect_url = nologin_url if nologin_url is not None else ("/login?next=%s" % (req.META.get("PATH_INFO","/"),))
        return HttpResponseRedirect(redirect_url)
    if user.guest is False and (user.firstname is None or user.lastname is None):
        return HttpResponseRedirect("/enteryourname?ckey=%s" % (user.confkey,))
    user = UR.model2dict(user, {"ckey": "confkey", "email": None, "firstname": None, "guest": None, "id": None, "lastname": None, "valid": None})
    signals.page_served.send("page", req=req, uid=user["id"])

    r = render_to_response(tpl, {"o": o}, content_type=('application/xhtml+xml' if content_type is None else content_type))
    r.set_cookie("userinfo", urllib.quote(json.dumps(user)), 1e6)
    return r

# o is a dictionary representing the variables
def __serve_page_with_vars(req, tpl, o, allow_guest=False, nologin_url=None, content_type=None):
    """Serve the template 'tpl' if user is in DB or allow_guest is True. If not, serve the welcome/login screen"""
    user       = UR.getUserInfo(req, allow_guest, __extra_confkey_getter)
    if user is None:
        redirect_url = nologin_url if nologin_url is not None else ("/login?next=%s" % (req.META.get("PATH_INFO","/"),))
        return HttpResponseRedirect(redirect_url)
    if user.guest is False and (user.firstname is None or user.lastname is None):
        return HttpResponseRedirect("/enteryourname?ckey=%s" % (user.confkey,))
    user = UR.model2dict(user, {"ckey": "confkey", "email": None, "firstname": None, "guest": None, "id": None, "lastname": None, "password": None, "valid": None})
    signals.page_served.send("page", req=req, uid=user["id"])
    r = render_to_response(tpl, o, content_type=('application/xhtml+xml' if content_type is None else content_type))
    r.set_cookie("userinfo", urllib.quote(json.dumps(user)), 1e6)
    return r

def index(req):
    return __serve_page(req, settings.DESKTOP_TEMPLATE, False, "/welcome", content_type="text/html" )

def collage(req):
    return __serve_page(req, settings.COLLAGE_TEMPLATE, content_type="text/html")

def dev_desktop(req, n):
    return __serve_page(req, settings.DEV_DESKTOP_TEMPLATE % (n,))


def ondemand(req, ensemble_id):
    url = req.GET.get("url", None)
    if url:
        try:
            source_info = M.OnDemandInfo.objects.get(url=url, ensemble_id=ensemble_id)
            return HttpResponseRedirect("/f/%s" %(source_info.source_id,))
        except M.OnDemandInfo.DoesNotExist:
            ensemble = None
            try:
                ensemble = M.Ensemble.objects.get(pk=ensemble_id)
            except M.Ensemble.DoesNotExist:
                return HttpResponse("No such ensemble: %s " % (ensemble_id,))
            if not ensemble.allow_ondemand:
                return HttpResponse("ondemand uplaod not allowed for that ensemble: %s " % (ensemble_id,))
            import urllib2
            from upload.views import insert_pdf_metadata
            f = urllib2.urlopen(url)
            s = None
            try:
                s = f.read()
                f.close()
                source = M.Source()
                uid = UR.getUserId(req);
                source.submittedby_id = uid
                source.title = url.rpartition("/")[2]
                source.save();
                sid = source.id
                annotations.addOwnership(sid, ensemble_id)
                REPOSITORY_DIR = "%s/%s" % (settings.HTTPD_MEDIA, "/pdf/repository")
                f2 = open("%s/%s" % (REPOSITORY_DIR, sid,),"wb")
                f2.write(s)
                f2.close()
                insert_pdf_metadata(sid,  REPOSITORY_DIR)
                info = M.OnDemandInfo()
                info.url = url
                info.ensemble_id = ensemble_id
                info.source_id = sid
                info.save()
                return HttpResponseRedirect("/f/%s" %(sid,))
            except Exception as e:
                return HttpResponse("URL Read Error: %s, %s " % (url,e))
    else:
        return HttpResponse("Missing parameter: url")



def source(req, n, allow_guest=False):
    try:
       source = M.Source.objects.get(pk=n)
    except M.Source.DoesNotExist:
       return HttpResponse("No such document number: %s " % (n,))
    if source.type==M.Source.TYPE_YOUTUBE:
        return __serve_page(req, settings.YOUTUBE_TEMPLATE, allow_guest , content_type="text/html")
    elif source.type==M.Source.TYPE_HTML5:
        return HttpResponseRedirect(M.HTML5Info.objects.get(source=source).url)
    else:
        return __serve_page(req, settings.SOURCE_TEMPLATE, allow_guest, content_type="text/html")


def source_analytics(req, n):
    pages, chart_stats = doc_analytics.get_page_stats(n)
    highlights = doc_analytics.get_highlights(n)
    source = M.Source.objects.get(pk=n)
    var_dict = {
        'source': source,
        'pages': pages,
        'chart_stats': chart_stats,
        'highlights': highlights,
        'numpages': source.numpages
    }
    return HttpResponse(UR.prepare_response({"source": UR.model2dict(source),
                                             "pages": pages,
                                             "chart_stats": chart_stats,
                                             "highlights": highlights,
                                             "numpages": source.numpages}))


def your_settings(req):
    return __serve_page(req, 'web/your_settings.html', content_type="text/html")

def embedopenid(req):
    return __serve_page(req, 'web/embedopenid.html', content_type="text/html")

@ensure_csrf_cookie
def newsite(req):
    import base.models as M, random, string
    form                = None
    auth_user           = UR.getUserInfo(req)
    ensemble_form       = None
    user_form           = None
    if auth_user is not None:
        return HttpResponseRedirect("/")
    if req.method == 'POST':
        user            = M.User(confkey="".join([choice(string.ascii_letters+string.digits) for i in xrange(0,32)]))
        ensemble        = M.Ensemble()
        user_form       = forms.UserForm(req.POST, instance=user)
        ensemble_form   = forms.EnsembleForm(req.POST, instance=ensemble)
        if user_form.is_valid() and ensemble_form.is_valid():
            user_form.save()
            ensemble.invitekey =  "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,50)])
            ensemble_form.save()
            m = M.Membership(user=user, ensemble=ensemble, admin=True)
            m.save()
            p = {
                "tutorial_url": settings.GUEST_TUTORIAL_URL,
                "conf_url": "http://%s?ckey=%s" %(settings.NB_SERVERNAME, user.confkey),
                "firstname": user.firstname,
                "email": user.email
            }
            email = EmailMessage(
                "Welcome to NB, %s" % (user.firstname),
                render_to_string("email/confirm_newsite", p),
                settings.EMAIL_FROM,
                (user.email, ),
                (settings.EMAIL_BCC, ))
            email.send()
            return HttpResponseRedirect('/newsite_thanks')
    else:
        user_form       = forms.UserForm()
        ensemble_form   = forms.EnsembleForm()
    return render_to_response("web/newsite.html", {"user_form": user_form, "ensemble_form": ensemble_form})


def user_name_form(req):
    user = UR.getUserInfo(req, False)
    if user is None:
        redirect_url = "/login?next=%s" % (req.META.get("PATH_INFO","/"),)
        return HttpResponse(UR.prepare_response({"redirect": redirect_url}))

    remote_form = RemoteForm(forms.UserForm(instance=user))
    if req.method == 'POST':
        user_form = forms.EnterYourNameUserForm(req.POST, instance=user)
        if user_form.is_valid():
            user_form.save()
            return HttpResponse(UR.prepare_response({"redirect": "/?ckey=%s" % user.confkey}))
        else:  # Invalid form - return form with error messages
            __clean_form(user_form)  # Ensure user-generated data gets cleaned before sending back the form
            remote_form = RemoteForm(user_form)
            return HttpResponse(UR.prepare_response({"form": remote_form.as_dict()}))
    else:
        return HttpResponse(UR.prepare_response({"form": remote_form.as_dict()}))


def add_html_doc(req, ensemble_id):
    import base.models as M
    user       = UR.getUserInfo(req, False)
    if user is None:
        redirect_url = "/login?next=%s" % (req.META.get("PATH_INFO","/"),)
        return HttpResponseRedirect(redirect_url)
    if not auth.canEditEnsemble(user.id, ensemble_id):
        return HttpResponseRedirect("/notallowed")
    addform = forms.Html5Form()
    if req.method == 'POST':
        addform = forms.Html5Form(req.POST)
        if addform.is_valid():
            source = M.Source()
            source.numpages = 1
            source.w = 0
            source.h = 0
            source.rotation = 0
            source.version = 0
            source.type = 4
            source.submittedby=user
            source.title = addform.cleaned_data['title']
            source.save()
            ownership = M.Ownership()
            ownership.source = source
            ownership.ensemble_id = ensemble_id
            ownership.save()
            info = M.HTML5Info()
            info.source = source
            # trailing slash is sometimes added by server redirects
            # but person specifying upload url may not realize this
            # so remove trailing slash as well as hash part of the URL
            info.url = addform.cleaned_data['url'].partition("#")[0].rstrip("/")
            info.save();
            return HttpResponseRedirect("/")
    return render_to_response("web/add_html_doc.html", {"form": addform})

def add_youtube_doc(req, ensemble_id):
    import base.models as M
    from apiclient.discovery import build
    from urlparse import urlparse, parse_qs
    import re
    re_iso8601 = re.compile("PT(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?")
    youtube = build("youtube", "v3", developerKey=settings.GOOGLE_DEVELOPER_KEY)
    user       = UR.getUserInfo(req, False)
    if user is None:
        redirect_url = "/login?next=%s" % (req.META.get("PATH_INFO","/"),)
        return HttpResponseRedirect(redirect_url)
    if not auth.canEditEnsemble(user.id, ensemble_id):
        return HttpResponseRedirect("/notallowed")
    addform = forms.YoutubeForm()
    if req.method == 'POST':
        addform = forms.YoutubeForm(req.POST)
        if addform.is_valid():
            source = M.Source()
            source.numpages = 1
            source.w = 0
            source.h = 0
            source.rotation = 0
            source.version = 0
            source.type = 2
            source.submittedby=user
            source.save()
            ownership = M.Ownership()
            ownership.source = source
            ownership.ensemble_id = ensemble_id
            ownership.save()
            info = M.YoutubeInfo()
            info.source = source
            url = addform.cleaned_data['url']
            result = urlparse(url)
            key = None
            try:
                # old format ,e.g. http://www.youtube.com/watch?v=Z3EAE9F2Qpo
                key = parse_qs(result.query)["v"][0]
            except KeyError:
                # new format, e.g. http://youtu.be/Z3EAE9F2Qpo
                key = result.path[1:]
            key = key.strip()
            info.key = key
            info.save();
            ginfo = youtube.videos().list(part="id,contentDetails,snippet", id=key).execute()
            source.title = ginfo["items"][0]["snippet"]["title"]
            matches_dict = re_iso8601.match(ginfo["items"][0]["contentDetails"]["duration"]).groupdict()
            numsecs = 0
            if matches_dict["hours"] is not None:
                numsecs += int(matches_dict["hours"])*3600
            if matches_dict["minutes"] is not None:
                numsecs += int(matches_dict["minutes"])*60
            if matches_dict["seconds"] is not None:
                numsecs += int(matches_dict["seconds"])
            source.numpages = numsecs #we use 1/100 sec precision.
            source.save();
            #addform.cleaned_data['title']

            return HttpResponseRedirect("/")
    return render_to_response("web/add_youtube_doc.html", {"form": addform})

def comment(req, id_comment):
    #id_comment = int(id_comment)
    c = M.Comment.objects.get(pk=id_comment)
    #id_source = annotations.getSourceForComment(id_comment)
    #[id_comment]
    org=("&org="+req.GET["org"]) if "org" in req.GET else ""
    do_reply = "&reply=1" if req.path.split("/")[1]=="r" else ""
    return HttpResponseRedirect("/f/%s?c=%s%s%s" % (c.location.source.id, id_comment, org, do_reply))

def invite(req):
    pass #SACHA TODO

def logout(req):
    o = {}
    r = __serve_page(req, 'web/static_page.html', content_type="text/html", allow_guest=True)
    user = UR.getUserInfo(req, False)
    if user is not None and user.guest:
        r.set_cookie("pgid", user.id, 1e9)
    r.delete_cookie("userinfo")
    r.delete_cookie("ckey")
    from django.contrib.auth import logout as djangologout
    djangologout(req)
    return r

def membership_from_invite(req):
    invite_key  = req.GET.get("invite_key", None)
    try:
        invite      = M.Invite.objects.get(key=invite_key)
    except M.Invite.DoesNotExist:
        return HttpResponse(UR.prepare_response({}, 1,  "Invalid Invite Key"))
    m = M.Membership.objects.filter(user=invite.user, ensemble=invite.ensemble)
    if m.count() > 0:
        m = m[0]
    else:
        m = M.Membership(user=invite.user, ensemble=invite.ensemble)
        m.admin = invite.admin
        m.section = invite.section
        m.save()
    if invite.user.valid == False:
        invite.user.valid=True
        invite.user.save()
    return HttpResponse(UR.prepare_response({"is_admin": m.admin, "email": m.user.email, "class_name": m.ensemble.name, "confkey": m.user.confkey}))

@ensure_csrf_cookie
def subscribe(req):
    return render_to_response("web/subscribe.html")


def properties_ensemble(req, id):
    user       = UR.getUserInfo(req)
    if user is None:
        return HttpResponseRedirect("/login?next=%s" % (req.META.get("PATH_INFO","/"),))
    if not auth.canEditEnsemble(user.id, id):
        return HttpResponseRedirect("/notallowed")
    ensemble = M.Ensemble.objects.get(pk=id)
    ensemble_form = None
    if req.method=="POST":
        ensemble_form = forms.EnsembleForm(req.POST, instance=ensemble)
        if ensemble_form.is_valid():
            ensemble_form.save()
            return HttpResponseRedirect('/')
    else:
        return render_to_response("web/properties_ensemble.html")


def properties_ensemble_users(req, id):
    user = UR.getUserInfo(req)
    if user is None:
        return HttpResponseRedirect("/login?next=%s" % (req.META.get("PATH_INFO","/"),))
    if not auth.canEditEnsemble(user.id, id):
        return HttpResponseRedirect("/notallowed")
    ensemble = M.Ensemble.objects.get(pk=id)
    memberships = M.Membership.objects.filter(ensemble=ensemble)
    real_memberships = memberships.filter(user__in=M.User.objects.filter(valid=True), deleted=False)
    if "action" in req.GET and "membership_id" in req.GET:
        if req.GET["action"] == "delete":
            m = real_memberships.filter(id=req.GET["membership_id"])
            if len(m):
                m = m[0]
                m.deleted = True
                m.save()
                return HttpResponseRedirect(req.path)
        elif req.GET["action"] == "undelete":
            deleted_memberships =  memberships.filter(user__in=M.User.objects.filter(valid=True), deleted=True)
            m = deleted_memberships.filter(id=req.GET["membership_id"])
            if len(m):
                m = m[0]
                m.deleted = False
                m.save()
                return HttpResponseRedirect(req.path)
        elif req.GET["action"] == "admin":
            m = real_memberships.filter(id=req.GET["membership_id"])
            if len(m):
                m = m[0]
                m.admin = True
                m.save()
                return HttpResponseRedirect(req.path)
        elif req.GET["action"] == "unadmin":
            m = real_memberships.filter(id=req.GET["membership_id"])
            if len(m):
                m = m[0]
                m.admin = False
                m.save()
                return HttpResponseRedirect(req.path)
        elif req.GET["action"] == "setsection":
            m = real_memberships.filter(id=req.GET["membership_id"])
            if req.POST["section_id"] == "None":
                s = None
            else:
                sections = M.Section.objects.filter(ensemble=ensemble)
                s = sections.filter(id=req.POST["section_id"])[0]
            if len(m):
                m = m[0]
                m.section = s
                m.save()
                return HttpResponseRedirect(req.path)

    return render_to_response("web/properties_ensemble_users.html")

def properties_ensemble_sections(req, id):
    user = UR.getUserInfo(req)
    if user is None:
        return HttpResponseRedirect("/login?next=%s" % (req.META.get("PATH_INFO","/"),))
    if not auth.canEditEnsemble(user.id, id):
        return HttpResponseRedirect("/notallowed")
    ensemble = M.Ensemble.objects.get(pk=id)
    sections = M.Section.objects.filter(ensemble=ensemble)
    err = ""
    if "action" in req.GET:
        if req.GET["action"] == "create" and "name" in req.POST:
            if M.Section.objects.filter(ensemble=ensemble, name=req.POST["name"]).exists():
                err = "Could not create section \"%s\" because it already exists." % req.POST["name"]
            else:
                s = M.Section(name=req.POST["name"], ensemble=ensemble)
                s.save()
                return HttpResponseRedirect(req.path)
        elif req.GET["action"] == "delete" and "section_id" in req.GET:
            s = sections.filter(id=req.GET["section_id"])
            if len(s):
                s = s[0]
                if ( len(M.Membership.objects.filter(section=s)) > 0):
                    err = "The section you are trying to delete is not empty."
                else:
                    s.delete()
                    return HttpResponseRedirect(req.path)
            else:
                err = "Cannot find section"
        elif req.GET["action"] == "reassign" and "membership_id" in req.POST and "section_id" in req.POST:
            if req.POST["section_id"] == "None":
                s = [None]
            else:
                s = sections.filter(id=req.POST["section_id"]);
            if len(s):
                s = s[0];
                m = M.Membership.objects.filter(id=req.POST["membership_id"])
                if len(m):
                    m = m[0]
                    m.section = s
                    m.save()
                else:
                  err = "Cannot find member"
            else:
                err = "Cannot find section"
        elif req.GET["action"] == "reassign_many":
            json_data = json.loads(req.body)
            new_sections = set(json_data["new_sections"])

            # Check that none of the new_sections already exist
            old_sections = set([s.name for s in M.Section.objects.filter(ensemble=ensemble).all()])
            sections_intersection = old_sections.intersection(new_sections)
            if sections_intersection:
                err = "Could not create the following sections because they already exists: " + \
                      ", ".join(sections_intersection)
                return HttpResponse(json.dumps({"error_message": err}), content_type="application/json")

            # Check that all section names in updated_sections are valid i.e. either an existing section
            # or one of the new_sections.
            all_sections = old_sections.union(new_sections)
            updated_sections = json_data["updated_sections"]
            updated_sections_names = set([r["section"] for r in updated_sections])
            invalid_section_names = updated_sections_names.difference(all_sections)
            if invalid_section_names:
                # Under normal circumstances the code should not get here because the UI should have ensured that all
                # new sections are part of the new_sections field in the json data sent to the server.
                err = "Could not update records because students cannot be added to these sections which do not exist: " + \
                      ", ".join(invalid_section_names)
                return HttpResponse(json.dumps({"error_message": err}), content_type="application/json")

            # Check that all user IDs in updated_sections are valid
            invalid_user_id = []
            for r in updated_sections:
                if not len(M.Membership.objects.filter(id=r["user_id"])):
                    invalid_user_id.append(r["user_id"])
            if invalid_user_id:
                err = "Could not update records because the following user IDs are invalid: " + \
                      ", ".join(invalid_user_id)
                return HttpResponse(json.dumps({"error_message": err}), content_type="application/json")

            # Create new sections
            for section_name in new_sections:
                section_object = M.Section(name=section_name, ensemble=ensemble)
                section_object.save()

            # Update students' sections
            for r in updated_sections:
                m = M.Membership.objects.filter(id=r["user_id"])[0]
                s = sections.filter(name=r["section"], ensemble=ensemble)[0];
                m.section = s
                m.save()
        else:
           err = "Unrecognized Command"
    if err or "json" in req.GET:
        return HttpResponse(json.dumps({"error_message": err}), content_type="application/json")
    else:
        return render_to_response("web/properties_ensemble_sections.html")


def spreadsheet(req):
    return __serve_page(req, settings.SPREADSHEET_TEMPLATE, False, "/login?next=%s" % (req.get_full_path(),), content_type="text/html")

def fbchannel(req):
    import datetime
    r = HttpResponse('<script src="//connect.facebook.net/en_US/all.js"></script>')
    r["Pragma"] = "Public"
    cache_expire = 60*60*24*365
    r["Cache-Control"] = "max-age="+cache_expire
    r["Expires"]=(datetime.datetime.now()+datetime.timedelta(cache_expire)).strftime("%a, %d %b %Y %H:%M:%S GMT")
    return r

def openid_index(request):
    s = ['<p>']
    if request.user.is_authenticated():
        s.append('You are signed in as <strong>%s</strong> (%s)' % (
                escape(request.user.username),
                escape(request.user.get_full_name())))
        s.append(' | <a href="/openid_logout">Sign out</a>')
    else:
        s.append('<a href="/openid/login">Sign in with OpenID</a>')
    s.append('</p>')
    s.append('<p><a href="/private">This requires authentication</a></p>')
    return HttpResponse('\n'.join(s))


def facebooksample(request):
    #without that we we get an error when visiting /openid/login/ (ViewDoesNotExist at /openid/login/)
    #cf: http://stackoverflow.com/questions/6324799/django-templatesyntaxerror
    return HttpResponse('Nothing here.')
def debug(request):
    #without that we we get an error when visiting /openid/login/ (ViewDoesNotExist at /openid/login/)
    #cf: http://stackoverflow.com/questions/6324799/django-templatesyntaxerror
    return HttpResponse('Nothing here.')


@login_required
def require_authentication(request):
    return HttpResponse('This page requires authentication')

@csrf_protect
def subscribe_with_key(req):
    key = req.GET.get("key", "")
    if not key:
        return HttpResponse(UR.prepare_response({}, 1,  "NOT ALLOWED"))
    e = M.Ensemble.objects.get(invitekey=key)
    if not e.use_invitekey:
        return  HttpResponse(UR.prepare_response({}, 1,  "NOT ALLOWED"))
    auth_user = UR.getUserInfo(req)
    if req.method == 'GET':
        if auth_user is None:  # Guest retrieving the subscribe page
            remote_form = RemoteForm(forms.UserForm())
            return HttpResponse(UR.prepare_response({"new_user": True, "class_settings": UR.model2dict(e),
                                                     "form": remote_form.as_dict()}))
        else:  # Logged in user retrieving the subscribe page
            user = auth_user
            remote_form = RemoteForm(forms.UserForm(instance=user))
            m = M.Membership.objects.filter(user=user, ensemble=e)
            if m.count() ==0:
                m = M.Membership(user=user, ensemble=e)
                m.save()
            return HttpResponse(UR.prepare_response({"new_user": False, "user": UR.model2dict(user),
                                                     "class_settings": UR.model2dict(e), "form": remote_form.as_dict()}))
    else:  # POST requests
        if auth_user is None:  # Guest subscribing to a class
            user = M.User(confkey="".join([choice(string.ascii_letters+string.digits) for i in xrange(0,32)]))
            req.POST = dict(req.POST.iteritems()) # Convert immutable object to mutable object
            user_form = forms.UserForm(req.POST, instance=user)
            if user_form.is_valid():
                user_form.save()
                m = M.Membership(user=user, ensemble=e)
                m.save() # membership exists but user is still invalid until has confirmed their email
                p = {
                    "tutorial_url": settings.GUEST_TUTORIAL_URL,
                    "conf_url": "%s://%s/?ckey=%s" %(settings.PROTOCOL, settings.NB_SERVERNAME, user.confkey),
                    "firstname": user.firstname,
                    "email": user.email
                }
                email = EmailMessage(
                "Welcome to NB, %s" % (user.firstname,),
                render_to_string("email/confirm_subscribe", p),
                settings.EMAIL_FROM,
                (user.email, ),
                (settings.EMAIL_BCC, ))
                email.send()
                return HttpResponse(UR.prepare_response({"new_user": True, "class_settings": UR.model2dict(e),
                                                         "next": "/subscribe_thanks"}))
            else:  # Invalid form - return form with error messages
                __clean_form(user_form)  # Ensure user-generated data gets cleaned before sending back the form
                remote_form = RemoteForm(user_form)
                return HttpResponse(UR.prepare_response({"new_user": True, "user": UR.model2dict(user),
                                                     "class_settings": UR.model2dict(e), "form": remote_form.as_dict()}))
        else:  # Logged in user subscribing to a class
            user = auth_user
            m = M.Membership.objects.filter(user=user, ensemble=e)
            if m.count() ==0:
                m = M.Membership(user=user, ensemble=e)
                m.save()
            return HttpResponse(UR.prepare_response({"new_user": False, "class_settings": UR.model2dict(e), "next": "/"}))


@csrf_protect
def newsite_form(req):
    import base.models as M, random, string
    auth_user = UR.getUserInfo(req)
    if auth_user is not None:
        return HttpResponse(UR.prepare_response({"redirect": "/"}))
    if req.method == 'GET':
        remote_user_form = RemoteForm(forms.UserForm())
        remote_class_form = RemoteForm(forms.EnsembleForm())
        return HttpResponse(UR.prepare_response({"user_form": remote_user_form.as_dict(), "class_form": remote_class_form.as_dict()}))
    else:
        user = M.User(confkey="".join([choice(string.ascii_letters+string.digits) for i in xrange(0,32)]))
        ensemble = M.Ensemble()
        req.POST = dict(req.POST.iteritems()) # Convert immutable object to mutable object
        user_form       = forms.UserForm(req.POST, instance=user)
        ensemble_form   = forms.EnsembleForm(req.POST, instance=ensemble)
        if user_form.is_valid() and ensemble_form.is_valid():
            user_form.save()
            ensemble.invitekey =  "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,50)])
            ensemble_form.save()
            m = M.Membership(user=user, ensemble=ensemble, admin=True)
            m.save()
            p = {
                "tutorial_url": settings.GUEST_TUTORIAL_URL,
                "conf_url": "http://%s?ckey=%s" %(settings.NB_SERVERNAME, user.confkey),
                "firstname": user.firstname,
                "email": user.email
            }
            email = EmailMessage(
                "Welcome to NB, %s" % (user.firstname),
                render_to_string("email/confirm_newsite", p),
                settings.EMAIL_FROM,
                (user.email, ),
                (settings.EMAIL_BCC, ))
            email.send()
            return HttpResponse(UR.prepare_response({"redirect": "/newsite_thanks"}))
        else:  # Invalid form - return form with error messages
            __clean_form(user_form)  # Ensure user-generated data gets cleaned before sending back the form
            __clean_form(ensemble_form)  # Ensure user-generated data gets cleaned before sending back the form
            remote_user_form = RemoteForm(user_form)
            remote_class_form = RemoteForm(ensemble_form)
            return HttpResponse(UR.prepare_response({"user_form": remote_user_form.as_dict(),
                                                     "class_form": remote_class_form.as_dict()}))


def __clean_form(form):
    """
    This method should be called before sending a form to the client if the form was created from
    user-generated json.
    """
    form.is_valid() # Calling this method will populate the cleaned_data field.
    # Replace data with cleaned_data to ensure the values get sent back as the right type e.g.
    # javascript boolean value of true gets sent as string "true". Cleaning converts it back to
    # boolean
    form.data = form.cleaned_data
