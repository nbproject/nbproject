# Django settings for apps project.
from os.path import abspath, dirname, basename

FN_CREDENTIALS =  "settings_credentials.py"
def msg_credentials():
    msg = "*** Please edit the %s file with the required settings for authentication. ***" %(FN_CREDENTIALS, )
    stars = "*" * len(msg)
    return "\n\n%s\n%s\n%s\n\n" %(stars, msg, stars)

try:
    from . import settings_credentials
except ImportError:
    from os.path import dirname, abspath
    import shutil
    thisdir = dirname(abspath(__file__))
    shutil.copy2("%s/%s.skel" % (thisdir, FN_CREDENTIALS), "%s/%s" % (thisdir, FN_CREDENTIALS))
    print(msg_credentials())
    exit(1)

DEBUG = settings_credentials.__dict__.get("DEBUG", False)
TEMPLATE_DEBUG = DEBUG
ADMINS         = settings_credentials.__dict__.get("ADMINS", ())
MANAGERS = ADMINS
NB_SERVERNAME   = settings_credentials.__dict__.get("NB_SERVERNAME", "localhost")
NB_HTTP_PORT    = settings_credentials.__dict__.get("NB_HTTP_PORT", "80")
CRON_EMAIL      = settings_credentials.__dict__.get("CRON_EMAIL", "planet.nb+cron@gmail.com")
DATABASES       = settings_credentials.DATABASES
FACEBOOK_APP_ID = settings_credentials.FACEBOOK_APP_ID
FACEBOOK_APP_SECRET =  settings_credentials.FACEBOOK_APP_SECRET
GOOGLE_DEVELOPER_KEY =  settings_credentials.__dict__.get("GOOGLE_DEVELOPER_KEY", "CHANGE_ME")

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

if "default" not in DATABASES or "PASSWORD" not in DATABASES["default"] or DATABASES["default"]["PASSWORD"]=="":
    print(msg_credentials())
    exit(1)


# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/New_York'

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = ''

ROOTDIR = dirname(abspath(__file__))
ROOTDIR_BASENAME = basename(ROOTDIR)

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = "%s/" % (abspath("%s/../static" % (ROOTDIR, )),)

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = "/static/"

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = settings_credentials.__dict__.get("SECRET_KEY", "CHANGE_ME")


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            (abspath("%s/../../templates" % (ROOTDIR, ))),
            # insert your TEMPLATE_DIRS here
            # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
            # Always use forward slashes, even on Windows.
            # Don't forget to use absolute paths, not relative paths.
                                ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

MIDDLEWARE = (
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = "nbsite.urls"

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'nbsite.wsgi.application'


INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
#    "django_openid_auth",
    'corsheaders',
   # 'django_facebook',
#    'facebook',
    "base",
    "polls",
#"fixture_magic" #add this for
)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'scrolling': {
            'format': '%(message)s',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
            }
        },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
            },
        'scrolling': {
            'level': 'INFO',
            'class' : 'logging.FileHandler',
            'formatter': 'scrolling',
            'filename': "%s/%s" % (ROOTDIR, 'scrolling.log')
            },
        'errorlog': {
            'level': 'ERROR',
            'class' : 'logging.FileHandler',
            'formatter': 'verbose',
            'filename': "%s/%s" % (ROOTDIR, 'errors.log'),
            },
        },
    'loggers': {
        'django.request': {
            'handlers': ['errorlog'],
            'level': 'ERROR',
            'propagate': False,
        },
        'scrolling':{
            'handlers': ['scrolling'],
            'level': 'INFO',
            'propagate': False,
            }
        }
    }

AUTHENTICATION_BACKENDS = (
    'django_openid_auth.auth.OpenIDBackend',
#    'django_facebook.auth_backends.FacebookBackend',
    'facebook.backend.FacebookBackend',
    'django.contrib.auth.backends.ModelBackend',
)

HTTPD_MEDIA             =  settings_credentials.__dict__.get("HTTPD_MEDIA", "/var/local/nb")
HTTPD_MEDIA_CACHE       =  settings_credentials.__dict__.get("HTTPD_MEDIA_CACHE", HTTPD_MEDIA)

IMG_FMT_STRING          =  "%04d"
SERVER_USERNAME         = "www-data"

DESKTOP_TEMPLATE        = "web/desktop.html"
COLLAGE_TEMPLATE        = "web/collage.html"
DEV_DESKTOP_TEMPLATE    = 'web/desktop%s.xhtml'
SOURCE_TEMPLATE         = "web/source1.html"
YOUTUBE_TEMPLATE        = "web/youtube1.html"
GUEST_TUTORIAL_URL      = "http://%s/tutorial" % (NB_SERVERNAME,)
SPREADSHEET_TEMPLATE    = "web/spreadsheet.html"



#for utils_notify
SMTP_CC_USER    = "planet.nb+cc@gmail.com"
SMTP_REPLY_TO   = "planet.nb+reply@gmail.com"
PROTOCOL        = "http"
HOSTNAME        = NB_SERVERNAME
SMTP_USER       = "sacha@csail.mit.edu"
SMTP_SERVER     = "outgoing.csail.mit.edu"
DO_EMAIL        = True

