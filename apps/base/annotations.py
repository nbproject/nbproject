"""
annotations.py -  Model queries.

Author(s) cf AUTHORS.txt

License
    Copyright (c) 2010-2012 Massachusetts Institute of Technology.
    MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
"""
from django.db.models import Q, Max
from django.db.models import Count
from django.db import transaction
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
import datetime, os, re, json
import models as M
import auth
import constants as CST
import utils_response as UR #, utils_format as UF
from django.template import Template
from django.core.exceptions import ValidationError
from django.conf import settings
import shutil

#SINGLETONS:

__MARK_TRIGGERS = {
    3:5, 5:3, 7:9, 9:7
}
#typical fields we request for objects
__NAMES = {
    "location": {
         "id_ensemble": None,
        "top": "y",
        "left": "x",
        "page": None,
        "id_source": None,
        "ID": "id",
        "w": None,
        "h": None,
},
    "location2": {
        "id_ensemble": "ensemble_id",
        "top": "y",
        "left": "x",
        "page": None,
        "duration": None,
        "pause": None,
        "id_source": "source_id",
        "ID": "id",
        "w": None,
        "h": None,
	"section_id": None
},
    "location_v_comment": {
        "id_ensemble": None,
        "top": "y",
        "left": "x",
        "page": None,
        "id_source": None,
        "ID": "id_location",
        "w": None,
        "h": None,
        "body": "substring(body, 0, 95) || replace(substring(body, 95, 5), '&', '') as body",
        "big": "cast(length(body)>100 as integer) as big"
},
    "location_v_comment2":{
        "ID": "location_id",
        "id_ensemble": "location.ensemble_id",
        "top": "location.y",
        "left": "location.x",
        "page": "location.page",
        "duration": "location.duration",
        "pause": "location.pause",
        "id_source": "location.source_id",
        "w": "location.w",
        "h": "location.h",
        "body": None,
        "is_title": "location.is_title",
	"duration": "location.duration",
        "section_id": "location.section_id"
},
    "tag": {
        "ID": "id",
        "user_id": "individual_id",
        "comment_id": "comment_id"
},
       "html5location":{
        "ID": "id",
        "id_location": "location_id",
        "path1": "path1",
        "path2": "path2",
        "offset1": "offset1",
        "offset2": "offset2"
            },
    "comment": {
        "ID": "id",
        "ID_location": "id_location",
        "email": None, #replaced in __post_process_comments
        "id_parent": None,
        "id_author": None, #deleted in __post_process_comments
        "ctime": "cast(ctime as text) as ctime", #so that psycopg is not tempted to convert it to a native python format
        "body": None,
        "signed": None,
        "id_type": None,
        "n_answerplease": None,
        "n_approve": None,
        "n_reject": None,
        "n_favorite": None,
        "n_hide": None,

        "p": "preselected",
        "admin": None,
        "id_ensemble": None, #this one is redundant but deleted in __post_process_comments (after use)
},
    "comment2": {
        "ID": "id",
        "ID_location": "location_id",
        "id_parent": "parent_id",
        "id_author": "author_id",
        "ctime": None,
        "created": None,
        #"created": Template("""{{ V.ctime|notthisweek|date:"D d M Y" }}"""),
        "body": None,
        "signed": None,
        "type": None,
        "fullname": Template("{{V.author.firstname}} {{V.author.lastname}}"),
        "admin": None
},
    "location_stats": {
        "id_location": None,
        "answerplease": None,
        "approve": None,
        "reject": None,
        "favorite": None,
        "hide": None
},
    "files": {
        "ID": "id_source",
        "id": "id_source",
        "ID_ensemble": "id_ensemble",
        "id_ensemble": None,
        "id_folder": None,
        "title": None,
        "numpages": None,
        "w": "ncols",
        "h": "nrows",
        "rotation": None,
},
    "ensembles": {
         "ID": "id_ensemble",
         "id": "id_ensemble",
        "name": None,
        "admin": None,
        "description": None,
        "public": None
            },
"files2": {
        "ID": "source_id",
        "id": "source_id",
        "ID_ensemble": "ensemble_id",
        "id_ensemble": "ensemble_id",
        "id_folder": "folder_id",
        "title": "source.title",
        "numpages": "source.numpages",
        "w": "source.w",
        "h": "source.h",
        "rotation": "source.rotation",
        "assignment": None,
        "due": None,
        "filetype": "source.type",
        "date_published": "published"
},
           "ensembles2": {
                          "ID": "ensemble_id",
                          "id": "ensemble_id",
                          "name": "ensemble.name",
                          "admin": UR.Expression(False),
                          "description": "ensemble.description",
                          "allow_guest": "ensemble.allow_guest",
                          "allow_anonymous": "ensemble.allow_anonymous",
                          "allow_staffonly": "ensemble.allow_staffonly",
                          "allow_tag_private": "ensemble.allow_tag_private",
                          "use_invitekey": "ensemble.use_invitekey",
                          "default_pause": "ensemble.default_pause",
                           } ,
           "folders2":{
        "ID": "folder_id",
        "id": "folder_id",
        "id_parent": "folder.parent_id",
        "id_ensemble": "ensemble_id",
        "name": "folder.name"},
            "members":{
        "ID": "user_id",
        "id": "user_id",
        "section_id": None,
        "email": "user.email",
        "firstname": "user.firstname",
        "lastname": "user.lastname",
        "guest": "user.guest",
        "admin": None},

    "assignment_grade": {
              "id": None,
              "grade": None,
              "id_user": "user_id",
              "id_source": "source_id"},
           "threadmark":{
                         "id": None,
                         "location_id": None,
                         "user_id": None,
                         "active": None,
                         "type": None,
                         "comment_id": None
                         }
}

def get_ensembles(uid, payload):
    id = payload["id"] if "id" in payload else None
    names = {
        "ID": "ensemble_id",
        "name": "ensemble.name",
        "admin": None,
        "description": "ensemble.description",
        "allow_staffonly": "ensemble.allow_staffonly",
        "allow_anonymous": "ensemble.allow_anonymous",
        "allow_guest": "ensemble.allow_guest",
        "allow_download": "ensemble.allow_download",
        "allow_ondemand": "ensemble.allow_ondemand",
         }
    my_memberships = M.Membership.objects.select_related("ensemble").filter(user__id=uid, deleted=False)
    if id is not None:
        my_memberships = my_memberships.filter(ensemble__id=id)
    return UR.qs2dict(my_memberships, names, "ID")

def get_folders(uid, payload):
    id = payload["id"] if "id" in payload else None
    names = {
        "ID": "id",
        "id_parent": "parent_id",
        "id_ensemble": "ensemble_id",
        "name": None}
    my_memberships = M.Membership.objects.filter(user__id=uid, deleted=False)
    my_ensembles = M.Ensemble.objects.filter(membership__in=my_memberships)
    my_folders = M.Folder.objects.filter(ensemble__in=my_ensembles)
    if id is not None:
        my_folders = my_folders.filter(id=id)
    return UR.qs2dict(my_folders, names, "ID")

