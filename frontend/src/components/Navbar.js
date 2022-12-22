import React from "react";
import { Link } from "react-router-dom";

const Navbar = ()=>{

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/addstudent">Add Student</Link></li>
                        <li><Link to="/viewstudents">View Students</Link></li>
                        <li><Link to="/editstudent">Edit Student</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    );
}
export default Navbar;