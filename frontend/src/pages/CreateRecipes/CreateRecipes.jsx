import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Stack,
  MultiSelect,
  Image,
  FileInput,
  NumberInput,
  Select,
  Flex,
  Center,
} from "@mantine/core";
import { useForm, hasLength, isEmail, matchesField } from "@mantine/form";
import placeholder from "../../assets/images/placeholder.png";
import { Attachments } from "../../components";
import axios from "axios";

export default function CreateRecipePage() {
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const ingredientData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-ingredients/"
      );
      const dietData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-diets/"
      );
      const cuisineData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-cuisines/"
      );

      const ingredientArr = ingredientData.data.results.map((item) => ({
        value: item.recipe,
        label: item.recipe,
        id: item.id,
        quantity: item.quantity,
      }));

      const dietArr = dietData.data.results.map((item) => ({
        value: item.name,
        label: item.name,
        id: item.id,
      }));

      const cuisineArr = cuisineData.data.results.map((item) => ({
        value: item.name,
        label: item.name,
        id: item.id,
      }));

      setIngredientOptions([ingredientArr]);
      setDietOptions([dietArr]);
      setCuisineOptions([cuisineArr]);
    }
    fetchData();
  }, []);

  const form = useForm({
    initialValues: {
      image: "",
      recipeName: "",
      serving: 1,
      ingredients: [
        { amount: 1, name: "Lettuce" },
        { amount: 2, name: "Tomato" },
      ],
      diets: [],
      cuisine: [],
      steps: [""],
      prepTime: 1,
      cookingTime: 1,
      baseRecipe: "",
      galleryAttachments: [],
    },
  });

  const CREATERECIPE_API_ENDPOINT =
    "http://127.0.0.1:8000/recipes/create-recipe/";

  const handleCreateRecipe = async (formValues) => {
    console.log(formValues);
    /*
    try {
      const response = await axios.post(CREATERECIPE_API_ENDPOINT, {
        name: formValues.recipeName,
        serving: formValues.serving,
        prep_time: formValues.prepTime,
      });

      if (response.status === 200) {
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    } */
  };

  const VIEWRECIPE_API_ENDPOINT =
    "http://127.0.0.1:8000/recipes/get-ingredients/";

  const handleViewRecipe = async () => {
    try {
      const response = await axios.get(VIEWRECIPE_API_ENDPOINT);
      if (response.status === 200) {
        const d = response.data.results;
        //console.log(JSON.stringify(d, null, 2));
        console.log(dietOptions);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Title>Create Your Own Recipe</Title>
      <Flex>
        <form onSubmit={form.onSubmit(handleCreateRecipe)}>
          <Image
            component={FileInput}
            maw={240}
            mx="auto"
            radius="md"
            src={placeholder}
            alt="Random image"
          />
          <TextInput
            placeholder="Recipe Name"
            label="Create Recipe"
            required
            {...form.getInputProps("recipeName")}
          />
          <NumberInput
            defaultValue={1}
            min={1}
            placeholder="Serving Size"
            label="Serving Size"
            required
            {...form.getInputProps("serving")}
          />
          <Group>
            <MultiSelect
              data={dietOptions}
              placeholder="Diets"
              label="Diets"
              required
              {...form.getInputProps("diets")}
            />
            <MultiSelect
              data={cuisineOptions}
              placeholder="Cuisine"
              label="Cuisine"
              required
              {...form.getInputProps("cuisine")}
            />
          </Group>
          <Group>
            <NumberInput
              min={1}
              placeholder="Prep Time"
              label="Prep Time"
              required
              {...form.getInputProps("prepTime")}
            />
            <NumberInput
              min={1}
              placeholder="Cooking Time"
              label="Cooking Time"
              required
              {...form.getInputProps("cookingTime")}
            />
          </Group>

          <Attachments
            placeholder="Attachments"
            label="Gallery Attachment(s)"
            required
          />
          <Center>
            <Button type="submit">Create Recipe</Button>
          </Center>
        </form>
        <form onSubmit={form.onSubmit(handleViewRecipe)}>
          <Button type="submit">console.log(recipes available)</Button>
        </form>
      </Flex>
    </Container>
  );
}
