from django.db import models
from django.db.models.fields import  CharField, IntegerField, BooleanField, TextField, DateTimeField, EmailField
from django.db.models.fields.related import ForeignKey, OneToOneField, ManyToManyField
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class ReportRating(models.Model): 
    """Meta info about a report on a user-basis: usefulness, and whether to show it or not"""
    ctime               = DateTimeField(default=datetime.now())
    user                = ForeignKey(User)
    grade               = IntegerField(null=True)
    hidden              = BooleanField(default=False)       
 
class Environment(models.Model): 
    name                = CharField(max_length=255) 
    command             = CharField(max_length=1024)


class Script(models.Model): 
    """Set of Instructions to perform for a given analysis"""
    description         = CharField(max_length=1024)
    environment         = ForeignKey(Environment, null=True)
   
class Section(models.Model):
    """Stand alone piece of analysis"""
    TYPE_TABLE          = 1
    TYPE_GRAPH          = 2
    TYPES               = ((TYPE_TABLE, "Table"), (TYPE_GRAPH, "Graph"))
    kind                = IntegerField(choices=TYPES)
    params              = TextField(blank=True, null=True)
    steps               = ManyToManyField(Script, through="Step", blank=True, null=True)
    description         = TextField(blank=True, null=True) #part of the section that we want to appear on all reports. 

class Report(models.Model):
    """A report is a group of sections and correponding comments"""
    ctime               = DateTimeField(null=True, default=datetime.now())
    seenby              = ManyToManyField(User, through="ReportSeen", blank=True, null=True)
    ratings             = ManyToManyField(ReportRating,blank=True, null=True)
    ckey                = CharField(max_length=63, blank=True, null=True)
    sections            = ManyToManyField(Section, through="SectionUnit", blank=True, null=True)
    
class ReportSeen(models.Model): 
    """This is used to track which reports have been seen"""
    user                = ForeignKey(User)
    report              = ForeignKey(Report)
    ctime               = DateTimeField(null=True, default=datetime.now())

class SectionUnit(models.Model): 
    report              = ForeignKey(Report)
    section             = ForeignKey(Section)
    comment             = TextField(blank=True, null=True)
    position            = IntegerField()

class Step(models.Model): 
    """Script info and position to execute for a script in a section"""
    section             = ForeignKey(Section)
    script              = ForeignKey(Script)
    position            = IntegerField()
    params              = TextField(blank=True, null=True)   
    
#class Comment(models.Model): 
#    TYPE_PRIVATE        = 1
#    TYPE_PUBLIC         = 2
#    TYPES               = ((TYPE_PRIVATE, "private"), (TYPE_PUBLIC, "public"))
#    ctime               = DateTimeField(null=True, default=datetime.now())
#    user                = ForeignKey(User)
#    section             = ForeignKey(Section)
#    report              = ForeignKey(Report, null=True) #null means visible from all reports
#    kind                = IntegerField(choices=TYPES)
#    deleted             = BooleanField(default=False)  
#