def get_sections(uid, payload):
    id = payload["id"] if "id" in payload else None
    names = {
        "ID": "id",
        "id_ensemble": "ensemble_id",
        "name": None}
    my_memberships = M.Membership.objects.filter(user__id=uid, deleted=False)
    my_ensembles = M.Ensemble.objects.filter(membership__in=my_memberships)
    my_sections = M.Section.objects.filter(ensemble__in=my_ensembles)
    if id is not None:
        my_sections = my_sections.filter(id=id)
    return UR.qs2dict(my_sections, names, "ID")

def get_file_stats(uid, payload):
    import db
    id_ensemble = payload["id_ensemble"]
    names = {
        "id": "source_id",
        "seen":None,
        "total": None,
        "mine": None
        }
    from_clause = """(select vc.source_id as source_id, count(vc.id) as total , sum(cast(s.comment_id is not null as integer)) as seen,  sum(cast(vc.author_id=? as integer)) as mine
from base_v_comment vc left join (select distinct comment_id from base_commentseen where user_id = ?) as s on s.comment_id=vc.id , base_membership m
where
m.user_id = ? and m.ensemble_id = vc.ensemble_id and ((vc.type>2 or ( vc.type>1 and m.admin=true)) or vc.author_id=?)
and (m.section_id is null or vc.section_id = m.section_id or vc.section_id is null)
and vc.ensemble_id=?
group by source_id) as v1"""
    return  db.Db().getIndexedObjects(names, "id", from_clause, "true" , (uid,uid, uid, uid, id_ensemble))

# Get members of an ensemble
def get_members(eid):
    memberships = M.Membership.objects.filter(ensemble__id=eid, deleted=False)
    users = {}
    for membership in memberships:
        user = M.User.objects.get(id=membership.user.id)
        user_entry = UR.model2dict(user)

        # Remove unnecessary fields
        del user_entry["guest"]
        del user_entry["confkey"]
        del user_entry["valid"]
        del user_entry["saltedhash"]
        del user_entry["salt"]
        del user_entry["password"]

        # Add section
	if membership.section == None:
            user_entry["section"] = None
        else:
            user_entry["section"] = membership.section.id

        # Add user dictionary to users
        users[user.id] = user_entry
    return users

def get_stats_ensemble(payload):
    import db
    id_ensemble = payload["id_ensemble"]
    names = {
        "ID": "record_id",
        "cnt": None,
        "numchars": None,
        "numwords": None
        }
    from_clause = """(select count(v.id) as cnt,  v.author_id || '_' || v.source_id as record_id, sum(length(c.body)) as numchars, sum(array_length(regexp_split_to_array(c.body, E'\\\\s+'), 1)) as numwords from base_v_comment v, base_comment c where v.type>1 and v.ensemble_id=? and v.id=c.id group by v.author_id, v.source_id) as v1"""
    retval={"stats":  db.Db().getIndexedObjects(names, "ID", from_clause, "true" , (id_ensemble,))}
    grades = M.AssignmentGrade.objects.filter(source__ownership__ensemble__id=id_ensemble)
    ownerships = M.Ownership.objects.select_related("source", "ensemble", "folder").filter(ensemble__id=id_ensemble, deleted=False)
    memberships = M.Membership.objects.select_related("user").filter(ensemble__id=id_ensemble, deleted=False)
    sections = M.Section.objects.filter(membership__in=memberships)
    retval["users"] =  UR.qs2dict(memberships, __NAMES["members"] , "ID")
    retval ["files"] =  UR.qs2dict(ownerships, __NAMES["files2"] , "ID")
    retval["ensembles"] = UR.qs2dict(ownerships, __NAMES["ensembles2"] , "ID")
    retval["grades"] = UR.qs2dict(grades, __NAMES["assignment_grade"], "id")
    retval["sections"] = UR.qs2dict(sections)
    return retval

def get_social_interactions(id_ensemble):
    # Generate how many times each student communicated with another student for a given group.
    import db
    names = {
        "cnt":None,
        "id": None
        }
    #for one-way a1 initiates and a2 replies.
    from_clause = """
     (select count(id) as cnt, a2||'_'||a1 as id  from (select c1.id, c1.author_id as a1, c2.author_id as a2 from base_v_comment c1, base_v_comment c2 where c2.parent_id=c1.id and c1.ensemble_id=?) as v1 group by a1, a2) as v2"""
    output = {}
    output["oneway"] = db.Db().getIndexedObjects(names, "id", from_clause, "true" , (id_ensemble,))
    #for two-way, a1 initiates, a2 replies, and a1 re-replies.
    from_clause = """
     (select count(id) as cnt, a2||'_'||a1 as id  from (select c1.id, c1.author_id as a1, c2.author_id as a2 from base_v_comment c1, base_v_comment c2, base_v_comment c3 where c3.parent_id=c2.id and c3.author_id=c1.author_id and c2.parent_id=c1.id and c1.ensemble_id=?) as v1 group by a1, a2) as v2"""
    output["twoway"] = db.Db().getIndexedObjects(names, "id", from_clause, "true" , (id_ensemble,))
    return output

def get_social_interactions_clusters(id_ensemble):
    # Generate how many times each student communicated with another student using the clusters given in that group metadata.
    import db, json
    names = {
        "cnt":None,
        "id": None
        }
    ensemble = M.Ensemble.objects.get(pk=id_ensemble)
    clusters = json.loads(ensemble.metadata)["groups"]
    output = []
    for cluster in clusters:
    #for one-way a1 initiates and a2 replies.
        from_clause = """
     (select count(id) as cnt, a2||'_'||a1 as id  from (select c1.id, c1.author_id as a1, c2.author_id as a2 from base_v_comment c1, base_v_comment c2 where c2.parent_id=c1.id and c1.ensemble_id=? and c1.source_id in (%s)) as v1 group by a1, a2) as v2""" %(",".join([str(j) for j in cluster["source"]]),)
        output.append(db.Db().getIndexedObjects(names, "id", from_clause, "true" , (id_ensemble,)))
    return output


def set_grade_assignment(uid, P):
    id_user = P["id_user"]
    id_source = P["id_source"]
    record = None
    try:
        record = M.AssignmentGrade.objects.get(user__id=id_user, source__id=id_source)
        rh = M.AssignmentGradeHistory()
        rh.user_id = record.user_id
        rh.grade = record.grade
        rh.source_id = record.source_id
        rh.grader = record.grader
        rh.ctime = record.ctime
        rh.save()
        record.ctime = datetime.datetime.now()
    except M.AssignmentGrade.DoesNotExist:
        record = M.AssignmentGrade()
        record.user_id = id_user
        record.source_id = id_source
    record.grade = P["grade"]
    record.grader_id = uid
    record.save()
    return UR.model2dict(record, __NAMES["assignment_grade"], "id")


