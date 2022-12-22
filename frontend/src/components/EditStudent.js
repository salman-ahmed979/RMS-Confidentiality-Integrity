import axios from "axios";
import React, { useState } from "react";
import Navbar from "./Navbar";

const EditStudent = () => {
  const [sid, setSID] = useState("");
  const [gpa, setGPA] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _gpa = parseFloat(gpa);
    if (sid === "" || gpa === "" || key === "") {
      setResult("Fields are Empty");
      return;
    }
    if (_gpa > 4.0 || _gpa < 0.0) {
      setResult("GPA is invalid");
      return;
    }
    axios.defaults.withCredentials = true;
    let response = await axios.get("http://localhost:8083/record/getusername");
    if (response.data.status === "failed") {
      setResult(response.data.message);
      return;
    }

    const userName = response.data.message;
    response = await axios.post(
      "http://localhost:7000/generate_digitalsignature",
      {
        userName: userName,
        key: key,
        sid: sid,
        gpa: gpa,
      }
    );
    if (response.data.status !== "success") {
      setResult(response.data.message);
      return;
    }
    let responseCA = await axios.get(
      "http://localhost:4000/get_CA_Certificate"
    );
    if (responseCA.data.status !== "success") {
      setResult(responseCA.data.message);
      return;
    }

    const finalResponse = await axios.put(
      "http://localhost:8083/record/editrecord",
      {
        signature: response.data.signature,
        certificate: response.data.certificate,
        ca_certificate: responseCA.data.ca_certificate,
        studentData: response.data.studentData,
      }
    );
    if (finalResponse.data.status !== "success") {
      setResult(finalResponse.data.message);
      return;
    }
    setResult(finalResponse.data.message);
    setGPA("");
    setSID("");
    setKey("");
  };
  return (
    <>
      <Navbar />
      <div>
        <h1>Edit Student Record</h1>

        <div>
          <div>
            <label>SID:</label>
            <input
              type="text"
              placeholder="sid..."
              value={sid}
              onChange={(event) => setSID(event.target.value)}
            />
          </div>
          <div>
            <label>GPA:</label>
            <input
              type="text"
              placeholder="4.0"
              value={gpa}
              onChange={(event) => setGPA(event.target.value)}
            />
          </div>
          <div>
            <label>Key:</label>
            <input
              type="password"
              placeholder="*****"
              value={key}
              onChange={(event) => setKey(event.target.value)}
            />
          </div>
          <div>
            <button onClick={handleSubmit}>Update Record</button>
          </div>
        </div>
        <div>{result === "" ? null : <h4>{result}</h4>}</div>
      </div>
    </>
  );
};
export default EditStudent;
