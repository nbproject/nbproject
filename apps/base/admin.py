from django.contrib import admin
import models as M

#The list below was obtained from the models.py file, using the following: 
#egrep '^class' models.py | sed 's|^class \(\w*\)(.*|admin.site.register(M.\1)|'


class EnsembleAdmin(admin.ModelAdmin): 
    list_display = ("name", "description", "allow_guest", "use_invitekey")

admin.site.register(M.User)
admin.site.register(M.Ensemble, EnsembleAdmin)
admin.site.register(M.Folder)
admin.site.register(M.Invite)
admin.site.register(M.Membership)
admin.site.register(M.Source)
admin.site.register(M.Ownership)
admin.site.register(M.Location)
admin.site.register(M.Comment)
admin.site.register(M.Mark)
admin.site.register(M.Processqueue)