def get_guestfileinfo(id_source):
    ownership = M.Ownership.objects.select_related("source", "ensemble", "folder").filter(source__id=id_source, deleted=False)
    o = {
         "files": UR.qs2dict(ownership, __NAMES["files2"] , "ID"),
         "ensembles": UR.qs2dict(ownership, __NAMES["ensembles2"] , "ID") ,
         "folders": UR.qs2dict(ownership, __NAMES["folders2"] , "ID") ,
         }
    if len(ownership)==1:
        if ownership[0].source.type == M.Source.TYPE_YOUTUBE:
            o["youtubeinfos"]= UR.model2dict(ownership[0].source.youtubeinfo, None, "id")
    return o

def get_files(uid, payload):
    id = payload["id"] if "id" in payload else None
    names = __NAMES["files2"]
    my_memberships = M.Membership.objects.filter(user__id=uid,  deleted=False)
    my_ensembles = M.Ensemble.objects.filter(membership__in=my_memberships)
    my_ownerships = M.Ownership.objects.select_related("source").filter(ensemble__in=my_ensembles, deleted=False)
    return UR.qs2dict(my_ownerships, names, "ID")

def save_settings(uid, payload):
    #print "save settings w/ payload %s" % (payload, )
    for k in [k for k in payload if k!="__PASSWD__"]:
        ds = M.DefaultSetting.objects.get(name=k)
        m = M.UserSetting.objects.filter(user__id=uid, setting__id=ds.id)
        if len(m)==0:
            m = M.UserSetting(user_id=uid, setting_id=ds.id)
        else:
            m = m[0]
        m.value = payload[k]
        m.ctime = datetime.datetime.now()
        m.save()
        #DB().doTransaction("update nb2_user_settings set valid=0 where id_user=? and name=?", (uid, k))
        #DB().doTransaction("insert into nb2_user_settings(id_user, name, value) values (?, ?, ?)", (uid, k, payload[k]))
    if "__PASSWD__" in payload:
        password = payload["__PASSWD__"]
        u = M.User.objects.get(pk=uid)
        u.set_password(password)
        u.save()
    return get_settings(uid, {})

def get_settings(uid, payload):
    ds = M.DefaultSetting.objects.all()
    us = M.UserSetting.objects.filter(user__id=uid)
    sl = M.SettingLabel.objects.all()
    retval =  {"ds": UR.qs2dict(ds), "us":UR.qs2dict(us), "sl":UR.qs2dict(sl)}
    return retval

def getLocation(id):
    """Returns an "enriched" location"""
    o = M.Comment.objects.select_related("location").filter(location__id=id, parent__id=None, deleted=False)
    loc_dict = UR.qs2dict(o, __NAMES["location_v_comment2"], "ID")
    h5l = None
    try:
        h5l = o[0].location.html5location if len(o) else None
    except M.HTML5Location.DoesNotExist:
        pass
    h5l_dict = UR.model2dict(h5l, __NAMES["html5location"], "ID") if h5l else None
    return (loc_dict, h5l_dict)

def getTopCommentsFromLocations(location_ids):
    comments = {}
    for loc_id in location_ids:
        loc_comments = M.Comment.objects.filter(location_id=loc_id)
        if loc_comments.count() > 0:
            comments[loc_id] = {"replies": loc_comments.count(), "head_body": loc_comments[0].body}
            # TODO: use .first() for above instead of [0] once we update to 1.6

    return comments

def getAdvancedFilteredLocationsByFile(id_source, n, r, filterType):
    source_locations = M.Location.objects.filter(source__id=id_source).annotate(reply=Count('comment')).filter(reply__gt=0)

    if filterType == "reply":
        filter_locations=source_locations.order_by('-reply')
    elif filterType == "students":
        filter_locations=source_locations.annotate(students=Count('comment__author',distinct=True)).order_by('-students')
    elif filterType == "longest":
        return {}
        #TODO: fix
        #filter_locations=source_locations.annotate(body=Q(comment__parent=None)).extra(select={'length':'Length(body)'}).order_by('-length')
    elif filterType == "random":
        filter_locations=source_locations.order_by('?')

    if r == "threads":
        filter_locations = filter_locations[:n]
    else:
        nTotal = len(source_locations)
        filter_locations = filter_locations[:nTotal * n / 100]

    retval = {}
    for loc in filter_locations:
        retval[loc.id] = loc.id

    return retval

def getComment(id, uid):
    names = __NAMES["comment2"]
    comment = M.Comment.objects.select_related("location", "author").extra(select={"admin": 'select cast(admin as integer) from base_membership, base_location where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id and base_location.id=base_comment.location_id'}).get(pk=id)
    return UR.model2dict(comment, names, "ID")

def getTagsByComment(comment_id):
    tags = M.Tag.objects.filter(comment__id=comment_id)
    return UR.qs2dict(tags, __NAMES["tag"], "ID")

# Returns a QuerySet of Locations in a thread that the user is tagged somewhere in
def getLocationsTaggedIn(uid):
    tags = M.Tag.objects.filter(individual__id=uid)
    comments = M.Comment.objects.filter(id__in=tags.values_list("comment_id"))
    loc_set = {}
    for comment in comments:
        loc_set[comment.location.id] = None
    return M.Location.objects.filter(id__in=loc_set.keys())

def getCommentsByFile(id_source, uid, after):
    names_location = __NAMES["location_v_comment2"]
    names_comment = __NAMES["comment2"]
    ensembles_im_admin = M.Ensemble.objects.filter(membership__in=M.Membership.objects.filter(user__id=uid).filter(admin=True))
    locations_im_admin = M.Location.objects.filter(ensemble__in=ensembles_im_admin)
    comments = M.Comment.objects.extra(select={"admin": 'select cast(admin as integer) from base_membership where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id'}).select_related("location", "author").filter(location__source__id=id_source, deleted=False, moderated=False).filter(Q(location__in=locations_im_admin, type__gt=1) | Q(author__id=uid) | Q(type__gt=2))
    membership = M.Membership.objects.filter(user__id=uid, ensemble__ownership__source__id=id_source, deleted=False)[0]
    if membership.section is not None:
        seen = M.CommentSeen.objects.filter(comment__location__source__id=id_source, user__id=uid)
        #idea: we let you see comments
        # - that are in your current section
        # - that aren't in any section
        # - that you've seen before
        # - that you've authored.
        comments = comments.filter(Q(location__section=membership.section)|
                                   Q(location__section=None)|
                                   Q(location__comment__in=seen.values_list("comment_id"))|
                                   Q(author__id=uid))
    threadmarks = M.ThreadMark.objects.filter(location__in=comments.values_list("location_id"))
    if after is not None:
        comments = comments.filter(ctime__gt=after)
        threadmarks = threadmarks.filter(ctime__gt=after)

    # Filter out private tags that aren't yours
    #comments_tagged_in = M.Tag.objects.filter(individual__id=uid).values_list("comment_id")
    locations_tagged_in = getLocationsTaggedIn(uid)
    comments = comments.filter(Q(author__id=uid) | ~Q(type__in=[4]) | Q(location__in=locations_tagged_in))

    # Get Tags
    tags = M.Tag.objects.filter(comment__in=comments)

    html5locations = M.HTML5Location.objects.filter(location__comment__in=comments)
    locations_dict = UR.qs2dict(comments, names_location, "ID")
    comments_dict =  UR.qs2dict(comments, names_comment, "ID")
    html5locations_dict = UR.qs2dict(html5locations, __NAMES["html5location"], "ID")
    threadmarks_dict = UR.qs2dict(threadmarks, __NAMES["threadmark"], "id")
    tag_dict = UR.qs2dict(tags, __NAMES["tag"], "ID")
    #Anonymous comments
    ensembles_im_admin_ids = [o.id for o in ensembles_im_admin]
    for k,c in comments_dict.iteritems():
        if not c["signed"] and not (locations_dict[c["ID_location"]]["id_ensemble"] in  ensembles_im_admin_ids or uid==c["id_author"]):
            c["fullname"]="Anonymous"
            c["id_author"]=0
    return locations_dict, html5locations_dict, comments_dict, threadmarks_dict, tag_dict

