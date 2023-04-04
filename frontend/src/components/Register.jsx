import React, { useEffect } from "react";
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Stack,
} from "@mantine/core";
import { useForm, hasLength, isEmail, matchesField } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Register() {
    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password1: '',
            password2: '',
        },

        validate: {
            firstName: hasLength({ min: 2, max: 12 }),
            lastName: hasLength({ min: 2, max: 12 }),
            email: isEmail('Invalid email'),
            password2: matchesField('password1', 'Passwords are not the same'),
        },
    });

    const REGISTER_API_ENDPOINT = 'http://127.0.0.1:8000/accounts/register/';
    const navigate = useNavigate();

    const handleRegister = async (formValues) => {
        try {
            const response = await axios.post(REGISTER_API_ENDPOINT, {
                first_name: formValues.firstName,
                last_name: formValues.lastName,
                email: formValues.email,
                password: formValues.password1,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                navigate('/login');
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            navigate('/');
        }
    }, []);

    return (
        <Container size={520} my={40}>
            <Title
                align="center"
                sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                })}
            >
                Create an Account
            </Title>


            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleRegister)}>

                    <Stack>

                        <TextInput label="First Name" placeholder="First Name" required {...form.getInputProps('firstName')} />
                        <TextInput label="Last Name" placeholder="Last Name" required {...form.getInputProps('lastName')} />

                        <TextInput label="Email" placeholder="example@gmail.com" required {...form.getInputProps('email')} />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            {...form.getInputProps('password1')}
                        />
                        <PasswordInput
                            label="Confirm password"
                            {...form.getInputProps('password2')}
                        />
                    </Stack>
                    <Group position="apart" mt="xs">
                        <Anchor
                            onClick={(event) => event.preventDefault()}
                            href="#"
                            size="sm"
                        >
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type="submit" fullWidth mt="xl">
                        Sign Up
                    </Button>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Already have an account?{" "}
                        <Anchor component={Link} to="/login"
                            size="sm"
                        //onClick={(event) => event.preventDefault()}
                        >
                            Login
                        </Anchor>
                    </Text>
                </form>

            </Paper>
        </Container>
    );
}