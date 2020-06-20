# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.conf.urls import url, include
from . import views

from os.path import abspath, dirname, basename 
ROOTDIR = dirname(abspath(__file__))
ROOTDIR_BASENAME = basename(ROOTDIR)


urlpatterns = [
     url(r'^$', views.run,), 
     url(r'^.*$', views.other, ),                  
]
