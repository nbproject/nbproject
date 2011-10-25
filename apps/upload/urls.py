# Copyright (c) 2010 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.conf.urls.defaults import *

urlpatterns = patterns('upload.views',
     (r'^$', 'upload',), 
     (r'^/update$', 'update',),          
)
