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

export const addIngredientAPI = async (formValues) => {
  console.log(formValues);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/recipes/add-ingredient-to-recipe/",
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

export const createBaseIngredientAPI = async (formValues) => {
  console.log(formValues);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/recipes/create-base-ingredient/",
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
