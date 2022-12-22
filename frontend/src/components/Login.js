import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./Validation";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName === "" || password === "") {
      setResult("Fields are Empty");
      return;
    }
    axios.defaults.withCredentials = true;
    let response = await axios.post(
      "http://localhost:8083/user/login",
      {
        userName: userName,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    setResult("Login Successfull... Redirecting to home Page");
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  return (
    <>
      <Validation />
      <div>
        <h1>Login</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="username..."
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="****"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <button onClick={handleSubmit}>Login</button>
        </div>
        <div>{result === "" ? null : <h4>{result}</h4>}</div>
      </div>
    </>
  );
};

export default Login;
