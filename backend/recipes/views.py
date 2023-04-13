from django.db.models import Avg
from rest_framework import status, exceptions
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework_simplejwt.authentication import JWTAuthentication
from distutils.log import debug
from django.shortcuts import render
from rest_framework import views
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from recipes.serializers import *
from django.shortcuts import get_object_or_404
import os
from rest_framework import filters
from rest_framework.filters import SearchFilter, OrderingFilter
from recipes.filters import RecipeFilter
from rest_framework.response import Response
from recipes.models import Comment
from django.db.models import Count

class GetRecipes(ListAPIView):
    queryset = Recipe.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ShowRecipeSerializer
    
class GetIngredients(ListAPIView):
    queryset = Ingredient.objects.all()
    permissions_classes = [AllowAny]
    serializer_class = IngredientSerializer
    
class GetDiets(ListAPIView):
    queryset = Diet.objects.all()
    permissions_classes = [AllowAny]
    serializer_class = DietSerializer
    
class GetCuisines(ListAPIView):
    queryset = Cuisine.objects.all()
    permissions_classes = [AllowAny]
    serializer_class = CuisineSerializer
    
class GetBaseIngredients(ListAPIView):
    queryset = BaseIngredient.objects.all()
    permissions_classes = [AllowAny]
    serializer_class = BaseIngredientSerializer
  
class SearchAPIView(ListAPIView):
    # https://stackoverflow.com/questions/31933239/using-annotate-or-extra-to-add-field-of-foreignkey-to-queryset-equivalent-of
    queryset = Recipe.objects.annotate(avg_rating=Avg('recipe_ratings__stars'))
    serializer_class = ShowRecipeSerializer
    permission_classes = [AllowAny]
    # https://www.django-rest-framework.org/api-guide/filtering/
    filter_backends = [SearchFilter, OrderingFilter, RecipeFilter]
    search_fields = ['name','owner__first_name','owner__last_name','ingredients__name']
    ordering_fields = ['avg_rating']
    ordering = ['avg_rating']

#all views below are used from lecture unless additional external source is provided
#views with overriden functions are taken internall from django rest framework
#(for example: ctrl + left click on CreateAPIView to see source code + methods)

class CreateRecipeView(CreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class GetRecipeBaseView(RetrieveAPIView):
    serializer_class = ShowRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        base_id = self.kwargs['recipe_id']
        base = get_object_or_404(Recipe, id=base_id)
        base.base_recipe = base
        
        return base

class AddIngredientView(CreateAPIView):
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        
        rcp = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        
        if rcp.owner != self.request.user:
            raise PermissionDenied()

        serializer.save(recipe=rcp)


class DeleteIngredientView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return get_object_or_404(Ingredient, id=self.kwargs['ingredient_id'])
    
    def perform_destroy(self, instance):

        if instance.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        instance.delete()
        

class CreateDietView(CreateAPIView):
    serializer_class = DietSerializer
    permission_classes = [AllowAny]


class CreateCuisineView(CreateAPIView):
    serializer_class = CuisineSerializer
    permission_classes = [AllowAny]


class CreateBaseIngredientView(CreateAPIView):
    serializer_class = BaseIngredientSerializer
    permission_classes = [AllowAny]


class CreateImageRecipeView(CreateAPIView):
    serializer_class = ImageRecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data['recipe'].owner != self.request.user:
            raise PermissionDenied()

        serializer.save()


class CreateVideoRecipeView(CreateAPIView):
    serializer_class = VideoRecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data['recipe'].owner != self.request.user:
            raise PermissionDenied()

        serializer.save()

class CreateStepView(CreateAPIView):
    serializer_class = StepSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data['recipe'].owner != self.request.user:
            raise PermissionDenied()

        serializer.save()

class CreateImageStepView(CreateAPIView):
    serializer_class = ImageStepSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data['step'].recipe.owner != self.request.user:
            raise PermissionDenied()

        serializer.save()

class CreateVideoStepView(CreateAPIView):
    serializer_class = VideoStepSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.validated_data['step'].recipe.owner != self.request.user:
            raise PermissionDenied()

        serializer.save()


class DeleteImageRecipeView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ImageRecipe, id=self.kwargs['image_id'])
    
    def perform_destroy(self, instance):

        if instance.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        #https://docs.python.org/2/library/os.html#os.remove
        #delete image from server media
        os.remove(instance.image.path)
        
        instance.delete()
        

class DeleteVideoRecipeView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(VideoRecipe, id=self.kwargs['video_id'])
    
    def perform_destroy(self, instance):

        if instance.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        #delete image from server media
        os.remove(instance.video.path)
        
        instance.delete()


