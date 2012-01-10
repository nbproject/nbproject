#use the following to configure the 'nb3' server: 
SRCDIR		= apps

PREREQS		= postgresql imagemagick 
PWD		= $(shell pwd)
PREFIXDIR	= $(PWD)
WSGIDIR		= $(SRCDIR)/apache
WSGIFILE	= $(WSGIDIR)/django.wsgi
WSGISKEL	= $(WSGIFILE).skel
APACHEFILE	= conf/nb_apache
APACHESKEL	= $(APACHEFILE).skel
CRONFILE	= conf/nb_crontab
CRONSKEL	= conf/crontab.skel
MIGRATEDBFILE	= conf/migratedb.sh
MIGRATEDBSKEL	= conf/migratedb.sh.skel
OLD_DB		= notabene
NEW_DB		= nb3
SETTINGSFILE	= $(SRCDIR)/settings.py
SETTINGS_STATUS	= $(shell python -c 'import $(SRCDIR).settings'; echo $$? )
DBNAME		= $(shell python -c 'from  $(SRCDIR).settings import DATABASES;print DATABASES["default"]["NAME"]')
DBUSER		= $(shell python -c 'from  $(SRCDIR).settings import DATABASES;print DATABASES["default"]["USER"]')
DBPASS		= $(shell python -c 'from  $(SRCDIR).settings import DATABASES;print DATABASES["default"]["PASSWORD"]')
DBHOST		= $(shell python -c 'from  $(SRCDIR).settings import DATABASES;a=DATABASES["default"]["HOST"];a="localhost" if a=="" else a;print a')
CRON_EMAIL	= $(shell python -c 'from  $(SRCDIR).settings import CRON_EMAIL;print CRON_EMAIL')
CONTENTDIR	= $(PWD)/content
HTTPD_MEDIA_DIR = $(shell python -c 'from  $(SRCDIR).settings import HTTPD_MEDIA;print HTTPD_MEDIA')
HTTPD_REP_DIR	= $(HTTPD_MEDIA_DIR)/$(shell python -c 'from  $(SRCDIR).settings import REPOSITORY_DIR;print REPOSITORY_DIR')
HTTPD_ANNOTATED_DIR	= $(HTTPD_MEDIA_DIR)/$(shell python -c 'from  $(SRCDIR).settings import ANNOTATED_DIR;print ANNOTATED_DIR')
HTTPD_RESTRICTED_REP_DIR	= $(HTTPD_MEDIA_DIR)/$(shell python -c 'from  $(SRCDIR).settings import RESTRICTED_REPOSITORY_DIR;print RESTRICTED_REPOSITORY_DIR')
HTTPD_CACHE_DIR = $(HTTPD_MEDIA_DIR)/$(shell python -c 'from  $(SRCDIR).settings import CACHE_DIR; print CACHE_DIR')



SERVER_USERNAME = $(shell python -c 'from  $(SRCDIR).settings import SERVER_USERNAME;print SERVER_USERNAME')
NB_SERVERNAME  	= $(shell python -c 'from  $(SRCDIR).settings import NB_SERVERNAME;print NB_SERVERNAME')
NB_HTTP_PORT  	= $(shell python -c 'from  $(SRCDIR).settings import NB_HTTP_PORT;print NB_HTTP_PORT')

HOST_PROD	= sacha.csail.mit.edu
ROOT_PROD	= /sachacsail
NB		= nb
NB_ARCHIVE	= nb.tgz
NB_ARCHIVE	= nb_stats_`date`_.tgz
HOME_PROD	= $(ROOT_PROD)/var/local/home/sacha
CONFDIR_PROD	= $(HOME_PROD)/$(NB)/conf
DEFAULT_FILE	= defaults.json
DEFAULT_PROD	= defaults.json.prod
COMPILED_DIR = content/compiled
API_ROOT	= content/modules
API_DEST	= $(COMPILED_DIR)/api.js
#API_FILES	= Module.js NB.js auth.js dom.js rpc.js observer.js mvc.js dev/models.js 
API_FILES      = Module.js NB.js auth.js dom.js mvc.js dev/models.js
APIDEV_ROOT	= content/modules
APIDEV_DEST	= $(COMPILED_DIR)/apidev.js
APIDEV_FILES	= Module.js NB.js auth.js dom.js mvc.js dev/models2.js 

