import React from 'react';
import { useState, useContext } from 'react';
import axios from "axios";
import userContex from './UserContex';


function Signup() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleOnChangeEmail = (event) => {
        const value = event.target.value;
        setUser((prev) => {
            return {
                email: value,
                password: prev.password
            }
        })
    };

    const handleOnChangePassword = (event) => {
        const value = event.target.value;
        setUser((prev) => {
            return {
                password: value,
                email: prev.email
            }
        })
    };

    const userObject = useContext(userContex);

    //register user
    const loginUser = async (event) => {
        event.preventDefault();
        axios.post("http://localhost:3000/login", user, { withCredentials: true })
            .then((response) => {
                userObject.setEmail(response.data.email);
                setUser({ email: "", password: "" });
            })
    };

    return (
        <div>
            <div>Login Form</div>
            <form onSubmit={loginUser}>
                <label htmlFor="email">email</label>
                <input type="text" placeholder='email' value={user.email} onChange={handleOnChangeEmail} name='email' />

                <label htmlFor="password">password</label>
                <input type="text" placeholder='password' value={user.password} onChange={handleOnChangePassword} name='password' />

                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default Signup