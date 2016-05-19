from django.db import models
from django.db.models.fields import  CharField, IntegerField, BooleanField, TextField, DateTimeField, EmailField
from django.db.models.fields.related import ForeignKey, OneToOneField
from django.utils.tzinfo import FixedOffset, LocalTimezone
from datetime import datetime
import time
import pytz
import calendar
from django.utils import timezone
import hashlib, uuid

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
class User(models.Model):
    email               = EmailField(max_length=63, unique=True)
    firstname           = CharField(max_length=63, blank=True, null=True)
    lastname            = CharField(max_length=63, blank=True, null=True)
    pseudonym           = CharField(max_length=63, blank=True, null=True)
    password            = CharField(max_length=63, blank=True, null=True)      # old; should be null
    salt                = CharField(max_length=32, blank=False, null=True)     # new secure authentication
    saltedhash          = CharField(max_length=128, blank=False, null=True)    # new secure authentication
    confkey             = CharField(max_length=63, blank=True, null=True)
    guest               = BooleanField(default=False)
    valid               = BooleanField(default=False)

    def __unicode__(self):
        return "%s %s: %s %s <%s>" % (self.__class__.__name__,self.id,  self.firstname, self.lastname, self.email)

    # Returns 'True' if password is correct, 'False' othrewise
    def authenticate(self, password):
        user_hash = hashlib.sha512(password.encode('ascii', 'xmlcharrefreplace') + self.salt).hexdigest()
        return (self.saltedhash == user_hash)

    # Updates 'salt' and 'saltedhash' to correspond to new password
    # this method does notcall 'save'
    def set_password(self, password):
        self.salt = uuid.uuid4().hex
        self.saltedhash = hashlib.sha512(password.encode('ascii', 'xmlcharrefreplace') + self.salt).hexdigest()
        return

class Ensemble(models.Model):                                                   # old: ensemble
    SECTION_ASSGT_NULL  = 1
    SECTION_ASSGT_RAND  = 2
    SECTION_ASSGT_TYPES = ((SECTION_ASSGT_NULL,"NULL"), (SECTION_ASSGT_RAND,"RANDOM") )
    name                = CharField(max_length=255)                             # old: name text
    description         = CharField(max_length=255, default="No description available")
    allow_staffonly     = BooleanField(default=True, verbose_name="Allow users to write 'staff-only' comments")
    allow_anonymous     = BooleanField(default=True, verbose_name="Allow users to write anonymous comments")
    allow_tag_private	= BooleanField(default=True, verbose_name="Allow users to make comments private to tagged users only")
    allow_guest         = BooleanField(default=False, verbose_name="Allow guests (i.e. non-members) to access the site")
    invitekey           = CharField(max_length=63,  blank=True, null=True)      # new
    use_invitekey       = BooleanField(default=True, verbose_name="Allow users who have the 'subscribe link' to register by themselves")
    allow_download      = BooleanField(default=True, verbose_name="Allow users to download the PDFs")
    allow_ondemand      = BooleanField(default=False, verbose_name="Allow users to add any PDF accessible on the internet by pointing to its URL")
    default_pause       = BooleanField(default=False, verbose_name="Pause on staff Video comments by default")
    section_assignment  = IntegerField(choices=SECTION_ASSGT_TYPES, default=SECTION_ASSGT_NULL, null=True)
    metadata            = TextField(null=True, blank=True) #data in json format to help processing.
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.name)
    class Meta:
        ordering = ["id"]

class Folder(models.Model):                                                     # old: folder
    parent              = ForeignKey("self", null=True)                         # old: id_parent integer
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer
    name                = CharField(max_length=255)                             # old: name text
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.name)

class Section(models.Model):
    name                = CharField(max_length=255)
    ensemble            = ForeignKey(Ensemble)
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.name)


### TODO: Would be nice to remember the invite text and when it was sent.
class Invite(models.Model):                                                     # old: invite
    key                 = CharField(max_length=255)                             # old: id
    user                = ForeignKey(User)                                      # old: id_user
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble
    admin               = BooleanField(default=False)                           # old: admin integer
    ctime               = DateTimeField(null=True, default=datetime.now(), db_index=True)
    section             = ForeignKey(Section, null=True)

    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.key)


