import React, { useState, useEffect } from "react";
import {
  getUserPersonalAPI,
  getUserFavouritesAPI,
  getUserInteractedAPI,
} from "../../utils/apis";
import { RecipeCard } from "../../components";
import { Container, Title, SegmentedControl, Flex } from "@mantine/core";

export default function MyRecipesPage() {
  const [personalRecipes, setPersonalRecipes] = useState();
  const [favouriteRecipes, setFavouriteRecipes] = useState();
  const [interactedRecipes, setInteractedRecipes] = useState();
  const [selectedValue, setSelectedValue] = useState("personal");

  useEffect(() => {
    async function fetchData() {
      const [personal, favourite, interacted] = await Promise.all([
        getUserPersonalAPI(),
        getUserFavouritesAPI(),
        getUserInteractedAPI(),
      ]);
      setPersonalRecipes(personal);
      setFavouriteRecipes(favourite);
      setInteractedRecipes(interacted);
    }
    fetchData();
  }, []);

  const RecipeCards = (recipeData) =>
    recipeData?.map((item, index) => <RecipeCard key={index} recipe={item} />);

  const renderRecipeCards = (value) => {
    if (value === "personal") {
      return RecipeCards(personalRecipes);
    } else if (value === "favourites") {
      return RecipeCards(favouriteRecipes);
    } else if (value === "interacted") {
      return RecipeCards(interactedRecipes);
    } else {
      return null;
    }
  };

  return (
    <Container size="80%">
      <Title>We are in the My Recipes Page</Title>
      <SegmentedControl
        data={[
          { value: "personal", label: "Personal" },
          { value: "favourites", label: "Favourites" },
          { value: "interacted", label: "Interacted" },
        ]}
        onChange={(value) => setSelectedValue(value)}
      />
      <Flex wrap="wrap" size direction="row" gap="xl">
        {renderRecipeCards(selectedValue)}
      </Flex>
    </Container>
  );
}
