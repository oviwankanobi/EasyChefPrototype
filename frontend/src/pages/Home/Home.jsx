import React from "react";
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
    </Container>
  );
}

export default HomePage;
