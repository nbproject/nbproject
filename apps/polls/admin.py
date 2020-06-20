from django.contrib import admin
from . import models as M

admin.site.register(M.Consent)
admin.site.register(M.Message)

