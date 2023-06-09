import React, { useState, useEffect } from 'react';
import { Container, Table, Button, List, Paper, Divider, Flex} from '@mantine/core';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { Trash } from 'tabler-icons-react';

function EditStepsList(props) {
    const { steps, update, setUpdate } = props
    const accessToken = localStorage.getItem('access_token');
    var [userID, setUserID] = useState(null);
    var [avatarURL, setAvatarURL] = useState("")

    var [comments, setComments] = useState([])
    var [next, setNext] = useState(null)
    var [prev, setPrev] = useState(null)
    var [page, setPage] = useState(1)
    // function deleteIngredient(id) {
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    //     axios.delete(`http://localhost:8000/recipes/delete-ingredient-from-recipe/${id}/`)
    //     setUpdate(!update)
    // }

    function deleteIngredient(id) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
        axios.delete(`http://localhost:8000/recipes/delete-step-from-recipe/${id}/`)
        setUpdate(!update)
    }

    return (
        <Paper p="1rem">
            <h6>Delete Steps</h6>
            <Divider mb="lg" />
            <List>
                {steps.map((step, index) => (
                    <Flex key={index}>
                        <List.Item mb="1rem">{step.name}</List.Item>
                        <Button ml="1rem" onClick={() => { deleteIngredient(step.id) }} color="red" size="xs" compact leftIcon={<Trash size={20} strokeWidth={2} color={'white'} />}>
                            Delete Step
                        </Button>
                    </Flex>
                ))}
            </List>
        </Paper>

        // <Table>
        //     <tbody>
        //         {steps.map((ingredient) => (
        //             <tr key={ingredient["id"]}>
        //                 <td>{ingredient["name"]}</td>
        //                 <td>{ingredient["quantity"]} oz</td>
        //                 <td>
        //                     <Button onClick={()=>{deleteIngredient(ingredient["id"])}} variant="outline" color="red" size="xs" compact>
        //                         <Trash size={20} strokeWidth={1} color={'red'}/>
        //                         Delete Ingredient
        //                     </Button>
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        // </Table>
    )
}

export default EditStepsList;