def get_comments_collection(uid, P):
    output = {}
    comments_refs = M.Comment.objects.filter(id__in=P["comments"], deleted=False, moderated=False)
    locations= M.Location.objects.filter(comment__in=comments_refs)
    html5locations = M.HTML5Location.objects.filter(location__in=locations)
    locations_im_admin = locations.filter(ensemble__in= M.Ensemble.objects.filter(membership__in=M.Membership.objects.filter(user__id=uid).filter(admin=True)))
    comments =  M.Comment.objects.extra(select={"admin": 'select cast(admin as integer) from base_membership,  base_location where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id and base_location.id = base_comment.location_id'}).select_related("location", "author").filter(deleted=False, moderated=False, location__in=locations).filter(Q(location__in=locations_im_admin, type__gt=1) | Q(author__id=uid) | Q(type__gt=2))
    ensembles = M.Ensemble.objects.filter(location__in=locations)
    files = M.Source.objects.filter(location__in=locations)
    ownerships = M.Ownership.objects.select_related("source", "ensemble", "folder").filter(source__in=files, ensemble__in=ensembles)
    seen = M.CommentSeen.objects.select_related("comment").filter(comment__in=comments).filter(user__id=uid)
    output["ensembles"]=UR.qs2dict(ownerships, __NAMES["ensembles2"] , "ID")
    output["files"]=UR.qs2dict(ownerships, __NAMES["files2"] , "ID")
    output["folders"]=UR.qs2dict(ownerships, __NAMES["folders2"] , "ID")
    output["locations"] = UR.qs2dict( comments, __NAMES["location_v_comment2"], "ID")
    output["html5locations"] = UR.qs2dict( html5locations, __NAMES["html5locations"], "ID")
    comments_dict =  UR.qs2dict( comments, __NAMES["comment2"] , "ID")
    #Anonymous comments
    for k,c in comments_dict.iteritems():
        if c["type"] < 3:
            c["fullname"]="Anonymous"
            c["id_author"]=0
    output["comments"] = comments_dict
    output["seen"] = UR.qs2dict(seen, {"id": None, "id_location": "comment.location_id"}, "id")
    return output

def get_comments_auth(uid, P):
    output = {}
    id_ensemble = False
    id_source = False
    if "id_ensemble" in P:
        id_ensemble = P["id_ensemble"]
    if "id_source" in P:
        id_source = P["id_source"]
    comments_authored = M.Comment.objects.filter(author__id=uid, deleted=False, moderated=False)
    if id_ensemble:
        comments_authored = comments_authored.filter(location__ensemble__id=id_ensemble)
    if id_source:
        comments_authored = comments_authored.filter(location__source__id=id_source)
    locations= M.Location.objects.filter(comment__in=comments_authored)
    locations_im_admin = locations.filter(ensemble__in= M.Ensemble.objects.filter(membership__in=M.Membership.objects.filter(user__id=uid).filter(admin=True)))
    comments =  M.Comment.objects.extra(select={"admin": 'select cast(admin as integer) from base_membership,  base_location where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id and base_location.id = base_comment.location_id'}).select_related("location", "author").filter(deleted=False, moderated=False, location__in=locations).filter(Q(location__in=locations_im_admin, type__gt=1) | Q(author__id=uid) | Q(type__gt=2))
    ensembles = M.Ensemble.objects.filter(location__in=locations)
    files = M.Source.objects.filter(location__in=locations)
    ownerships = M.Ownership.objects.select_related("source", "ensemble", "folder").filter(source__in=files, ensemble__in=ensembles)
    seen = M.CommentSeen.objects.select_related("comment").filter(comment__in=comments).filter(user__id=uid)
    sequence = comments_authored.values_list('id', flat=True).order_by('-id')
    output["ensembles"]=UR.qs2dict(ownerships, __NAMES["ensembles2"] , "ID")
    output["files"]=UR.qs2dict(ownerships, __NAMES["files2"] , "ID")
    output["folders"]=UR.qs2dict(ownerships, __NAMES["folders2"] , "ID")
    output["locations"] = UR.qs2dict( comments, __NAMES["location_v_comment2"], "ID")
    comments_dict =  UR.qs2dict( comments, __NAMES["comment2"] , "ID")
    #Anonymous comments
    for k,c in comments_dict.iteritems():
        if c["type"] < 3:
            c["fullname"]="Anonymous"
            c["id_author"]=0
    output["comments"] = comments_dict
    output["seen"] = UR.qs2dict(seen, {"id": None, "id_location": "comment.location_id"}, "id")
    description =  "My Notes "
    if id_ensemble and ownerships.count():
        description += "on %s " % (ownerships[0].ensemble.name,)
    if id_source and ownerships.count():
        description += "on %s " % (ownerships[0].source.title,)
    description += "(%s comments)" % (comments_authored.count(),)
    output["sequence"] = {"type": "comment", "data": list(sequence), "description": description}
    return output


