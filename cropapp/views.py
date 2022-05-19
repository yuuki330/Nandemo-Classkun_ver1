from django.views.generic import TemplateView
from django.shortcuts import render

class IndexView(TemplateView):
    template_name = "cropapp/index.html"

# class HomeView(TemplateView):
#     template_name = "cropapp/home.html"

def Index(request):
    return render(request, 'templates/cropapp/index.html')