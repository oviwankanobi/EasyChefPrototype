import React from "react";
import Cards from '../../components/cards/cards.jsx'
import { Container, Title, Text } from '@mantine/core'
import axios from 'axios';

function HomePage() {
  console.log(axios.defaults.headers.common["Authorization"])
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
