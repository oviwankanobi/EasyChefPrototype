import { useState, useEffect } from "react";
import { axios } from "./axiosAutoAuth";

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

export const addIngredientAPI = async (base_ingredient, quantity, recipeId) => {
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-ingredient-to-recipe/${recipeId}/`,
    {
      base_ingredient: base_ingredient,
      quantity: quantity,
    }
  );
};

export const addImageToRecipe = async (recipeId, file) => {
  const formData = new FormData();
  formData.append("recipe", recipeId);
  formData.append("image", file);
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-image-to-recipe/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const addVideoToRecipe = async () => {
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-video-to-recipe/`
  );
};
export const addImageToStep = async () => {
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-image-to-step/`
  );
};
export const addVideoToStep = async () => {
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-video-to-step/`
  );
};
export const addStepToRecipe = async () => {
  const response = await axios.post(
    `http://127.0.0.1:8000/recipes/add-image-to-recipe/`
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

export const getUserPersonalAPI = async () => {
  const response = await axios.get("http://127.0.0.1:8000/recipes/my-recipes/");
  return response.data.results;
};

export const getUserFavouritesAPI = async () => {
  const response = await axios.get(
    "http://127.0.0.1:8000/recipes/my-favorites/"
  );
  return response.data.results;
};

export const getUserInteractedAPI = async () => {
  const response = await axios.get(
    "http://127.0.0.1:8000/recipes/interacted-recipes/"
  );
  return response.data.results;
};
