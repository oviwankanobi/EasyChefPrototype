import React, { useState, useEffect } from "react";
import { Container, Table } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { axios } from "../../utils/axiosAutoAuth";
import EditIngredientsTable from "./EditIngredientsTable";
import EditIngredientsAdd from "./EditIngredientsAdd";

function EditIngredients(props) {
  const { initial_ingredients, recipeid } = props;
  var [ingredients, setIngredients] = useState(initial_ingredients);
  const accessToken = localStorage.getItem("access_token");
  var [userID, setUserID] = useState(null);
  var [avatarURL, setAvatarURL] = useState("");
  var [update, setUpdate] = useState(false);

  var [comments, setComments] = useState([]);
  var [next, setNext] = useState(null);
  var [prev, setPrev] = useState(null);
  var [page, setPage] = useState(1);
  console.log(initial_ingredients);
  useEffect(() => {
    // Get ingredients
    axios
      .get("http://127.0.0.1:8000/recipes/recipe-details/" + recipeid + "/")
      .then((response) => {
        setIngredients(response.data["ingredients_info"]);
      });
    // Get user data
    if (accessToken) {
      axios.get("http://localhost:8000/accounts/my-info/").then((response) => {
        setUserID(response.data["id"]);
        setAvatarURL("http://localhost:8000" + response.data["avatar"]);
      });
    }

    console.log(update);
  }, [update]);

  return (
    <>
      <Container mt="5rem">
        <h6>Ingredients</h6>
        <EditIngredientsTable
          ingredients={ingredients}
          update={update}
          setUpdate={setUpdate}
        />
        <EditIngredientsAdd
          recipeid={recipeid}
          update={update}
          setUpdate={setUpdate}
        />
      </Container>
    </>
  );
}

export default EditIngredients;
