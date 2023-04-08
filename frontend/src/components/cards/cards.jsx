import { Card, Image, Text, Badge, Group, Input, Button, Container, Flex } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './cards.css';

export default function Cards() {

  var [cards, setCards] = useState([])
  var [search, setSearch] = useState("");
  var [header, setHeader] = useState("Popular recipes");

  const POPULAR_RECIPES_ENDPOINT = 'http://127.0.0.1:8000/recipes/popular/';

  useEffect(() => {

    async function fetchData() {
      const response = await axios.get(POPULAR_RECIPES_ENDPOINT);
      setCards(response.data.results);
    }
    fetchData();
  }, [])

  const SEARCH_RECIPE_ENDPOINT = 'http://127.0.0.1:8000/recipes/filter?search='+search;

  const handleSearchClick = async () => {

    try {
      const response = await axios.get(SEARCH_RECIPE_ENDPOINT);
      const isDataAvailable = response.data.results && response.data.results.length;
      setCards(response.data.results);

      if(isDataAvailable){
        setHeader("Search results for "+search)
      } else{
        setHeader("Nothing found for "+search)
      }
    } catch (error) {
        console.error(error);
    }

  };

  const handleSearchKeydown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  return (
    <>
    <Container  mt={120}>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap="sm"
        align="center"
      >
        <Input
          placeholder="Search for any recipe"
          value={search}
          onKeyDown={handleSearchKeydown}
          onChange={(e) => setSearch(e.target.value)}
          radius="xl"
        />
        <Button onClick={handleSearchClick}  size="xs" radius="xl">
          Search
        </Button>
      </Flex>
    </Container>
    <h1 id="header">{header}</h1>

    <div className="flex-container">

      {cards.map(card => (
        <div key={card.name} style={{width: 280}}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={"http://127.0.0.1:8000/media/"+card.images[0].image}
                height={200}
                width={280}
                alt={card.name}
              />
            </Card.Section>
      
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{card.name}</Text>
              <Badge color="pink" variant="light">
                {card.favorites} likes
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
};