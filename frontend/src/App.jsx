import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register, Login, Logout } from "./components";
import {
  Home,
  MyRecipes,
  CreateRecipes,
  RecipeDetails,
  Profile,
  Layout,
  Authentication,
  ShoppingList,
  EditRecipe,
} from "./pages";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/my-recipes",
        element: <MyRecipes />,
      },
      {
        path: "/create-recipe",
        element: <CreateRecipes />,
      },
      {
        path: "/recipe-details/:id",
        element: <RecipeDetails />,
      },
      {
        path: "/recipe-details/:id/edit",
        element: <EditRecipe />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingList />,
      },
    ],
  },
  {
    element: <Authentication />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
