import React from "react";
import Cards from '../../components/cards/cards.jsx'
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
      <Cards/>
    </Container>
  );
}

export default HomePage;