### TODO: port id_grader functionality (i.e. class sections)
class Membership(models.Model):                                                 # old: membership
    user                = ForeignKey(User)                                      # old: id_user
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble
    section             = ForeignKey(Section, null=True)
    admin               = BooleanField(default=False)                           # old: admin integer
    deleted             = BooleanField(default=False)
    guest               = BooleanField(default=False)                           # Adding guest membership to remember section_id.
    #FIXME Note: To preserve compatibility w/ previous production DB, I also added a default=false at the SQL level for the 'guest' field , so that we don't create null records if using the old framework
    def __unicode__(self):
        return "%s %s: (user %s, ensemble %s)" % (self.__class__.__name__,self.id,  self.user_id, self.ensemble_id)

class Source(models.Model):
    TYPE_PDF            = 1
    TYPE_YOUTUBE        = 2
    TYPE_HTML5VIDEO     = 3
    TYPE_HTML5          = 4
    TYPES               = ((TYPE_PDF, "PDF"), (TYPE_YOUTUBE, "YOUTUBE"), (TYPE_HTML5VIDEO, "HTML5VIDEO"), (TYPE_HTML5, "HTML5"))
    title               = CharField(max_length=255, default="untitled")         # old: title text
    submittedby         = ForeignKey(User, blank=True, null=True)               # old: submittedby integer
    numpages            = IntegerField(default=0)
    w                   = IntegerField(default=0)                               # old: ncols integer
    h                   = IntegerField(default=0)                               # old: nrows integer
    rotation            = IntegerField(default=0)                               # new
    version             = IntegerField(default=0)                               #incremented when adding src
    type                = IntegerField(choices=TYPES, default=TYPE_PDF)
    x0                  = IntegerField(default=0)                               #x-coordinate of lower-left corner of trimbox
    y0                  = IntegerField(default=0)                               #y-coordinate of lower-left corner of trimbox
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.title)
    #FIXME Note: To preserve compatibility w/ previous production DB, I also added a default=1 at the SQL level for the 'type' field , so that we don't create null records if using the old framework

class YoutubeInfo(models.Model):
    source              = OneToOneField(Source)
    key                 = CharField(max_length=255,blank=True, null=True)
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.key)

class HTML5Info(models.Model):
    source              = OneToOneField(Source)
    url                 = CharField(max_length=2048,blank=True, null=True)
    def __unicode__(self):
        return "%s %s: %s" % (self.__class__.__name__,self.id,  self.url)

class OnDemandInfo(models.Model):
    ensemble            = ForeignKey(Ensemble)
    source              = OneToOneField(Source)
    url                 = CharField(max_length=2048,blank=True, null=True)

### TODO: port history feature, so we can restore a file is an admin erases it by mistake.
class Ownership(models.Model):                                                  # old: ownership
    source              = ForeignKey(Source)                                    # old: id_source integer
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer
    folder              = ForeignKey(Folder, null=True)                         # old: id_folder integer
    published           = DateTimeField(default=datetime.now, db_index=True)    # old: published timestamp without time zone DEFAULT now()
    deleted             = BooleanField(default=False)
    assignment          = BooleanField(default=False)
    due                 = DateTimeField(default=datetime.now(), null=True)
    def __unicode__(self):
        return "%s %s: source %s in ensemble %s" % (self.__class__.__name__,self.id,  self.source_id, self.ensemble_id)

class Location(models.Model):                                                   # old: nb2_location
    source              = ForeignKey(Source)                                    # old: id_source integer
    version             = IntegerField(default=1)
    ensemble            = ForeignKey(Ensemble)                                  # old: id_ensemble integer
    section             = ForeignKey(Section, null=True)
    x                   = IntegerField()
    y                   = IntegerField()
    w                   = IntegerField()
    h                   = IntegerField()
    page                = IntegerField()
    duration		= IntegerField(null=True)
    is_title		= BooleanField(default=False)
    pause           = BooleanField(default=False)
    def __unicode__(self):
        return "%s %s: on source %s - page %s " % (self.__class__.__name__,self.id,  self.source_id, self.page)

class HTML5Location(models.Model):
    location              = OneToOneField(Location)
    path1                 = CharField(max_length=2048,blank=True, null=True)
    path2                 = CharField(max_length=2048,blank=True, null=True)
    offset1               = IntegerField()
    offset2               = IntegerField()

