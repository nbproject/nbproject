"""
jobs.py - notification routines

Author 
    Sacha Zyto <sacha@csail.mit.edu>

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
import sys,os
import datetime
if "." not in sys.path: 
    sys.path.append(".")
if "DJANGO_SETTINGS_MODULE" not in os.environ: 
    os.environ['DJANGO_SETTINGS_MODULE'] = 'nbsite.settings'
from django.conf import settings
import base.utils as utils, base.models as M
from polls.models import Message, Consent
from django.template import Template, Context
from django.core.mail import EmailMessage
from django.db.models import Max

def do_pending(t_args):
    when = datetime.datetime.now()
    print("""


---------------------- pending NOTIFICATIONS FOR %s -----------------""" % (when, ))
    do_pending_msg()
    print("--------------- END OF pending NOTIFICATIONS FOR %s -----------------" % (when, ))
   

def do_pending_msg():
    msgs = Message.objects.filter(sent=None, draft=False)
    for o in msgs: 
        #exclude clause in order not to spam people who have participated in the past. 
        recipients = o.ensemble.membership_set.filter(deleted=False).exclude(user__in=Consent.objects.values_list("user"))
        if o.students and not o.admins:
            recipients = recipients.filter(admin=False)
        if o.admins and not o.students: 
            recipients = recipients.filter(admin=True)
        if not o.admins and not o.students:
            recipients = []
        tpl_title = Template(o.title)
        tpl_body =  Template(o.body)       
        for r in recipients:
            link_dont_approve="%s://%s/polls/consent?ckey=%s" % (settings.PROTOCOL, settings.HOSTNAME, r.user.confkey)
            link_approve="%s&approved=1" % (link_dont_approve,) 
            V = Context({"user": r.user, "link_approve": link_approve, "link_dont_approve": link_dont_approve})
            email = EmailMessage(tpl_title.render(V),
            tpl_body.render(V),  
            o.author, 
            (r.user.email, ), 
            (settings.EMAIL_BCC, ))
            email.send()
            print("[%s] sent email to %s %s <%s>" % (o.ensemble.name, r.user.firstname, r.user.lastname, r.user.email))
    msgs.update(sent=datetime.datetime.now())            
                
if __name__ == "__main__" :
    ACTIONS = {
        "pending": do_pending,
        }
    utils.process_cli(__file__, ACTIONS)

