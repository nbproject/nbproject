# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.urls import  re_path, include
from . import views

urlpatterns = [
     re_path(r'consent$', views.consent,),
    re_path(r'survey', views.survey,),
]
