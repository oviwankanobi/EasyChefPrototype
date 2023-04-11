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

export const addIngredientAPI = async (baseIngredient, quantity) => {
  console.log(baseIngredient, quantity);
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/recipes/add-ingredient-to-recipe/",
      {
        base_ingredient: baseIngredient,
        quantity: quantity,
      }
    );
    console.log(response);
    console.log(response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createBaseIngredientAPI = async (ingredientName) => {
  console.log(ingredientName);
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/recipes/create-base-ingredient/",
      {
        name: ingredientName,
      }
    );
    console.log(response);
    console.log(response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const createRecipeAPI = async (formValues) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/recipes/create-recipe/",
      {
        name: formValues.recipeName,
        serving: formValues.serving,
        prep_time: formValues.prepTime,
        cooking_time: formValues.cookingTime,
      }
    );

    if (response.status === 200) {
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
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
