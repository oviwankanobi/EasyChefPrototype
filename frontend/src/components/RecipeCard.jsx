import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Rating,
  createStyles,
  AspectRatio,
  Container,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/images/placeholder.png";

const useStyles = createStyles({
  card: {
    "&:hover": {
      cursor: "pointer",
      transition: "ease-out .2s",
      border: "thin solid rgb(11, 130, 194)",
      boxShadow: "0 0 8px rgb(11, 130, 194)",
    },
  },
});

export default function RecipeCard({ recipe }) {
  const { classes } = useStyles();
  var [cards, setCards] = useState();

  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/recipe-details/${id}`);
  };

  const handleImage = () => {
    const test = recipe.images[0];
    return test ? (
      <Image
        src={`${recipe.images[0].image}`}
        alt={recipe.name}
        height={200}
        width={280}
      />
    ) : (
      <Image src={placeholder} alt={recipe.name} height={200} width={280} />
    );
  };

  return (
    <Container m="0" p="0">
      <Card
        maw="280px"
        miw="280px"
        mah="380px"
        mih="380px"
        className={classes.card}
        onClick={() => handleClick(recipe.id)}
        shadow="sm"
        radius="lg"
      >
        <Card.Section>{handleImage()}</Card.Section>

        <Group position="center" mt="md" mb="xs">
          <Text size="md" weight={500}>
            {recipe.name}
          </Text>

          <Rating value={recipe.average_rating} readOnly />

          <Badge color="pink" variant="light">
            {recipe.favorites} favorites
          </Badge>

          <Text size="sm" color="dimmed">
            {recipe.description}
          </Text>
        </Group>
      </Card>
    </Container>
  );
}
