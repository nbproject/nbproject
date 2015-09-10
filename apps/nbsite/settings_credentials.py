# 
# uncomment and complete the following to set up your server name
#
#NB_SERVERNAME = ""

# 
# uncomment and complete the following to set up who should get cron reports
#
#CRON_EMAIL = ""

# 
# These are overrides to defaults set in settings.py.  To keep defaults, leave
# these values empty. To replace the defaults, uncomment the line and enter 
# your changes here rather than making the changes in settings.py.
#
DEBUG = True
# TEMPLATE_DEBUG = ""
# ADMINS = (('admin name', 'admin@admin.test'),)
# MANAGERS = ""
# NB_HTTP_PORT = ""
# HTTPD_MEDIA = ""
# HTTPD_MEDIA_CACHE = ""
# EMAIL_HOST = ""
# EMAIL_FROM = ""
# EMAIL_BCC = ""

EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"
EMAIL_FILE_PATH = "/tmp/nb_emails"

# PERSONA_EMAIL = ""
# PERSONA_PASSWORD = ""

# Make this unique, and don't share it with anybody.
SECRET_KEY = "TvO8Zg"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'nburop',                      # Or path to database file if using sqlite3.
        'USER': 'nburop',                      # Not used with sqlite3.
        'PASSWORD': 'ur0p34501',                  # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}
FACEBOOK_APP_ID         = "CHANGE_ME"
FACEBOOK_APP_SECRET     = "CHANGE_ME"
GOOGLE_DEVELOPER_KEY    = "AIzaSyDBApbig3PaN6_Y4aN38ww56pWt9NaYIX4"
