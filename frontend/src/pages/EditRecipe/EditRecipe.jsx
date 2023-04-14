import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Text,
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

import "./EditRecipe.css";
import EditProfileHeader from "../../components/EditProfile/EditProfileHeader";
import { Trash, PhotoUp } from "tabler-icons-react";
import EditIngredients from "../../components/EditRecipe/EditIngredients";

export default function EditRecipePage() {
  const { id } = useParams();

  const [nameField, setNameField] = useState("");
  const [descField, setDescField] = useState("");
  const [servingSize, setServingSize] = useState(0);
  const [ingredients, setIngredients] = useState([]);

  const [ingredientInput, setIngredientInput] = useState();
  const [stepInput, setStepInput] = useState();

  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [steps, setSteps] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setselectedVideo] = useState(null);

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

    axios
      .get("http://127.0.0.1:8000/recipes/recipe-details/" + id + "/")
      .then((response) => {
        setNameField(response.data["name"]);
        setDescField(response.data["description"]);
        setServingSize(response.data["serving"]);
        setImages(response.data.images);
        setVideos(response.data.videos);
        setSteps(response.data.steps);
        setIngredients(response.data["ingredients_info"]);
      });
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
  console.log(nameField);

  function deleteImage(image_id) {
    const DEL_RECIPE_IMAGE =
      "http://127.0.0.1:8000/recipes/delete-image-from-recipe/" +
      image_id +
      "/";
    axios.delete(DEL_RECIPE_IMAGE);

    setImages((images) => images.filter((image) => image.id != image_id));
  }

  function deleteVideo(video_id) {
    const DEL_RECIPE_VIDEO =
      "http://127.0.0.1:8000/recipes/delete-video-from-recipe/" +
      video_id +
      "/";
    axios.delete(DEL_RECIPE_VIDEO);

    setVideos((videos) => videos.filter((video) => video.id != video_id));
  }

  function uploadImage() {
    const UPLOAD_RECIPE_IMAGE =
      "http://127.0.0.1:8000/recipes/add-image-to-recipe/";
    var accessToken = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("recipe", id);
    formData.append("image", selectedImage);

    axios.post(UPLOAD_RECIPE_IMAGE, formData).then((response) => {
      console.log(response.data);

      const newImgObj = {
        id: response.data.id,
        image: response.data.image,
      };

      const newImages = images.concat(newImgObj);
      setImages(newImages);
    });
  }

  function uploadVideo() {
    const UPLOAD_RECIPE_VIDEO =
      "http://127.0.0.1:8000/recipes/add-video-to-recipe/";
    var accessToken = localStorage.getItem("access_token");
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + accessToken,
    };

    const formData = new FormData();
    formData.append("recipe", id);
    formData.append("video", selectedVideo);

    axios
      .post(UPLOAD_RECIPE_VIDEO, formData, {
        headers: headers,
      })
      .then((response) => {
        console.log(response.data);

        const newVidObj = {
          id: response.data.id,
          video: response.data.video,
        };

        const newVideos = videos.concat(newVidObj);
        setVideos(newVideos);
      });
  }

  return (
    <Container>
      <Title my="1rem">Edit Recipe</Title>
      <Stack>
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
          value={nameField}
          required
          // {...form.getInputProps("recipeName")}
        />
        <Textarea
          my="1rem"
          placeholder="Recipe Description"
          label="Description"
          value={descField}
        />
        <NumberInput
          my="1rem"
          min={1}
          placeholder="Serving Size"
          label="Serving Size"
          value={servingSize}
          required
          {...form.getInputProps("serving")}
        />
        <Group my="1rem">
          <EditIngredients initial_ingredients={ingredients} recipeid={id} />
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
      </Stack>

      <form onSubmit={form.onSubmit(getRecipesAPI)}>
        <Button type="submit">console.log(recipes available)</Button>
      </form>
      <form onSubmit={form.onSubmit(getIngredientsAPI)}>
        <Button type="submit">console.log(ingredients available)</Button>
      </form>

      <SearchModal />

      <br />
      <br />

      <EditProfileHeader text="Overall Images" />

      {Object.keys(images).length === 0 ? (
        <span className="empty-media">No images to show</span>
      ) : (
        <tbody className="images-table">
          {images.map((image) => (
            <tr>
              <td>
                <Image width={150} height={150} src={image.image} />
              </td>
              <td>
                <Button
                  onClick={() => {
                    deleteImage(image.id);
                  }}
                  variant="outline"
                  color="red"
                  leftIcon={<Trash size={20} strokeWidth={1} color={"red"} />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      )}

      <div className="upload-wrapper">
        <Text>Upload an image</Text>
        <FileInput
          className="file-input"
          onChange={(event) => {
            setSelectedImage(event);
          }}
        />
        <br />
        <Button
          id="upload-button"
          onClick={() => {
            uploadImage();
          }}
          color="green"
          leftIcon={<PhotoUp size={20} strokeWidth={2} color={"white"} />}
        >
          Upload
        </Button>
      </div>

      <EditProfileHeader text="Overall Videos" />

      {Object.keys(videos).length === 0 ? (
        <span className="empty-media">No videos to show</span>
      ) : (
        <tbody className="images-table">
          {videos.map((video) => (
            <tr>
              <td>
                <video
                  width={150}
                  height={150}
                  controls
                  loop
                  autoPlay
                  src={video.video}
                  fit="contain"
                />
              </td>
              <td>
                <Button
                  onClick={() => {
                    deleteVideo(video.id);
                  }}
                  variant="outline"
                  color="red"
                  leftIcon={<Trash size={20} strokeWidth={1} color={"red"} />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      )}

      <div className="upload-wrapper">
        <Text>Upload a video</Text>
        <FileInput
          className="file-input"
          onChange={(event) => {
            setselectedVideo(event);
          }}
        />
        <br />
        <Button
          id="upload-button"
          onClick={() => {
            uploadVideo();
          }}
          color="green"
          leftIcon={<PhotoUp size={20} strokeWidth={2} color={"white"} />}
        >
          Upload
        </Button>
      </div>

      <EditProfileHeader text="Steps" />
    </Container>
  );
}
