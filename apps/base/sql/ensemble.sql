drop view if exists base_v_comment;
create view  base_v_comment as SELECT c.id, l.source_id, l.ensemble_id, c.type, c.author_id, l.page, c.parent_id, c.ctime, l.y, l.x, l.w, l.h, l.section_id
   FROM base_comment c, base_location l
  WHERE c.location_id = l.id AND c.deleted = false AND c.moderated = false;

--now insert system values: 
INSERT INTO base_notification VALUES (2, 'auth_digest', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (3, 'reply_digest', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (4, 'all_digest', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (5, 'answerplease_digest', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (7, 'unclear_digest', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (10, 'answerplease_immediate', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (11, 'unclear_immediate', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (8, 'auth_immediate', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (9, 'reply_immediate', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (6, 'all_immediate', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_notification VALUES (1, 'richpdf', '2000-01-01 00:00:00.000000-04');
INSERT INTO base_defaultsetting VALUES (1, 'email_confirmation_author', NULL, 2);
INSERT INTO base_defaultsetting VALUES (2, 'email_confirmation_reply_author', NULL, 2);
INSERT INTO base_defaultsetting VALUES (3, 'email_confirmation_reply_answerplease', NULL, 2);
INSERT INTO base_defaultsetting VALUES (4, 'email_confirmation_reply_unclear', NULL, 2);
INSERT INTO base_defaultsetting VALUES (5, 'email_confirmation_all', NULL, 0);
INSERT INTO base_settinglabel VALUES (1, 1, 2, 'For each note I write');
--INSERT INTO base_settinglabel VALUES (2, 1, 1, 'Once a day, as a digest');
INSERT INTO base_settinglabel VALUES (3, 1, 0, 'Never');
INSERT INTO base_settinglabel VALUES (4, 2, 2, 'For each reply');
--INSERT INTO base_settinglabel VALUES (5, 2, 1, 'Once a day, as a digest');
INSERT INTO base_settinglabel VALUES (6, 2, 0, 'Never');
INSERT INTO base_settinglabel VALUES (7, 3, 2, 'For each reply');
--INSERT INTO base_settinglabel VALUES (8, 3, 1, 'Once a day, as a digest');
INSERT INTO base_settinglabel VALUES (9, 3, 0, 'Never');
INSERT INTO base_settinglabel VALUES (10, 4, 2, 'For each reply');
--INSERT INTO base_settinglabel VALUES (11, 4, 1, 'Once a day, as a digest');
INSERT INTO base_settinglabel VALUES (12, 4, 0, 'Never');
INSERT INTO base_settinglabel VALUES (13, 5, 2, 'For each note');
--INSERT INTO base_settinglabel VALUES (14, 5, 1, 'Once a day, as a digest');
INSERT INTO base_settinglabel VALUES (15, 5, 0, 'Never');
