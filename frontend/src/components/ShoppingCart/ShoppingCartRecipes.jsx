import React, { useState, useEffect } from "react";
import { List, Button } from "@mantine/core";
import Alert from "react-bootstrap/Alert";
import Fade from "react-bootstrap/Fade";
import ShoppingCartRemoveButton from "./ShoppingCartRemoveButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { axios } from "../../utils/axiosAutoAuth";

function ShoppingCartRecipes(props) {
  const { cart, setRemoveErrors } = props;

  return (
    <>
      <div className="container m-2">
        <List>
          {cart.map((recipe, index) => {
            // TODO: make remove button send a delete request (requires id)
            return (
              <List.Item key={index}>
                <p>
                  {recipe.name}
                  <ShoppingCartRemoveButton
                    recipe_id={recipe.id}
                    setRemoveErrors={setRemoveErrors}
                  />
                </p>
              </List.Item>
            );
          })}
        </List>
      </div>
    </>
  );
}

export default ShoppingCartRecipes;
