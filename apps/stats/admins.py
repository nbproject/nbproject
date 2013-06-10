from django.contrib import admin
import models as M

admin_site = admin.AdminSite("Stats admin app")
admin_site.register(M.Section)
admin_site.register(M.Report)
admin_site.register(M.SectionUnit)


