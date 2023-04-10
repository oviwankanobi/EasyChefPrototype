from django.urls import path
from recipes.views import *

urlpatterns = [

    #did user rate a recipe
    path('is-rated/<int:recipe_id>/', IsRecipeRatedByUser.as_view(), name='did-user-rate'),
    
    #update user rating
    path('update-rating/<int:recipe_id>/', UpdateUserRating.as_view(), name='update-user-rating'),

    #most favorited recipes
    path('popular/', MostPopularRecipes.as_view(), name='popular'),

    path('filter/', SearchAPIView.as_view(), name='search'),

    path('create-recipe/', CreateRecipeView.as_view()),
    
    #delete a recipe
    path('delete-recipe/<int:recipe_id>/', DeleteRecipeView.as_view()),
    
    #admin creates unique diets
    path('create-diet/', CreateDietView.as_view()),
    
    #admin creates unique cuisines
    path('create-cuisine/', CreateCuisineView.as_view()),
    
    #admin creates base ingredients
    path('create-base-ingredient/', CreateBaseIngredientView.as_view()),
    
    #EDIT RECIPE-------------------------------------------------------------------------------
    #edit recipe basic structure (includes changing serving to scale up/down ingredient qtys)
    path('edit-recipe/<int:recipe_id>/', EditRecipeView.as_view()),
    
    #add/delete ingredient (with custom quantity) to recipe
    path('add-ingredient-to-recipe/<int:recipe_id>/', AddIngredientView.as_view()),
    path('delete-ingredient-from-recipe/<int:ingredient_id>/', DeleteIngredientView.as_view()),
    #TODO edit ingredient from recipe (if have time)
    
    #add/delete images/videos of recipe, add/delete images/videos of a step (of a recipe)
    path('add-image-to-recipe/', CreateImageRecipeView.as_view()),
    path('add-video-to-recipe/', CreateVideoRecipeView.as_view()),
    path('add-image-to-step/', CreateImageStepView.as_view()),
    path('add-video-to-step/', CreateVideoStepView.as_view()),
    path('delete-image-from-recipe/<int:image_id>/', DeleteImageRecipeView.as_view()),
    path('delete-video-from-recipe/<int:video_id>/', DeleteVideoRecipeView.as_view()),
    path('delete-image-from-step/<int:image_id>/', DeleteImageStepView.as_view()),
    path('delete-video-from-step/<int:video_id>/', DeleteVideoStepView.as_view()),
    
    #create step for recipe, delete step from recipe
    path('add-step-to-recipe/', CreateStepView.as_view()),
    path('delete-step-from-recipe/<int:step_id>/', DeleteStepView.as_view()),
    
    #/EDIT RECIPE------------------------------------------------------------------------------
    
    path('get-recipe-base/<recipe_id>/', GetRecipeBaseView.as_view()),
    #NOTE: frontend, at the recipe creating page, there will be a dropdown
    #that says "create from base". When pressed, a search bar and submit
    #button will appear that uses our search endpoint so user find a recipe.
    #when the user hits submit, this endpoint will be called to fetch the 
    #data from the base and send it back to the frontend to be used to 
    #prefill the recipe creation form with the data from the base recipe
    #aditionally, the base recipe (id) is sent so frontend prefills that 
    #data too so that when user hits create recipe button, the recipe
    #will have the base recipe link
    
    #ingredient autocomplete
    path('autocomplete-ingredient/', AutocompleteIngredientView.as_view()),

    #recipe details
    path('recipe-details/<int:recipe_id>/', RecipeDetailsView.as_view()),
    
    #adds a recipe to a user's shopping list / cart
    path('add-recipe-to-cart/', AddToCartView.as_view()),
    
    #removes a recipe from a user's shopping list / cart
    path('remove-recipe-from-cart/<int:recipe_id>/', RemoveFromCartView.as_view()),
    
    #shows all items in a cart along with aggregated ingredient qty totals
    path('cart-details/', CartDetailsView.as_view()),

    # SOCIAL MEDIA
    path('comments/all/', AllCommentsView.as_view()),
    path('<int:recipe_id>/comments/', GetCommentsFromRecipesView.as_view()),
    path('comments/create/', CreateCommentView.as_view()),
    path('comments/<int:id>/', DeleteCommentView.as_view()),
    path('comments/user/<int:user_id>/', GetUserCommentsView.as_view()),

    path('rate/', CreateRatingView.as_view()),
    path('ratings/<int:recipe_id>/', RemoveRatingView.as_view()),
    path('<int:recipe_id>/average-rating/', GetRecipeAverageRatingView.as_view()),
    path('ratings/', GetRecipesRatedByUserView.as_view()),

    path('favorite/', AddFavoriteRecipeView.as_view()),
    path('favorite/<int:recipe_id>/', RemoveFavoriteView.as_view()),
    path('favorite/user/<int:user_id>/', GetUserFavoritesView.as_view()),
    path('<int:recipe_id>/favorites/', CountRecipeFavoritesView.as_view()),

    path('interacted-recipes/', GetUserInteractedRecipesView.as_view()),
    path('my-recipes/', GetRecipesMadeByUserView.as_view()),

]
