from django.contrib import admin
import models as M
print "before adminsite"
admin_site = admin.AdminSite("Stats admin app")
print "after adminsite"

admin_site.register(M.Environment)
admin_site.register(M.Report)
print admin_site.urls

