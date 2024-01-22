import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import userContex from "./components/UserContex";
import axios from "axios";
import { useState } from "react";
import Logout from "./components/Logout";


function App() {

  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/user", { withCredentials: true })
      .then((response) => {
        setEmail(response.data.email);
      })
  }, [])

  return (
    <>
      <userContex.Provider value={{ email, setEmail }}>
        <BrowserRouter>
          <div>
            {!!email && <div>Logged in as {email}</div>}
            {!email && <div>Not Logged in </div>}
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Routes>
        </BrowserRouter>
        <Logout></Logout>
      </userContex.Provider>
    </>
  );
}

export default App;
