import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell, Header } from "@mantine/core";
import {
  HomePage,
  MyRecipesPage,
  CreateRecipePage,
  ProfilePage,
} from "./pages";
import Layout from "./components/Layout.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/my-recipes",
        element: <MyRecipesPage />,
      },
      {
        path: "/create-recipe",
        element: <CreateRecipePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
