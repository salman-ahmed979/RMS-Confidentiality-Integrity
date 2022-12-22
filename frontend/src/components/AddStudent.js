import axios from "axios";
import React, { useState } from "react";
import Navbar from "./Navbar";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [gpa, setGPA] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const _gpa = parseFloat(gpa);
    if (_gpa > 4.0 || _gpa < 0.0) {
      setResult("GPA is invalid");
      return;
    }

    const response = await axios.post(
      "http://localhost:8083/record/addstudent",
      {
        studentName: name,
        department: department,
        gpa: gpa,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data.status !== "success") {
      setResult(response.data.message);
      console.log(response.data.message);
      return;
    }
    setResult(response.data.message);
    setDepartment("");
    setGPA("");
    setName("");
  };
  return (
    <>
      <Navbar />
      <div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="John"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            placeholder="SE"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
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
          <button onClick={handleSubmit}>Add Student Record</button>
        </div>
        <div>{result === "" ? null : <h4>{result}</h4>}</div>
      </div>
    </>
  );
};
export default AddStudent;
