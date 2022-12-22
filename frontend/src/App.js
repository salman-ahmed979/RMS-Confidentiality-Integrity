import { Routes, Route } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ViewStudent from "./components/ViewStudent";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addstudent" element={<AddStudent />} />
        <Route path="/editstudent" element={<EditStudent />} />
        <Route path="/viewstudents" element={<ViewStudent />} />
      </Routes>
    </div>
  );
}

export default App;
