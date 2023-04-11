from rest_framework import serializers
from rest_framework.serializers import Serializer
from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField

UserModel = get_user_model()

class CreateUserSerializer(serializers.ModelSerializer):

    phone_number = PhoneNumberField(region="CA", required=False)

    class Meta:
        model = UserModel
        fields = ['id',
                  'first_name',
                  'last_name',
                  'email',
                  'password', #confirm password validation done in frontend, which then calls register endpoint with confirmed password
                  'avatar',
                  'phone_number']
    
    def create(self, validated_data):
        
        user = UserModel.objects.create_user(
            first_name=validated_data.get('first_name', ""),
            last_name=validated_data.get('last_name', ""),
            email=validated_data['email'],
            password=validated_data['password'],
            avatar=validated_data.get('avatar', ""),
            phone_number=validated_data.get('phone_number', ""),
        )

        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    
    phone_number = PhoneNumberField(region="CA", required=False)
    
    class Meta:
        model = UserModel
        fields = ['first_name',
                  'last_name',
                  'avatar',
                  'phone_number']
        
#https://stackoverflow.com/questions/38845051/how-to-update-user-password-in-django-rest-framework
class ChangePasswordSerializer(Serializer):
    old_password = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    confirmed_password = serializers.CharField(required=True)

    def validate(self, data):
        if not self.context['request'].user.check_password(data.get('old_password')):
            raise serializers.ValidationError({'old_password': 'Wrong password'})

        if data.get('confirmed_password') != data.get('password'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})

        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance

    @property
    def data(self):
        return {'Success': True}


class CommentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'first_name', 'last_name', 'avatar']
        
class GetUserBasicSerializer(serializers.ModelSerializer):   
    class Meta:
        model = UserModel
        fields = ['id',
                  'first_name',
                  'last_name',
                  'avatar',]