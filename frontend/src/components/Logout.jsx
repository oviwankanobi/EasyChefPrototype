import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Logout() {
    const navigate = useNavigate();
    localStorage.clear();
    axios.defaults.headers.common['Authorization'] = null;
    return navigate('/login')
}