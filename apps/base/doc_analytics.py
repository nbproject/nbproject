import json
from django.core import serializers

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

def get_page_stats(sid):
	pages = get_num_annotations_stats(sid)
	q_stats = get_num_questions_stats(sid)
	for p in q_stats:
		if p in pages:
			pages[p]["num_questions"] = q_stats[p]["num_questions"]
		else:
			pages[p] = q_stats[p]
	print pages
	#return serializers.serialize("json", pages)
	return json.dumps(pages)

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