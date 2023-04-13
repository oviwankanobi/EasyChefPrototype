import React from "react";
import {
  getUserCreatedAPI,
  getUserFavouritedAPI,
  getUserInteractedAPI,
} from "../../utils/apis";

function MyRecipesPage() {
  console.log(getUserCreatedAPI());
  console.log(getUserInteractedAPI());

  return (
    <div>
      <p>We are in the My Recipes Page</p>
    </div>
  );
}

export default MyRecipesPage;
