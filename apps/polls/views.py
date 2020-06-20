# Create your views here.
from django.shortcuts import render_to_response
from base import auth
from .models import Consent, SurveyVisit

def consent(req): 
    ckey = req.GET.get("ckey", None)
    approved = req.GET.get("approved", None)
    approved = approved is not None     
    user = auth.getCkeyInfo(ckey)
    consent = Consent()
    consent.user = user
    consent.approved = approved
    consent.save()
    return render_to_response("web/consent.html", {"user": user, "approved": approved, "surveylink": "/polls/survey?ckey=%s" % (ckey,)})

def survey(req):
    ckey = req.GET.get("ckey", None)
    user = auth.getCkeyInfo(ckey)
    if user is not None: 
        sv = SurveyVisit()
        sv.user = user
        sv.save()
    return render_to_response("web/survey.html", {"user": user})
