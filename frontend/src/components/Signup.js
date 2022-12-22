import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./Validation";
const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userName === "" || email === "" || password === "") {
      setResult("Fields Empty");
      return;
    }
    let response = await axios.post("http://localhost:8083/user/signup", {
      userName: userName,
      password: password,
      email: email,
    });
    if (response.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    response = await axios.post("http://localhost:7000/generateKeyPair", {
      userName: userName,
      email: email,
    });
    if (response.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    response = await axios.post("http://localhost:7000/generatecsr", {
      userName: userName,
    });
    if (response.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    let csr = response.data.csr;
    let response_cert = await axios.post(
      "http://localhost:4000/generateDigitalCertificate",
      {
        userName: userName,
        csr: csr,
      }
    );
    if (response_cert.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    let finalResponse = await axios.post(
      "http://localhost:7000/saveCertificate",
      {
        userName: userName,
        certificate: response_cert.data.certificate,
      }
    );
    if (response_cert.data.status !== "success") {
      setResult(finalResponse.data.message);
      return;
    }
    setResult("Registered Successfully... Redirecting to Login");

    setTimeout(() => {
      navigate("/");
    }, 3000);
  };
  return (
    <>
      <Validation />
      <div>
        <h1>Signup</h1>
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
          <label>Email:</label>
          <input
            type="email"
            placeholder="john@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
          <button onClick={handleSubmit}>SignUp</button>
        </div>
        <div>{result === "" ? null : <h4>{result}</h4>}</div>
      </div>
    </>
  );
};

export default Signup;
