import { useState } from "react";
import { Input, Button, Container, Flex } from "@mantine/core";
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const SEARCH_RECIPE_ENDPOINT = 'http://127.0.0.1:8000/recipes/filter?search='+searchQuery;

  const handleSearchClick = async () => {
    console.log(`Searching for "${searchQuery}"...`);

    try {
      const response = await axios.get(SEARCH_RECIPE_ENDPOINT);

      if (response.status === 200) {
        console.log(response.data);
      } else {
          console.log(response.data);
      }
    } catch (error) {
        console.error(error);
    }

  };

  return (
    <>
      <Container  mt={120}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap="sm"
          align="center"
        >
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchInputChange}
            radius="xl"
          />
          <Button onClick={handleSearchClick}  size="xs" radius="xl">
            Search
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default SearchBar;