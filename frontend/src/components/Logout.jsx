import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem('access_token')) {
            localStorage.clear();
            axios.defaults.headers.common['Authorization'] = null;
        }
        navigate('/login')

    }, []);
}