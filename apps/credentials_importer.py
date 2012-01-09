FN_CREDENTIALS =  "settings_credentials.py"

def msg_credentials(): 
    msg = "*** Please edit the %s file with the required settings for authentication. ***" %(FN_CREDENTIALS, )
    stars = "*" * len(msg)
    return "\n\n%s\n%s\n%s\n\n" %(stars, msg, stars)

try: 
    from settings_credentials import *
except ImportError: 
    from os.path import dirname, abspath
    import shutil
    thisdir = dirname(abspath(__file__))
    shutil.copy2("%s/%s.skel" % (thisdir, FN_CREDENTIALS), "%s/%s" % (thisdir, FN_CREDENTIALS))
    sys.strderr.write(msg_credentials())
    sys.exit(1)

if "default" not in DATABASES or "PASSWORD" not in DATABASES["default"] or DATABASES["default"]["PASSWORD"]=="": 
    sys.stderr.write(msg_credentials())
    sys.exit(1)
