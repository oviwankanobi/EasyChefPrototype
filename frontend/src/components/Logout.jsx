import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem('access_token')) {
            localStorage.clear();
            delete axios.defaults.headers.common['Authorization']
        }
        navigate('/login')

    }, []);
}