def get_comments_auth_admin(uid, P):
    output = {}
    id_ensemble = P.get("id_ensemble", False)
    id_source   = P.get("id_source", False)
    id_author   = P.get("id_author", False)
    unread      = P.get("unread", False)

    locations_im_admin = M.Location.objects.filter(ensemble__in= M.Ensemble.objects.filter(membership__in=M.Membership.objects.filter(user__id=uid).filter(admin=True)))
    if id_author:
        locations_im_admin = locations_im_admin.filter(id__in=M.Location.objects.filter(comment__in=M.Comment.objects.filter(author__id=id_author, deleted=False, moderated=False)))
    if id_ensemble:
        locations_im_admin=locations_im_admin.filter(ensemble__id=id_ensemble)
    if id_source:
        locations_im_admin=locations_im_admin.filter(source__id=id_source)

    comments =  M.Comment.objects.extra(select={"admin": 'select max(cast(admin as integer)) from base_membership,  base_location where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id and base_location.id = base_comment.location_id'}).select_related("location", "author").filter(deleted=False, moderated=False, location__in=locations_im_admin).filter(Q(type__gt=1) | Q(author__id=uid))
    seen = M.CommentSeen.objects.select_related("comment").filter(comment__in=comments).filter(user__id=uid)
    if unread:
        comments_unread = comments.exclude(commentseen__in=seen)
        locations_im_admin = locations_im_admin.filter(comment__in=comments_unread)
        comments =  M.Comment.objects.extra(select={"admin": 'select max(cast(admin as integer)) from base_membership,  base_location where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id and base_location.id = base_comment.location_id'}).select_related("location", "author").filter(deleted=False, moderated=False, location__in=locations_im_admin).filter(Q(type__gt=1) | Q(author__id=uid))
        seen = M.CommentSeen.objects.select_related("comment").filter(comment__in=comments).filter(user__id=uid)
    ensembles = M.Ensemble.objects.filter(location__in=locations_im_admin)
    files = M.Source.objects.filter(location__in=locations_im_admin)
    ownerships = M.Ownership.objects.select_related("source", "ensemble", "folder").filter(source__in=files, ensemble__in=ensembles)
    sequence = comments.values_list('id', flat=True).order_by('-id')
    output["ensembles"]=UR.qs2dict(ownerships, __NAMES["ensembles2"] , "ID")
    output["files"]=UR.qs2dict(ownerships, __NAMES["files2"] , "ID")
    output["folders"]=UR.qs2dict(ownerships, __NAMES["folders2"] , "ID")
    output["locations"] = UR.qs2dict( comments, __NAMES["location_v_comment2"], "ID")
    output["comments"] =  UR.qs2dict( comments, __NAMES["comment2"] , "ID")
    output["seen"] = UR.qs2dict(seen, {"id": None, "id_location": "comment.location_id"}, "id")
    description =  "Notes "
    if id_author:
       author = M.User.objects.get(pk=id_author)
       description += "from %s %s " % (author.firstname, author.lastname)
    if id_ensemble and ownerships.count():
       description += "on %s " % (ownerships[0].ensemble.name,)
    if id_source and ownerships.count():
       description += "on %s " % (ownerships[0].source.title,)
    if unread:
        description = "Unread "+description
    description += "(%s comments)" % (comments.count(),)
    output["sequence"] = {"type": "comment", "data": list(sequence), "description": description}
    return output



def getPublicCommentsByFile(id_source):
    names_location = __NAMES["location_v_comment2"]
    names_comment = __NAMES["comment2"]
    comments = M.Comment.objects.extra(select={"admin": 'select cast(admin as integer) from base_membership where base_membership.user_id=base_comment.author_id and base_membership.ensemble_id = base_location.ensemble_id'}).select_related("location", "author").filter(location__source__id=id_source, deleted=False, moderated=False, type__gt=2)
    locations_dict = UR.qs2dict(comments, names_location, "ID")
    comments_dict =  UR.qs2dict(comments, names_comment, "ID")
    #Anonymous comments
    for k,c in comments_dict.iteritems():
        if c["type"] < 3:
            c["fullname"]="Anonymous"
            c["id_author"]=0
    return locations_dict, comments_dict



def getSeenByFile(id_source, uid):
    names = {"id": "comment.id", "id_location": "comment.location_id"}
    locations = M.Location.objects.filter(source__id=id_source)
    comments = M.Comment.objects.filter(location__in=locations)
    seen = M.CommentSeen.objects.select_related("comment").filter(comment__in=comments).filter(user__id=uid)
    return UR.qs2dict(seen, names, "id")

def markThread(uid, payload):
    mtype = int(payload["type"])
    lid  = int(payload["id_location"])
    #comment_id = None if "comment_id" not in payload or payload["comment_id"] is None else int(payload["comment_id"])
    comment_id = int(payload["comment_id"])
    mark = M.ThreadMark.objects.filter(user__id=uid, type=mtype, location__id=lid, active=True)
    if mark.count()>0: # only allow one active threadmark of a given type per thread
        mark = mark[0]
        mh = M.ThreadMarkHistory()
        mh.active = mark.active
        mh.comment_id = mark.comment_id
        mh.ctime = mark.ctime
        mh.location_id = mark.location_id
        mh.user_id = mark.user_id
        mh.type = mark.type
        mh.save()
        mark.ctime = datetime.datetime.now()
        active_default = True
        if comment_id != mark.comment_id:
            #there was a real change of comment_id: don't update active default value
            active_default = mark.active
        else: #then probably just a toggle
            active_default = not mark.active
        mark.comment_id = comment_id
        mark.active =  payload["active"] if "active" in payload else active_default # if no arg given, toggle
    else:
        mark = M.ThreadMark()
        mark.user_id = uid
        mark.location_id = lid
        mark.comment_id = comment_id
        mark.type = mtype
        mark.active = payload["active"] if "active" in payload else True
    mark.save()
    return UR.model2dict(mark)

def getMark(uid, payload):
    names = {
        "ID": "id",
        "type": None,
        }
    comment = M.Comment.objects.get(pk=int(payload["id_comment"]))
    user = M.User.objects.get(pk=uid)
    o = M.Mark.objects.filter(comment=comment, user=user)
    return UR.qs2dict(o, names, "ID")
    #return DB().getIndexedObjects(names, "ID", "nb2_v_mark3", "id=? and id_user=?", (int(payload["id_comment"]),uid));

def instantTagReminder(comment, recipient):
    # Email Data
    subject = "You were tagged in a new note on NB!"
    V = {"reply_to": settings.SMTP_REPLY_TO, "protocol": settings.PROTOCOL, "hostname":  settings.HOSTNAME}

    # Send Email
    default_setting = M.DefaultSetting.objects.get(name="email_confirmation_tags")
    try:
        user_setting = M.UserSetting.objects.get(setting=default_setting, user=recipient)
    except M.UserSetting.DoesNotExist:
        user_setting = default_setting
    if user_setting.value > 0:
        context = {"V": V, "comment": comment, "recipient": recipient}
        msg = render_to_string("email/msg_instant_tag_reminder", context)
        email = EmailMessage(subject, msg, settings.EMAIL_FROM, (recipient.email,), (settings.EMAIL_BCC,))
        email.send(fail_silently=True)

