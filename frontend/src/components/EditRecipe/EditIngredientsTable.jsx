import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Trash } from "tabler-icons-react";

function EditIngredientsTable(props) {
  const { ingredients, update, setUpdate } = props;
  var [userID, setUserID] = useState(null);
  var [avatarURL, setAvatarURL] = useState("");

    var [comments, setComments] = useState([])
    var [next, setNext] = useState(null)
    var [prev, setPrev] = useState(null)
    var [page, setPage] = useState(1)
    function deleteIngredient(id) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
        axios.delete(`http://localhost:8000/recipes/delete-ingredient-from-recipe/${id}/`).then(()=>{setUpdate(!update)})
    }

    return (
        <Table>
            <tbody>
                {ingredients.map((ingredient) => (
                    <tr key={ingredient["id"]}>
                        <td>{ingredient["name"]}</td>
                        <td>{ingredient["quantity"]} oz</td>
                        <td>
                            <Button onClick={()=>{deleteIngredient(ingredient["id"])}} color="red" size="xs" compact>
                                <Trash size={20} strokeWidth={2} color={'white'}/>
                                Delete Ingredient
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default EditIngredientsTable;
