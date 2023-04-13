import React, { useState, useEffect } from "react";
import {
  getUserCreatedAPI,
  getUserFavouritedAPI,
  getUserInteractedAPI,
} from "../../utils/apis";
import { RecipeCard } from "../../components";
import { Container, Title } from "@mantine/core";

export default function MyRecipesPage() {
  const [createdRecipes, setCreatedRecipes] = useState();

  useEffect(() => {
    async function fetchData() {
      const [createdData, interactedData] = await Promise.all([
        getUserCreatedAPI(),
        getUserInteractedAPI(),
      ]);
      setCreatedRecipes(createdData);
      //setDietOptions(dietArr);
      //setCuisineOptions(cuisineArr);
    }
    fetchData();
  }, []);

  console.log(createdRecipes);
  /*
function RecipeCards({ header, recipes, onCardClick }) {
  return (
    <>
      <h4 id="header">{header}</h4>
      <div className="flex-container">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.name}
            recipe={recipe}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </>
  );
}
*/

  //const RecipeCards = createdRecipes.map((item, index) => console.log(item));

  //console.log(createdRecipes);
  return (
    <Container>
      <Title>We are in the My Recipes Page</Title>
    </Container>
  );
}
