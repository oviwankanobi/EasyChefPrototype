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
  Select,
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
  getBaseIngredientAPI,
  addImageToRecipe,
} from "../../utils/apis.jsx";

export default function CreateRecipePage() {
  const [ingredientInput, setIngredientInput] = useState();
  const [stepInput, setStepInput] = useState();

  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const ingredientData = await axios.get(
        "http://127.0.0.1:8000/recipes/autocomplete-ingredient/"
      );
      const dietData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-diets/"
      );
      const cuisineData = await axios.get(
        "http://127.0.0.1:8000/recipes/get-cuisines/"
      );

      const ingredientArr = ingredientData.data.results.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      const dietArr = dietData.data.results.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      const cuisineArr = cuisineData.data.results.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setIngredientOptions(ingredientArr);
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
      ingredients: [],
      diets: [],
      cuisine: [],
      steps: [],
      prepTime: 1,
      cookingTime: 1,
      baseRecipe: "",
      galleryAttachments: [],
    },
  });

  const handleRecipe = async (formValues) => {
    try {
      createRecipeAPI(formValues).then((recipeId) => {
        formValues.ingredients.forEach((ingredient) =>
          addIngredientAPI(ingredient.id, ingredient.quantity, recipeId)
        );
        addImageToRecipe(recipeId, formValues.image);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ingredientClick = () => {
    const ingredientName = ingredientOptions.find(
      (option) => option.value === ingredientInput
    ).label;
    form.insertListItem("ingredients", {
      quantity: 1,
      name: ingredientName,
      id: ingredientInput,
    });
    setIngredientInput(null);
  };

  const IngredientsField = form.values.ingredients.map((item, index) => (
    <Group key={index}>
      <NumberInput value={item.quantity} precision={2} step={0.5} min={1} />
      <TextInput
        disabled
        {...form.getInputProps(`ingredients.${index}.name`)}
      />
      <Button onClick={() => form.removeListItem("ingredients", index)}>
        delete
      </Button>
    </Group>
  ));

  const StepsField = form.values.steps.map((item, index) => (
    <Group grow key={index}>
      <NumberInput value={item.prepTime} min={1} />
      <Textarea {...form.getInputProps(`steps.${index}.description`)} />
    </Group>
  ));

  const test = { value: 6, label: "lettuce" };

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
            <Select
              label="Ingredients"
              placeholder="Ingredient"
              searchable
              hoverOnSearchChange
              nothingFound="No options"
              filter={(value, item) =>
                !form
                  .getInputProps("ingredients")
                  .value.some((ingredient) => ingredient.id === item.value)
              }
              data={ingredientOptions}
              value={ingredientInput}
              onChange={(event) => setIngredientInput(event)}
            />
            <Button
              label="Ingredients"
              onClick={(event) =>
                ingredientInput ? ingredientClick(event) : null
              }
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
