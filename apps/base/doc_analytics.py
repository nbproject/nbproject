import json
from django.core import serializers
import models as M
import datetime
import psycopg2.extensions
import db
import math

def get_num_annotations_stats(sid):
	attr = {
		"page_num": "page",
		"num_annotations": None
	}
	from_clause = """
	(SELECT page, count(*) as num_annotations 
	FROM base_v_comment 
	WHERE source_id= ?
	AND type = 3 
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])

def get_num_questions_stats(sid):
	attr = {
		"page_num": "page",
		"num_questions": None
	}
	from_clause = """
	(SELECT c.page, count(*) as num_questions
	FROM base_threadmark t,
		base_v_comment c
	WHERE t.comment_id = c.id
	AND c.source_id = ?
	GROUP BY c.page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])

def get_num_threads_stats(sid):
	attr = {
		"page_num": "page",
		"num_threads": None
	}
	from_clause = """
	(SELECT page, count(distinct(location_id)) as num_threads
	FROM base_location l, base_comment c
	WHERE source_id = ?
	AND l.id = c.location_id
	AND type = 3
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])

def get_highlights(sid):
	attr = {
		"id": "id",
		"page_num": "page",
		"x": None,
		"y": None,
		"w": None,
		"h": None
	}
	from_clause = """
	(SELECT page, x, y, w, h, id
	FROM base_v_comment
	WHERE source_id = ?
	AND type = 3) as v1
	"""
	return db.Db().getIndexedObjects(attr, "id", from_clause, "true", [sid])

def get_num_pages(sid):
	numpages = M.Source.objects.get(id = sid).numpages
	return numpages

def get_num_participants_stats(sid):
	attr = {
		"page_num": "page",
		"num_participants": None
	}
	from_clause = """
	(SELECT page, count(distinct(author_id)) as num_participants 
	FROM base_v_comment
	WHERE source_id = ?
	AND type = 3
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])


# returns tuple (chart_stats, json_stats)
# where chart_stats is an array of arrays: 
#	[[page, num_threads, num_annotations, num_questions]]
# and json_stats is a dictionary of dictionaries:
#	{page_num: {page_dict}}
def get_page_stats(sid):
	a_stats = get_num_annotations_stats(sid)
	q_stats = get_num_questions_stats(sid)
	t_stats = get_num_threads_stats(sid)
	p_stats = get_num_participants_stats(sid)

	gather_time_stats(sid)
	totaltime_stats = get_total_times(sid)
	avgtime_stats = get_avgtime_peruser(sid)

	pages = {}
	numpages = get_num_pages(sid)
	chart_array = []

	for p in range(1, numpages+1):
		if p in a_stats:
			a_stat = a_stats[p]["num_annotations"]
		else:
			a_stat = 0
		if p in q_stats:
			q_stat = q_stats[p]["num_questions"]
		else:
			q_stat = 0
		if p in t_stats:
			t_stat = t_stats[p]["num_threads"]
		else:
			t_stat = 0
		if p in p_stats:
			p_stat = p_stats[p]["num_participants"]
		else:
			p_stat = 0
		if p in totaltime_stats:
			tt_stat = totaltime_stats[p]['total_time'].seconds/60
		else:
			tt_stat = 0
		if p in avgtime_stats:
			at_stat = avgtime_stats[p]['avgtime_per_user'].seconds/60
		else:
			at_stat = 0

		pages[p] = {
			"page_num": p,
			"num_threads": t_stat, 
			"num_annotations": a_stat, 
			"num_questions": q_stat,
			"num_participants": p_stat,
			"total_time": tt_stat,
			"avg_time": at_stat
		}
		chart_array.append([str(p), int(t_stat), int(a_stat), int(q_stat), int(p_stat), int(tt_stat), int(at_stat)])

	# print pages
	# for p in pages:
	# 	print pages[p]["avg_time"]
	# print chart_array	
	return (json.dumps(pages), chart_array)

