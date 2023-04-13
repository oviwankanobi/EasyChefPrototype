import React, { useState } from "react";
import { Card, Image, Text, Badge, Group, Rating } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function RecipeCard(data) {
  var [cards, setCards] = useState(data);
  var [header, setHeader] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    if (onCardClick) {
      onCardClick(recipe.id);
    } else {
      navigate(`/recipe-details/${recipe.id}`);
    }
  }

  return (
    <Flex>
      <Card
        className="card"
        onClick={handleClick}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Card.Section>
          {Object.keys(recipe.images).length === 0 ? (
            <span></span>
          ) : (
            <Image
              src={`http://127.0.0.1:8000/media/${recipe.images[0].image}`}
              height={200}
              width={280}
              alt={recipe.name}
            />
          )}
        </Card.Section>

        <Group position="center" mt="md" mb="xs">
          <Text size="md" weight={500}>
            {recipe.name}
          </Text>
          <Rating value={recipe.average_rating} readOnly />
          <Badge color="pink" variant="light">
            {recipe.favorites} favorites
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {recipe.description}
        </Text>
      </Card>
    </Flex>
  );
}

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
