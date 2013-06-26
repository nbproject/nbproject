from django.db import models
from django.db.models.fields import  CharField, IntegerField, BooleanField, TextField, DateTimeField, EmailField
from django.db.models.fields.related import ForeignKey, OneToOneField

#in edx forum,the initial thread of the comment has its comment embedded and all the comments on those are considered not to have a parent. To make comparative analysis easier, we're going to change this in favor of a more NB-like scheme: For each CommentThread, there's only going to be one root comment, extracted from that comment thread. 

class Course(models.Model): 
    name = CharField(max_length=255)

class CommentThread(models.Model):
    oid = CharField(max_length=64)
    title = CharField(max_length=1024)
    course = ForeignKey(Course)

class Author: 
    edxid = IntegerField()

class Comment(models.Model): 
    oid = CharField(max_length=64)
    anonymous = BooleanField()
    anonymous_to_peers = BooleanField()
    author = ForeignKey(Author)
    body = TextField()
    commentthread = ForeignKey(CommentThread)
    
