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
  Autocomplete,
  MantineProvider,
  Text,
  Paper,
  Flex,
  Divider
} from "@mantine/core";
import { modals, ModalsProvider, ContextModalProps } from '@mantine/modals';
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
} from "../../utils/apis.jsx";
import CreateIngredientsTable from "../../components/CreateRecipe/CreateIngredientsTable";
import { Notifications } from '@mantine/notifications';
import './CreateRecipes.css';

export default function CreateRecipePage() {
  const [ingredientInput, setIngredientInput] = useState();
  const [stepInput, setStepInput] = useState();
  const [searchResults, setSearchResults] = useState([])
  const [searchField, setSearchField] = useState("")
  const [addField, setAddField] = useState(null)
  const [amountField, setAmountField] = useState(1)
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [update, setUpdate] = useState(false)
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

      axios.get(`http://localhost:8000/recipes/autocomplete-ingredient/?search=${searchQuery}`)
            .then(request => {
                console.log(request.data)
                setSearchResults(request.data["results"])
            })

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
  }, [ingredients]);
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
      createRecipeAPI(formValues).then((recipeId) => {
        console.log(recipeId)
        let timeout = 0;
        ingredients.map((ingredient) => {
          setTimeout(()=>addIngredientAPI(ingredient.baseID, ingredient.quantity, recipeId), timeout)
          timeout += 100;
      })
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
      <NumberInput value={item.quantity} precision={2} step={0.5} min={1} {...form.getInputProps(`ingredients.${index}.quantity`)} />
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
      <NumberInput value={item.prepTime} min={1} {...form.getInputProps(`steps.${index}.prepTime`)} />
      <Textarea {...form.getInputProps(`steps.${index}.description`)} />
    </Group>
  ));

  const test = { value: 6, label: "lettuce" };
  
  function addIngredient() {
    if (addField) {
      let foundIngredient = ingredients.find(ingredient => (ingredient.baseID === addField.id))
      if (foundIngredient) {
        foundIngredient.quantity = amountField
        setAddField(null)
        setSearchField("")
      }
      else{
        setIngredients(ingredients.concat({
          baseID: addField.id,
          name: addField.value,
          quantity: amountField,
        }))
        setAddField(null)
        setSearchField("")
      }
    }
    else {
      openModal()
    }
    
  }
  // https://mantine.dev/others/modals/
  const TestModal = ({ context, id, innerProps }) => (
    <>
      <Text size="sm">{innerProps.modalBody}</Text>
      <Button mt="md" onClick={() => context.closeModal(id)}>
        Close
      </Button>
    </>
  );

  const openModal = () => modals.openContextModal({
    modal: 'ingr',
    title: 'Select an ingredient',
    innerProps: {
      modalBody:
        'Please select an ingredient from the dropdown.',
    },
  })


  return (
    <MantineProvider>
      <ModalsProvider modals={{ ingr: TestModal }}>
    <Container>
    <Title weight="100" my="2rem" align="center">Create your Recipe</Title>
      <Stack>
        <form onSubmit={form.onSubmit(handleRecipe)}>
          <Group>
          <TextInput
            className="name-input"
            my="1rem"
            placeholder="Recipe name"
            label="Name"
            required
            {...form.getInputProps("recipeName")}
          />
          <NumberInput
            className="serving-input"
            my="1rem"
            defaultValue={1}
            min={1}
            placeholder="Serving size"
            label="Serving"
            required
            {...form.getInputProps("serving")}
          />
          </Group>

          <br />

          <Paper my="0rem" maw="30rem" shadow="xs" p="sm" withBorder>
            <h6>Add Ingredients</h6>
            <CreateIngredientsTable ingredients={ingredients} update={update} setUpdate={setUpdate} setIngredients={setIngredients} />
            <Flex mt="1rem">
            <Autocomplete label="Search ingredients"
              data={searchResults.map((ingredient) => {
                return { "value": ingredient["name"], "id": ingredient["id"] }
              })}
              onItemSubmit={(i) => { setAddField(i) }}
              value={searchField}
              onChange={setSearchField} />
            <NumberInput ml="1rem" label="Quantity (oz)" w="7rem" min={1} value={amountField} onChange={setAmountField} />
            <Button className="add-button" ml="1rem" mt="1rem" onClick={addIngredient}>Add</Button>
            </Flex>
          </Paper>
          {IngredientsField}

          <br />

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

            <br />

          <Title weight={100} size="1.4rem">Add steps to your recipe.</Title>
          <Divider my="xs" />
          <Group my="1rem">
            <TextInput
              label="Step"
              placeholder="description"
              defaultValue={stepInput}
              onChange={(event) => setStepInput(event.currentTarget.value)}
            />
            <Button
              className="add-button"
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

          <Divider my="xl" />

              <br />
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
          <br />
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


    </Container>
    </ModalsProvider>
    </MantineProvider>
  );
}