class Comment(models.Model):                                                    # old: nb2_comment
    TYPES               = ((1, "Private"), (2, "Staff"), (3, "Class"), (4, "Tag Private"))
    location            = ForeignKey(Location)                                  # old: id_location integer
    parent              = ForeignKey('self', null=True)                         # old: id_parent integer
    author              = ForeignKey(User)                                      # old: id_author integer,
    ctime               = DateTimeField(default=datetime.now, db_index=True)    # old: ctime timestamp
    body                = TextField(blank=True, null=True)
    type                = IntegerField(choices=TYPES)
    signed              = BooleanField(default=True)                            # old: signed integer DEFAULT 0,
    deleted             = BooleanField(default=False)                           # old: vis_status integer DEFAULT 0
    moderated           = BooleanField(default=False)
    def __unicode__(self):
        return "%s %s: %s " % (self.__class__.__name__,self.id,  self.body[:50])

    @property
    def created(self):
        if (timezone.is_naive(self.ctime)):
            return str(calendar.timegm(pytz.utc.localize(self.ctime).timetuple()))
        else:
            return str(calendar.timegm(self.ctime.astimezone(pytz.utc).timetuple()))

# Represents Users tagged in a comment
class Tag(models.Model):
    TYPES               = ((1, "Individual"),)
    type                = IntegerField(choices=TYPES)
    individual          = ForeignKey(User, null=True)
    comment		= ForeignKey(Comment)
    last_reminder	= DateTimeField(null=True)

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
    ctime               = DateTimeField(default=datetime.now, db_index=True)
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
    ctime               = DateTimeField(default=datetime.now, db_index=True)
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

class AnalyticsVisit(models.Model):
    source              = ForeignKey(Source)
    user                = ForeignKey(User, null=True)
    ctime               = DateTimeField(default=datetime.now)

class AnalyticsClick(models.Model):
    source              = ForeignKey(Source)
    user                = ForeignKey(User, null=True)
    ctime               = DateTimeField(default=datetime.now)
    control             = CharField(max_length=30)
    value               = CharField(max_length=30)

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
    annotated           = BooleanField(default=False)

class Notification(models.Model):
    type                = CharField(max_length=127)
    atime               = DateTimeField(null=True, default=datetime.now())

class GuestHistory(models.Model):
    """
    Records the period during which a user was a guest. t_end gets populated if the user ever converts their guest account into a regular account by registering (not using SSO).
    """
    user                = ForeignKey(User)
    t_start             = DateTimeField(null=True, default=datetime.now())
    t_end               = DateTimeField(null=True)

class GuestLoginHistory(models.Model):
    """
    Records the transition between a login as guest account and login as a exising  account. This data supplements the one in GuestHistory. i.e. for the cases where we have a transition from a guest to a existing user. Note that SSO (i.e. Google ID) users are always considered "existing" even if they weren't in the DB before (since their guest account id doesn't get recycled), so they appear here.
    """
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

class LabelCategory(models.Model):
    TYPE_USER           = 1
    TYPE_ADMIN          = 2
    TYPE_SUPERADMIN     = 3
    TYPES               = ((TYPE_USER, "USER"), (TYPE_ADMIN, "ADMIN"), (TYPE_SUPERADMIN, "SUPERADMIN"))
    TYPE_COMMENT        = 1
    TYPE_THREAD         = 2
    TYPES_SCOPE         = ((TYPE_COMMENT, "COMMENT"), (TYPE_THREAD, "THREAD"),)
    visibility          = IntegerField(choices=TYPES, default=TYPE_ADMIN)
    scope               = IntegerField(choices=TYPES_SCOPE, default=TYPE_COMMENT)
    pointscale          = IntegerField()
    name                = CharField(max_length=1024)
    ensemble            = ForeignKey(Ensemble)

class LabelCategoryCaption(models.Model):
    category       = ForeignKey(LabelCategory)
    grade               = IntegerField()
    caption             = CharField(max_length=127)

class CommentLabel(models.Model):
    """Used for finer grain grading or categorizing comments or threads"""
    grader              = ForeignKey(User)
    ctime               = DateTimeField(default=datetime.now())
    grade               = IntegerField()
    category            = ForeignKey(LabelCategory) #so we can grade different dimensions of a post.
    comment             = ForeignKey(Comment)

class CommentLabelHistory(models.Model):
    grader              = ForeignKey(User)
    ctime               = DateTimeField(default=datetime.now())
    grade               = IntegerField()
    category            = ForeignKey(LabelCategory) #so we can grade different dimensions of a post.
    comment             = ForeignKey(Comment)
