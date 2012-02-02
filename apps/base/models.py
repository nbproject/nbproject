from django.db import models
from django.db.models.fields import  CharField, IntegerField, BooleanField, TextField, DateTimeField, EmailField
from django.db.models.fields.related import ForeignKey, OneToOneField
from datetime import datetime

### TODO continue porting with schema in main_dir/schema

### SQL functions not ported: 
# add_ens
# add_source_default
# array_median
# py_random_string
# pymax

### SQL aggregates not ported: 
# median

### SQL tables not ported: 
# annotation_pdf                old format
# comment                       old format
# event                         not used
# grade                         for experiment w/ Rob's class 
# hide                          not used
# hist_timed                    for experiment
# history                       old format
# infolder                      old format - replaced by folder entry in ownership
# answerplease                  old format - replaced by nb2_mark
# assignment                    old format - never really implemented
# collage_history               old format - replaced by nb2_collage_history
# enrolled                      for data analysis
# marked                        old format
# nb2_email_alias               for data analysis:  used for stats to reconcile 6.042 email based submissions with users. 
# nb2_email_submission          for data analysis:  used for stats to reconcile 6.042 email based submissions with users. 
# stroke_pdf                    for experiment w/ penstroke data
# userinfo                      for data analysis

### SQL views not ported: 
# page_change_3sec
# changes1
# nb2_v_comment

### TODO: Maybe use the django auth.user model
### TODO: Port COUHES approvals
class User(models.Model):                                                       # old: users
    email               = EmailField(max_length=63, unique=True)
    firstname           = CharField(max_length=63, blank=True, null=True)      # new
    lastname            = CharField(max_length=63, blank=True, null=True)      # new 
    pseudonym           = CharField(max_length=63, blank=True, null=True)      # new
    password            = CharField(max_length=63, blank=True, null=True)      
    confkey             = CharField(max_length=63, blank=True, null=True)      
    guest               = BooleanField(default=False)                          # new
    valid               = BooleanField(default=False)                          # new

class Ensemble(models.Model):                                                   # old: ensemble
    name                = CharField(max_length=255)                             # old: name text
    description         = CharField(max_length=255, default="No description available") 
    allow_staffonly     = BooleanField(default=True, verbose_name="Allow users to write 'staff-only' comments")                           
    allow_anonymous     = BooleanField(default=True, verbose_name="Allow users to write anonymous comments")  
    allow_guest         = BooleanField(default=False, verbose_name="Allow guests (i.e. non-members) to access the site")      
    invitekey           = CharField(max_length=63,  blank=True, null=True)      # new
    use_invitekey       = BooleanField(default=True, verbose_name="Allow users who have the 'subscribe link' to register by themselves")
    allow_download      = BooleanField(default=True, verbose_name="Allow users to download the PDFs")                       
    def __unicode__(self):
        return "(%s) %s" %(self.id, self.name)
    class Meta: 
        ordering = ["id"]

class Folder(models.Model):                                                     # old: folder
    parent              = ForeignKey("self", null=True)                         # old: id_parent integer
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer
    name                = CharField(max_length=255)                             # old: name text

### TODO: Would be nice to remember the invite text and when it was sent. 
class Invite(models.Model):                                                     # old: invite
    key                 = CharField(max_length=255)                             # old: id
    user                = ForeignKey(User)                                      # old: id_user
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble
    admin               = BooleanField(default=False)                           # old: admin integer
    ctime               = DateTimeField(null=True, default=datetime.now())

### TODO: port id_grader functionality (i.e. class sections)
class Membership(models.Model):                                                 # old: membership
    user                = ForeignKey(User)                                      # old: id_user
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble
    admin               = BooleanField(default=False)                           # old: admin integer
    deleted             = BooleanField(default=False)

class Source(models.Model):                                                     # old: source
    title               = CharField(max_length=255, default="untitled")         # old: title text
    submittedby         = ForeignKey(User, blank=True, null=True)               # old: submittedby integer
    numpages            = IntegerField(default=0)
    w                   = IntegerField(default=0)                               # old: ncols integer
    h                   = IntegerField(default=0)                               # old: nrows integer
    rotation            = IntegerField(default=0)                               # new
    version             = IntegerField(default=0)                               #incremented when adding src
    
