from rest_framework.filters import BaseFilterBackend
import datetime

class RecipeFilter(BaseFilterBackend):
    """
    Filters recipe based on cuisine, diet, or cooking time.
    """
    def filter_queryset(self, request, queryset, view):
        # https://docs.djangoproject.com/en/4.1/ref/models/querysets/
        
        diets = request.query_params.getlist('diet')
        if diets is not None:
            for diet in diets:
                queryset = queryset.filter(diet__name__iexact=diet)
            queryset = queryset.distinct()
            
        cuisines = request.query_params.getlist('cuisine')
        if cuisines is not None:
            for cuisine in cuisines:
                queryset = queryset.filter(cuisine__name__iexact=cuisine)
            queryset = queryset.distinct()
            
        cooking_time = request.query_params.get('cooking_time')
        if cooking_time is not None:
            time = datetime.timedelta(seconds=int(cooking_time))
            queryset = queryset.filter(cooking_time=time)
        
        return queryset

