import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Fade from "react-bootstrap/Fade";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import axios from "axios";
import EditProfileTextField from "./EditProfileTextField";
import { Avatar } from "@mantine/core";

function EditProfileForm() {
  const ALERT_TIMEOUT = 4000;
  var [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  // validation states
  var [phoneErrors, setPhoneErrors] = useState([]);
  var [fnameErrors, setFnameErrors] = useState([]);
  var [lnameErrors, setLnameErrors] = useState([]);
  var [avatarErrors, setAvatarErrors] = useState([]);

  var [avatarURL, setAvatarURL] = useState("");

  var [uploadedAvatar, setUploadedAvatar] = useState("");

  var [alertData, setAlertData] = useState({
    variant: "secondary",
    // "visibility": "hidden",
    text: "",
    show: false,
  });

  var [pendingAlert, setPendingAlert] = useState(null);

  function clearErrors() {
    setPhoneErrors([]);
    setFnameErrors([]);
    setLnameErrors([]);
    setAvatarErrors([]);
  }

  function setAlertTimeout(timeoutAlertData, timeout) {
    clearTimeout(pendingAlert);
    setPendingAlert(
      setTimeout(() => {
        setAlertData(timeoutAlertData);
      }, timeout)
    );
  }

  var get_profile_data = () => {
    axios
      .get("http://localhost:8000/accounts/profile/my-profile/")
      .then((response) => {
        setData({
          first_name: response.data["first_name"],
          last_name: response.data["last_name"],
          phone_number: response.data["phone_number"],
        });
        setAvatarURL("http://localhost:8000" + response.data["avatar"]);
      })
      // .then(json => console.log(json))
      .catch((error) => console.log(error));
  };

  useEffect(get_profile_data, []);

  var formSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        "http://localhost:8000/accounts/profile/edit/",
        uploadedAvatar
          ? {
              ...data,
              avatar: uploadedAvatar,
            }
          : data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setAlertData({
          variant: "success",
          text: "Your changes have been saved.",
          show: true,
        });

        clearErrors();

        setAlertTimeout(
          {
            variant: "success",
            text: "Your changes have been saved.",
            show: false,
          },
          ALERT_TIMEOUT
        );

        get_profile_data();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            setAlertData({
              variant: "danger",
              text: "Please make sure you are logged in and try again.",
              show: true,
            });
            setAlertTimeout(
              {
                variant: "danger",
                text: "Please make sure you are logged in and try again.",
                show: false,
              },
              ALERT_TIMEOUT
            );
            break;
          default:
            // if ("phone_number" in error.response.data) {
            //     setPhoneErrors(error.response.data["phone_number"])
            // }
            // else {
            //     setPhoneErrors([])
            // }
            // if ("first_name" in error.response.data) {
            //     setFnameErrors(error.response.data["first_name"])
            // }
            // else {
            //     setFnameErrors([])
            // }
            error.response.data["phone_number"]
              ? setPhoneErrors(error.response.data["phone_number"])
              : setPhoneErrors([]);
            error.response.data["first_name"]
              ? setFnameErrors(error.response.data["first_name"])
              : setFnameErrors([]);
            error.response.data["last_name"]
              ? setLnameErrors(error.response.data["last_name"])
              : setLnameErrors([]);
            error.response.data["avatar"]
              ? setAvatarErrors(error.response.data["avatar"])
              : setAvatarErrors([]);
            setAlertData({
              variant: "danger",
              text: "Please make sure all fields are valid and try again.",
              show: true,
            });
            setAlertTimeout(
              {
                variant: "danger",
                text: "Please make sure all fields are valid and try again.",
                show: false,
              },
              ALERT_TIMEOUT
            );
        }
      });
  };

  return (
    <>
      <form noValidate className="w-100" onSubmit={formSubmit}>
        <div className="row m-5">
          <div className="col-lg-12 mb-5">
            <Avatar src={avatarURL} radius="xl" size="xl" />
            {/* <img src={avatarURL} className="rounded-circle ratio ratio-1x1" id="edit-dp" alt="..." /> */}
            <br />
            <br />
            <label htmlFor="addprofilepic">Upload Profile Picture</label>
            <br />
            <input
              type="file"
              id="addprofilepic"
              name="addprofilepic"
              accept="image/*"
              onChange={(e) => {
                setUploadedAvatar(e.target.files[0]);
              }}
            />
            {avatarErrors.map((error) => (
              <p key={error} style={{ color: "red" }}>
                {error}
              </p>
            ))}
          </div>
          <EditProfileTextField
            id="firstname"
            className="col-sm-6 mb-3"
            dataName="first_name"
            data={data}
            setData={setData}
            labelText="First Name"
            errors={fnameErrors}
          />
          <EditProfileTextField
            id="lastname"
            className="col-sm-6 mb-3"
            dataName="last_name"
            data={data}
            setData={setData}
            labelText="Last Name"
            errors={lnameErrors}
          />
          <EditProfileTextField
            id="phone"
            className="col-lg-12"
            dataName="phone_number"
            data={data}
            setData={setData}
            errors={phoneErrors}
            labelText="Phone Number"
            type="tel"
          />
        </div>
        &nbsp;
        <button id="apply" type="submit" className="btn btn-primary mx-5 my-1">
          Apply Changes
        </button>
        <Alert
          show={alertData["show"]}
          variant={alertData["variant"]}
          className="mx-5 my-1 w-75"
        >
          {alertData["text"]}
        </Alert>
      </form>
    </>
  );
}

export default EditProfileForm;
