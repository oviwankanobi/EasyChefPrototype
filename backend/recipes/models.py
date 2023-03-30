from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import SET_NULL
from django.forms import DurationField
from django.core.validators import FileExtensionValidator, MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

#https://stackoverflow.com/questions/24629705/django-using-get-user-model-vs-settings-auth-user-model#:~:text=get_user_model().,model%20using%20the%20AUTH_USER_MODEL%20setting.
UserModel = get_user_model()


class Diet(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False, unique=True)

    def __str__(self):
        return self.name


class Cuisine(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False, unique=True)

    def __str__(self):
        return self.name


class BaseIngredient(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False, unique=True)
        
    def __str__(self):
        return self.name


class Recipe(models.Model):
    owner = models.ForeignKey(to=UserModel, null=False, blank=False, on_delete=models.CASCADE, related_name="owned_recipes")
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    #https://docs.djangoproject.com/en/4.1/topics/db/examples/many_to_many/
    diet = models.ManyToManyField(Diet, blank=True)
    cuisine = models.ManyToManyField(Cuisine, blank=True)
    #https://docs.djangoproject.com/en/dev/topics/db/models/#extra-fields-on-many-to-many-relationships
    ingredients = models.ManyToManyField(BaseIngredient, through="Ingredient", blank=True)
    serving = models.FloatField(null=False, blank=False, validators=[MinValueValidator(1.0)])
    prep_time = models.DurationField(null=True, blank=True)
    cooking_time = models.DurationField(null=True, blank=True)
    base_recipe = models.ForeignKey('self', null=True, blank=True, on_delete=SET_NULL, related_name="child_recipes")
    
    def __str__(self):
        return self.name

