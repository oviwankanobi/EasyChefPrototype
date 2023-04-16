import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, NumberInput, Paper, Flex, Divider, Group, FileInput } from '@mantine/core'
import { Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import EditTimeField from './EditTime';
import { Upload } from 'tabler-icons-react';


function EditStepsAdd(props) {
    const { recipeid, update, setUpdate } = props
    const [nameField, setNameField] = useState("")
    const [descField, setDescField] = useState("")
    const [prepTimeField, setPrepTimeField] = useState({ h: 0, m: 0, s: 0 })
    const [cookTimeField, setCookTimeField] = useState({ h: 0, m: 0, s: 0 })
    const [imageField, setImageField] = useState(null)
    const [videoField, setVideoField] = useState(null)
    const [addField, setAddField] = useState(null)
    const [amountField, setAmountField] = useState(1)

    // function postIngredient(e) {
    //     e.preventDefault();
    //     if (addField) {
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    //         axios.post(`http://localhost:8000/recipes/add-ingredient-to-recipe/${recipeid}/`, {
    //             base_ingredient: addField["id"],
    //             quantity: amountField
    //         }).then(() => {
    //             setUpdate(!update)
    //             setSearchField("")
    //             setAddField(null)
    //         })
    //     }

    // }

    function parseDuration(o) {
        return o.h * 3600 + o.m * 60 + o.s
    }

    function stepUploadImage(stepID) {
        if (imageField) {
            axios.post("http://localhost:8000/recipes/add-image-to-step/", {
                step: stepID,
                image: imageField
            },
            {headers: {
                'Content-Type': 'multipart/form-data'
              }})
        }
    }

    function stepUploadVideo(stepID) {
        if (videoField) {
            axios.post("http://localhost:8000/recipes/add-video-to-step/", {
                step: stepID,
                video: videoField
            },
            {headers: {
                'Content-Type': 'multipart/form-data'
              }})
        }
    }

    

    function postStep(e) {
        e.preventDefault()
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
        axios.post("http://localhost:8000/recipes/add-step-to-recipe/", {
            name: nameField,
            description: descField,
            prep_time: parseDuration(prepTimeField),
            cooking_time: parseDuration(cookTimeField),
            recipe: recipeid,
            number: 1,
        }).then((response) => { 
            stepUploadImage(response.data.id)
            setTimeout(()=>stepUploadVideo(response.data.id), 100) 
            setUpdate(!update) 
        })
    }



    return (
        <form onSubmit={postStep}>
            <Paper p="1rem" withBorder>
                <h6 >Create New Step</h6>
                <Divider mb="sm" />

                <TextInput
                    placeholder="The title of your new step..."
                    label="New Step's Name"
                    value={nameField}
                    required
                    onChange={(e) => setNameField(e.target.value)}
                />
                <Textarea
                    my="1rem"
                    placeholder="A detailed description on how to carry out your step..."
                    label="New Step's Description"
                    value={descField}
                    required
                    onChange={(e) => setDescField(e.target.value)}
                />
                {/* <Flex mt="1rem">
                    <NumberInput label="Prep Time" min={0} required value={prepTimeField} onChange={setPrepTimeField} />
                    <NumberInput label="Cook Time" ml="1rem" required min={0} value={cookTimeField} onChange={setCookTimeField} />
                </Flex> */}

                <Paper w="50%" shadow="sm" p="1rem">
                    <h6>New Step's Prep Time</h6>
                    <Divider my="sm" />
                    <Group>
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={504}
                            placeholder="HH"
                            label="Hours"
                            required
                            value={prepTimeField.h}
                            onChange={(e) => setPrepTimeField({ ...prepTimeField, h: e })}
                        />
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={59}
                            placeholder="MM"
                            label="Mins"
                            required
                            value={prepTimeField.m}
                            onChange={(e) => setPrepTimeField({ ...prepTimeField, m: e })}
                        />
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={59}
                            placeholder="SS"
                            label="Secs"
                            required
                            value={prepTimeField.s}
                            onChange={(e) => setPrepTimeField({ ...prepTimeField, s: e })}
                        />
                    </Group>
                </Paper>

                <Paper w="50%" shadow="sm" p="1rem" mb="1rem">
                    <h6>New Step's Cooking Time</h6>
                    <Divider my="sm" />
                    <Group>
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={504}
                            placeholder="HH"
                            label="Hours"
                            required
                            value={cookTimeField.h}
                            onChange={(e) => setCookTimeField({ ...cookTimeField, h: e })}
                        />
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={59}
                            placeholder="MM"
                            label="Mins"
                            required
                            value={cookTimeField.m}
                            onChange={(e) => setCookTimeField({ ...cookTimeField, m: e })}
                        />
                        <NumberInput
                            w="4rem"
                            mb="1rem"
                            min={0}
                            max={59}
                            placeholder="SS"
                            label="Secs"
                            required
                            value={cookTimeField.s}
                            onChange={(e) => setCookTimeField({ ...cookTimeField, s: e })}
                        />
                    </Group>
                </Paper>

                {/* https://mantine.dev/core/file-input/ */}
                <Paper shadow="sm" p="1rem" mb="1rem">
                    <h6>New Step's Media</h6>
                    <Divider my="sm" />
                    <FileInput w="40%"
                        placeholder="Click here to upload an image"
                        label="Upload an image"
                        accept="image/*"
                        icon={<Upload
                            size={20}
                            strokeWidth={2}
                            />}
                        value={imageField}
                        onChange={setImageField}
                    />

                    <FileInput w="40%"
                        placeholder="Click here to upload a video"
                        label="Upload a video"
                        accept="video/*"
                        icon={<Upload
                            size={20}
                            strokeWidth={2}
                            />}
                        value={videoField}
                        onChange={setVideoField}
                    />
                </Paper>


                <Button type="submit" mt="1rem">Save Step</Button>
            </Paper>

        </form>

    )
}

export default EditStepsAdd;