# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
from django.urls import include, re_path
from . import views

urlpatterns = [
    re_path(r'^js/textareas/(?P<name>.+)/$', views.textareas_js, name='tinymce-js')
]
