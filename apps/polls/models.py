from django.db import models
from django.db.models.fields.related import ForeignKey
from base.models import User, Ensemble
from django.db.models.fields import BooleanField, DateTimeField, CharField,\
    TextField
from datetime import datetime
from django.dispatch import receiver

class Consent(models.Model):
    user            = ForeignKey(User)
    approved        = BooleanField(default=False)
    ctime           = DateTimeField(default=datetime.now)
    _active         = BooleanField(default=True)

class SurveyVisit(models.Model):
    user         = ForeignKey(User)
    ctime           = DateTimeField(default=datetime.now)

class Message(models.Model):
    ensemble        = ForeignKey(Ensemble)
    author          = CharField(max_length=255, default="The NB Team<nbnotifications@csail.mit.edu>")
    title           = CharField(max_length=512, default="untitled")
    body            = TextField()
    ctime           = DateTimeField(default=datetime.now)
    students        = BooleanField(default=False)
    admins          = BooleanField(default=False)
    sent            = DateTimeField(default=None, null=True, blank=True)
    draft           = BooleanField(default=False)
    
    def __unicode__(self):
        return "To %s on %s" % (self.ensemble.name, self.ctime)

@receiver(models.signals.pre_save, sender=Consent)
def presave_cb(sender, **kwargs):     
    o = kwargs["instance"]
    Consent.objects.filter(user=o.user, _active=True).update(_active=False);
#    if o._active: #prevent infinite loop since this method performs a save() as well
#        old = Consent.objects.filter(user=o.user, _active=True)
#        if old.count() > 0:
#            old[0]._active = False
#            old.save()            
