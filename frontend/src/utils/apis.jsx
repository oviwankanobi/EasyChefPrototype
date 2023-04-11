import axios from "axios";

export const getRecipesAPI = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/recipes/get-recipes/"
    );
    if (response.status === 200) {
      const d = response.data.results;
      console.log(JSON.stringify(d, null, 2));
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getIngredientsAPI = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/recipes/get-ingredients/"
    );
    if (response.status === 200) {
      const d = response.data.results;
      console.log(JSON.stringify(d, null, 2));
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const addIngredientAPI = async (ingredientObject, recipeId) => {
  const { base_ingredient, quantity } = ingredientObject;
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-ingredient-to-recipe/${recipeId}/`,
    {
      base_ingredient: base_ingredient,
      quantity: quantity,
    }
  );
};

export const createBaseIngredientAPI = async (ingredientName) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/recipes/create-base-ingredient/",
    {
      name: ingredientName,
    }
  );
  return response.data.id;
};

export const createRecipeAPI = async (formValues) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/recipes/create-recipe/",
    {
      name: formValues.recipeName,
      description: "",
      serving: formValues.serving,
      diet: formValues.diets,
      cuisine: formValues.cuisine,
      prep_time: formValues.prepTime,
      cooking_time: formValues.cookingTime,
    }
  );
  return response.data.id;
};

export const getBaseRecipeAPI = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/recipes/get-recipe-base/"
    );
    if (response.status === 200) {
      const d = response.data.results;
      console.log(JSON.stringify(d, null, 2));
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};
