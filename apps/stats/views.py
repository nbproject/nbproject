# Create your views here.
from django.shortcuts import render_to_response

def test1(req): 
    return render_to_response("web/stats1.html", {})
