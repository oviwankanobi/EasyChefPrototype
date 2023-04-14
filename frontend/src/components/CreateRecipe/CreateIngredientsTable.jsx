import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Trash } from "tabler-icons-react";

function EditIngredientsTable(props) {
  const { ingredients, setIngredients, update, setUpdate } = props;
  function deleteIngredient(id) {
    axios.delete(
      `http://localhost:8000/recipes/delete-ingredient-from-recipe/${id}/`
    );
    setUpdate(!update);
  }

  function deleteIngredient(index) {
    let ingr = [...ingredients];
    ingr.splice(index, 1);
    console.log(ingr);
    setIngredients(ingr);
  }
  return (
    <Table>
      <tbody>
        {ingredients.map((ingredient, index) => {
          return (
            <tr key={index}>
              <td>{ingredient.name}</td>
              <td>{ingredient.quantity} oz</td>
              <td>
                <Button
                  onClick={() => {
                    deleteIngredient(index);
                  }}
                  variant="outline"
                  color="red"
                  size="xs"
                  compact
                >
                  <Trash size={20} strokeWidth={1} color={"red"} />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default EditIngredientsTable;
