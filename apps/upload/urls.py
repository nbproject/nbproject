# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.conf.urls import  url, include
from . import views

urlpatterns = [
     url(r'^$', views.upload,), 
     url(r'^/update$', views.update,),          
]
