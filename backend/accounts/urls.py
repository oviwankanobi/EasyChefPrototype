from django.urls import path

from accounts.views import RegisterView, ProfileEditView, ChangePasswordView, GetProfileView, GetUserBasic
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/edit/', ProfileEditView.as_view(), name='profile_edit'),
    path('profile/change-password/',
         ChangePasswordView.as_view(), name='change_password'),
    path('profile/my-profile/', GetProfileView.as_view()),
    path('my-info/', GetUserBasic.as_view())
]
