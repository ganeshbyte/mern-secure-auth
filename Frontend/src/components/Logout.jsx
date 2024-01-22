import axios from 'axios'
import React from 'react'
import userContex from './UserContex';
import { useContext } from 'react';

function Logout() {
    const user = useContext(userContex);
    async function onLogoutHandler() {
        const response = await axios.get("http://localhost:3000/logout", { withCredentials: true });
        user.setEmail("");
    }
    return (
        <button onClick={onLogoutHandler}>Logout</button>
    )
}

export default Logout