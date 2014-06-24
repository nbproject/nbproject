# Copyright (c) 2010-2012 Massachusetts Institute of Technology.
# MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)

from django.conf.urls import patterns, url, include

from os.path import abspath, dirname, basename 
ROOTDIR = dirname(abspath(__file__))
ROOTDIR_BASENAME = basename(ROOTDIR)

#urlpatterns = patterns(ROOTDIR_BASENAME+".rpc.views",
urlpatterns = patterns("rpc.views",
     (r'^$', 'run',), 
     (r'^.*$', "other", ),                  
)
