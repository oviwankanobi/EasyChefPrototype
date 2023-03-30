from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

#https://django-phonenumber-field.readthedocs.io/en/latest/index.html
from phonenumber_field.modelfields import PhoneNumberField

#https://docs.djangoproject.com/en/4.1/topics/auth/customizing/#substituting-a-custom-user-model

class UserManager(BaseUserManager):
    
    def create_superuser(self, email, password, **kwargs):
            user = self.create_user(
                kwargs.get('first_name'),
                kwargs.get('last_name'),
                email,
                password,
                kwargs.get('avatar'),
                kwargs.get('phone_number')
            )
            user.is_admin = True
            user.is_staff = True
            user.save()
            return user
    
    def create_user(self, first_name, last_name, email, password, avatar, phone_number):
        
        user = self.model(
            first_name = first_name,
            last_name = last_name,
            email=self.normalize_email(email),
            avatar = avatar,
            phone_number = phone_number,
        )

        user.set_password(password)
        user.save()
        return user
    
    
class User(AbstractBaseUser):
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
        null=False,
        blank=False,
    )
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

