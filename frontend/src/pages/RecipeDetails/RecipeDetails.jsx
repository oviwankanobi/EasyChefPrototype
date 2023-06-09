import React from "react";
import {
  Image,
  Rating,
  Tooltip,
  Button,
  Badge,
  Divider,
  Title,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import "./RecipeDetails.css";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../../components/Comments/CommentSection";
import { ShoppingCart, Edit } from "tabler-icons-react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import { Link, Navigate } from "react-router-dom";

function RecipeDetailsPage() {
  const { id } = useParams();
  var [recipe, setRecipe] = useState([]);
  var [images, setImages] = useState([]);
  var [videos, setVideos] = useState([]);
  var [avgRating, setAvgRating] = useState([]);
  var [numRatings, setNumRatings] = useState([]);
  var [isRated, setIsRated] = useState(0);
  var [avatar, setAvatar] = useState("");
  var [diets, setDiets] = useState([]);
  var [cuisines, setCuisines] = useState([]);
  var [ingredients, setIngredients] = useState([]);
  var [steps, setSteps] = useState([]);
  var [serving, setServing] = useState([]);
  var [favBtnColor, setFavBtnColor] = useState("");
  var [favBtnText, setFavBtnText] = useState("");
  var [isFavorited, setisFavorited] = useState(0);
  var [favorites, setFavorites] = useState(0);
  var [isOwner, setIsOwner] = useState(false);
  var [location, setLocation] = useState("");
  var [notFound, setNotFound] = useState(false);

  const RECIPE_DETAILS_ENDPOINT =
    "http://127.0.0.1:8000/recipes/recipe-details/" + id + "/";
  const DID_USER_RATE_ENDPOINT =
    "http://127.0.0.1:8000/recipes/is-rated/" + id + "/";
  const DID_USER_FAVORITE_ENDPOINT =
    "http://127.0.0.1:8000/recipes/is-favorited/" + id + "/";

  useEffect(() => {

    //get all recipe details
    async function fetchData() {
      delete axios.defaults.headers.common['Authorization']
      const response = await axios.get(RECIPE_DETAILS_ENDPOINT).catch((e)=>{
        if (e.response.status === 404) {
          setNotFound(true)
        }
      });
      setRecipe(response.data);
      setImages(response.data.images);
      setVideos(response.data.videos);
      setAvgRating(response.data.average_rating);
      setNumRatings(response.data.num_ratings);
      setAvatar(response.data.avatar);
      setDiets(response.data.diet);
      setCuisines(response.data.cuisine);
      setIngredients(response.data.ingredients_info);
      setSteps(response.data.steps);
      setServing(response.data.serving);
      setFavorites(response.data.favorites);

      // Get user info, test to see if they own recipes
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
      const userinfoResponse = await axios.get("http://localhost:8000/accounts/my-info/")
      if (userinfoResponse.data.id === response.data.owner_id) {
        setIsOwner(true);
      }
      else {
        setIsOwner(false);
      }
    }
    fetchData();

    //see if user already rated the recipe, if logged in
    async function fetchIsRated() {
      var accessToken = localStorage.getItem('access_token');
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+accessToken
      }
      const response = await axios.get(DID_USER_RATE_ENDPOINT, {headers: headers});
      setIsRated(response.data.is_rated);
    }

    var accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetchIsRated();
    }

    async function didUserFavorite() {
      //set favBtnColor & favBtnText accordingly based on 0 or 1 return from backend
      var accessToken = localStorage.getItem('access_token');
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+accessToken
      }
      const response = await axios.get(DID_USER_FAVORITE_ENDPOINT, {headers: headers});
      var isFavorited = response.data.is_favorited;

      if (isFavorited === 0) {
        setFavBtnColor("indigo");
        setFavBtnText("Save to Favorites");
        setisFavorited(0);
      } else if (isFavorited > 0) {
        setFavBtnColor("green");
        setFavBtnText("Saved");
        setisFavorited(1);
      }
    }

    var accessToken = localStorage.getItem("access_token");

    //first load fails this some how (goes into diduserfavortie)
    if (accessToken) {
      didUserFavorite();
    } else {
      setFavBtnColor("indigo");
      setFavBtnText("Save to Favorites");
      setisFavorited(0);
    }
  }, []);

  const RATE_RECIPE_ENDPOINT = "http://127.0.0.1:8000/recipes/rate/";
  const UPDATE_USER_RATING_ENDPOINT =
    "http://127.0.0.1:8000/recipes/update-rating/" + id + "/";
  const GET_RATING_DATA =
    "http://127.0.0.1:8000/recipes/" + id + "/average-rating/";

  const rateRecipe = (user_rating) => {
    var accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      //logged in

      //if not rated, rate (creates new rating)
      if (isRated === 0) {
        var accessToken = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+accessToken
        }
        axios.post(RATE_RECIPE_ENDPOINT, {
          recipe: id,
          stars: user_rating,
        }, {headers: headers});

        //if rated, update user's existing rating
      } else if (isRated > 0) {
        var accessToken = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+accessToken
        }
        axios.patch(UPDATE_USER_RATING_ENDPOINT, {
          stars: user_rating,
        }, {headers: headers});
      }

      //update avg rating and num rating states
      async function fetchUpdatedRatingData() {
        delete axios.defaults.headers.common['Authorization']
        const response = await axios.get(GET_RATING_DATA);
        setAvgRating(response.data.average_rating);
        setNumRatings(response.data.num_ratings);
      }
      fetchUpdatedRatingData();
    }
  };

  const incrementServing = () => {
    setServing(serving + 1);

    var multiplier = serving / (serving - 1);

    //multiply every qty in ingredients by multiplier
    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i].quantity = ingredients[i].quantity * multiplier;
    }
  };

  const decrementServing = () => {
    if (serving - 1 > 1) {
      setServing(serving - 1);

      var multiplier = serving / (serving + 1);

      //multiply every qty in ingredients by multiplier
      for (let i = 0; i < ingredients.length; i++) {
        ingredients[i].quantity = ingredients[i].quantity * multiplier;
      }
    }
  };

  const favoriteRecipe = () => {
    var accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      //logged in

      if (isFavorited === 0) {
        //call endpoint to fav a recipe (create Favorite)
        var accessToken = localStorage.getItem("access_token");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
        const FAV_RECIPE_ENDPOINT = "http://127.0.0.1:8000/recipes/favorite/";
        axios.post(FAV_RECIPE_ENDPOINT, {
          recipe: id,
        }, {headers: headers});

        setisFavorited(1);
        setFavBtnColor("green");
        setFavBtnText("Saved");

        setFavorites(favorites + 1);

      } else if (isFavorited > 0) {
        //call endpoint to unfav a recipe (delete Favorite)
        var accessToken = localStorage.getItem("access_token");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
        const UNFAV_RECIPE_ENDPOINT = "http://127.0.0.1:8000/recipes/favorite/" + id + "/";
        axios.delete(UNFAV_RECIPE_ENDPOINT, {headers: headers});

        setisFavorited(0);
        setFavBtnColor("indigo");
        setFavBtnText("Save to Favorites");

        setFavorites(favorites - 1);
      }
    }
  };

  function addToCart() {
    var accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      var accessToken = localStorage.getItem("access_token");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+accessToken
      }
      const ADD_RECIPE_CART = "http://127.0.0.1:8000/recipes/add-recipe-to-cart/";
      axios.post(ADD_RECIPE_CART, {
        item: id,
      }, {headers: headers});

      Store.addNotification({
        title: "Recipe added to cart!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true,
        },
      });
    }
  }

  return (
    <>
      {notFound && <Navigate to="/not-found" />}
      <ReactNotifications />
      <div className="recipe-details-container">
        <h1 className="recipe-name-title">{recipe.name}</h1>
        <Badge className="favs" color="pink" variant="light">
          {favorites} favorites
        </Badge>

        <Tooltip
          label="You must be logged in to rate"
          disabled={localStorage.getItem("access_token")}
        >
          <Rating
            size="lg"
            className="rating"
            value={avgRating}
            onChange={(newRating) => rateRecipe(newRating)}
          />
        </Tooltip>
        <div id="rating-text">
          <span>{Math.round(avgRating * 10) / 10 + " out of 5"}</span>
        </div>
        <span id="num-ratings">{numRatings + " ratings"}</span>

        <br />

        <p>
          by &nbsp;
          <span id="underline-padded">{recipe.owner_name}</span>
        </p>

        {Object.keys(avatar).length === 0 ? (
          <span></span>
        ) : (
          <img
            src={"http://127.0.0.1:8000/media/" + avatar}
            id="jsmith-profile"
          ></img>
        )}

        <br />

        <div className="fav-cart-container">
          <div>
            <Tooltip
              label="You must be logged in to favorite"
              disabled={localStorage.getItem("access_token")}
            >
              <Button
                variant="light"
                color={favBtnColor}
                radius="lg"
                onClick={favoriteRecipe}
              >
                {favBtnText}
              </Button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              label="You must be logged in to add to cart"
              disabled={localStorage.getItem("access_token")}
            >
              <Button
                onClick={() => {
                  addToCart();
                }}
                variant="outline"
                color="green"
                leftIcon={
                  <ShoppingCart size={26} strokeWidth={1} color={"green"} />
                }
              >
                Add to Cart
              </Button>
            </Tooltip>
          </div>
          {
            isOwner && <div>
              <Button
                component={Link}
                to={`/recipe-details/${id}/edit`}
                variant="outline"
                color="blue"
                leftIcon={
                  <Edit size={26} strokeWidth={1} color={"blue"} />
                }
              >
                Edit Recipe
              </Button>
            </div>
          }

        </div>

        <br />
        <Divider my="xl" />
        {Object.keys(images).length === 0 &&
          Object.keys(videos).length === 0 ? (
          <span></span>
        ) : (
          <Carousel
            sx={{ maxWidth: 650 }}
            mx="auto"
            withIndicators
            height={450}
          >
            {images.map((image) => (
              <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                <Image width={650} height={450} src={image.image} />
              </Carousel.Slide>
            ))}

            {videos.map((video) => (
              <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                <video
                  width={650}
                  height={450}
                  controls
                  loop
                  autoPlay
                  src={video.video}
                  fit="contain"
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        )}

        <p>{recipe.description}</p>

        <br />
        <br />

        <div id="recipe-info">
          <div className="card2">
            <div className="card-body">
              <h2 className="card-title">Recipe</h2>
              <div className="cook-times-container">
                <div>
                  <span className="cook-times-headers">Diet</span>
                  <br />

                  <tbody className="sub-tables">
                    {Object.keys(diets).length === 0 ? (
                      <span>unspecified</span>
                    ) : (
                      diets.map((diet) => (
                        <tr>
                          <td> &nbsp; {diet.name}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </div>
                <div>
                  <span className="cook-times-headers">Cuisine</span>
                  <br />
                  <tbody className="sub-tables">
                    {Object.keys(cuisines).length === 0 ? (
                      <span>unspecified</span>
                    ) : (
                      cuisines.map((cuisine) => (
                        <tr>
                          <td> &nbsp; {cuisine.name}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </div>
                <div>
                  <span className="cook-times-headers">Serving</span>
                  <br />
                  <Button
                    compact
                    className="decrementServing"
                    onClick={decrementServing}
                  >
                    -
                  </Button>{" "}
                  &nbsp;
                  {recipe.serving === null ? (
                    <span>unspecified</span>
                  ) : (
                    serving
                  )}{" "}
                  &nbsp;
                  <Button
                    compact
                    className="incrementServing"
                    onClick={incrementServing}
                  >
                    +
                  </Button>
                </div>
              </div>
              <br />
              <div className="cook-times-container">
                <div>
                  <span className="cook-times-headers">Prep Time</span>
                  <br />
                  {recipe.prep_time === null ? (
                    <span>unspecified</span>
                  ) : (
                    recipe.prep_time
                  )}
                </div>

                <div>
                  <span className="cook-times-headers">Cook Time</span>
                  <br />
                  {recipe.cooking_time === null ? (
                    <span>unspecified</span>
                  ) : (
                    recipe.cooking_time
                  )}
                </div>
              </div>
              <br />
              <h4>Ingredients</h4>
              <ul>
                {Object.keys(ingredients).length === 0 ? (
                  <span>no ingredients specified</span>
                ) : (
                  ingredients.map((ingredient) => (
                    <li>
                      {ingredient.quantity.toFixed(1) +
                        " oz of " +
                        ingredient.name}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />

        <Divider my="xl" />

        <div className="steps">
          <Title weight={100}>Steps</Title>
          <div className="a-step">
            {Object.keys(steps).length === 0 ? (
              <span>no steps specified</span>
            ) : (
              steps.map((step, i) => (
                <div>
                  <h2>{i + 1 + ". " + step.name}</h2>
                  <p>
                    {step.prep_time === null || step.prep_time === "00:00:00" ? (
                      <span></span>
                    ) : (
                      "Prep Time: " + step.prep_time
                    )}
                    <br />
                    {console.log(step.cooking_time)}
                    {step.cooking_time === null || step.cooking_time === "00:00:00" ? (
                      <span></span>
                    ) : (
                      "Cook Time: " + step.cooking_time
                    )}
                  </p>
                  <p>{step.description}</p>

                  {Object.keys(step.images).length === 0 &&
                    Object.keys(step.videos).length === 0 ? (
                    <span></span>
                  ) : (
                    <Carousel
                      sx={{ maxWidth: 650 }}
                      mx="auto"
                      withIndicators
                      height={450}
                    >
                      {step.images.map((image) => (
                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                          <Image width={650} height={450} src={image.image} />
                        </Carousel.Slide>
                      ))}

                      {step.videos.map((video) => (
                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                          <video
                            width={650}
                            height={450}
                            controls
                            loop
                            autoPlay
                            src={video.video}
                            fit="contain"
                          />
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  )}

                  <Divider my="xl" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <CommentSection recipeid={id} />
    </>
  );
}

export default RecipeDetailsPage;
