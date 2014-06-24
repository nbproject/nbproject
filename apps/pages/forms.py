from django.forms import Form, ModelForm, ValidationError
from base import models as M
from django.forms.fields import CharField
from django.forms.widgets import PasswordInput


class EnterYourNameUserForm(ModelForm):    
    def clean_firstname(self):
        data = self.cleaned_data["firstname"].strip()
        if data == "": 
            raise ValidationError("First name can't be empty")
        return data
    
    def clean_lastname(self):
        data = self.cleaned_data["lastname"].strip()
        if data == "": 
            raise ValidationError("Last name can't be empty")
        return data    
        
    class Meta: 
        model = M.User
        fields = ("firstname", "lastname")

class UserForm(ModelForm):
    confirm_password = CharField(widget=PasswordInput())
    def clean_email(self):
        return self.cleaned_data["email"].strip().lower()
        
    def clean(self):
        super(UserForm, self).clean()
        cleaned_data = self.cleaned_data
        if cleaned_data.get("password") != cleaned_data.get("confirm_password"): 
            raise ValidationError("passwords don't match")
        return cleaned_data

    def save(self, force_insert=False, force_update=False, commit=True):
        m = super(UserForm, self).save(commit=False)
        m.password = None
        m.set_password(self.cleaned_data.get("password"))
        if commit:
            m.save()
        return m

    class Meta: 
        model = M.User
        fields = ( "firstname", "lastname", "email", "password", "confirm_password")
        widgets  = {
            'password': PasswordInput(),
        }

class EnsembleForm(ModelForm):
    class Meta: 
        model = M.Ensemble
        exclude = ("invitekey",)


class Html5Form(Form):
    title = CharField(max_length=256)
    url = CharField(max_length=1024)


class YoutubeForm(Form):
    #title = CharField(max_length=256)
    url = CharField(max_length=1024)


class SourceForm(ModelForm): 
    class Meta: 
        model = M.Source
        exclude = ("numpages", "w", "h", "rotation", "version", "type", "submittedby")

class HTML5InfoForm(ModelForm): 
    class Meta: 
        model = M.HTML5Info
        exclude = ("source",)

#class EditEnsembleForm(ModelForm):
#    class Meta: 
#        model = M.Ensemble
#        exclude = ("invitekey")
