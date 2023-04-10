import React from 'react';
import { Image, Rating, Tooltip, Title  } from '@mantine/core';
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

            <span id="rating-text">{(Math.round(avgRating * 10) / 10) + " out of 5"}</span>

            <Tooltip label="You must be logged in to rate" disabled = {localStorage.getItem('access_token')}>
                <Rating className='rating' value={avgRating} onChange={(newRating) => rateRecipe(newRating)}/>
            </Tooltip>

            <span id="num-ratings">{numRatings+ " ratings"}</span>

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
            
            <br />
            {/**
            <button type="button" class="btn btn-primary" onclick="location.href='#recipe-info';">Jump to Recipe</button>
            <button type="button" class="btn btn-primary">Save to Favorites</button>
            <button type="button" class="btn btn-primary">Add to Shopping List</button>
            */}
            <br />
            <p>{recipe.description}</p>
            {/**<img src="./images/reasted_sweet_potato_salad.png" id="details-main-pic" alt="..."></img>*/}
            <div id="recipe-info">
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Recipe</h2>
                        <div className="cook-times-container">
                            <div>
                                <span className="cook-times-headers">Diet</span>
                                <br />
                                Vegetarian
                            </div>
                            <div>
                                <span className="cook-times-headers">Cuisine</span>
                                <br />
                                American
                            </div>
                            <div>
                                <span className="cook-times-headers">Servings</span>
                                <br />
                                4 to 6 servings
                            </div>
                        </div>
                        <br />
                        <div className="cook-times-container">
                            <div>
                                <span className="cook-times-headers">Prep Time</span>
                                <br />
                                15 mins
                            </div>
                            <div>
                                <span className="cook-times-headers">Cook Time</span>
                                <br />
                                30 mins
                            </div>
                            <div>
                                <span className="cook-times-headers">Total Time</span>
                                <br />
                                45 mins
                            </div>
                        </div>
                        <br />
                        <h4>Ingredients</h4>
                        <ul>
                            <li>2 pounds sweet potatoes (3 medium or 2 large)</li>
                            <li>4 tablespoons olive oil, divided</li>
                            <li>1 tablespoon chili powder</li>
                            <li>3/4 teaspoon kosher salt, divided, plus more to taste</li>
                            <li>1/2 medium red onion</li>
                            <li>1 large lime</li>
                            <li>2 (14-ounce) cans black beans, drained and rinsed</li>
                            <li>1 to 2 packed cups baby spinach</li>
                            <li>1/4 teaspoon freshly ground black pepper, plus more to taste</li>
                            <li>4 ounces feta cheese, crumbled (about 1 cup)</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="steps">
                <h2>Steps</h2>
                <ul className="list-group">
                    <li className="list-group-item">
                        <h6>Preheat the oven to 425°F.</h6>
                        Arrange a rack in the middle of the oven.
                    </li>
                    <li className="list-group-item">
                        <h6>Prepare the sweet potatoes</h6>
                        <p>
                            Peel the sweet potatoes, if desired, and cut into 1-inch cubes. Place on a rimmed baking sheet. Drizzle with 2 tablespoons of olive oil and sprinkle with the chili powder and 1/2 teaspoon kosher salt.
                            <br />
                            <br />
                            Toss to coat. Arrange the potatoes in a single layer. Roast, tossing halfway through, until tender and browned in spots, about 30 minutes.
                            <br />
                            <br />
                            Once the potatoes are done, let them cool on the baking sheet until just warm to the touch, 10 to 15 minutes.
                        </p>
                        <br />
                        <img src="./images/step2_1.png" alt="..."></img>
                        <br />
                        <br />
                        <img src="./images/step2_2.png" alt="..."></img>
                    </li>
                    <li className="list-group-item">
                        <h6>Quick pickle the onion</h6>
                        <p>
                            Meanwhile, slice the red onion into very thin half-moons and place in a large bowl. Finely grate the zest of the lime into the bowl, then halve the lime crosswise and squeeze its juice into the bowl. Toss to coat the onion in the juice then leave to quick-pickle while the potatoes roast.
                        </p>
                        <img src="./images/step3.png" alt="..."></img>
                        <br />
                    </li>
                    <li className="list-group-item">
                        <h6>Assemble the salad</h6>
                        <p>
                            Add the roasted sweet potatoes, black beans, baby spinach, remaining 2 tablespoons olive oil, remaining 1/4 teaspoon kosher salt, and black pepper to the bowl with the onion and lime juice and toss to combine. Add the feta and toss gently again to combine.
                            <br />
                            <br />
                            Taste and season with additional salt and pepper, as needed. Enjoy warm or at room temperature.
                            <br />
                            <br />
                            Leftovers can be refrigerated in an airtight container for up to 5 days.
                        </p>
                        <br />
                        <img src="images/step4_1.png" alt="..."></img>
                        <br />
                        <br />
                        <img src="images/step4_2.png" alt="..."></img>
                    </li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default RecipeDetailsPage;