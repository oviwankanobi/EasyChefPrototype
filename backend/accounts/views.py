from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from accounts.serializers import CreateUserSerializer, UpdateUserSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

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
    
class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        u = get_object_or_404(UserModel, id=request.user.id)
        serializer = UpdateUserSerializer(u)
        print (serializer.data)
        return Response(serializer.data)
