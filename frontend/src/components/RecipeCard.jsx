import React, { useState, useEffect } from "react";
import { Card, Image, Text, Badge, Group, Rating, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function RecipeCard(recipe) {
  var [cards, setCards] = useState();
  var [header, setHeader] = useState();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe-details/${recipe.id}`);
  };

  return (
    <Flex>
      <Card
        className="card"
        onClick={handleClick(recipe.id)}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Card.Section>
          <Image
            src={`http://127.0.0.1:8000/media/${recipe.images[0].image}`}
            height={200}
            width={280}
            alt={recipe.name}
          />
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
