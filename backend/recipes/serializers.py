from dataclasses import fields
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from accounts.serializers import CreateUserSerializer, CommentUserSerializer
from recipes.models import *


#all serializers taken from class and https://www.django-rest-framework.org/api-guide/serializers/

class DietSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Diet
        fields = ['name']


class CuisineSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cuisine
        fields = ['name']


class BaseIngredientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BaseIngredient
        fields = ['name']


class IngredientSerializer(serializers.ModelSerializer):
    
    recipe = serializers.CharField(read_only=True)
    
    class Meta:
        model = Ingredient
        fields = ['base_ingredient', 'recipe', 'quantity']


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
    
    class Meta:
        model = Step
        fields = ['number',
                  'name',
                  'description',
                  'prep_time',
                  'cooking_time',
                  'recipe']


class ShowRecipeSerializer(serializers.ModelSerializer):
    
    owner = serializers.CharField(read_only=True)
    diet = DietSerializer(many=True, read_only=True)
    cuisine = CuisineSerializer(many=True, read_only=True)
    #https://www.django-rest-framework.org/api-guide/fields/#serializermethodfield
    ingredients_info = serializers.SerializerMethodField('get_ingredients')
    base_recipe = serializers.CharField(read_only=True)
    steps = StepSerializer(many=True, read_only=True)
    
    def get_ingredients(self, recipe):
        
        r = recipe
        queryset = Ingredient.objects.filter(recipe=r)
        
        #https://stackoverflow.com/questions/30012470/how-can-i-get-the-string-representation-from-queryset-in-django
        data = [{'name': str(ingr.base_ingredient), 'quantity': ingr.quantity} for ingr in queryset]
        
        return data
        

    class Meta:
        model = Recipe
        fields = ['id',
                  'owner',
                  'name',
                  'description',
                  'diet',
                  'cuisine',
                  'ingredients_info',
                  'serving',
                  'prep_time',
                  'cooking_time',
                  'base_recipe',
                  'steps']


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
        fields = ['author', 'recipe', 'datetime_created', 'content']


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['recipe', 'content']


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