### TODO: port history feature, so we can restore a file is an admin erases it by mistake. 
class Ownership(models.Model):                                                  # old: ownership
    source              = ForeignKey(Source)                                    # old: id_source integer
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer
    folder              = ForeignKey(Folder, null=True)                         # old: id_folder integer
    published           = DateTimeField(default=datetime.now)                   # old: published timestamp without time zone DEFAULT now() 
    deleted             = BooleanField(default=False)
    assignment          = BooleanField(default=False)
    due                 = DateTimeField(default=datetime.now(), null=True)
    
class Location(models.Model):                                                   # old: nb2_location
    source              = ForeignKey(Source)                                    # old: id_source integer
    version             = IntegerField(default=1)
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer    
    x                   = IntegerField()
    y                   = IntegerField()
    w                   = IntegerField()
    h                   = IntegerField()
    page                = IntegerField()

class Comment(models.Model):                                                    # old: nb2_comment
    TYPES               = ((1, "Private"), (2, "Staff"), (3, "Class"))     
    location            = ForeignKey(Location)                                  # old: id_location integer
    parent              = ForeignKey('self', null=True)                        # old: id_parent integer
    author              = ForeignKey(User)                                      # old: id_author integer,
    ctime               = DateTimeField(default=datetime.now)                   # old: ctime timestamp 
    body                = TextField(blank=True, null=True)
    type                = IntegerField(choices=TYPES)
    signed              = BooleanField(default=True)                            # old: signed integer DEFAULT 0,
    deleted             = BooleanField(default=False)                           # old: vis_status integer DEFAULT 0
    moderated           = BooleanField(default=False)
    
    @property
    def created(self):      
        t_d = self.ctime.isocalendar()
        t_now = datetime.now().isocalendar()
        if t_d[0] != t_now[0]: #not even this year
            return self.ctime.strftime("%d %b %Y")
        if t_d[1] != t_now[1]: #this year but not this week
            return self.ctime.strftime("%d %b, %I:%M%p")
        if t_d[2] != t_now[2]: #this week but not today
            return self.ctime.strftime("%a %I:%M%p")
        #today: 
        return  self.ctime.strftime("%I:%M%p")

### Those aren't used anymore (threadmarks are used instead)
class Mark(models.Model):                                                       # old: nb2_mark
    TYPES               = ((1, "answerplease"), (3, "approve"), (5, "reject"), (7, "favorite"), (9, "hide"))     
    type                = IntegerField(choices=TYPES)                           # old: id_type integer NOT NULL
    ctime               = DateTimeField(default=datetime.now)                   # old: ctime timestamp 
    comment             = ForeignKey(Comment)                                   # old: id_ann integer NOT NULL
    user                = ForeignKey(User)                                      # old: id_user integer NOT NULL

class ThreadMark(models.Model):
    TYPES               = ((1, "question"), (2, "star"), (3, "summarize"))
    type                = IntegerField(choices=TYPES)
    active              = BooleanField(default=True)
    ctime               = DateTimeField(default=datetime.now)                    
    location            = ForeignKey(Location)
    comment             = ForeignKey(Comment, null=True)                        #this is optional
    user                = ForeignKey(User)
    def resolved(self):
        return self.replyrating_set.filter(status__gt=ReplyRating.TYPE_UNRESOLVED).exists()

class ReplyRating(models.Model):
    #Rep invarient: TYPE_UNRESOLVED < TYPE_RESOLVED < TYPE_THANKS
    TYPE_UNRESOLVED     = 1
    TYPE_RESOLVED       = 2
    TYPE_THANKS         = 3    
    TYPES               = ((TYPE_UNRESOLVED, "unresolved"), (TYPE_RESOLVED, "resolved"), (TYPE_THANKS, "thanks"))
    threadmark          = ForeignKey(ThreadMark)
    comment             = ForeignKey(Comment)
    ctime               = DateTimeField(default=datetime.now)                    
    status              = IntegerField(choices=TYPES)   
    
class ThreadMarkHistory(models.Model):
    
    TYPES               = ((1, "question"), (2, "star"), (3,"summarize"))
    type                = IntegerField(choices=TYPES)
    active              = BooleanField(default=True)
    ctime               = DateTimeField(default=datetime.now)                    
    location            = ForeignKey(Location)
    user                = ForeignKey(User)
    comment             = ForeignKey(Comment, null=True)                        #this is optional

    