compat: api
	(rm content/compat/*; cd src; python compat.py dir ../ ../templates/web ../content/compat/)

check_settings: 
ifneq ($(SETTINGS_STATUS),0)
	$(info )
	$(info ********************************************************************************************)
	$(info * !! Unable to read settings !!)
	$(info * Create and modify $(SRCDIR)/settings.py and $(SRCDIR)/settings_credentials)
	$(info * based on $(SRCDIR)/settings.py.skel and $(SRCDIR)/settings_credentials.py.skel)
	$(info ********************************************************************************************)
	$(info )
	$(error Unable to load NB settings)
endif

.SILENT:

create_dirs: 
#	if test -d $(HTTPD_MEDIA_DIR) ; then echo 'HTTP DIR OK'; else mkdir -p $(HTTPD_MEDIA_DIR);  fi
	- mkdir -p $(HTTPD_REP_DIR)
	- mkdir -p $(HTTPD_ANNOTATED_DIR)
	- mkdir -p $(HTTPD_RESTRICTED_REP_DIR)
	- mkdir -p $(HTTPD_CACHE_DIR)
	- chown -R $(SERVER_USERNAME):$(SERVER_USERNAME) $(HTTPD_MEDIA_DIR)

create_db:
	if  psql -h $(DBHOST) -U $(DBUSER) -d $(DBNAME) -c 'select 0;' > /dev/null ; then echo 'DB OK ! '; else echo 'DB TEST CONNECTION FAILED using parameters: user=$(DBUSER) host=$(DBHOST) database=$(DBNAME)\nMake sure you have created a database compatible with the params defined in $(SETTINGSFILE)\nFor more info, read the INSTALL file '; fi

all: 
	echo $(DBNAME)

django: check_settings
	sed 's|@@SRC_DIR@@|$(PREFIXDIR)/$(SRCDIR)|g' $(WSGISKEL)   > $(WSGIFILE)
	sed -e 's|@@NB_DIR@@|$(PWD)|g' -e 's|@@SRCDIR@@|$(SRCDIR)|g'  -e 's|@@NB_CRON_EMAIL@@|$(CRON_EMAIL)|g' $(CRONSKEL) > $(CRONFILE)
	sed -e 's|NB_CONTENTDIR|$(CONTENTDIR)|g' -e 's|NB_WSGIDIR|$(PWD)/$(WSGIDIR)|g' -e 's|NB_SERVERNAME|$(NB_SERVERNAME)|g' -e 's|NB_HTTP_PORT|$(NB_HTTP_PORT)|g' $(APACHESKEL)   > $(APACHEFILE)
	echo ''
	echo '--------- Apache configuration file ------------'
	echo 'Copy the file $(APACHEFILE) into your apache configuration. Typically this can be done with the following sequence:'
	echo 'sudo cp conf/nb_apache /etc/apache2/sites-available/'
	echo 'cd /etc/apache2/sites-enabled'
	echo 'sudo ln -s ../sites-available/nb_apache .'
	echo ''
	echo '--------- Crontab file -------------------------'
	echo 'If you have not done it already, please update your crontab file with the contents of:'
	echo '$(CRONFILE)'
	echo ''
	echo '--------- End of make messages -----------------'
	echo ''

migratedb: 
	sed -e 's|@@OLD_DB@@|$(OLD_DB)|g' -e 's|@@NEW_DB@@|$(NEW_DB)|g' $(MIGRATEDBSKEL)   > $(MIGRATEDBFILE)
	chmod u+x $(MIGRATEDBFILE)


newstats: 	
	./stats nb2_notes
	unison -batch -ui text  nb_stats2


clean:
	- find . -name '*~' | xargs rm
	- find . -name '*.pyc' | xargs rm 


tgz: 
	(cd ~ ; tar cz $(NB) > $(NB_ARCHIVE) )


prod: 	tgz
	if test -e $(HOME_PROD); then (echo '$(HOME_PROD) mounted, continuing...') ;else (echo 'mounting $(ROOT_PROD)';sshfs $(HOST_PROD):/ $(ROOT_PROD)) fi
	if test -e $(HOME_PROD); then (echo 'copying...';cp ~/$(NB_ARCHIVE) $(HOME_PROD);echo 'done !') ;else echo 'ERROR: $(HOME_PROD) not mounted'; fi
	ssh $(HOST_PROD) 'tar zxf $(NB_ARCHIVE)'
	echo "You can kill the current daemon and run a new one now: sudo nohup ./runserver "


api:
	mkdir -p $(COMPILED_DIR)  	
	echo '' > $(API_DEST)
	for i in $(API_FILES); do cat $(API_ROOT)/$$i >> $(API_DEST) ; done

apidev: 
	mkdir -p $(COMPILED_DIR)
	touch content/ui/admin/conf_local.js
	echo '' > $(APIDEV_DEST)
	for i in $(APIDEV_FILES); do cat $(APIDEV_ROOT)/$$i >> $(APIDEV_DEST) ; done




#for some reason, the following doesn't perform Ok when in makefile, but OK when executed from shell...
check_prereqs: 
	for l in $(PREREQS); do \
		if [ $$l != `dpkg -l $$l | grep '^ii' | sed 's|^ii  \(\S*\).*|\1|'` ] ; then echo "$$l seems to be missing"; exit 1; else echo "$$l OK..."; fi; \
	done

prereqs_common:
	apt-get install python postgresql imagemagick pdfedit postgresql-plpython-8.4 python-pypdf context

prereqs_django:
	apt-get install apache2 python-psycopg2 libapache2-mod-wsgi


prereqs_twisted: 
	apt-get install python-twisted python-pygresql

startapp: #reminder for what links to create when creating a new django app
	echo 'ln -s ../../src/annotations3.py annotations.py'
	echo 'ln -s ../../src/utils_response.py .' 
	echo 'ln -s ../../src/utils_format.py .'
	echo 'ln -s ../../src/constants.py .'
	echo 'ln -s ../../src/utils_auth.py .'
	echo 'ln -s ../../src/db_django.py db.py'
	echo 'ln -s ../../src/registry.py .'
	echo ''
	echo ''

static2template: #reminder for how to change a static page into a template. 
	sed -i 's|href="../|href="/content/|' your_file
	sed -i 's|src="../|src="/content/|' your_file
	echo 'change manually other links to abolute links typicall pers???.css and pers???.js need to be replaced by /content/ui/classic/pers???...'
	echo 'close script tags with a </script> instead of />'
