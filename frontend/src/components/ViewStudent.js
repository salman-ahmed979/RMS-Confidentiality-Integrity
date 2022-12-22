import axios from "axios";
import React, { useState } from "react";
import Navbar from "./Navbar";

const ViewStudent = () => {
  const [showTable, setTable] = useState(false);
  const [data, setData] = useState([]);
  const [result, setResult] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTable(false);
    axios.defaults.withCredentials = true;
    const response = await axios.get(
      "http://localhost:8083/record/viewstudents"
    );
    if (response.data.status === "failed") {
      setResult(response.data.message);
      return;
    }
    setData(response.data.message);
    setTable(true);
  };

  const tableData = data.map((items, i) => {
    return (
      <tr key={i}>
        <td>{items.sid}</td>
        <td>{items.sname}</td>
        <td>{items.department}</td>
        <td>{items.gpa}</td>
      </tr>
    );
  });
  return (
    <>
      <Navbar />
      <div>
        <h1>View Student Records</h1>
        <div>
          <h4>Click to Display Record</h4>
          <button onClick={handleSubmit}>View Records</button>
        </div>
        <div>
          {showTable ? (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>StuID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>GPA</th>
                  </tr>
                </thead>
                <tbody>{tableData}</tbody>
              </table>
            </div>
          ) : (
            result
          )}
        </div>
      </div>
    </>
  );
};
export default ViewStudent;
