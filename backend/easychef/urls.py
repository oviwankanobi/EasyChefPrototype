from django.contrib import admin
from rest_framework import routers
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('accounts/', include('accounts.urls')),
    path('recipes/', include('recipes.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