def addNote(payload):
    id_location = None
    author =  M.User.objects.get(pk=payload["id_author"])
    location = None
    h5l = None
    parent =  M.Comment.objects.get(pk=payload["id_parent"]) if "id_parent" in payload else None
    #putting this in factor for duplicate detection:
    similar_comments = M.Comment.objects.filter(parent=parent, ctime__gt=datetime.datetime.now()-datetime.timedelta(0,10,0), author=author, body=payload["body"]);

    #do we need to insert a location ?
    if "id_location" in payload:
        location = M.Location.objects.get(pk=payload["id_location"])
        #refuse if similar comment
        similar_comments = similar_comments.filter(location=location)
        if similar_comments.count():
            return []
    else:
        location = M.Location()
        location.source = M.Source.objects.get(pk=payload["id_source"])
        location.ensemble = M.Ensemble.objects.get(pk=payload["id_ensemble"])
        location.y = payload["top"]
        location.x = payload["left"]
        location.w = payload["w"]
        location.h = payload["h"]
        location.page = payload["page"]
	# Duration for YouTube comments
    	if "duration" in payload:
    		location.duration = payload["duration"]
        if "pause" in payload and auth.canPauseComment(author.id, location.source.id):
            location.pause = payload["pause"]
        if "title" in payload:
            location.is_title = payload["title"] == 1
        location.section = M.Membership.objects.get(user=author, ensemble=location.ensemble, deleted=False).section

        #refuse if similar comment
        similar_comments = similar_comments.filter(location__in=M.Location.objects.filter(source=location.source, ensemble=location.ensemble, y=location.y, x=location.x, w=location.w, h=location.h, page=location.page));
        if similar_comments.count():
            return []

        location.save()
        #do we need to add an html5 location ?
        if "html5range" in payload:
                h5range = payload["html5range"]
                h5l = M.HTML5Location()
                h5l.path1 =   h5range["path1"]
                h5l.path2 =   str(h5range["path2"])
                h5l.offset1 = h5range["offset1"]
                h5l.offset2 = h5range["offset2"]
                h5l.location = location
                h5l.save()

    # Should we import this comment from somewhere?
    body = payload["body"]
    matchObj = re.match( r'@import\((\d+), *(.*)\)', body)

    if (matchObj):
        from_loc_id = int(matchObj.group(1))
        import_type = matchObj.group(2)

        # Am I allowed to do this? Am I an admin in the source?
        src_membership = M.Location.objects.get(pk=from_loc_id).ensemble.membership_set.filter(user=author,admin=True)
        if src_membership.count() > 0:
            return importAnnotation(import_type, from_loc_id, location)
        else:
            return []
    else:
        comment = M.Comment()
        comment.parent = parent
        comment.location = location
        comment.author = author
        comment.body = payload["body"]
        comment.type = payload["type"]
        comment.signed = payload["signed"] == 1
        comment.save()

        # Add any tags
        if "tags" in payload:
            new_tags = payload["tags"]
            for tag_id in new_tags:
                tagged_user = M.User.objects.get(pk=tag_id)

                tag = M.Tag()
                tag.type = 1
                tag.comment = comment
                tag.individual = tagged_user
                tag.save()

                instantTagReminder(comment, tagged_user)

        return [comment]

def setLocationSection(id_location, id_section):
    location = M.Location.objects.get(pk = id_location)
    if id_section:
        location.section = M.Section.objects.get(pk = id_section)
    else:
        location.section = None
    location.save()
    return location

def promoteLocationByCopy(id_location):
    location = M.Location.objects.get(pk = id_location)
    html5locations = M.HTML5Location.objects.filter(location = location)
    html5location = None

    if html5locations.exists():
        html5location = html5locations[0]

    if location.section == None:
        return { "status": "Already promoted" }

    # Get List of All Sections Except for mine
    sections = M.Section.objects.filter(ensemble=location.ensemble).exclude(pk=location.section.pk)
    top_comment = M.Comment.objects.get(location = location, parent__isnull = True)

    # Resulting Lists
    new_locs = []
    new_comments = []

    for section in sections:
        location.pk = None # prepare to make a new copy of location
        top_comment.pk = None # prepare to make a new copy of the top comment

        location.section = section

        location.save()

        # Create a Fresh HTML5Location for each location
        if html5location:
            html5location.pk = None
            html5location.location = location
            html5location.save()

        top_comment.location = location
        top_comment.signed = False
        top_comment.save()

        new_locs.append(location.pk)
        new_comments.append(top_comment.pk)
    return new_locs, new_comments

def importAnnotation(import_type, from_loc_id, target_location):

    # Now, import body text of the comment
    comment = M.Comment.objects.get(location = from_loc_id, parent__isnull = True)
    importPk = comment.pk
    comment.pk = None
    comment.location = target_location
    comment.signed = False
    comment.save()

    oldToNew = {}

    toReturn = [comment]

    # If we need to import the whole thread, do that
    if import_type == "all":
        oldToNew[importPk] = comment.pk
        toVisit = [ importPk ]

        while len(toVisit) > 0:
            visiting = toVisit.pop()
            comments = M.Comment.objects.filter(location = from_loc_id, parent = visiting)
            for c in comments:
                toVisit.append(c.pk)
                oldPk = c.pk
                c.pk = None
                c.location = target_location
                c.signed = False
                c.parent = M.Comment.objects.get(pk = oldToNew[visiting])
                c.save()
                oldToNew[oldPk] = c.pk
                toReturn.append(c)
    return toReturn

def bulkImportAnnotations(from_source_id, to_source_id, locs_array, import_type):

    from_source = M.Source.objects.get(pk=from_source_id)
    to_source = M.Source.objects.get(pk=to_source_id)

    for id_location in locs_array:
        location = M.Location.objects.get(pk=id_location)
        html5locations = M.HTML5Location.objects.filter(location=location)

        if location.source_id != from_source.pk:
            return { "status": "Source File Mismatch locsrc: %s, src %s"%(location.source_id,from_source_id) }

        # Copy Location and update the source
        location.pk = None
        location.source_id = to_source_id
        location.save()

        if html5locations.exists():
            html5location = html5locations[0]
            html5location.pk = None
            html5location.location = location
            html5location.save()

        # Arguments:                   old loc id  target loc
        importAnnotation( import_type, id_location, location)

    return {"status": "Success" }

def editNote(payload):
    id_type = payload["type"]
    comment_id = payload["id_comment"]
    comment = M.Comment.objects.get(pk=comment_id)
    comment.body = payload["body"]
    comment.type = id_type
    comment.signed = payload["signed"]
    comment.save()

    retval = None
    # Edit time and duration if they are in payload
    if ("page" in payload) and ("duration" in payload):
        comment.location.page = payload["page"]
        comment.location.duration = payload["duration"]
        comment.location.save()
        retval = comment.location
    # Edit whether to pause on comment if in payload
    if ("pause" in payload):
        comment.location.pause = payload["pause"]
        comment.location.save()

    # Edit Tags if they are in payload
    if "tags" in payload:
        tagset = payload["tags"]
        comment_tags = M.Tag.objects.filter(comment__id=comment_id)
        # If user in tagset and not yet tagged, add tag
        for user_id in tagset:
            try:
                # If no exception, the tag is already there
                tag = comment_tags.get(individual__id=user_id)
            except M.Tag.DoesNotExist:
                # Tag in tagset but not database, add to database
                tagged_user = M.User.objects.get(pk=user_id)
                tag = M.Tag()
                tag.type = 1
                tag.comment = comment
                tag.individual = tagged_user
                tag.save()
                instantTagReminder(comment, tagged_user)
        # If tag exists on this comment and not in tagset, delete it
        deleted_tags = comment_tags.exclude(individual__id__in=tagset)
        deleted_tags.delete()

    if not retval == None:
        retval = UR.model2dict(retval, __NAMES["location2"], "ID")
        for loc_id in retval:
            retval = retval[loc_id]
            break
        retval["body"] = M.Comment.objects.get(location__id=loc_id, parent=None).body

    return retval

