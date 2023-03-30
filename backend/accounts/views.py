from rest_framework import permissions
from rest_framework.generics import CreateAPIView, UpdateAPIView
from accounts.serializers import CreateUserSerializer, UpdateUserSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

UserModel = get_user_model()

#all views structure used from lecture

class RegisterView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.AllowAny]
    
class ProfileEditView(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    
