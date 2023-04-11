import React from 'react';
import { Image, Rating, Tooltip, Text  } from '@mantine/core';
import { useParams } from 'react-router-dom';
import './RecipeDetails.css';
import { Carousel } from "@mantine/carousel";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function RecipeDetailsPage() {

    const { id } = useParams()
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

    const RECIPE_DETAILS_ENDPOINT = "http://127.0.0.1:8000/recipes/recipe-details/"+id+"/";
    const DID_USER_RATE_ENDPOINT = "http://127.0.0.1:8000/recipes/is-rated/"+id+"/";

    useEffect(() => {

        //get all recipe details
        async function fetchData() {
            const response = await axios.get(RECIPE_DETAILS_ENDPOINT);
            setRecipe(response.data);
            setImages(response.data.images);
            setVideos(response.data.videos);
            setAvgRating(response.data.average_rating);
            setNumRatings(response.data.num_ratings);
            setAvatar(response.data.avatar);
            setDiets(response.data.diet);
            setCuisines(response.data.cuisine);
            setIngredients(response.data.ingredients_info);
            setSteps(response.data.steps)
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
            setIsRated(response.data.is_rated)
        }

        var accessToken = localStorage.getItem('access_token');
        if(accessToken){
            fetchIsRated();
        }        

    }, [])

    const RATE_RECIPE_ENDPOINT = "http://127.0.0.1:8000/recipes/rate/";
    const UPDATE_USER_RATING_ENDPOINT = "http://127.0.0.1:8000/recipes/update-rating/"+id+"/";
    const GET_RATING_DATA = "http://127.0.0.1:8000/recipes/"+id+"/average-rating/"


    const rateRecipe = (user_rating) => {

        var accessToken = localStorage.getItem('access_token');
        if (accessToken) { //logged in
            
            //if not rated, rate (creates new rating)
            if(isRated === 0){

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+accessToken
                }

                axios.post(RATE_RECIPE_ENDPOINT, {
                    recipe: id,
                    stars: user_rating
                }, {
                    headers: headers
                })
                .then((response) => {
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
                
            //if rated, update user's existing rating
            } else if (isRated > 0){

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+accessToken
                }

                axios.patch(UPDATE_USER_RATING_ENDPOINT, {
                    stars: user_rating
                }, {
                    headers: headers
                })
                .then((response) => {
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
            }

            //update avg rating and num rating states
            async function fetchUpdatedRatingData() {
                const response = await axios.get(GET_RATING_DATA);
                setAvgRating(response.data.average_rating)
                setNumRatings(response.data.num_ratings)
            }
            fetchUpdatedRatingData();

        }
        
    }

    return (
        <>
        <div className="recipe-details-container">
            <h1>{recipe.name}</h1>

            <Tooltip label="You must be logged in to rate" disabled = {localStorage.getItem('access_token')}>
                <Rating size='lg' className='rating' value={avgRating} onChange={(newRating) => rateRecipe(newRating)}/>
            </Tooltip>
            <span id="rating-text">
                {(Math.round(avgRating * 10) / 10) + " out of 5, "+numRatings+" ratings"}
            </span>
            <br />

            <br />

            <p>
                by &nbsp;
                <span id="underline-padded">{recipe.owner_name}</span>
            </p>

            {Object.keys(avatar).length === 0 ? <span></span> : 
            <img src={"http://127.0.0.1:8000/media/"+avatar} id="jsmith-profile"></img>
            }

            <br />
            <br />

            {Object.keys(images).length === 0 && Object.keys(videos).length === 0 ? <span></span> :
                <Carousel sx={{ maxWidth: 650 }} mx="auto" withIndicators height={450}>

                    {images.map(image => (
                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                            <Image width={650} height={450} src={"http://127.0.0.1:8000/media/"+image.image} />
                        </Carousel.Slide>
                    ))}
        
                    {videos.map(video => (
                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                            <video width={650} height={450} controls loop autoPlay src={"http://127.0.0.1:8000/media/"+video.video} fit="contain" />
                        </Carousel.Slide>
                    ))}
        
                </Carousel>
            }
            
            {/**
            <button type="button" class="btn btn-primary">Save to Favorites</button>
            <button type="button" class="btn btn-primary">Add to Shopping List</button>
            */}
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
                            
                                <table className="sub-tables">

                                    {Object.keys(diets).length === 0 ? <span>unspecified</span> : 
                                        diets.map(diet => (
                                            <tr>
                                            <td>{diet.name}</td>
                                            </tr>
                                        ))
                                    }
                                </table>
                            </div>
                            <div>
                                <span className="cook-times-headers">Cuisine</span>
                                <br />
                                <table className="sub-tables">

                                    {Object.keys(cuisines).length === 0 ? <span>unspecified</span> : 
                                        cuisines.map(cuisine => (
                                            <tr>
                                            <td>{cuisine.name}</td>
                                            </tr>
                                        ))
                                    }
                                </table>
                            </div>
                            <div>
                                <span className="cook-times-headers">Servings</span>
                                <br />
                                {recipe.serving === null ? <span>unspecified</span> : recipe.serving}
                            </div>
                        </div>
                        <br />
                        <div className="cook-times-container">
                            <div>
                                <span className="cook-times-headers">Prep Time</span>
                                <br />
                                {recipe.prep_time === null ? <span>unspecified</span> : recipe.prep_time}
                            </div>
    
                            <div>
                                <span className="cook-times-headers">Cook Time</span>
                                <br />
                                {recipe.cooking_time === null ? <span>unspecified</span> : recipe.cooking_time}
                            </div>
                        </div>
                        <br />
                        <h4>Ingredients</h4>
                        <ul>
                            {Object.keys(ingredients).length === 0 ? <span>no ingredients specified</span> : 
                                ingredients.map(ingredient => (
                                    <li>{ingredient.quantity+" oz of "+ingredient.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <br />
            <div className="steps">
                <h1>Steps</h1>
                <div className="a-step">

                    {Object.keys(steps).length === 0 ? <span>no steps specified</span> : 
                        steps.map((step, i) => (
                            <div>
                            <h2>{(i+1)+". "+step.name}</h2>
                            <p>
                                {recipe.prep_time === null ? <span>prep time: unspecified</span> : "prep time: "+recipe.prep_time}
                                <br />
                                {recipe.cooking_time === null ? <span>cook time: unspecified</span> : "cook time: "+recipe.cooking_time}
                            </p>
                            <p>
                                {step.description}
                            </p>

                            {Object.keys(step.images).length === 0 && Object.keys(step.videos).length === 0 ? <span></span> :
                                <Carousel sx={{ maxWidth: 650 }} mx="auto" withIndicators height={450}>

                                    {step.images.map(image => (
                                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                                            <Image width={650} height={450} src={"http://127.0.0.1:8000/media/"+image.image} />
                                        </Carousel.Slide>
                                    ))}
                        
                                    {step.videos.map(video => (
                                        <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                                            <video width={650} height={450} controls loop autoPlay src={"http://127.0.0.1:8000/media/"+video.video} fit="contain" />
                                        </Carousel.Slide>
                                    ))}
            
                                </Carousel>
                            }

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        </>
    );
}

export default RecipeDetailsPage;