class DeleteImageStepView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ImageStep, id=self.kwargs['image_id'])
    
    def perform_destroy(self, instance):

        if instance.step.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        #delete image from server media
        os.remove(instance.image.path)
        
        instance.delete()


class DeleteVideoStepView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(VideoStep, id=self.kwargs['video_id'])
    
    def perform_destroy(self, instance):

        if instance.step.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        #delete image from server media
        os.remove(instance.video.path)
        
        instance.delete()


class DeleteStepView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Step, id=self.kwargs['step_id'])
    
    def perform_destroy(self, instance):

        if instance.recipe.owner != self.request.user:
            raise PermissionDenied()
        
        #delete all images and videos of step from server media
        for si in instance.step_images.all():
            os.remove(si.image.path)
        
        for sv in instance.step_videos.all():
            os.remove(sv.video.path)
        
        #all ImageStep and VideoStep objects will be deleted
        #since they are set to cascade on step delete
        instance.delete()


class DeleteRecipeView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
    
    def perform_destroy(self, instance):

        if instance.owner != self.request.user:
            raise PermissionDenied()
        
        #delete images/videos of recipe from server media
        for ri in instance.overall_images.all():
            os.remove(ri.image.path)
        
        for rv in instance.overall_videos.all():
            os.remove(rv.video.path)
        
        
        #delete all images and videos of all steps from recipe (from server media)
        for stp in instance.steps.all():
            
            for si in stp.step_images.all():
                os.remove(si.image.path)
            
            for sv in stp.step_videos.all():
                os.remove(sv.video.path)
        
        #overall image/video objs are deleted since they cascade on recipe delete.
        #also, steps are set to cascade, so on recipe delete, all step objs will be deleted
        #which consequently deletes all image/video objs from all steps since they
        #are also set to cascade on step delete.
        instance.delete()


class EditRecipeView(UpdateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
        
    def get_object(self):
        rcp = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        
        if rcp.owner != self.request.user:
            raise PermissionDenied()
        
        return rcp

    def perform_update(self, serializer):
        
        old_serving = get_object_or_404(Recipe, id=self.kwargs['recipe_id']).serving
        rcp = serializer.save()
        new_serving = rcp.serving
        
        if old_serving != new_serving:
        
            multiplier = new_serving / old_serving
            
            for ingr in Ingredient.objects.filter(recipe=rcp):
                ingr.quantity = ingr.quantity * multiplier
                ingr.save()

#https://medium.com/swlh/searching-in-django-rest-framework-45aad62e7782
class AutocompleteIngredientView(ListAPIView):
    serializer_class = BaseIngredientSerializer
    permission_classes = [AllowAny]
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    queryset = BaseIngredient.objects.all()


class RecipeDetailsView(RetrieveAPIView):
    serializer_class = ShowRecipeSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['recipe_id'])


class AddToCartView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddToCartSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


#delete an item to user's shopping cart
class RemoveFromCartView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        
        obj = ShoppingListItem.objects.filter(owner=self.request.user,
                                              item=self.kwargs['recipe_id'])
        
        if obj.count() == 0:
            raise NotFound()
        
        return obj[0]


#add an item to user's shopping cart
class CartDetailsView(views.APIView):
    
    #NOTE: frontend: everytime a user changes serving of a recipe in shopping list, 
    #call a PATCH to edit-recipe/<int:recipe_id>/ with new serving
    #then call shopping-list-details/ to see all updates
    
    def get(self, request):

        usr = request.user
        if not usr.is_authenticated:
            return Response({'error': 'not logged in'}, status=401)
        
        result = []
        all_ingredients = []
        
        for item in usr.shopping_list_items.all():
            
            rec = item.item
            
            ingr_queryset = Ingredient.objects.filter(recipe=rec)
            recipe_ingredients = [
                {'ingredient': str(ingr.base_ingredient), 'quantity': ingr.quantity} for ingr in ingr_queryset   
            ]
            all_ingredients += recipe_ingredients
        
            rec_details = [{"id": rec.id,
                            "name": rec.name,
                            "ingredients": recipe_ingredients}]
            result += rec_details
        
        sum_dict = {}
        for dict in all_ingredients:
            val = dict['ingredient']
            
            #if exists, increment sum_dict[val] by dict[]
            if val in sum_dict:
                sum_dict[val] += dict['quantity']
            else: #if doesn't exist, add it
                sum_dict[val] = dict['quantity']
            
        totals = [{'Totals': sum_dict}]
        
        result += totals
        
        return Response(result)


