from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()
urlpatterns = [
                       url(r'admin/',    include(admin.site.urls)),
]


