import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Input,
  Button,
  Container,
  Flex,
  Rating,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../../utils/axiosAutoAuth";
import "./cards.css";

export default function Cards() {
  var [cards, setCards] = useState([]);
  var [search, setSearch] = useState("");
  var [header, setHeader] = useState("Popular recipes");
  const navigate = useNavigate();

  const POPULAR_RECIPES_ENDPOINT = "http://127.0.0.1:8000/recipes/popular/";

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(POPULAR_RECIPES_ENDPOINT);
      setCards(response.data.results);
    }
    fetchData();
  }, []);

  const SEARCH_RECIPE_ENDPOINT =
    "http://127.0.0.1:8000/recipes/filter?search=" + search;

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(SEARCH_RECIPE_ENDPOINT);
      const isDataAvailable =
        response.data.results && response.data.results.length;
      setCards(response.data.results);

      if (isDataAvailable) {
        setHeader('Search results for "' + search + '"');
      } else {
        setHeader('Nothing found for "' + search + '"');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchKeydown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  function cardClick(recipeID) {
    navigate("/recipe-details/" + recipeID);
  }

  return (
    <>
      <Container className="search-bar-container" mt={70}>
        <Flex direction={{ base: "column", sm: "row" }} gap="sm" align="center">
          <Input
            className="search-bar"
            placeholder="Search for any recipe"
            value={search}
            onKeyDown={handleSearchKeydown}
            onChange={(e) => setSearch(e.target.value)}
            radius="lg"
            size="lg"
          />
          <Button onClick={handleSearchClick} size="md" radius="xl">
            Search
          </Button>
        </Flex>
      </Container>
      <h4 id="header">{header}</h4>

      <div className="flex-container">
        {cards.map((card) => (
          <div key={card.name} style={{ width: 280 }}>
            <Card
              className="card"
              onClick={() => cardClick(card.id)}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Card.Section>
                {Object.keys(card.images).length === 0 ? (
                  <span></span>
                ) : (
                  <Image
                    src={card.images[0].image}
                    height={200}
                    width={280}
                    alt={card.name}
                  />
                )}
              </Card.Section>

              <Group position="center" mt="md" mb="xs">
                <Text size="md" weight={500}>
                  {card.name}
                </Text>
                <Rating value={card.average_rating} readOnly />
                <Badge color="pink" variant="light">
                  {card.favorites} favorites
                </Badge>
              </Group>

              <Text size="sm" color="dimmed">
                {card.description}
              </Text>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