class Processqueue(models.Model):                                               # old: nb2_processqueue
    source              = ForeignKey(Source, null=True)                                    # old: id_source integer,
    submitted           = DateTimeField(default=datetime.now)                   # old: submitted timestamp without time zone DEFAULT now(),
    started             = DateTimeField(null=True)                              # old: started timestamp without time zone,
    completed           = DateTimeField(null=True)                              # old: completed timestamp without time zone


#TODO: Continue migratedbscript from here. 
class Session(models.Model):
    user                = ForeignKey(User)
    ctime               = DateTimeField(default=datetime.now)
    lastactivity        = DateTimeField(default=datetime.now, null=True)                                           
    ip                  = CharField(max_length=63, blank=True, null=True)
    clienttime          = DateTimeField(blank=True, null=True)
                              
class CommentSeen(models.Model):
    comment             = ForeignKey(Comment)
    session             = ForeignKey(Session, null=True)
    user                = ForeignKey(User) #duplicate (cf session) but inlined for performance
    ctime               = DateTimeField(default=datetime.now)

class PageSeen(models.Model):
    source              = ForeignKey(Source)
    page                = IntegerField()
    session             = ForeignKey(Session, null=True)
    user                = ForeignKey(User, null=True) #duplicate (cf session) but inlined for performance
    ctime               = DateTimeField(default=datetime.now) 
   
class Landing(models.Model):
    user                = ForeignKey(User)
    ctime               = DateTimeField(default=datetime.now)
    ip                  = CharField(max_length=63, blank=True, null=True)
    client              = CharField(max_length=1023, blank=True, null=True)
    referer             = CharField(max_length=1023, blank=True, null=True)
    path                = CharField(max_length=1023, blank=True, null=True) 
    
class Idle(models.Model):
    session             = ForeignKey(Session)
    t1                  = DateTimeField()
    t2                  = DateTimeField()

#NB-wide settings (i.e. not ensemble-based). 
class DefaultSetting(models.Model):
    name                = CharField(max_length=1023)
    description         = TextField(blank=True, null=True)
    value               = IntegerField()

class SettingLabel(models.Model):
    setting             = ForeignKey(DefaultSetting)
    value               = IntegerField()
    label               = TextField()
    
class UserSetting(models.Model):
    user                = ForeignKey(User)
    setting             = ForeignKey(DefaultSetting)
    value               = IntegerField()
    ctime               = DateTimeField(default=datetime.now)            
    
class SourceVersion(models.Model):
    title               = CharField(max_length=255, default="untitled")         
    submittedby         = ForeignKey(User, blank=True, null=True)               
    numpages            = IntegerField(default=0)
    w                   = IntegerField(default=0)                               
    h                   = IntegerField(default=0)                               
    rotation            = IntegerField(default=0)                               
    version             = IntegerField(default=0)                                  
    published           = DateTimeField()   

class FileDownload(models.Model):
    ctime               = DateTimeField(default=datetime.now())
    user                = ForeignKey(User)
    source              = ForeignKey(Source)
    annotated           = BooleanField()

class Notification(models.Model):
    type                = CharField(max_length=127)
    atime               = DateTimeField(null=True, default=datetime.now())    

class GuestHistory(models.Model):
    user                = ForeignKey(User)
    t_start             = DateTimeField(null=True, default=datetime.now())
    t_end               = DateTimeField(null=True)
    
class GuestLoginHistory(models.Model):
    guest               = ForeignKey(User, related_name="u1")
    user                = ForeignKey(User, related_name="u2")
    ctime               = DateTimeField(null=True, default=datetime.now())    

class AssignmentGrade(models.Model):
    user                = ForeignKey(User, related_name="u_grade")
    grader              = ForeignKey(User, related_name="g_grade")
    ctime               = DateTimeField(default=datetime.now())
    grade               = IntegerField()
    source              = ForeignKey(Source)
    
class AssignmentGradeHistory(models.Model):
    user                = ForeignKey(User, related_name="u_grade_h")
    grader              = ForeignKey(User, related_name="g_grade_h")       
    ctime               = DateTimeField(default=datetime.now())
    grade               = IntegerField()
    source              = ForeignKey(Source)
    