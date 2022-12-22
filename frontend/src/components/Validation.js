import React from "react";
import { Link } from "react-router-dom";

const Validation = ()=>{

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Login</Link></li>
                        <li><Link to="/signup">SignUp</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    );
}
export default Validation;