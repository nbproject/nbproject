# Copyright (c) 2010 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
from os.path import abspath, dirname, basename 
from django.conf.urls.defaults import *
from django.contrib import admin
import rpc.urls
import polls.urls
from django.conf import settings

admin.autodiscover()

ROOTDIR = dirname(abspath(__file__))
import sys
if ROOTDIR not in sys.path: 
    sys.path.append(ROOTDIR)
ROOTDIR_BASENAME = basename(ROOTDIR)

urlpatterns = None
if settings.REDIRECT: 
    def f_redirect(req):
        from django.http import HttpResponseRedirect
        return  HttpResponseRedirect(settings.REDIRECT_URL)       

    urlpatterns = patterns("", 
                           (r'^.*$',f_redirect ), 
                        )
    
urlpatterns = patterns("",
                       (r'^pdf/cache2/(\d+)/(\d+)/(\d+)$', 'img.views.serve_img',), 
                       (r'^pdf/repository/(\d+)$', 'img.views.serve_doc',{"annotated": False}), 
                       (r'^pdf/annotated/(\d+)$', 'img.views.serve_doc',{"annotated": True}), 
                       (r'^pdf4/rpc', include(rpc.urls)),                        
                       (r'^pdf3/upload', include('upload.urls')), 
                       (r'^$', 'pages.views.index'),
                       (r'^collage/$' , 'pages.views.collage'),
                       (r'^admin/$' , 'pages.views.admin'),
                       (r'^feedback/$' , 'pages.views.feedback'),
                       (r'^feedback_alpha/$' , 'pages.views.feedback_alpha'),
                       (r'^dev/desktop/(\d+)$' , 'pages.views.dev_desktop'),
                       (r'^alpha/$' , 'pages.views.alpha'),
                       (r'^file/(\d+)$' , 'pages.views.source'),
                       (r'^f/(\d+)$' , 'pages.views.source', {"allow_guest": True}),
                       (r'^c/(\d+)$' , 'pages.views.comment'),
                       (r'^r/(\d+)$' , 'pages.views.comment'),
                       (r'^draft/(\w+)$' , 'pages.views.draft',),
                       (r'^settings$' , 'pages.views.your_settings',),
                       (r'^invite$', 'pages.views.invite'), 
                       (r'^logout$', 'pages.views.logout'),
                       (r'^newsite$', 'pages.views.newsite'),   
                                               (r'^subscribe$', 'pages.views.subscribe'),      
                         (r'^confirm_invite$', 'pages.views.confirm_invite'), 
                        (r'^enteryourname$', 'pages.views.enter_your_name'), 
                        (r'^properties/ensemble/(\d+)$', 'pages.views.properties_ensemble'), 
                         (r'^properties/ensemble_users/(\d+)$', 'pages.views.properties_ensemble_users'),
                        (r'^spreadsheet$', 'pages.views.spreadsheet'),
                        (r'^polls', include(polls.urls)),  

                       )

urlpatterns += patterns('django.views.generic.simple',
                        (r'^glossary/$',                           'direct_to_template', {'template': 'web/glossary.html'}),
                         (r'^about/$',                           'direct_to_template', {'template': 'web/about.html'}),
                        (r'^help/$',                           'direct_to_template', {'template': 'web/help.html'}),
                        (r'^tutorial/$',                           'direct_to_template', {'template': 'web/help.html'}),
                        (r'^password_reminder/$',                           'direct_to_template', {'template': 'web/password_reminder.html'}),
                        (r'^terms_public_site/$',                           'direct_to_template', {'template': 'web/terms_public_site.html'}),
                        (r'^robots.txt/$',                           'direct_to_template', {'template': 'web/robots.txt'}),
                         (r'^staff_benefits/$',                           'direct_to_template', {'template': 'web/staff_benefits.html'}),
                         (r'^welcome$',                           'direct_to_template', {'template': 'web/welcome2.html'}),
                        (r'^welcome_old$',                           'direct_to_template', {'template': 'web/welcome.html'}),
                         (r'^login$',                           'direct_to_template', {'template': 'web/login2.html'}),
                         (r'^newsite_thanks$',                           'direct_to_template', {'template': 'web/newsite_thanks.html'}),
                            (r'^subscribe_thanks$',                           'direct_to_template', {'template': 'web/subscribe_thanks.html'}),
                        (r'^notallowed$',                           'direct_to_template', {'template': 'web/notallowed.html'}),
                             (r'^news$',                           'direct_to_template', {'template': 'web/news.html'}),


                        )
urlpatterns += patterns('', 
                         (r'djangoadmin/',    include(admin.site.urls)),
                         
)

#this is short-circuited by apache when running as production: it's only useful when running from the debug server
urlpatterns += patterns('', 
    (r'^content/(?P<path>.*)$', 'django.views.static.serve',
     {'document_root':  abspath("%s/../content/" % (ROOTDIR, ))})

     )    



