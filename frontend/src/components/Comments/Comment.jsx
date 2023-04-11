//https://ui.mantine.dev/category/comments

import { createStyles, Text, Avatar, Group, rem, Flex, Button } from '@mantine/core';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
    body: {
        paddingLeft: rem(54),
        paddingTop: theme.spacing.xs,
        wordWrap: "break-word",
    },
}));
function Comment(props) {
    const { userid, comment, setUpdate, update } = props;
    const { id, author, datetime_created, content } = comment
    const date = new Date(datetime_created)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    const { classes } = useStyles();

    console.log(userid === author["id"])

    function deleteComment() {
        axios.delete(`http://localhost:8000/recipes/comments/${id}/`)
        setUpdate(!update)
    }

    return (
        <div>
            <Group>
                <Avatar src={author["avatar"]} radius="xl" />
                <div>
                    <Flex gap="md">
                        <Text size="sm">{`${author["first_name"]} ${author["last_name"]}`}</Text>
                        {userid === author["id"] && <Button color="red" radius="xl" size="xs" compact onClick={deleteComment}>Delete</Button>}
                    </Flex>
                    
                    <Text size="xs" color="dimmed">
                        {date.toLocaleDateString(undefined, options)}
                    </Text>
                </div>
            </Group>
            <Text className={classes.body} size="sm">
                {content}
            </Text>
        </div>
    );
}

export default Comment;