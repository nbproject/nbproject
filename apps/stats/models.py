from django.db import models
from django.db.models.fields import  CharField, IntegerField, BooleanField, TextField, DateTimeField, EmailField
from django.db.models.fields.related import ForeignKey, OneToOneField, ManyToManyField
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class Section(models.Model):
    """Stand alone piece of analysis"""
    name                = CharField(max_length=1024)
    description         = TextField(blank=True, null=True) #part of the section that we want to appear on all reports. 
    def __unicode__(self):
        return "[%s %s] %s: %s" % (self.__class__.__name__,self.id,  self.name, self.description)

class Report(models.Model):
    """A report is a group of sections and correponding comments"""
    ctime               = DateTimeField(null=True, default=datetime.now())
    ckey                = CharField(max_length=63, blank=True, null=True)
    sections            = ManyToManyField(Section, through="SectionUnit", blank=True, null=True)
    name                = CharField(max_length=1024)
    description         = TextField(blank=True, null=True) 
    def __unicode__(self):
        return "[%s %s] %s: %s" % (self.__class__.__name__,self.id,  self.name, self.description)

    
class SectionUnit(models.Model): 
    report              = ForeignKey(Report)
    section             = ForeignKey(Section)
    comment             = TextField(blank=True, null=True)
    position            = IntegerField()
    def __unicode__(self):
        return "[%s %s]  %s[%s]=%s" % (self.__class__.__name__,self.id,  self.report.name, self.position, self.section.name)

