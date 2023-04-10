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
