import { Card, Image, Text, Badge, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cards() {

  var [cards, setCards] = useState([])

  const POPULAR_RECIPES_ENDPOINT = 'http://127.0.0.1:8000/recipes/popular/';

  useEffect(() => {

    async function fetchData() {
      const response = await axios.get(POPULAR_RECIPES_ENDPOINT);
      setCards(response.data.results);
    }
    fetchData();
  }, [])

  console.log(cards)

  return (
    <>
    <h1>Popular recipes</h1>
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
        <br />
      </div>
    ))}
    </>
  );
};