def deleteNote(payload):
    id = int(payload["id_comment"])
    comment = M.Comment.objects.get(pk=id)
    comment.deleted = True
    comment.save()

def deleteThread(payload):
    comments = M.Comment.objects.filter(location__id = payload["id_location"])
    comments.delete()
    location = M.Location.objects.get(pk=payload["id_location"])
    location.delete()

def approveNote(uid, payload):
    value = int(payload["value"])
    id_comment = int(payload["id_comment"])
    DB().doTransaction("update nb2_comment set preselected=? where id=?", (value, id_comment))

def delete_file(uid, P):
    id = P["id"]
    if P["item_type"]=="file":
        o = M.Ownership.objects.get(source__id=id)
        o.deleted = True
        o.save()
        return id
    else: #folder
        folder =  M.Folder.objects.get(pk=id)
        M.Ownership.objects.filter(folder__id=id).update(folder=None)
        folder.delete()
        return id

def create_ensemble(uid, P): #name, description, uid, allow_staffonly, allow_anonymous, ):
    import random, string
    ensemble = M.Ensemble(name=P["name"], description=P["description"])
    if "allow_staffonly" in P:
        ensemble.allow_staffonly = P["allow_staffonly"]
    if "allow_anonymous" in P:
        ensemble.allow_anonymous = P["allow_anonymous"]
    if "allow_guest" in P:
        ensemble.allow_guest = P["allow_guest"]
    if "use_invitekey" in P:
        ensemble.use_invitekey = P["use_invitekey"]
    if "allow_download" in P:
        ensemble.allow_download = P["allow_download"]
    if "allow_ondemand" in P:
        ensemble.allow_ondemand = P["allow_ondemand"]
    if "default_pause" in P:
        ensemble.default_pause = P["default_pause"]
    ensemble.invitekey =  "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,50)])
    ensemble.save()
    id = ensemble.pk
    membership = M.Membership(ensemble_id=id, user_id=uid, admin=1)
    membership.save()
    return id

def createSourceID():
    o = M.Source()
    o.save()
    return o.id

def create_folder(id_ensemble, id_parent, name):
    folder = M.Folder(parent_id=id_parent, ensemble_id=id_ensemble, name=name)
    folder.save()
    return folder.pk

def rename_file(uid, P):
    if P["item_type"]=="file":
        source = M.Source.objects.get(pk=P['id'])
        source.title = P["title"]
        source.save()
        return get_files(uid, {"id":  P["id"]})
    else:
        folder = M.Folder.objects.get(pk=P["id"])
        folder.name = P["title"]
        folder.save()
        return get_folders(uid,  {"id":  P["id"]})

def edit_assignment(uid, P):
    source = M.Source.objects.get(pk=P['id'])
    ownership = M.Ownership.objects.get(source=source)
    ownership.assignment = P["assignment"]
    ownership.due = datetime.datetime.strptime(P["due"], '%Y-%m-%d %H:%M')
    ownership.save()
    return get_files(uid, {"id":  P["id"]})



def move_file(uid, P):
    id = P["id"]
    if P["item_type"]=="file":
        o = M.Ownership.objects.get(source__id=id)
        o.folder_id = P["dest"]
        o.save()
        return get_files(uid, {"id": id})
    else:
        o = M.Folder.objects.get(pk=id)
        o.parent_id = P["dest"]
        o.save()
        return get_folders(uid, {"id": id})

def copy_file(uid, P):
    new_source = M.Source.objects.get(pk=P["source_id"])
    new_source.title = P["target_name"]
    new_source.pk = None
    new_source.submittedby_id = uid
    new_source.save()

    new_ownership = M.Ownership.objects.get(source__id=P["source_id"])
    new_ownership.pk = None
    new_ownership.source = new_source
    new_ownership.published = datetime.datetime.now()
    new_ownership.deleted = False
    # new_ownership.due = None

    if P["target_type"] == "ensemble":
        new_ownership.ensemble_id = P["target_id"]
        new_ownership.folder = None
    else: # target type is folder, we know for sure since it was validated before
        folder = M.Folder.objects.get(pk=P["target_id"])
        new_ownership.folder = folder
        new_ownership.ensemble = folder.ensemble

    new_ownership.save()

    if new_source.type == 1: # ondemand pdf
        try:
            new_ondemand = M.OnDemandInfo.objects.get(source__pk=P["source_id"])
            new_ondemand.pk = None
            new_ondemand.ensemble = new_ownership.ensemble
            new_ondemand.source = new_source
            new_ondemand.save()
        except M.OnDemandInfo.DoesNotExist:
            pass
        pdf_dir =  "%s/%s" % (settings.HTTPD_MEDIA, settings.REPOSITORY_DIR)
        old_file = "%s/%s" % (pdf_dir, P["source_id"])
        new_file = "%s/%s" % (pdf_dir, new_source.pk)
        shutil.copyfile(old_file, new_file)

    elif new_source.type == 2: # youtube
        new_youtube = M.YoutubeInfo.objects.get(source__pk=P["source_id"])
        new_youtube.pk = None
        new_youtube.source = new_source
        new_youtube.save()
    elif new_source.type == 3: # html5 video
        pass
    elif new_source.type == 4: # html5
        new_html5 = M.HTML5Info.objects.get(source__pk=P["source_id"])
        new_html5.pk = None
        new_html5.source = new_source
        new_html5.save()

    return new_source.pk


def createSource(uid, payload):
    """
    if id_source in payload, use that id, provided no record already exists, if not use new id
    returns the id
    """
    source = None
    url = payload["url"]
    page = parsePage(url)
    if "id_source" in payload:
        id = payload["id_source"]
        source = M.Source.objects.get(pk=id)
        if source is not None and source.numpages!=0:
            assert False, "already a source w/ id=%s !!!" % (id,)
            return None
        else:
            source.submittedby_id = uid
    else:
        source = M.Source(submittedby_id=uid)
    source.title = page["path"][1:]
    id = source.save() # Django's default behavior is auto-commit
    return id

