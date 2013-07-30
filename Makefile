#use the following to configure the 'nb3' server: 
SRCDIR		= apps
SITEDIR		= $(SRCDIR)/nbsite
SITEDIR_DOT	= $(shell echo $(SITEDIR) | sed 's|/|.|g')
PWD		= $(shell pwd)
PREFIXDIR	= $(PWD)
WSGIDIR		= $(SITEDIR)
WSGIFILE	= $(WSGIDIR)/wsgi.py
WSGISKEL	= $(WSGIFILE).skel
APACHEFILE	= conf/nb_apache
APACHESKEL	= $(APACHEFILE).skel
CRONFILE	= conf/nb_crontab
CRONSKEL	= conf/crontab.skel
MIGRATEDBFILE	= conf/migratedb.sh
MIGRATEDBSKEL	= conf/migratedb.sh.skel
OLD_DB		= notabene
NEW_DB		= nb3
CONF_LOCAL		= content/ui/admin/conf_local.js
SETTINGSFILE	= $(SITEDIR)/settings.py
DBNAME		= $(shell python -c 'from  $(SITEDIR_DOT).settings import DATABASES;print DATABASES["default"]["NAME"]')
DBUSER		= $(shell python -c 'from  $(SITEDIR_DOT).settings import DATABASES;print DATABASES["default"]["USER"]')
DBPASS		= $(shell python -c 'from  $(SITEDIR_DOT).settings import DATABASES;print DATABASES["default"]["PASSWORD"]')
DBHOST		= $(shell python -c 'from  $(SITEDIR_DOT).settings import DATABASES;a=DATABASES["default"]["HOST"];a="localhost" if a=="" else a;print a')
CRON_EMAIL	= $(shell python -c 'from  $(SITEDIR_DOT).settings import CRON_EMAIL;print CRON_EMAIL')
CONTENTDIR	= $(PWD)/content
HTTPD_MEDIA_DIR = $(shell python -c 'from  $(SITEDIR_DOT).settings import HTTPD_MEDIA;print HTTPD_MEDIA')
NB_STATIC_MEDIA_DIR= $(shell python -c 'from  $(SITEDIR_DOT).settings import STATIC_ROOT;print STATIC_ROOT')
NB_STATICURL	= $(shell python -c 'from  $(SITEDIR_DOT).settings import STATIC_URL;print STATIC_URL')
HTTPD_PDF_DIR	= $(HTTPD_MEDIA_DIR)/pdf
HTTPD_REP_DIR	= $(HTTPD_PDF_DIR)/repository
HTTPD_ANNOTATED_DIR =  $(HTTPD_PDF_DIR)/annotated
HTTPD_RESTRICTED_REP_DIR	= $(HTTPD_PDF_DIR)/restricted_repository
HTTPD_CACHE_DIR = $(HTTPD_PDF_DIR)/cache2

SERVER_USERNAME = $(shell python -c 'from  $(SITEDIR_DOT).settings import SERVER_USERNAME;print SERVER_USERNAME')
NB_SERVERNAME  	= $(shell python -c 'from  $(SITEDIR_DOT).settings import NB_SERVERNAME;print NB_SERVERNAME')
NB_HTTP_PORT  	= $(shell python -c 'from  $(SITEDIR_DOT).settings import NB_HTTP_PORT;print NB_HTTP_PORT')

NB		= nb
NB_ARCHIVE	= nb_stats_`date`_.tgz


check_settings: 
	echo ''
	echo '********************************************************************************************'
	echo '* Please edit your DB connections parameters in $(SITEDIR)/settings_credentials.py, if needed *'
	echo '********************************************************************************************'
	echo '' 
	$(shell python -c 'import $(SITEDIR_DOT).settings')


create_dirs: 
	echo 'attempting to create Media dir: ' $(HTTPD_MEDIA_DIR)
