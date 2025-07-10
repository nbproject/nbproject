# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.urls import  re_path, include
from . import views

urlpatterns = [
     re_path(r'^$', views.upload,), 
     re_path(r'^update$', views.update,),          
]
