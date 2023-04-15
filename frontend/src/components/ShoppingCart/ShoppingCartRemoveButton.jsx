import React, { useState, useEffect } from "react";
import { List, Button } from "@mantine/core";
import Alert from "react-bootstrap/Alert";
import Fade from "react-bootstrap/Fade";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { axios } from "../../utils/axiosAutoAuth";

function ShoppingCartRemoveButton(props) {
  const { recipe_id, setRemoveErrors } = props;

  function removeCart() {
    axios
      .delete(
        "http://localhost:8000/recipes/remove-recipe-from-cart/" +
          recipe_id +
          "/"
      )
      .then(() => {
        setRemoveErrors([]);
      })
      .catch((error) => {
        setRemoveErrors(error.response);
      });
  }

  return (
    <Button
      color="red"
      compact
      size="xs"
      radius="xl"
      ml="sm"
      onClick={removeCart}
    >
      Remove
    </Button>
  );
}

export default ShoppingCartRemoveButton;
