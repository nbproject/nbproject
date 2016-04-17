# NB Installation Procedure

**Note:** This assumes that you've downloaded the project from git (for instance from https://github.com/nbproject/nbproject ) and that you copied it in a directory that the user running the server (e.g www-data) can access. 

## 1 - Dependencies
On a typical debian-like (ubuntu etc...) distribution, NB requires the following base packages:

**NOTE:**
  * packages in square brackets are optional
  * core ubuntu dependencies can be installed by running 'sudo make prereqs'
  
### CORE DEPENDENCIES
These can be installed as ubuntu packages

    python (>= 2.6)
    postgresql (>= 8.4)
    imagemagick
    mupdf-tools (for pdfdraw)
    context (for rich, i.e. annotated pdf generation)
    apache2
    libapache2-mod-wsgi
    python-setuptools (used for 'easy_install pytz' in make prereqs as well)
    g++ (used to compile node)
    python-pip (used to install google python library and other dependencies).
    nodejs
    npm
    nodejs-legacy (in order to use executable name node instead of nodejs) 
   
### Pip installations
    cd nbproject # (or whatever name you may have choosen for the root NB code directory).
    sudo pip install -r requirements.txt # To install additional required dependencies such as django, pyPdf, etc
      
### grunt
    # As of March 2016 we have been using grunt 0.4.X. 
    # For questions on getting NB to work wit grunt 0.3.X, plrease refer to 
    # http://gruntjs.com/upgrading-from-0.3-to-0.4, and follow the procedure in the opposite way. 
      npm install grunt 
      sudo npm install -g grunt-cli
      sudo npm install -g grunt-init
      npm install grunt-contrib-jshint  --save-dev
      npm install grunt-contrib-concat  --save-dev
      npm install grunt-contrib-cssmin  --save-dev
        
### [optional] To annotate YouTube Videos: The google python library
    sudo pip install --upgrade google-api-python-client


## 2 - Installation commands
   Once you've satisfied the dependencies listed above, you need to run the following installation commands (from nb root folder):

    npm install #in order to install specific grunt modules, such as grunt-css, execSync
    make django #create configuration files. You can safely ignore the "Error 127" message
    #[copy apps/nbsite/settings_credentials.py.skel to settings_credentials.py and]
    #[edit values in apps/nbsite/settings_credentials.py, following the direction there]
    sudo make create_dirs  # create root folder and some folders below that for nb data
    make django  # one more time...
    #[If you're deploying a production environmant, use the cmds given in output in order to configure apache]
    #[then configure the cron jobs (cf 5)]
    grunt  # Compiles js and css.  
    #[optional]: If you want to use different slave servers for different parts of the app (i.e. one for serving 
    # images, one for handling the rpc calls, and one for handling file uploads for instance), edit params in 
    # content/ui/admin/conf.js: Tell which server(s) the client should use to fetch various pieces data. If you're 
    # going to use just one server for the whole app, you can safely ignore this. Note that this is unrelated to 
    # whether or not you're using localhost as your  databse server, but if you do use several server, make sure 
    # they all use the same database, for consistency.  Don't forget to re-run 'grunt' if you change conf.js

## 3 - Database Initialization
   * Log in as someone who has postgres create role and create database privileges, such as postgres (one way is to do 'su' and then 'su postgres')
    createuser nbadmin -P #important to setup as superuser since only superusers can create a language (used for plpythonu) 

   * Back to the regular user:
    createdb -U <YOUR_POSTGRES_USER> -h localhost <YOUR_NB_DATABASE_NAME>

   * Exit from the database

```
    cd apps
    ./manage.py makemigrations # to create the database migrations files
    ./manage.py migrate # To create the database tables from the migrations files
    ./manage.py sqlcustom base | ./manage.py dbshell # to create custom views. If this throws an error, you could simply log in to your postgres database and run the query contained in https://github.com/nbproject/nbproject/blob/dev/apps/base/sql/ensemble.sql 
```

   * You may also have to allow remote connections
     * sudo nano /etc/postgresql/[YOUR_VERSION]/main/pg_hba.conf 
          o host    your_db_name       your_db_user       127.0.0.1/0     password
     * sudo nano /etc/postgresql/[YOUR_VERSION]/main/postgresql.conf
          listen_addresses = '*' 
   * if you make a mistake:
 
 ```
    dropdb  -U nbadmin -h localhost notabene
    createdb -U nbadmin -h localhost notabene
```
    At this point you can try your installation using the Django debug server (but never use this in production...): 
* From the apps directory: ```./manage.py runserver```
* In your browser visit ```http://localhost:8000```

## 4 - Extra stuff
  To be able to genereate annotated pdfs: Configure tex so that it allows mpost commands: make sure that 'mpost' is in shell_escape_commands (cf /tex/texmf/texmg.cnf) 

## 5 - Crontab setup
  A sample crontab generated as part of the 'make django'. You just need to add it to your crontab for it to take effect

## 6 - Backup 
  - **Database:**  use the pg_dump command, for instance, if NB was installed on host example.com, that the DB belonged to postgres used nbuser, and that the DB was called notabene, you'd use the following: 
    -pg_dump -U nbuser -h example.com -Fc notabene > nb.backup.YYYYMMDD
  
  - **Uploaded PDF files:** Use your favorite file backup technique (tar, rdiff-backup, unison etc...) to backup the directory: 
    "%s%s" % (settings.HTTPD_MEDIA,settings.REPOSITORY_DIR) (cf your settings.py files for actual values). 

## 7 - Restore (change localhost to your server name if it's not on loacalhost)
    dropdb  -U nbadmin -h localhost notabene
    createdb -U nbadmin -h localhost notabene
    pg_restore -U nbadmin -h localhost -d nb3 YOUR_NB_BACKUP_FILE

## 8 - [Advanced] Updating the code base
What is a bit delicate is that database structure may change: You need to add the missing fields manually, as described at http://www.djangobook.com/en/2.0/chapter10.html#making-changes-to-a-database-schema

**IMPORTANT:** Make a database backup (cf. step 6) so you can revert to the previous state if you encounter a problem

    git fetch 
    git diff master origin master apps/base/models.py
    #for each difference, add the corresponding field in the database. 
    #once everything is added: 
    git merge
    apachectl restart
    grunt  

**Note:** If you encounter a problem, and would like to restore things as they were before you updated the code and the database:  

    # restore your database (cf 7) 
    git reset --hard HEAD@{1} # revert to the version of the code you were at
    apachectl restart
    grunt      

# Questions
For questions (including how to install NB on other linux distributions), use our forum at
* http://nbproject.vanillaforums.com/ more specifically, the deployers section:
* http://nbproject.vanillaforums.com/categories/deployers

Contact: nb-team@csail.mit.edu (NOTE: You'll likely get a much faster reply if you use the forum above).

# VIDEO ANNOTATOR UPDATE
Since this commit, NB runs on Django 1.7.  This means changes to the database can now be handled with Django migrations!
These instructions will get you up and running from a previous NB install.

### 1) Run the database migrations included in the codebase
    cd apps
    ./manage.py migrate

### 2) Add the new user option
    python base/jobs.py addsettings
(If this fails try changing the id fields in the function do_add_tag_email_setting)


### 3) Schedule the CRON job for automated tag reminders
(The following job runs daily at 8 PM)

    0 20 * * * (cd /home/ubuntu/nbgit/apps;  python -m 'base.jobs' tagreminders)

The tagreminders option of the base/jobs.py script sends reminders to all users about unseen tagged comments.
 
