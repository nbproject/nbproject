# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
from os.path import abspath, dirname, basename
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
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
                       (r'^collage/$', 'pages.views.collage'),
                       (r'^dev/desktop/(\d+)$', 'pages.views.dev_desktop'),
                       (r'^dev/test$', 'pages.views.dev_test'), # Todo: k>>> Delete this line after dev testing.
                       (r'^dev/test2$', 'pages.views.dev_test2'), # Todo: k>>> Delete this line after dev testing.
                       (r'^welcome$', 'pages.views.static_page'),
                       (r'^faq_student/$', 'pages.views.static_page'),
                       (r'^faq_instructor/$', 'pages.views.static_page'),
                       (r'^tutorial/$', 'pages.views.static_page'),
                       (r'^contact/$', 'pages.views.static_page'),
                       (r'^about/$', 'pages.views.static_page'),
                       (r'^disclaimer/$', 'pages.views.static_page'),
                       (r'^login$', 'pages.views.static_page'),
                       (r'^password_reminder/$', 'pages.views.static_page'),
                       (r'^terms_public_site/$', 'pages.views.static_page'),
                       (r'^staff_benefits/$', 'pages.views.static_page'),
                       (r'^subscribe_thanks$', 'pages.views.static_page'),
                       (r'^notallowed$', 'pages.views.static_page'),
                       (r'^newsite_thanks$', 'pages.views.static_page'),

                       (r'^file/(\d+)$' , 'pages.views.source'),
                       (r'^f/(\d+)$' , 'pages.views.source', {"allow_guest": True}),
                       (r'^f/(\d+)/analyze$' , 'pages.views.source_analytics'),
                       (r'^c/(\d+)$' , 'pages.views.comment'),
                       (r'^r/(\d+)$' , 'pages.views.comment'),
                       (r'^d/(\d+)$' , 'pages.views.ondemand'),
                       (r'^settings$' , 'pages.views.your_settings',),
                       (r'^embedopenid$' , 'pages.views.embedopenid',),
                       (r'^invite$', 'pages.views.invite'),
                       (r'^logout$', 'pages.views.logout'),
                       (r'^newsite$', 'pages.views.newsite'),
                       (r'^subscribe$', TemplateView.as_view(template_name='web/subscribe.html')),
                       (r'^confirm_invite$', 'pages.views.confirm_invite'),
                       (r'^enteryourname$', 'pages.views.enter_your_name'),
                       (r'^properties/ensemble/(\d+)$', 'pages.views.properties_ensemble'),
                       (r'^properties/ensemble_users/(\d+)$', 'pages.views.properties_ensemble_users'),
                       (r'^properties/ensemble_sections/(\d+)$', 'pages.views.properties_ensemble_sections'),
                       (r'^addhtml/(\d+)$', 'pages.views.add_html_doc'),
                       (r'^addyoutube/(\d+)$', 'pages.views.add_youtube_doc'),

                       (r'^fbchannel$', 'pages.views.fbchannel'),  #TODO: not sure this is needed anymore.
                       (r'^spreadsheet$', 'pages.views.spreadsheet'),
                       (r'^spreadsheet_cluster/download/(\d+)$', 'img.views.spreadsheet_cluster'),
                       (r'^spreadsheet_comments/download/(\d+)$', 'img.views.spreadsheet_comments'),
                       (r'^spreadsheet/download/(\d+)$', 'img.views.serve_grades_spreadsheet'),
                       (r'^debug', 'pages.views.debug'),
                       (r'^polls', include(polls.urls)),
                       )

urlpatterns += patterns('django.views.generic.simple',
                        (r'^robots.txt/$', TemplateView.as_view(template_name='web/robots.txt')))
urlpatterns += patterns('',
                         (r'djangoadmin/',    include(admin.site.urls)),
                        (r'^openid/', include('django_openid_auth.urls')),
                        (r'^openid_logout/$', 'django.contrib.auth.views.logout'),
                        (r'^openid_private/$', "pages.views.require_authentication"),
                        (r'^openid_index$', "pages.views.openid_index"),
#                        (r'^facebook/', include('django_facebook.urls')),
#                        (r'^accounts/', include('django_facebook.auth_urls'))
#                        url(r'^facebooksample$', 'pages.views.facebooksample'),
#                        url(r'^facebook/login$', 'facebook.views.login'),
#                        url(r'^facebook/authentication_callback$', 'facebook.views.authentication_callback'),
                        url(r'^logout$', 'django.contrib.auth.views.logout'),



)

#embedded NB to annotate HTML:
urlpatterns += patterns('',
    (r'^embed_NB.js$', 'django.views.static.serve',
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, )), "path":"compiled/embed_NB.js" })

     )

#this is short-circuited by apache when running as production: it's only useful when running from the debug server
urlpatterns += patterns('',
    (r'^content/(?P<path>.*)$', 'django.views.static.serve',
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, ))})

     )



