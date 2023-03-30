from django.urls import path

from accounts.views import RegisterView, ProfileEditView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/edit/', ProfileEditView.as_view(), name='profile_edit'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change_password'),
]

