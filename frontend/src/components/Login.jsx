import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: rem(900),
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },

    form: {
        borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        minHeight: rem(900),
        maxWidth: rem(450),
        paddingTop: rem(80),

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));


export default function Login() {

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    });

    const LOGIN_API_ENDPOINT = 'http://127.0.0.1:8000/accounts/login/';
    const navigate = useNavigate();

    const handleLogin = async (formValues) => {
        try {
            const response = await fetch(LOGIN_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formValues.email,
                    password: formValues.password,
                })
            });

            const result = await response.json();
            if (response.ok) {
                navigate('/');
            }
            else {
                console.log(result)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} p={30} mt={30} radius={0}>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome back to Easy Chef!
                </Title>

                <form onSubmit={form.onSubmit(handleLogin)}>
                    <TextInput label="Email address" placeholder="example@gmail.com" size="md" {...form.getInputProps('email')} />
                    <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" {...form.getInputProps('password')} />
                    <Checkbox label="Keep me logged in" mt="xl" size="md" />
                    <Button type="submit" fullWidth mt="xl" size="md">
                        Login
                    </Button>
                </form>

                <Text ta="center" mt="md">
                    Don&apos;t have an account?{' '}
                    <Anchor component={Link} to="/register" weight={700} >
                        Register
                    </Anchor>
                </Text>
            </Paper>
        </div >
    );

}