import json
from django.core import serializers
import models as M

def get_num_annotations_stats(sid):
	import db
	attr = {
		"page_num": "page",
		"num_annotations": None
	}
	from_clause = """
	(SELECT page, count(*) as num_annotations 
	FROM base_v_comment 
	WHERE source_id= ? 
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])

def get_num_questions_stats(sid):
	import db
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
	import db
	attr = {
		"page_num": "page",
		"num_threads": None
	}
	from_clause = """
	(SELECT page, count(*) as num_threads
	FROM base_location
	WHERE source_id = ?
	GROUP BY page) as v1
	"""
	return db.Db().getIndexedObjects(attr, "page_num", from_clause, "true", [sid])

def get_highlights(sid):
	import db
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
	WHERE source_id = ?) as v1
	"""
	return db.Db().getIndexedObjects(attr, "id", from_clause, "true", [sid])

def get_num_pages(sid):
	numpages = M.Source.objects.get(id = sid).numpages
	return numpages

# returns tuple (chart_stats, json_stats)
# where chart_stats is an array of arrays: 
#	[[page, num_threads, num_annotations, num_questions]]
# and json_stats is a dictionary of dictionaries:
#	{page_num: {page_dict}}
def get_page_stats(sid):
	a_stats = get_num_annotations_stats(sid)
	q_stats = get_num_questions_stats(sid)
	t_stats = get_num_threads_stats(sid)

	pages = {}
	numpages = get_num_pages(sid)
	chart_array = [["Page", "Threads", "Annotations", "Questions"]]
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
		pages[p] = {
			"page_num": p,
			"num_threads": t_stat, 
			"num_annotations": a_stat, 
			"num_questions": q_stat
		}
		chart_array.append([p, int(t_stat), int(a_stat), int(q_stat)])

	# print pages
	print chart_array
	return (json.dumps(pages), chart_array)

# def get_time_on_page(sid):
# 	SELECT page, ctime
# 	FROM page_seen

# # number of questions per page
# SELECT c.page, count(*) as get_num_questions
# FROM base_threadmark t,
# 	base_v_comment c
# WHERE t.comment_id = c.id
# AND c.source_id = 8
# GROUP BY c.page



# # order by time of last annotation
# SELECT page, max(ctime) as last_annotated
# FROM base_v_comment 
# WHERE source_id=8 
# GROUP BY page
# ORDER BY last_annotated desc;