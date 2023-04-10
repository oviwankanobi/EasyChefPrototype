import React, { useEffect, useState } from "react";
import {
  TextInput,
  Title,
  Container,
  Group,
  Button,
  MultiSelect,
  Image,
  FileInput,
  NumberInput,
  Select,
  Flex,
  Center,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import placeholder from "../../assets/images/placeholder.png";
import { Attachments, SearchModal } from "../../components";
import axios from "axios";
import { getRecipesAPI } from "../../utils/apis.jsx";

export default function CreateRecipePage() {
  const [ingredientInput, setIngredientInput] = useState();
  const [stepInput, setStepInput] = useState();

  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dietData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-diets/"
      );
      const cuisineData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-cuisines/"
      );

      const dietArr = dietData.data.results.map((item) => ({
        key: item.id.toString(),
        value: item.name,
        label: item.name,
      }));

      const cuisineArr = cuisineData.data.results.map((item) => ({
        key: item.id.toString(),
        value: item.name,
        label: item.name,
      }));

      setDietOptions(dietArr);
      setCuisineOptions(cuisineArr);
    }
    fetchData();
  }, []);

  const form = useForm({
    initialValues: {
      image: "",
      recipeName: "",
      serving: 1,
      ingredients: [
        { quantity: 1, name: "Lettuce" },
        { quantity: 2, name: "Tomato" },
      ],
      diets: [],
      cuisine: [],
      steps: [],
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

  const GETBASERECIPE_API_ENDPOINT =
    "http://127.0.0.1:8000/recipes/get-recipe-base/";

  const getBaseRecipeAPI = async () => {
    try {
      const response = await axios.get(GETBASERECIPE_API_ENDPOINT);
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

          <Group>
            <Button
              onClick={() =>
                form.insertListItem("ingredients", {
                  quantity: 1,
                  name: ingredientInput,
                })
              }
            >
              +
            </Button>
            <TextInput
              onChange={(event) =>
                setIngredientInput(event.currentTarget.value)
              }
            />
          </Group>

          {form.getInputProps("ingredients").value.map((v) => {
            return (
              <Group>
                <NumberInput defaultValue={v.quantity} min={1} />
                <TextInput defaultValue={v.name} />
              </Group>
            );
          })}

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
            <Button
              onClick={() =>
                form.insertListItem("steps", {
                  prepTime: 1,
                  description: stepInput,
                })
              }
            >
              +
            </Button>
            <Textarea
              onChange={(event) => setStepInput(event.currentTarget.value)}
            />
          </Group>

          {form.getInputProps("steps").value.map((v) => {
            return (
              <Group>
                <NumberInput defaultValue={v.prepTime} min={1} />
                <Textarea defaultValue={v.description} />
              </Group>
            );
          })}

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
      </Flex>

      <form onSubmit={form.onSubmit(getRecipesAPI)}>
        <Button type="submit">console.log(recipes available)</Button>
      </form>

      <SearchModal />
    </Container>
  );
}