def markAnalyticsVisit(uid, o):
	for id in o:
		id_source, junk = id.split("|")
		x = M.AnalyticsVisit(user_id=uid, source_id=id_source, ctime=datetime.datetime.fromtimestamp((o[id]+0.0)/1000))
		x.save()

import socket

def gather_time_stats(sid):
	from django.db import connection
	try:
		c = connection.cursor()
		# print "cursor created"
		qry = "drop table if exists nb2_page_order cascade;"
		c.execute(qry)

		qry ="create table nb2_page_order(id serial primary key, source_id integer, user_id integer, page integer, ctime timestamp, session_id integer);"
		c.execute(qry)
		qry ="""		
			insert into nb2_page_order(source_id, user_id, page, ctime,
			session_id) select source_id, user_id, page, ctime, session_id
			from base_pageseen where session_id is not null and source_id= (%s) 
			order by session_id, ctime;
			"""
		c.execute(qry, [sid])
		qry = "DROP INDEX IF EXISTS nb2_page_order_id_session_idx ;"
		c.execute(qry)

		qry = "DROP INDEX IF EXISTS nb2_page_order_ctime_idx ;"
		c.execute(qry)

		qry = "drop index if exists nb2_page_order_id_source_idx ;"
		c.execute(qry)

		qry = "drop index if exists nb2_page_order_id_user_idx ;"
		c.execute(qry)

		qry = "drop index if exists nb2_page_order_page_idx ;"
		c.execute(qry)
		qry = "CREATE INDEX nb2_page_order_id_session_idx ON nb2_page_order(session_id);"
		c.execute(qry)

		qry = "CREATE INDEX nb2_page_order_ctime_idx ON nb2_page_order(ctime);"
		c.execute(qry)

		qry = "create index nb2_page_order_id_source_idx on nb2_page_order(source_id);"
		c.execute(qry)

		qry = "create index nb2_page_order_id_user_idx on nb2_page_order(user_id);"
		c.execute(qry)

		qry = "create index nb2_page_order_page_idx on nb2_page_order(page);"
		c.execute(qry)
		
		qry = "drop view if exists tpage;"
		c.execute(qry)
		
		qry = """
			create view tpage as 

			SELECT o1.source_id, o1.user_id, o1.page, o1.ctime AS t1,
			o2.ctime AS t2, o2.ctime - o1.ctime AS total, o1.session_id,
			o.ensemble_id FROM nb2_page_order o1, nb2_page_order o2,
			base_ownership o WHERE o1.id = (o2.id - 1) AND o1.session_id =
			o2.session_id AND o1.source_id = o.source_id ORDER BY
			o1.session_id, o1.ctime;
			"""
		c.execute(qry)
		
		qry = "drop table if exists tpage2;"
		c.execute(qry)

		qry = """
			create table tpage2 as 

			select t.*, (t.t2-t.t1)-coalesce((i.t2-i.t1), '0 seconds') as
			tcorrected from tpage t left join base_idle i on
			t.session_id=i.session_id and t.t1<i.t1 and t.t2>i.t2;
			"""
		c.execute(qry)
	except Exception, e:
		print e.pgerror
	finally:
		c.close()

def get_total_times(sid):
	# get total times
	attr = {
		"page": None,
		"total_time": None
	}
	from_clause = """
	(SELECT page, sum(tcorrected) as total_time from tpage2
	WHERE source_id = ?
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page", from_clause, "true", [sid])

def get_avgtime_peruser(sid):
		# get average time per user
	attr = {
		"page": None,
		"avgtime_per_user": "avg_time"
	}
	from_clause = """
	(SELECT page, avg(timeperuser) as avg_time from
		(SELECT page, sum(tcorrected) as timeperuser from tpage2
		WHERE source_id = ?
		GROUP BY page, user_id) as v1
	GROUP BY page) as v2
	"""
	return db.Db().getIndexedObjects(attr, "page", from_clause, "true", [sid])