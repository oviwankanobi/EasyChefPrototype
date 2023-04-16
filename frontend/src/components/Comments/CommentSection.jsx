import React, { useState, useEffect } from "react";
import { Container } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CommentField from "./CommentField";
import Comment from "./Comment";

function CommentSection(props) {
  const { recipeid } = props;
  const accessToken = localStorage.getItem("access_token");
  var [userID, setUserID] = useState(null);
  var [avatarURL, setAvatarURL] = useState("");
  var [update, setUpdate] = useState(false);

  var [comments, setComments] = useState([]);
  var [next, setNext] = useState(null);
  var [prev, setPrev] = useState(null);
  var [page, setPage] = useState(1);

  useEffect(() => {
    // Get comments
    delete axios.defaults.headers.common['Authorization']
    axios
      .get(`http://localhost:8000/recipes/${recipeid}/comments/?page=${page}`)
      .then((response) => {
        setComments(response.data["results"]);
        setNext(response.data["next"]);
        setPrev(response.data["previous"]);
      })
      // .then(json => console.log(json))
      .catch((error) => console.log(error));

    // Get user data
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
      axios.get("http://localhost:8000/accounts/my-info/").then((response) => {
        setUserID(response.data["id"]);
        setAvatarURL("http://localhost:8000" + response.data["avatar"]);
      });
    }
  }, [update]);

  return (
    <>
      <Container mt="5rem">
        <Row className="height d-flex justify-content-center align-items-center">
          <Col md={7}>
            <div>
              <div className="p=3">
                <h6>Comments</h6>
              </div>
              {accessToken ? (
                <CommentField
                  recipe_id={recipeid}
                  avatar={avatarURL}
                  setUpdate={setUpdate}
                  update={update}
                />
              ) : (
                <p>You must be logged in to comment.</p>
              )}
              <div className="mt-2">
                {comments.map((comment) => (
                  <Container key={comment["id"]} my="2rem">
                    <Comment
                      userid={userID}
                      comment={comment}
                      setUpdate={setUpdate}
                      update={update}
                    />
                  </Container>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CommentSection;
