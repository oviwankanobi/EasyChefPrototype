import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

function EditProfileHeader(props) {
    const {text} = props
    return (
        <h1 className="p-3 border-bottom editprofileheader">{text}</h1>
        
    );
}

export default EditProfileHeader;