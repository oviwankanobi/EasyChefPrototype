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
  Center,
  Textarea,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import placeholder from "../../assets/images/placeholder.png";
import { Attachments, SearchModal } from "../../components";
import axios from "axios";
import {
  getRecipesAPI,
  createRecipeAPI,
  addIngredientAPI,
  createBaseIngredientAPI,
  getIngredientsAPI,
} from "../../utils/apis.jsx";

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
        value: item.id,
        label: item.name,
      }));

      const cuisineArr = cuisineData.data.results.map((item) => ({
        value: item.id,
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
      steps: [
        {
          description: "wash lettuce and cut into size of your choosing",
          prepTime: 300,
        },
        { description: "slice tomato", prepTime: 150 },
      ],
      prepTime: 1,
      cookingTime: 1,
      baseRecipe: "",
      galleryAttachments: [],
    },
  });

  const handleRecipe = async (formValues) => {
    const ingredientPromises = formValues.ingredients.map(
      async (ingredient) => {
        const base_ingredient = await createBaseIngredientAPI(ingredient.name);
        const quantity = ingredient.quantity;
        return { base_ingredient, quantity };
      }
    );

    const ingredientObject = await Promise.all(ingredientPromises);

    try {
      createRecipeAPI(formValues).then((recipeId) => {
        ingredientObject.forEach((ingredient) => {
          addIngredientAPI(ingredient, recipeId);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const IngredientsField = form.values.ingredients.map((item, index) => (
    <Group key={index}>
      <NumberInput value={item.quantity} precision={2} step={0.5} min={1} />
      <TextInput {...form.getInputProps(`ingredients.${index}.name`)} />
    </Group>
  ));

  const StepsField = form.values.steps.map((item, index) => (
    <Group grow key={index}>
      <NumberInput value={item.prepTime} min={1} />
      <Textarea {...form.getInputProps(`steps.${index}.description`)} />
    </Group>
  ));

  return (
    <Container>
      <Title my="1rem">Create Your Own Recipe</Title>
      <Stack>
        <form onSubmit={form.onSubmit(handleRecipe)}>
          <Image
            component={FileInput}
            maw={240}
            mah={240}
            mx="0"
            radius="md"
            src={placeholder}
            alt="Placeholder"
            {...form.getInputProps("image")}
          />
          <TextInput
            my="1rem"
            placeholder="Recipe Name"
            label="Create Recipe"
            required
            {...form.getInputProps("recipeName")}
          />
          <NumberInput
            my="1rem"
            defaultValue={1}
            min={1}
            placeholder="Serving Size"
            label="Serving Size"
            required
            {...form.getInputProps("serving")}
          />
          <Group my="1rem">
            <TextInput
              label="Ingredients"
              defaultValue={ingredientInput}
              onChange={(event) =>
                setIngredientInput(event.currentTarget.value)
              }
            />
            <Button
              label="Ingredients"
              onClick={() => {
                form.insertListItem("ingredients", {
                  quantity: 1,
                  name: ingredientInput,
                });
                setIngredientInput("");
              }}
            >
              +
            </Button>
          </Group>
          {IngredientsField}

          <Group my="1rem" grow>
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

          <Group my="1rem">
            <Textarea
              label="Steps"
              defaultValue={stepInput}
              onChange={(event) => setStepInput(event.currentTarget.value)}
            />
            <Button
              onClick={() => {
                form.insertListItem("steps", {
                  prepTime: 1,
                  description: stepInput,
                });
                setStepInput("");
              }}
            >
              +
            </Button>
          </Group>

          {StepsField}

          <Group>
            <NumberInput
              min={0}
              placeholder="Prep Time"
              label="Prep Time"
              required
              {...form.getInputProps("prepTime")}
            />
            <NumberInput
              min={0}
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
            {...form}
          />
          <Center>
            <Button type="submit">Create Recipe</Button>
          </Center>
        </form>
      </Stack>

      <form onSubmit={form.onSubmit(getRecipesAPI)}>
        <Button type="submit">console.log(recipes available)</Button>
      </form>
      <form onSubmit={form.onSubmit(getIngredientsAPI)}>
        <Button type="submit">console.log(ingredients available)</Button>
      </form>

      <SearchModal />
    </Container>
  );
}