#for utils_pdf
CACHE_DIR = "pdf/cache2"
#HOSTNAME
#HTTPD_MEDIA
#IMG_FMT_STRING
#PROTOCOL
REPOSITORY_DIR = "pdf/repository"
ANNOTATED_DIR = "pdf/annotated"
RESTRICTED_REPOSITORY_DIR = "pdf/restricted_repository"
RESOLUTIONS = {"72":{"20": None, "100": None},"288":{"25": None, "33": None, "50": None, "65": None, "80": None, "100": None }}
SMTP_CC_PDFERROR = "planet.nb+pdferror@gmail.com"
#SMTP_CC_USER
#SMTP_REPLY_TO
#SMTP_SERVER
#SMTP_USER

#URL of a google form (or similar service) that can be used for user to contact the NB Team:
SUPPORT_LINK = "https://groups.google.com/forum/#!forum/nbusers"

#EMAIL to contact he NB Team:
NBTEAM_EMAIL = "nb-team@csail.mit.edu"


#for db:
DEBUG_QUERY = False

#for rpc:
SMTP_TEST_USER = "planet.nb+testuser@gmail.com"
#HOSTNAME
SMTP_CC_LOSTPASSWORD =  "planet.nb+lostpassword@gmail.com"

#For Using Django's email framework
EMAIL_HOST              = settings_credentials.__dict__.get("EMAIL_HOST", 'localhost')
EMAIL_PORT              = settings_credentials.__dict__.get("EMAIL_PORT", 25)

EMAIL_FROM              = settings_credentials.__dict__.get("EMAIL_FROM", "NB Notifications <nbnotifications@csail.mit.edu>")
EMAIL_WATCHDOG          = settings_credentials.__dict__.get("EMAIL_WATCHDOG", "NB Watchdog <nbnotifications@csail.mit.edu>")
EMAIL_HOST_USER		= settings_credentials.__dict__.get("EMAIL_HOST_USER",  "")
EMAIL_HOST_PASSWORD     = settings_credentials.__dict__.get("EMAIL_HOST_PASSWORD",  "")
EMAIL_USE_TLS		= settings_credentials.__dict__.get("EMAIL_USE_TLS", False)
EMAIL_BCC               = settings_credentials.__dict__.get("EMAIL_BCC",  "planet.nb+bcc@gmail.com")

EMAIL_BACKEND           = settings_credentials.__dict__.get("EMAIL_BACKEND",  'django.core.mail.backends.smtp.EmailBackend')
EMAIL_FILE_PATH         = settings_credentials.__dict__.get("EMAIL_FILE_PATH", '/tmp/app-messages')

#For Personae framework:
PERSONA_EMAIL           = settings_credentials.__dict__.get("PERSONA_EMAIL", "planet.nb+%s@gmail.com")
PERSONA_PASSWORD        = settings_credentials.__dict__.get("PERSONA_PASSWORD", "secret")

#For remote debugging:
#ENABLE_REMOTE_DEBUGGING = True
ENABLE_REMOTE_DEBUGGING = False

REMOTE_DEBUGGING_PATH = "/var/local/home/sacha/bin/aptana3/plugins/org.python.pydev.debug_1.6.3.2010100422/pysrc"
if ENABLE_REMOTE_DEBUGGING:
    import sys
    sys.path.append(REMOTE_DEBUGGING_PATH)

#What signals should be monitored.
MONITOR = {"PAGE_SERVED": True,
           "FILE_DOWNLOAD": True
           }
REDIRECT = False
REDIRECT_URL = "https://nb.mit.edu"


#OPENID SSO:
OPENID_CREATE_USERS             = True
OPENID_UPDATE_DETAILS_FROM_SREG = True
OPENID_SSO_SERVER_URL           = 'https://www.google.com/accounts/o8/id'
#OPENID_SSO_SERVER_URL = 'https://www.edx.org/openid/provider/login'

LOGIN_URL                       = '/openid/login/'
LOGIN_REDIRECT_URL              = '/'
OPENID_USE_AS_ADMIN_LOGIN       = False

#Facebook stuff:
#AUTH_PROFILE_MODULE             = 'django_facebook.FacebookProfile'
AUTH_PROFILE_MODULE             = 'facebook.FacebookProfile'
FACEBOOK_SCOPE = 'email'

# Django Cors headers for cross-origin requests to ensure font-awesome can be accessed by the embedded JS file
CORS_ORIGIN_ALLOW_ALL = True


#Without that, when DEBUG=False,  Django 1.5 threw a SuspiciousOperation: Invalid HTTP_HOST header (you may need to set ALLOWED_HOSTS).
ALLOWED_HOSTS =  settings_credentials.__dict__.get("ALLOWED_HOSTS", ["*"])


CUSTOM_DUMPS = {
'ensemble':{# Initiate dump with: ./manage.py custom_dump ensemble ensemble_id
'primary': 'base.Ensemble',  # This is our reference model.
'dependents': [  # These are the attributes/methods of the model that we wish to dump.
            'location_set.all',
        ],
'excludes': {
            'base.user': ('password',)}

},
'comments':{
'primary': 'base.Comment',  # This is our reference model.
'dependents': [  # These are the attributes/methods of the model that we wish to dump.
            'location.ensemble=3756',
        ],
}
}
