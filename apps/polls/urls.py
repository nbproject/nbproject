# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.conf.urls.defaults import *
import views

urlpatterns = patterns("",
     (r'consent$', views.consent,),
    (r'survey', views.survey,),
)
