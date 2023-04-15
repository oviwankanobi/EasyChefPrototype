import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, NumberInput, Paper, Flex, Divider, Group } from '@mantine/core'
import { Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'


function EditTimeField(props) {
    const { id, time, setTime, name, field } = props

    function parseDuration(o) {
        return o.h * 3600 + o.m * 60 + o.s
    }

    function editField(e, field, value) {
        e.preventDefault()
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
        axios.patch(`http://localhost:8000/recipes/edit-recipe/${id}/`, { [field]: value })
    }

    return (
        <form onSubmit={(e) => editField(e, field, parseDuration(time))}>
            <Group>
                <NumberInput
                    w="4rem"
                    mb="1rem"
                    min={0}
                    max={504}
                    placeholder="HH"
                    label="Hours"
                    required
                    value={time.h}
                    onChange={(e) => setTime({ ...time, h: e })}
                />
                <NumberInput
                    w="4rem"
                    mb="1rem"
                    min={0}
                    max={59}
                    placeholder="MM"
                    label="Mins"
                    required
                    value={time.m}
                    onChange={(e) => setTime({ ...time, m: e })}
                />
                <NumberInput
                    w="4rem"
                    mb="1rem"
                    min={0}
                    max={59}
                    placeholder="SS"
                    label="Secs"
                    required
                    value={time.s}
                    onChange={(e) => setTime({ ...time, s: e })}
                />
            </Group>
            <Button mb="1rem" type="submit">Save {name} Time</Button>
        </form>
    )
}

export default EditTimeField;