#	if test -d $(HTTPD_MEDIA_DIR) ; then echo 'HTTP DIR OK'; else mkdir -p $(HTTPD_MEDIA_DIR);  fi
	echo 'attempting to create Repository dir: ' $(HTTPD_REP_DIR)
	- mkdir -p $(HTTPD_REP_DIR)
	echo 'attempting to create Annotated dir: ' $(HTTPD_ANNOTATED_DIR)
	- mkdir -p $(HTTPD_ANNOTATED_DIR)
	echo 'attempting to create Restricted Repository dir: ' $(HTTPD_RESTRICTED_REP_DIR)
	- mkdir -p $(HTTPD_RESTRICTED_REP_DIR)
	echo 'attempting to create Cache dir: ' $(HTTPD_CACHE_DIR)
	- mkdir -p $(HTTPD_CACHE_DIR)
	echo 'attempting to chown Media dir: ' $(HTTPD_MEDIA_DIR)
	- chown -R $(SERVER_USERNAME):$(SERVER_USERNAME) $(HTTPD_MEDIA_DIR)
	echo 'attempting to create static media dir: ' $(NB_STATIC_MEDIA_DIR)
	- mkdir -p $(NB_STATIC_MEDIA_DIR)

.SILENT:

create_db:
	if  psql -h $(DBHOST) -U $(DBUSER) -d $(DBNAME) -c 'select 0;' > /dev/null ; then echo 'DB OK ! '; else echo 'DB TEST CONNECTION FAILED using parameters: user=$(DBUSER) host=$(DBHOST) database=$(DBNAME)\nMake sure you have created a database compatible with the params defined in $(SETTINGSFILE)\nFor more info, read the INSTALL file '; fi

all: 
	echo $(DBNAME)

django: check_settings
	sed -e 's|@@NB_DIR@@|$(PWD)|g' -e 's|@@SRCDIR@@|$(SRCDIR)|g'  -e 's|@@NB_CRON_EMAIL@@|$(CRON_EMAIL)|g' $(CRONSKEL) > $(CRONFILE)
	sed -e 's|NB_CONTENTDIR|$(CONTENTDIR)|g' -e 's|NB_WSGIDIR|$(PWD)/$(WSGIDIR)|g' -e 's|NB_SERVERNAME|$(NB_SERVERNAME)|g' -e 's|NB_HTTP_PORT|$(NB_HTTP_PORT)|g' -e 's|NB_STATICURL|$(NB_STATICURL)|g' -e 's|NB_STATIC_MEDIA_DIR|$(NB_STATIC_MEDIA_DIR)|g' $(APACHESKEL)   > $(APACHEFILE)
	touch $(CONF_LOCAL)
	if [ -s $(CONF_LOCAL) ]; then echo "local conf exists and not empty"; else echo "//your local conf here" >> $(CONF_LOCAL) ;  fi
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
	echo 'Replacing grunt-css with our customized version'
	cp lib/grunt-css.js node_modules/grunt-css/tasks/ 

migratedb: 
	sed -e 's|@@OLD_DB@@|$(OLD_DB)|g' -e 's|@@NEW_DB@@|$(NEW_DB)|g' $(MIGRATEDBSKEL)   > $(MIGRATEDBFILE)
	chmod u+x $(MIGRATEDBFILE)

newstats: 	
	./stats nb2_notes
	unison -batch -ui text  nb_stats2

clean:
	- find . -name '*~' | xargs rm
	- find . -name '*.pyc' | xargs rm 
	- rm content/compiled/*

tgz: 
	(cd ~ ; tar cz $(NB) > $(NB_ARCHIVE) )

apidev: 
	mkdir -p $(COMPILED_DIR)
	touch content/ui/admin/conf_local.js
	echo '' > $(APIDEV_DEST)
	for i in $(APIDEV_FILES); do cat $(APIDEV_ROOT)/$$i >> $(APIDEV_DEST) ; done
	for i in $(BUILDTRAIL_FILES); do cat $$i >> $(BUILDTRAIL_DEST) ; done
	for i in $(BUILDEMBED_FILES); do cat $$i >> $(BUILDEMBED_DEST) ; done
	for i in $(DESKTOP_FILES); do cat $$i >> $(DESKTOP_DEST) ; done

prereqs:
	apt-get install python postgresql imagemagick python-pypdf context python-numpy apache2 python-psycopg2 libapache2-mod-wsgi python-openid mupdf-tools python-setuptools python-xlwt g++ python-pip
	easy_install pytz
