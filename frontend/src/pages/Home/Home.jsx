import React from "react";
import SearchBar from '../../components/search.jsx'
import CARD_COMP from '../../components/card.jsx'
import { Container, Title, Text } from '@mantine/core'

function HomePage() {
  const accessToken = localStorage.getItem('access_token');
  let auth;
  if (accessToken) {
    auth = "true";
  } else {
    auth = "false";
  }
  return (
    <Container>
      <Title>
        Home Page
      </Title>
      <Text>
        Auth is: {auth}
      </Text>
      <SearchBar/>
      <br/>
      <CARD_COMP/>
    </Container>
  );
}

export default HomePage;
