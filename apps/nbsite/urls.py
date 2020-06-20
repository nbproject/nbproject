# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
from os.path import abspath, dirname, basename
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.contrib import admin
import rpc.urls
import polls.urls
from django.conf import settings
import img.views as img_views
import pages.views as pages_views
import django.contrib.auth.views as auth_views
import django.views.static as static

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

    urlpatterns = [
                           url(r'^.*$',f_redirect ),
                        ]

urlpatterns = [
                       url(r'^pdf/cache2/(\d+)/(\d+)/(\d+)$', img_views.serve_img,),
                       url(r'^pdf/repository/(\d+)$', img_views.serve_doc,{"annotated": False}),
                       url(r'^pdf/annotated/(\d+)$', img_views.serve_doc,{"annotated": True}),
                       url(r'^pdf4/rpc', include(rpc.urls)),
                       url(r'^pdf3/upload', include('upload.urls')),
                       url(r'^$', pages_views.index),
                       url(r'^collage/$', pages_views.collage),
                       url(r'^dev/desktop/(\d+)$', pages_views.dev_desktop),
                       url(r'^welcome$', TemplateView.as_view(template_name='web/welcome.html')),
                       url(r'^faq_student/$', TemplateView.as_view(template_name='web/faq_student.html')),
                       url(r'^faq_instructor/$', TemplateView.as_view(template_name='web/faq_instructor.html')),
                       url(r'^tutorial/$', TemplateView.as_view(template_name='web/tutorial.html')),
                       url(r'^contact/$', TemplateView.as_view(template_name='web/contact.html')),
                       url(r'^about/$', TemplateView.as_view(template_name='web/about.html')),
                       url(r'^disclaimer/$', TemplateView.as_view(template_name='web/disclaimer.html')),
                       url(r'^login$', TemplateView.as_view(template_name='web/login.html')),
                       url(r'^password_reminder/$', TemplateView.as_view(template_name='web/password_reminder.html')),
                       url(r'^terms_public_site/$', TemplateView.as_view(template_name='web/terms_public_site.html')),
                       url(r'^staff_benefits/$', TemplateView.as_view(template_name='web/staff_benefits.html')),
                       url(r'^subscribe_thanks$', TemplateView.as_view(template_name='web/subscribe_thanks.html')),
                       url(r'^notallowed$', TemplateView.as_view(template_name='web/notallowed.html')),
                       url(r'^newsite_thanks$', TemplateView.as_view(template_name='web/subscribe_thanks.html')),

                       url(r'^file/(\d+)$' , pages_views.source),
                       url(r'^f/(\d+)$' , pages_views.source, {"allow_guest": True}),
                       url(r'^f/(\d+)/analyze$' , TemplateView.as_view(template_name='web/source_analytics.html')),
                       url(r'^f/(\d+)/source_analytics' , pages_views.source_analytics),
                       url(r'^c/(\d+)$' , pages_views.comment),
                       url(r'^r/(\d+)$' , pages_views.comment),
                       url(r'^d/(\d+)$' , pages_views.ondemand),
                       url(r'^settings$' , pages_views.your_settings,),
                       url(r'^embedopenid$' , pages_views.embedopenid,),
                       url(r'^invite$', pages_views.invite),
                       url(r'^logout$', TemplateView.as_view(template_name='web/logout.html')),
                       url(r'^membership_from_invite$', pages_views.membership_from_invite),
                       url(r'^newsite$', pages_views.newsite),
                       url(r'^newsite_form$', pages_views.newsite_form),
                       url(r'^subscribe$', pages_views.subscribe),
                       url(r'^subscribe_with_key$', pages_views.subscribe_with_key),
                       url(r'^user_name_form$', pages_views.user_name_form),
                       url(r'^confirm_invite$', TemplateView.as_view(template_name='web/confirm_invite.html')),
                       url(r'^enteryourname$', TemplateView.as_view(template_name='web/enteryourname.html')),
                       url(r'^properties/ensemble/(\d+)$', pages_views.properties_ensemble),
                       url(r'^properties/ensemble_users/(\d+)$', pages_views.properties_ensemble_users),
                       url(r'^properties/ensemble_sections/(\d+)$', pages_views.properties_ensemble_sections),
                       url(r'^addhtml/(\d+)$', pages_views.add_html_doc),
                       url(r'^addyoutube/(\d+)$', pages_views.add_youtube_doc),
                       url(r'^fbchannel$', pages_views.fbchannel),  #TODO: not sure this is needed anymore.
                       url(r'^spreadsheet$', pages_views.spreadsheet),
                       url(r'^spreadsheet_cluster/download/(\d+)$', img_views.spreadsheet_cluster),
                       url(r'^spreadsheet_comments/download/(\d+)$', img_views.spreadsheet_comments),
                       url(r'^spreadsheet/download/(\d+)$', img_views.serve_grades_spreadsheet),
                       url(r'^debug', pages_views.debug),
                       url(r'^polls', include(polls.urls)),
                       ]

urlpatterns += [
                        url(r'^robots.txt/$', TemplateView.as_view(template_name='web/robots.txt'))
    ]
urlpatterns += [
                        url(r'djangoadmin/',    include(admin.site.urls)),
                        url(r'^openid/', include('django_openid_auth.urls')),
                        url(r'^openid_logout/$', auth_views.logout),
                        url(r'^openid_private/$', pages_views.require_authentication),
                        url(r'^openid_index$', pages_views.openid_index),
#                        url(r'^facebook/', include('django_facebook.urls')),
#                        url(r'^accounts/', include('django_facebook.auth_urls'))
#                        url(r'^facebooksample$', pages_views.facebooksample),
#                        url(r'^facebook/login$', 'facebook.views.login),
#                        url(r'^facebook/authentication_callback$', 'facebook.views.authentication_callback'),
                        url(r'^logout$', auth_views.logout),
]


#embedded NB to annotate HTML:
urlpatterns += [
    url(r'^embed_NB.js$', static.serve,
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, )), "path":"compiled/embed_NB.js" })
]


#this is short-circuited by apache when running as production: it's only useful when running from the debug server
urlpatterns += [
    url(r'^content/(?P<path>.*)$', static.serve,
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, ))})

     ]



