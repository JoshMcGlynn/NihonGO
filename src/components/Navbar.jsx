import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {auth, db} from "../firebaseConfig";
import {signOut} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import logo from "../assets/NihonGOLogo.png";

import "./Navbar.css";

export default function Navbar(){
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    useEffect(() => {
        async function fetchUsername(){
            const user = auth.currentUser;

            if(!user) return;

            try{
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()){
                    setUsername(userSnap.data().username || user.email);
                }else{
                    setUsername(user.email);
                }
            }   catch(error){
                console.error("Navbar username error:", error);
            }
        }

        fetchUsername();
    }, []);

    async function handleLogout(){
        try{
            await signOut(auth);
            navigate("/");
        }   catch(error){
            console.error("Logout error:", error);
        }
    }

    return(
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/dashboard" className="nav-logo">
                    <img src={logo} alt="NihonGO logo" className="nav-logo-img" />
                </Link>

                <Link to="/scenarios" className="nav-link">
                Scenarios 
                </Link>

                <Link to="/community" className="nav-link">
                Community 
                </Link>
                
                <Link to="/community/create" className="nav-link">
                Create 
                </Link>

                <Link to={`/profile/${auth.currentUser?.uid}`} className="nav-link">
                Profile 
                </Link>
            </div>

            <div className="navbar-right">
                <span className="nav-username">
                    {username}
                </span>

                <button className="logout-nav-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}