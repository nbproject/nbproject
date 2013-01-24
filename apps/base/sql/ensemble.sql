drop view if exists base_v_comment;
create view  base_v_comment as SELECT c.id, l.source_id, l.ensemble_id, c.type, c.author_id, l.page, c.parent_id, c.ctime, l.y, l.x, l.w, l.h
   FROM base_comment c, base_location l
  WHERE c.location_id = l.id AND c.deleted = false AND c.moderated = false;
