import React, { useState, useEffect } from "react";
import { Form, Autocomplete, Button, Flex, NumberInput } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";

function EditIngredientsAdd(props) {
    const {recipeid, update, setUpdate, ingredients, notification} = props
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [searchField, setSearchField] = useState("")
    const [addField, setAddField] = useState(null)
    const [amountField, setAmountField] = useState(1)

    useEffect(()=>{
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem('access_token')
        }
        delete axios.defaults.headers.common["Authorization"]
        axios.get(`http://localhost:8000/recipes/autocomplete-ingredient/?search=${searchField}`)
            .then(request => {
                setSearchResults(request.data["results"])
            })
    }, [searchField])

    function postIngredient(e) {
        e.preventDefault();
        if (addField) {
            let foundIngredient = ingredients.find(ingredient => {
                return ingredient.base_id === addField.id
            })
            let previousAmount = 0
            foundIngredient ? previousAmount = foundIngredient.quantity : previousAmount = 0
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
            axios.post(`http://localhost:8000/recipes/add-ingredient-to-recipe/${recipeid}/`, {
                base_ingredient: addField["id"],
                quantity: amountField + previousAmount
            }).then(() => {
                setUpdate(!update)
                setSearchField("")
                setAddField(null)
                notification()
            })
        }
        else {
            errorNotification()
        }
        
    }

    function errorNotification() {  
        Store.addNotification({
          title: "Please pick an ingredient from the dropdown list.",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animateanimated", "animatefadeIn"],
          animationOut: ["animateanimated", "animatefadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true,
          },
        });}
    
    return (    
        <form onSubmit={postIngredient}>
            <Flex>
                <Autocomplete required
                    data={searchResults.map((ingredient)=>{
                        return {"value": ingredient["name"], "id": ingredient["id"]}
                        })} 
                    onItemSubmit={(i) => {setAddField(i)}} 
                    value={searchField}
                    onChange={setSearchField}/>
                <NumberInput ml="1rem" w="5rem" min={1} value={amountField} onChange={setAmountField} />
                <Button type="submit" ml="1rem">Save Ingredient</Button> 
            </Flex>
            
        </form>
        
    )
}

export default EditIngredientsAdd;