#https://docs.djangoproject.com/en/dev/topics/db/models/#extra-fields-on-many-to-many-relationships
class Ingredient(models.Model):
    base_ingredient = models.ForeignKey(BaseIngredient, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    #https://docs.djangoproject.com/en/4.1/ref/validators/
    quantity = models.FloatField(null=False, blank=False, validators=[MinValueValidator(1.0)])

    def __str__(self):
        return self.base_ingredient.name + " " + str(self.quantity)


#step[number, description, multi photo, multi video, prep time, cooking time]
class Step(models.Model):
    number = models.PositiveSmallIntegerField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    prep_time = models.DurationField(null=True, blank=True)
    cooking_time = models.DurationField(null=True, blank=True)
    recipe = models.ForeignKey(to=Recipe, null=False, blank=False, on_delete=models.CASCADE, related_name="steps")

    def __str__(self):
        return str(self.number) + ": " + self.name

#https://medium.com/ibisdev/upload-multiple-images-to-a-model-with-django-fd00d8551a1c
# ^^also for the image/video models idea
#dynamically creates a path based on existing users, recipes, and steps
def upload_path(instance, filename):
        
    #overall images for recipe
    if isinstance(instance, ImageRecipe):
        user_id = instance.recipe.owner.pk
        recipe_id = instance.recipe.pk
        #images/<user_id>/<recipe_id>/overall_images/
        return 'user_{0}/recipe_{1}/overall_images/{2}'.format(user_id, recipe_id, filename)

    #overall videos for recipe
    if isinstance(instance, VideoRecipe):
        user_id = instance.recipe.owner.pk
        recipe_id = instance.recipe.pk
        #videos/<user_id>/<recipe_id>/overall_videos/
        return 'user_{0}/recipe_{1}/overall_videos/{2}'.format(user_id, recipe_id, filename)

    #images for a step
    if isinstance(instance, ImageStep):
        user_id = instance.step.recipe.owner.pk
        recipe_id = instance.step.recipe.pk
        step_id = instance.step.pk
        #images/<user_id>/<recipe_id>/steps/<step_id>/images/
        return 'user_{0}/recipe_{1}/steps/step_{2}/images/{3}'.format(user_id, recipe_id, step_id, filename)
    
    #videos for a step
    if isinstance(instance, VideoStep):
        user_id = instance.step.recipe.owner.pk
        recipe_id = instance.step.recipe.pk
        step_id = instance.step.pk
        #videos/<user_id>/<recipe_id>/steps/<step_id>/videos/
        return 'user_{0}/recipe_{1}/steps/step_{2}/videos/{3}'.format(user_id, recipe_id, step_id, filename)

#overall images for recipe (each image is stored in a ImageRecipe model which points to a recipe) 
class ImageRecipe(models.Model):
    recipe = models.ForeignKey(to=Recipe, null=False, blank=False, on_delete=models.CASCADE, related_name="overall_images")
    image = models.ImageField(upload_to=upload_path, null=False, blank=False)
    
    def __str__(self):
        return str(self.pk) + ": " + self.image.path

#overall videos for recipe (each video is stored in a VideoRecipe model which points to a recipe) 
class VideoRecipe(models.Model):
    recipe = models.ForeignKey(to=Recipe, null=False, blank=False, on_delete=models.CASCADE, related_name="overall_videos")
    #basic file type validation. TODO actual file type validation in serializer (since files can be renamed to have any extension no matter what data they contain)
    video = models.FileField(upload_to=upload_path, null=False, blank=False,
                             validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv', 'flv', 'wmv', 'AVCHD', 'H.264', 'MPEG-4'])])

    def __str__(self):
        return str(self.pk) + ": " + self.video.path

#images for a step (each image is stored in a ImageStep model which points to a step)
class ImageStep(models.Model):
    step = models.ForeignKey(to=Step, null=False, blank=False, on_delete=models.CASCADE, related_name="step_images")
    image = models.ImageField(upload_to=upload_path, null=False, blank=False)
    
    def __str__(self):
        return str(self.pk) + ": " + self.image.path

#videos for a step (each video is stored in a VideoStep model which points to a step)
class VideoStep(models.Model):
    step = models.ForeignKey(to=Step, null=False, blank=False, on_delete=models.CASCADE, related_name="step_videos")
    video = models.FileField(upload_to=upload_path, null=False, blank=False,
                             validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv', 'flv', 'wmv', 'AVCHD', 'H.264', 'MPEG-4'])])

    def __str__(self):
        return str(self.pk) + ": " + self.video.path
    

class ShoppingListItem(models.Model):
    owner = models.ForeignKey(to=UserModel, null=False, blank=False, on_delete=models.CASCADE, related_name="shopping_list_items")
    item = models.ForeignKey(to=Recipe, null=False, blank=False, on_delete=models.CASCADE)
 
    def __str__(self):
        return str(self.item)


class Comment(models.Model):
    author = models.ForeignKey(to=get_user_model(), null=True, on_delete=SET_NULL, related_name='user_comments')
    recipe = models.ForeignKey(to=Recipe, null=False, blank=False, on_delete=models.CASCADE, related_name='recipe_comments')
    datetime_created = models.DateTimeField(default=timezone.now)
    content = models.TextField(blank=False)


class Rating(models.Model):
    user = models.ForeignKey(to=get_user_model(), null=False, on_delete=models.CASCADE, related_name='user_ratings')
    recipe = models.ForeignKey(to=Recipe, null=False, on_delete=models.CASCADE, related_name='recipe_ratings')
    stars = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)], null=False)
    datetime_created = models.DateTimeField(null=False, default=timezone.now)
    class Meta:
        unique_together = ('user', 'recipe')


class Favorite(models.Model):
    user = models.ForeignKey(to=get_user_model(), null=False, on_delete=models.CASCADE, related_name='user_favorites')
    recipe = models.ForeignKey(to=Recipe, null=False, on_delete=models.CASCADE, related_name='recipe_favorites')
    datetime_created = models.DateTimeField(null=False, default=timezone.now)
    class Meta:
        unique_together = ('user', 'recipe')
        