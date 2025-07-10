# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
from os.path import abspath, dirname, basename
from django.urls import include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
import rpc.urls
import polls.urls
from django.conf import settings
import img.views as img_views
import pages.views as pages_views
import django.contrib.auth.views as auth_views
import django.views.static as static

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
                           re_path(r'^.*$',f_redirect ),
                        ]

urlpatterns = [
                       re_path(r'^pdf/cache2/(\d+)/(\d+)/(\d+)$', img_views.serve_img,),
                       re_path(r'^pdf/repository/(\d+)$', img_views.serve_doc,{"annotated": False}),
                       re_path(r'^pdf/annotated/(\d+)$', img_views.serve_doc,{"annotated": True}),
                       re_path(r'^pdf4/rpc', include(rpc.urls)),
                       re_path(r'^pdf3/upload', include('upload.urls')),
                       re_path(r'^$', pages_views.index),
                       re_path(r'^collage/$', pages_views.collage),
                       re_path(r'^dev/desktop/(\d+)$', pages_views.dev_desktop),
                       re_path(r'^welcome$', TemplateView.as_view(template_name='web/welcome.html')),
                       re_path(r'^faq_student/$', TemplateView.as_view(template_name='web/faq_student.html')),
                       re_path(r'^faq_instructor/$', TemplateView.as_view(template_name='web/faq_instructor.html')),
                       re_path(r'^tutorial/$', TemplateView.as_view(template_name='web/tutorial.html')),
                       re_path(r'^contact/$', TemplateView.as_view(template_name='web/contact.html')),
                       re_path(r'^about/$', TemplateView.as_view(template_name='web/about.html')),
                       re_path(r'^disclaimer/$', TemplateView.as_view(template_name='web/disclaimer.html')),
                       re_path(r'^login$', TemplateView.as_view(template_name='web/login.html')),
                       re_path(r'^password_reminder/$', TemplateView.as_view(template_name='web/password_reminder.html')),
                       re_path(r'^terms_public_site/$', TemplateView.as_view(template_name='web/terms_public_site.html')),
                       re_path(r'^staff_benefits/$', TemplateView.as_view(template_name='web/staff_benefits.html')),
                       re_path(r'^subscribe_thanks$', TemplateView.as_view(template_name='web/subscribe_thanks.html')),
                       re_path(r'^notallowed$', TemplateView.as_view(template_name='web/notallowed.html')),
                       re_path(r'^newsite_thanks$', TemplateView.as_view(template_name='web/subscribe_thanks.html')),

                       re_path(r'^file/(\d+)$' , pages_views.source),
                       re_path(r'^f/(\d+)$' , pages_views.source, {"allow_guest": True}),
                       re_path(r'^f/(\d+)/analyze$' , TemplateView.as_view(template_name='web/source_analytics.html')),
                       re_path(r'^f/(\d+)/source_analytics' , pages_views.source_analytics),
                       re_path(r'^c/(\d+)$' , pages_views.comment),
                       re_path(r'^r/(\d+)$' , pages_views.comment),
                       re_path(r'^d/(\d+)$' , pages_views.ondemand),
                       re_path(r'^settings$' , pages_views.your_settings,),
#                       re_path(r'^embedopenid$' , pages_views.embedopenid,),
                       re_path(r'^invite$', pages_views.invite),
                       re_path(r'^logout$', TemplateView.as_view(template_name='web/logout.html')),
                       re_path(r'^membership_from_invite$', pages_views.membership_from_invite),
                       re_path(r'^newsite$', pages_views.newsite),
                       re_path(r'^newsite_form$', pages_views.newsite_form),
                       re_path(r'^subscribe$', pages_views.subscribe),
                       re_path(r'^subscribe_with_key$', pages_views.subscribe_with_key),
                       re_path(r'^user_name_form$', pages_views.user_name_form),
                       re_path(r'^confirm_invite$', TemplateView.as_view(template_name='web/confirm_invite.html')),
                       re_path(r'^enteryourname$', TemplateView.as_view(template_name='web/enteryourname.html')),
                       re_path(r'^properties/ensemble/(\d+)$', pages_views.properties_ensemble),
                       re_path(r'^properties/ensemble_users/(\d+)$', pages_views.properties_ensemble_users),
                       re_path(r'^properties/ensemble_sections/(\d+)$', pages_views.properties_ensemble_sections),
                       re_path(r'^addhtml/(\d+)$', pages_views.add_html_doc),
                       re_path(r'^addyoutube/(\d+)$', pages_views.add_youtube_doc),
                       re_path(r'^fbchannel$', pages_views.fbchannel),  #TODO: not sure this is needed anymore.
                       re_path(r'^spreadsheet$', pages_views.spreadsheet),
                       re_path(r'^spreadsheet_cluster/download/(\d+)$', img_views.spreadsheet_cluster),
                       re_path(r'^spreadsheet_comments/download/(\d+)$', img_views.spreadsheet_comments),
                       re_path(r'^spreadsheet/download/(\d+)$', img_views.serve_grades_spreadsheet),
                       re_path(r'^debug', pages_views.debug),
                       re_path(r'^polls', include(polls.urls)),
                       ]

urlpatterns += [
                        re_path(r'^robots.txt/$', TemplateView.as_view(template_name='web/robots.txt'))
    ]
urlpatterns += [
                        re_path(r'djangoadmin/',    admin.site.urls),
                        re_path(r'^logout$', auth_views.LogoutView.as_view(), name='logout'),
]


#embedded NB to annotate HTML:
urlpatterns += [
    re_path(r'^embed_NB.js$', static.serve,
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, )), "path":"compiled/embed_NB.js" })
]


#this is short-circuited by apache when running as production: it's only useful when running from the debug server
urlpatterns += [
    re_path(r'^content/(?P<path>.*)$', static.serve,
     {'document_root':  abspath("%s/../../content/" % (ROOTDIR, ))})

     ]



