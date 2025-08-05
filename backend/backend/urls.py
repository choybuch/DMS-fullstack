from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from documents import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'documents', views.DocumentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/search/', views.SearchAPIView.as_view(), name='search'),
    path('admin/', admin.site.urls),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)