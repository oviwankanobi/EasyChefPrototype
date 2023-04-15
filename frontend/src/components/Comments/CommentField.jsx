import React, { useState, useEffect } from "react";
import { Avatar, Textarea, Button, Container } from "@mantine/core";
import Alert from "react-bootstrap/Alert";
import Fade from "react-bootstrap/Fade";
import "bootstrap/dist/css/bootstrap.min.css";
import { axios } from "../../utils/axiosAutoAuth";
import "./style.css";

function CommentField(props) {
  const { recipe_id, avatar, setUpdate, update } = props;
  // const accessToken = localStorage.getItem('access_token');
  var [comment, setComment] = useState("");

  // var [avatarURL, setAvatarURL] = useState("")
  // useEffect(() => {
  //     if (accessToken) {
  //         axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
  //         axios.get('http://localhost:8000/accounts/profile/my-profile/')
  //         .then(response => {
  //             setAvatarURL("http://localhost:8000" + response.data["avatar"])
  //         })
  //         // .then(json => console.log(json))
  //         .catch(error => console.log(error));
  //     }
  // }, [])

  function postComment(e) {
    e.preventDefault();
    axios.post("http://localhost:8000/recipes/comments/create/", {
      content: comment,
      recipe: recipe_id,
    });
    setComment("");
    setUpdate(!update);
  }

  return (
    <>
      <Container className="form-color" pb="1rem">
        <form onSubmit={postComment}>
          <div className="mt-3 d-flex flex-row align-items-center p-3">
            <Avatar src={avatar} radius="xl" size="lg" />
            <Textarea
              placeholder="Enter your comment..."
              w="100%"
              ml="1rem"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <Button type="submit" radius="lg">
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
}

export default CommentField;