class MostPopularRecipes(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ShowRecipeSerializer
    
    def get_queryset(self):
        top = []
        favorites = Favorite.objects.all().values('recipe').annotate(total=Count('recipe')).order_by('-total')[:2] #top 2
                
        for fav in favorites:
            top.append(fav.get('recipe'))
        
        return Recipe.objects.all().filter(pk__in=top)


# ==== SOCIAL MEDIA ===
class CommentsPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 10000


class AllCommentsView(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentsPagination

    def get_queryset(self):
        return Comment.objects.all().order_by('-datetime_created')


class CreateCommentView(CreateAPIView):
    """
    (POST) localhost:8000/recipes/comments/create/
    Creates a comment on a recipe by the currently logged in user.

    ==== Body parameters ====
    content: the text content of the comment.
    recipe: the id of the recipe you want to comment on.

    ==== Returns ====
    Status:
        - 201 Created: If the comment was succesfully created.
        - 401 Unauthorized: If the user is not currently logged in.
        - 404 Not Found: If no recipe with id <recipe> exists
    """
    serializer_class = CreateCommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    #
    # https://www.django-rest-framework.org/api-guide/generic-views/
    def create(self, request, *args, **kwargs):
        get_object_or_404(Recipe, id=request.data.get('recipe'))
        return super().create(request, *args, **kwargs)

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GetUserCommentsView(ListAPIView):
    """
    (GET) localhost:8000/recipes/comments/user/:user_id
    Gets the paginated comments created by the specified user.

    ==== Path parameters ====
    user_id: The id of the specified user.

    ==== Returns ====
    Status:
        - 200 OK: If the request is successful.
        - 404 Not Found: If no user with id <user_id> exists.
    """
    serializer_class = CommentSerializer
    pagination_class = CommentsPagination

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(get_user_model(), id=user_id)
        return Comment.objects.filter(author=user).order_by('-datetime_created')


class GetCommentsFromRecipesView(ListAPIView):
    """
    (GET) localhost:8000/recipes/:recipe_id/comments/
    Gets the paginated comments of a specified recipe.

    ==== Path parameters ====
    recipe_id: The id of the specified recipe.

    ==== Returns ====
    Status:
        - 200 OK: If the request is successful.
        - 404 Not Found: If no recipe with id <recipe_id> exists.
    """
    serializer_class = CommentSerializer
    pagination_class = CommentsPagination

    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id', None)
        recipe = get_object_or_404(Recipe, id=recipe_id)
        return Comment.objects.filter(recipe=recipe).order_by('-datetime_created')


class DeleteCommentView(DestroyAPIView):
    """
    (GET) localhost:8000/recipes/comments/:id/
    Deletes a specified comment.

    ==== Path parameters ====
    id: The id of the comment to be deleted.

    ==== Returns ====
    Status:
        - 204 No Content: If the deletion was successful.
        - 401 Unauthorized: If the user is not logged in.
        - 403 Forbidden: If the currently logged-in user is not the creator of the comment.
        - 404 Not Found: If no recipe with id <recipe_id> exists.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            raise exceptions.PermissionDenied
        instance.delete()


class CreateRatingView(CreateAPIView):
    """
    (POST) localhost:8000/recipes/rate/
    Creates a rating on the recipe by the currently logged-in user.

    ==== Body parameters ====
    recipe: the id of the recipe you want to rate.
    stars: how many stars you want to give in your rating (must be an integer between 0-5)


    """
    serializer_class = CreateRatingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def create(self, request, *args, **kwargs):
        get_object_or_404(Recipe, id=request.data.get('recipe'))
        return super().create(request, *args, **kwargs)

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RemoveRatingView(DestroyAPIView):
    serializer_class = CreateRatingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        recipe_id = self.kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        rating = get_object_or_404(Rating, user=user, recipe=recipe)
        return rating

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            raise exceptions.PermissionDenied
        instance.delete()


def get_average_rating(recipe):
    ratings_queryset = Rating.objects.filter(recipe=recipe)
    return ratings_queryset.aggregate(Avg('stars')).get('stars__avg')


class GetRecipeAverageRatingView(views.APIView):
    # https://docs.djangoproject.com/en/4.1/topics/db/aggregation/
    def get(self, request, *args, **kwargs):
        recipe_id = kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        info = {}
        ratings_queryset = Rating.objects.filter(recipe=recipe)
        info['num_ratings'] = ratings_queryset.count()
        info['average_rating'] = ratings_queryset.aggregate(Avg('stars')).get('stars__avg')

        return Response(info, status=status.HTTP_200_OK)


class AddFavoriteRecipeView(CreateAPIView):
    serializer_class = CreateFavoriteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def create(self, request, *args, **kwargs):
        get_object_or_404(Recipe, id=request.data.get('recipe'))
        return super().create(request, *args, **kwargs)

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RemoveFavoriteView(DestroyAPIView):
    serializer_class = CreateFavoriteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        recipe_id = self.kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        favorite = get_object_or_404(Favorite, user=user, recipe=recipe)
        return favorite

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            raise exceptions.PermissionDenied
        instance.delete()


class GetUserFavoritesView(ListAPIView):
    serializer_class = FavoriteSerializer
    pagination_class = CommentsPagination

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(get_user_model(), id=user_id)
        return Favorite.objects.filter(user=user).order_by('-datetime_created')


class CountRecipeFavoritesView(views.APIView):
    def get(self, request, *args, **kwargs):
        recipe_id = kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        info = {'favorites': Favorite.objects.filter(recipe=recipe).count()}
        return Response(info, status=status.HTTP_200_OK)


class GetUserInteractedRecipesView(ListAPIView):
    """
    (GET) localhost:8000/recipes/interacted-recipes/
    Gets all the recipes that the user has created, liked, rated, or commented.

    ==== Returns ====
    Status:
        - 200 OK: If the request is successful.
        - 401 Unauthorized: If the user is not logged in.
    """

    serializer_class = RecipeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CommentsPagination

    def get_queryset(self):
        user = self.request.user
        recipes_by_user = Recipe.objects.filter(owner=user)

        # https://docs.djangoproject.com/en/4.1/topics/db/queries/
        # https://docs.djangoproject.com/en/4.1/ref/models/querysets/
        favorites = Favorite.objects.filter(user=user).values('recipe')
        favorited_recipes = Recipe.objects.filter(id__in=models.Subquery(favorites))

        rated = Rating.objects.filter(user_id=user.id).values('recipe')
        rated_recipes = Recipe.objects.filter(id__in=models.Subquery(rated))

        commented = Comment.objects.filter(author=user).values('recipe').distinct()
        commented_recipes = Recipe.objects.filter(id__in=models.Subquery(commented))

        interacted_recipes = recipes_by_user | favorited_recipes | rated_recipes | commented_recipes

        return interacted_recipes


class GetRecipesRatedByUserView(ListAPIView):
    """
    (GET) localhost:8000/recipes/my-ratings/
    Gets all the ratings that the user has made.

    ==== Returns ====
    Status:
        - 200 OK: If the request is successful.
        - 401 Unauthorized: If the user is not logged in.
    """

    serializer_class = CreateRatingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CommentsPagination

    def get_queryset(self):
        user = self.request.user
        # rated = Rating.objects.filter(user_id=user.id).values('recipe')
        # rated_recipes = Recipe.objects.filter(id__in=models.Subquery(rated))

        return Rating.objects.filter(user_id=user.id)


class GetRecipesMadeByUserView(ListAPIView):
    """
    (GET) localhost:8000/recipes/my-recipes/
    Gets all the recipes that the user has created.

    ==== Returns ====
    Status:
        - 200 OK: If the request is successful.
        - 401 Unauthorized: If the user is not logged in.
    """

    serializer_class = RecipeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CommentsPagination

    def get_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(owner=user)

class IsRecipeRatedByUser(views.APIView):
    def get(self, request, recipe_id):
        
        user = request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        
        return Response({'is_rated': Rating.objects.filter(user=user, recipe=recipe).count()})
    

class IsRecipeFavoritedByUser(views.APIView):
    def get(self, request, recipe_id):
        
        user = request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)
        
        return Response({'is_favorited': Favorite.objects.filter(user=user, recipe=recipe).count()})
    
    
class GetNumFavsRecipe(views.APIView):
    def get(self, request, recipe_id):
        return Response({'num_favs': Favorite.objects.filter(recipe=recipe_id).count()})
    
#update user rating
class UpdateUserRating(UpdateAPIView):
    serializer_class = UpdateRatingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user=self.request.user
        recipe=self.kwargs['recipe_id']
        rating = get_object_or_404(Rating, user=user, recipe=recipe)
        
        return rating

class EditStepView(UpdateAPIView):
    serializer_class = EditStepSerializer
    permission_classes = [IsAuthenticated]
        
    def get_object(self):
        return get_object_or_404(Step, id=self.kwargs['step_id'])
        