def parsePage(s):
    s = s.strip()
    #print "parsing <%s>" % (s,)
    port = ""
    path = "/"
    query = ""
    r = re.compile('(\w*)://([^/]*)[/]?(.*)')
    m1 = r.match(s)
    scheme = m1.group(1)
    dn_and_port = m1.group(2)
    path_and_query = m1.group(3)
    #print "m1 parsed: %s", (m1.groups(),)
    #get port if any:
    r = re.compile('([^:]*):([\d]*)')
    m2 = r.match(dn_and_port)
    if m2 is None:
        dn = dn_and_port
    else:
        dn = m2.group(1)
        port = m2.group(2)
    if path_and_query is not "":    #need to get path and query from dn
        r = re.compile('([^\?]*)\?(.*)')
        m3 = r.match(path_and_query)
        if m3 is not None:
            #print "m3 parsed: %s", (m3.groups(),)
            path += m3.group(1)
            query = m3.group(2)
        else:
            path += path_and_query
    page = {}
    page["scheme"] = scheme
    page["dn"] = dn
    page["port"] = port
    page["path"] = path
    page["query"] = query
    #print "here's the page I've parsed: %s" % (page,)
    return page

def addOwnership(id_source, id_ensemble, id_folder=None):
    ownership = M.Ownership()
    ownership.source_id = id_source
    ownership.ensemble_id = id_ensemble
    if id_folder is not None:
        ownership.folder_id = id_folder
    ownership.save()
    return ownership

def markIdle(uid, id_session, o):
    for id in o:
        t1= datetime.datetime.fromtimestamp(long(id)/1000)
        t2= datetime.datetime.fromtimestamp(o[id]/1000)
        x = M.Idle(session_id=id_session, t1=t1, t2=t2)
        x.save()

def markCommentSeen(uid, id_session, o):
    for id in o:
        try:
            comment_id = int(id)
            x = M.CommentSeen(user_id=uid, session_id=id_session, comment_id=comment_id, ctime=datetime.datetime.fromtimestamp((o[id]+0.0)/1000))
            x.save()
        except ValueError:
            pass

def markPageSeen(uid, id_session, o):
    for id in o:
        page, id_source, junk = id.split("|")
        x = M.PageSeen(user_id=uid, session_id=id_session, source_id=id_source, page=page, ctime=datetime.datetime.fromtimestamp((o[id]+0.0)/1000))
        x.save()

def getFilename(id_source):
    return M.Source.objects.get(pk=id_source)

def register_session(uid, p):
    o = M.Session(user_id=uid, ctime=p["ctime"], ip=p["ip"])
    o.save()

def register_user(uid, P):
    import random, string
    #we need to change confkey, so that the access from the confkey that user had gotten as guest can't work anymore.
    new_confkey = "".join([ random.choice(string.ascii_letters+string.digits) for i in xrange(0,20)])
    u = M.User.objects.get(pk=uid)
    u.firstname = P["firstname"]
    u.lastname = P["lastname"]
    u.confkey = new_confkey
    u.email =  P["email"]
    u.set_password(P["password"])
    u.guest = False
    u.save()
    gh = M.GuestHistory.objects.get(user=u)
    gh.t_end = datetime.datetime.now()
    gh.save()
    return new_confkey


def page_served(uid, p):
    o = M.Landing(user_id=uid, ip=p["ip"], referer=p["referer"], path=p["path"], client=p["client"])
    o.save()

def markActivity(cid):
    if cid=="0" or cid=="1":
        return None, None #temporary fix
    try:
        session = M.Session.objects.filter(ctime=cid)[0]
        previous_activity = session.lastactivity
        session.lastactivity = datetime.datetime.now()
        session.save()
        return session, previous_activity
    except (M.Session.DoesNotExist, ValidationError, IndexError):
        pass
    return None, None

def getPending(uid, payload):
    #reply requested threadmarks:
    questions = M.ThreadMark.objects.filter(location__ensemble__membership__user__id=uid, type=1, active=True).exclude(user__id=uid)
    comments = M.Comment.objects.filter(location__threadmark__in=questions, parent__id=None, type=3, deleted=False, moderated=False)
    locations = M.Location.objects.filter(comment__in=comments)
    all_comments = M.Comment.objects.filter(location__in=locations)
    unrated_replies = all_comments.extra(tables=["base_threadmark"], where=["base_threadmark.location_id=base_comment.location_id and base_threadmark.ctime<base_comment.ctime"]).exclude(replyrating__status=M.ReplyRating.TYPE_UNRESOLVED)
    questions = questions.exclude(location__comment__in=list(unrated_replies))
    comments =  M.Comment.objects.filter(location__threadmark__in=questions, parent__id=None, type=3, deleted=False, moderated=False)
    locations = M.Location.objects.filter(comment__in=comments)
    locations = locations.filter(Q(section__membership__user__id=uid)|Q(section=None)|Q(ensemble__in=M.Ensemble.objects.filter(membership__section=None, membership__user__id=uid)))

    #now items where action required:
    my_questions =  M.ThreadMark.objects.filter(type=1, active=True, user__id=uid)#extra(select={"pending": "false"})
    my_unresolved = M.ReplyRating.objects.filter(threadmark__in=my_questions, status = M.ReplyRating.TYPE_UNRESOLVED)
    my_comments_unresolved =M.Comment.objects.filter(replyrating__in=my_unresolved)
    recent_replies = M.Comment.objects.extra(where=["base_threadmark.ctime<base_comment.ctime"]).filter(location__threadmark__in=my_questions).exclude(id__in=my_comments_unresolved)
    recent_replies_base = M.Comment.objects.extra(where=["base_threadmark.comment_id=base_comment.id or (base_threadmark.comment_id is null and base_comment.parent_id is null)"]).filter(location__threadmark__in=my_questions).exclude(id__in=my_comments_unresolved)
    #list() makes sure this gets evaluated.
    #otherwise we get errors since other aliases are used in subsequent queries, that aren't compatibles with the names we defined in extra()
    recent_replies_ids = list(recent_replies.values_list("id", flat=True))
    recent_locations = M.Location.objects.filter(comment__in=recent_replies_ids)
    recent_locations = recent_locations.filter(Q(section__membership__user__id=uid)|Q(section=None)|Q(ensemble__in=M.Ensemble.objects.filter(membership__section=None, membership__user__id=uid)))
    replied_questions = my_questions.filter(location__in=recent_locations)
    replied_questions = replied_questions.extra(select={"pending": "true"})
    output = {}
    output["questions"] = UR.qs2dict(questions|replied_questions)#, {"id":None, "type": None, "active":None, "location_id":None, "comment_id":None, "ctime":None, "pending":None, "user_id":None})
    output["locations"] = UR.qs2dict(locations|recent_locations)
    output["comments"]  = UR.qs2dict(comments)
    output["comments"].update(UR.qs2dict(recent_replies)) #same reason as the list() above: we don't want a query to produce an error if reevaluated in a different context
    output["basecomments"] = UR.qs2dict(recent_replies_base)
    return output
