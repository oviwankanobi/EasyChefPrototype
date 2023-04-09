import React from "react";
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

const data = [
  { value: "react", label: "React" },
  { value: "ng", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
  { value: "riot", label: "Riot" },
  { value: "next", label: "Next.js" },
  { value: "blitz", label: "Blitz.js" },
];

export default function CreateRecipePage() {
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
    }
  };

  const VIEWRECIPE_API_ENDPOINT = "http://127.0.0.1:8000/recipes/get-recipes/";

  const handleViewRecipe = async () => {
    try {
      const response = await axios.get(VIEWRECIPE_API_ENDPOINT);
      if (response.status === 200) {
        const d = response.data.results;
        console.log(JSON.stringify(d, null, 2));
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
              data={data}
              placeholder="Diets"
              label="Diets"
              required
              {...form.getInputProps("diets")}
            />
            <MultiSelect
              data={data}
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

          <Select
            data={data}
            placeholder="Base Recipe"
            label="Base Recipe"
            required
          />
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
