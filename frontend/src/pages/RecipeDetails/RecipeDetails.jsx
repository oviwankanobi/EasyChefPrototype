import React from 'react';
import { Image } from '@mantine/core';
import { useParams } from 'react-router-dom';
import './RecipeDetails.css';
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from 'react';
import axios from 'axios';

function RecipeDetailsPage() {

    const { id } = useParams()
    var [recipe, setRecipe] = useState([]);
    var [images, setImages] = useState([]);

    const RECIPE_DETAILS_ENDPOINT = "http://127.0.0.1:8000/recipes/recipe-details/"+id;

    useEffect(() => {
  
      async function fetchData() {
        const response = await axios.get(RECIPE_DETAILS_ENDPOINT);
        setRecipe(response.data);
        setImages(response.data.images);
      }
      fetchData();
    }, [])

    return (
        <>
        <div className="recipe-details-container">
            <h1>{recipe.name}</h1>
            {/**
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            */}
            <span className="fa fa-star checked">
                <span id="rating-text">4.9 (26 ratings)</span>
            </span>

            <Carousel sx={{ maxWidth: 450 }} mx="auto" withIndicators height={350}>

                {images.map(image => (
                    <Carousel.Slide sx={{ backgroundColor: "#eee" }}>
                        <Image src={"http://127.0.0.1:8000/media/"+image.image} />
                    </Carousel.Slide>
                ))}

            </Carousel>
            
            <p>
                by &nbsp;
                <span id="underline-padded">{recipe.owner_name}</span>
            </p>
            <img src="./images/johnsmith_avatar.png" id="jsmith-profile" alt="John Smith"></img>
            <br />
            {/**
            <button type="button" class="btn btn-primary" onclick="location.href='#recipe-info';">Jump to Recipe</button>
            <button type="button" class="btn btn-primary">Save to Favorites</button>
            <button type="button" class="btn btn-primary">Add to Shopping List</button>
            */}
            <br />
            <p>This colorful, hearty combination of spiced sweet potatoes, black beans, baby spinach, and feta is perfect for meal prepping. Make roasted sweet potato salad for lunch or dinner.</p>
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