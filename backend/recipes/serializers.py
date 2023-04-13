from dataclasses import fields
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from accounts.serializers import CreateUserSerializer, CommentUserSerializer
from recipes.models import *
from django.db.models import Avg
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404


#all serializers taken from class and https://www.django-rest-framework.org/api-guide/serializers/

class DietSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Diet
        fields = ['id', 'name']


class CuisineSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cuisine
        fields = ['id', 'name']


class BaseIngredientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BaseIngredient
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    
    recipe = serializers.CharField(read_only=True)
    
    class Meta:
        model = Ingredient
        fields = ['id', 'base_ingredient', 'recipe', 'quantity']


class RecipeSerializer(serializers.ModelSerializer):
    
    owner = serializers.CharField(read_only=True)
    base_recipe = serializers.CharField(read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id',
                  'owner',
                  'name',
                  'description',
                  'diet',
                  'cuisine',
                  'serving',
                  'prep_time',
                  'cooking_time',
                  'base_recipe']


class StepSerializer(serializers.ModelSerializer):
    
    images = serializers.SerializerMethodField('get_images')
    videos = serializers.SerializerMethodField('get_videos')
    
    def get_images(self, step):
        
        queryset = step.step_images.all()
        
        data = [{'image': str(img.image)} for img in queryset]
        
        return data
    
    def get_videos(self, step):
        
        queryset = step.step_videos.all()
        
        data = [{'video': str(vid.video)} for vid in queryset]
        
        return data
    
    class Meta:
        model = Step
        fields = ['number',
                  'name',
                  'description',
                  'prep_time',
                  'cooking_time',
                  'recipe',
                  'images',
                  'videos']


class ShowRecipeSerializer(serializers.ModelSerializer):
    
    owner = serializers.CharField(read_only=True)
    owner_id = serializers.SerializerMethodField('get_owner_id')
    owner_name = serializers.SerializerMethodField('get_owner_full_name')
    diet = DietSerializer(many=True, read_only=True)
    cuisine = CuisineSerializer(many=True, read_only=True)
    #https://www.django-rest-framework.org/api-guide/fields/#serializermethodfield
    ingredients_info = serializers.SerializerMethodField('get_ingredients')
    base_recipe = serializers.CharField(read_only=True)
    steps = StepSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField('get_images')
    videos = serializers.SerializerMethodField('get_videos')
    favorites = serializers.SerializerMethodField('get_favorites')
    num_ratings = serializers.SerializerMethodField('get_num_ratings')
    average_rating = serializers.SerializerMethodField('get_avg_rating')
    avatar = serializers.SerializerMethodField('get_avatar')
    
    def get_avatar(self, recipe):
        user = get_object_or_404(get_user_model(), email=recipe.owner)
        
        if (not user.avatar):
            return ""
        
        return str(user.avatar)
    
    def get_owner_id(self, recipe):
        user = get_object_or_404(get_user_model(), email=recipe.owner)
        return user.pk
    
    def get_avg_rating(self, recipe):
        return Rating.objects.filter(recipe=recipe).aggregate(Avg('stars')).get('stars__avg')
    
    def get_num_ratings(self, recipe):
        return Rating.objects.filter(recipe=recipe).count()
    
    def get_owner_full_name(self, recipe):
        
        first = recipe.owner.first_name
        last = recipe.owner.last_name
        
        if not first:
            if not last:
                return "Anonymous"
            else:
                return last
        else:
            if not last:
                return first
        
        return first + " " + last
        
            
    def get_favorites(self, recipe):
        
        return Favorite.objects.filter(recipe=recipe).count()
    
    def get_ingredients(self, recipe):
        
        r = recipe
        queryset = Ingredient.objects.filter(recipe=r)
        
        #https://stackoverflow.com/questions/30012470/how-can-i-get-the-string-representation-from-queryset-in-django
        data = [{'id': ingr.id, 'base_id': ingr.base_ingredient.id,  'name': str(ingr.base_ingredient), 'quantity': ingr.quantity} for ingr in queryset]
        
        return data
        
    def get_images(self, recipe):
        
        queryset = recipe.overall_images.all()
        
        data = [{'image': str(img.image)} for img in queryset]
        
        return data
    
    def get_videos(self, recipe):
        
        queryset = recipe.overall_videos.all()
        
        data = [{'video': str(vid.video)} for vid in queryset]
        
        return data

    class Meta:
        model = Recipe
        fields = ['id',
                  'name',
                  'owner',
                  'owner_id',
                  'owner_name',
                  'avatar',
                  'description',
                  'favorites',
                  'num_ratings',
                  'average_rating',
                  'diet',
                  'cuisine',
                  'ingredients_info',
                  'serving',
                  'prep_time',
                  'cooking_time',
                  'base_recipe',
                  'steps',
                  'images',
                  'videos']


class ImageRecipeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ImageRecipe
        fields = ['recipe', 'image']


class VideoRecipeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VideoRecipe
        fields = ['recipe', 'video']


class ImageStepSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ImageStep
        fields = ['step' ,'image']


class VideoStepSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VideoStep
        fields = ['step' ,'video']


class AddToCartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ShoppingListItem
        fields = ['item']


# SOCIAL MEDIA
class CommentSerializer(serializers.ModelSerializer):
    # author_first_name = serializers.CharField(source='author.first_name')
    # author_last_name = serializers.CharField(source='author.last_name')
    # author_avatar = serializers.ImageField(source='author.avatar')
    author = CommentUserSerializer(read_only=True)

    class Meta:
        model = Comment
        # fields = ['author', 'author_first_name', 'author_last_name', 'author_avatar', 'recipe', 'datetime_created',
        # 'content']
        fields = ['id', 'author', 'recipe', 'datetime_created', 'content']


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['recipe', 'content']


class UpdateRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['stars']

class CreateRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['recipe', 'stars']

    def create(self, validated_data):
        user = validated_data.get('user')
        recipe = validated_data.get('recipe')
        stars = validated_data.get('stars')

        rating, created = Rating.objects.update_or_create(
            user=user,
            recipe=recipe,
            defaults={'stars': stars}
        )

        return rating


class CreateFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['recipe']

    def create(self, validated_data):
        user = validated_data.get('user')
        recipe = validated_data.get('recipe')

        favorite, created = Favorite.objects.get_or_create(user=user, recipe=recipe)

        return favorite

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['user', 'recipe', 'datetime_created']
