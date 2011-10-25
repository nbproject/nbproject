--use the local 'notabene' (i.e. old framework) database
begin;
--
drop table if exists base_user cascade;
create table base_user as select id, email, firstname, lastname, pseudonym, confkey, valid=1 as valid , guest=1 as guest, password from users;
update base_user set valid=false where valid is null;
update base_user set guest=false where guest is null;
--
drop table if exists base_ensemble cascade;
create table base_ensemble as select id, name, substring(description, 0, 256) as description,  public=1 as allow_guest, true as allow_staffonly, true as allow_anonymous, ''::text as invitekey, false as use_invitekey from ensemble order by id; 
update base_ensemble set allow_guest = false where allow_guest is null;
update base_ensemble set allow_staffonly = not allow_guest;
update base_ensemble set allow_anonymous = not allow_guest;
--
drop table if exists base_folder cascade;
create table base_folder as select id, id_parent as parent_id, id_ensemble as ensemble_id, name from folder order by id; 
--
drop table if exists base_invite cascade;
create table base_invite as select id  as key, id_user as user_id, id_ensemble as ensemble_id, admin=1 as admin  from invite where id_user in (select id from users) order by id; 
update base_invite set admin = false where admin is null;
delete from base_invite where user_id not in (select id from base_user) or ensemble_id not in (select id from base_ensemble) ;
--
drop table if exists base_membership cascade;
create table base_membership as select id_user as user_id, id_ensemble as ensemble_id, admin, false as deleted from membership order by id_user; 
delete from base_membership  where user_id not in (select id from base_user) or ensemble_id not in (select id from base_ensemble) ;
--
drop table if exists base_source cascade;
create table base_source as select s.id, 1 as version, s.title, s.submittedby as submittedby_id, p.numpages, p.ncols as w, p.nrows as h, p.rotation  from source s, pdf_data p where p.id_source=s.id order by id; 
update base_source set w=612 where w is null;
update base_source set h=792 where h is null;
--
drop table if exists base_ownership cascade;
create table base_ownership as select id_source as source_id, id_ensemble as ensemble_id, id_folder as folder_id, published, false as deleted , false as assignment, null::timestamp as due  from ownership order by id_source; 
delete from base_ownership  where source_id not in (select id from base_source) or ensemble_id not in (select id from base_ensemble) ;
--
drop table if exists base_location cascade;
create table base_location as select id, id_source as source_id, 1 as version, id_ensemble as ensemble_id,x,y,w,h,page from nb2_location order by id;
CREATE  INDEX loc_src_idx ON base_location(source_id);
CREATE  INDEX loc_end_idx ON base_location(ensemble_id);
delete from base_location where source_id not in (select id from base_source) or ensemble_id not in (select id from base_ensemble) ;
--
drop table if exists base_comment cascade;
create table base_comment as select id, id_location as location_id, id_parent as parent_id, id_author as author_id, ctime, body, type, cast(signed as boolean), vis_status=1 as deleted, false as moderated from nb2_comment order by id; 
CREATE  INDEX com_loc_idx ON base_comment(location_id);
CREATE  INDEX com_aut_idx ON base_comment(author_id);
delete from base_comment where location_id not in (select id from base_location) or author_id not in (select id from base_user);
--
drop table if exists base_mark cascade;
create table base_mark as select id_type as type, ctime, id_ann as comment_id, id_user as user_id  from nb2_mark order by id_user; 
CREATE  INDEX mrk_com_idx ON base_mark(comment_id);
CREATE  INDEX mrk_usr_idx ON base_mark(user_id);
delete from base_mark where comment_id not in  (select id from base_comment) or user_id not in (select id from base_user);
--
drop table if exists base_processqueue cascade;
create table base_processqueue as select id_source as source_id, submitted, started, completed from nb2_processqueue order by id_source;delete from base_processqueue where source_id not in (select id from base_source);
--
drop table if exists base_session cascade;
create table base_session as select id, id_user as user_id, ctime, lastactivity, ip from nb2_session_history where id_user is not null and id_user in (select id from base_user);
--
drop table if exists base_commentseen cascade;
drop sequence if exists base_commentseen_seq;
create sequence base_commentseen_seq;
create table base_commentseen as select nextval('base_commentseen_seq') as id, id_comment as comment_id, null as session_id, id_user as user_id, ctime from nb2_seen where id_comment in (select id from base_comment);
--
drop table if exists base_pageseen cascade;
drop sequence if exists base_pageseen_seq;
create sequence base_pageseen_seq;
create table base_pageseen as select nextval('base_pageseen_seq') as id, page , null::integer as user_id, id_session as session_id, id_source as source_id,  ctime from nb2_page_history where id_session in (select id from base_session);
delete from base_pageseen where source_id not in (select id from base_source);
--
drop table if exists base_landing cascade;
drop sequence if exists base_landing_seq;
create sequence base_landing_seq;
create table base_landing as select  nextval('base_landing_seq') as id, id_user as user_id, ctime,client, ip referer, path from nb2_landing_history;
--
drop table if exists base_idle cascade;
drop sequence if exists base_idle_seq;
create sequence base_idle_seq;
create table base_idle as select  nextval('base_idle_seq') as id,id_session as session_id,  t1, t2 from nb2_idle where  id_session in (select id from base_session);
--
drop table if exists base_defaultsetting cascade;
drop sequence if exists base_defaultsetting_seq;
create sequence base_defaultsetting_seq;
create table base_defaultsetting as select  nextval('base_defaultsetting_seq') as id, name, value from  nb2_default_settings;
--
drop table if exists base_settinglabel cascade;
drop sequence if exists base_settinglabel_seq;
create sequence base_settinglabel_seq;
create table base_settinglabel as select  nextval('base_settinglabel_seq') as id, ds.id as setting_id, sl.value, sl.label from  base_defaultsetting ds, nb2_settings_labels sl where sl.name = ds.name;
--
drop table if exists base_usersetting cascade;
drop sequence if exists base_usersetting_seq;
create sequence base_usersetting_seq;
create table base_usersetting as select  nextval('base_usersetting_seq') as id, ds.id as setting_id, us.id_user as user_id,  us.value, us.ctime from  base_defaultsetting ds, nb2_user_settings us where us.name = ds.name and us.valid=1;
--
-- we don't port nb2_source_history into base_sourceversion since versioning hasn't been fully implemented yet. 
--
drop table if exists base_notification cascade;
drop sequence if exists base_notification_seq;
create sequence base_notification_seq;
create table base_notification as select  nextval('base_notification_seq') as id, type, atime from nb2_latest_notifications;
commit;

