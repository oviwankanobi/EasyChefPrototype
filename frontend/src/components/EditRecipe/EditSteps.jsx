import React, { useState, useEffect } from 'react';
import {Container, Table, Divider} from '@mantine/core'
import {Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import EditIngredientsTable from './EditIngredientsTable';
import EditStepsAdd from './EditStepsAdd';
import EditStepsList from './EditStepsList'


function EditSteps(props) {
    const {initial_steps, recipeid} = props
    var [steps, setSteps] = useState(initial_steps)
    const accessToken = localStorage.getItem('access_token');
    var [userID, setUserID] = useState(null);
    var [avatarURL, setAvatarURL] = useState("")
    var [update, setUpdate] = useState(false);

    var [comments, setComments] = useState([])
    var [next, setNext] = useState(null)
    var [prev, setPrev] = useState(null)
    var [page, setPage] = useState(1)
    useEffect(() => {
        // Get ingredients
        delete axios.defaults.headers.common['Authorization']
        
        axios.get("http://127.0.0.1:8000/recipes/recipe-details/"+recipeid+"/")
            .then(response => {
                setSteps(response.data["steps"])
            })
        // Get user data
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        if (accessToken) {
            axios.get('http://localhost:8000/accounts/my-info/')
            .then(response => {
                setUserID(response.data["id"])
                setAvatarURL("http://localhost:8000" + response.data["avatar"])
            })
        }
    }, [update])

    return (
        <>
           <Container>
                <h3>Edit Steps</h3>
                <Divider my="sm" />
                {/* <EditIngredientsTable steps={steps} update={update} setUpdate={setUpdate} /> */}
                <EditStepsAdd recipeid={recipeid} update={update} setUpdate={setUpdate}/>
                <EditStepsList steps={steps} update={update} setUpdate={setUpdate}/>
           </Container>
            
        </>
    )
}

export default EditSteps;