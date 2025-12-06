import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        try{
            if (mode === "login"){
                await signInWithEmailAndPassword(auth, email, password);
            }else{
                await createUserWithEmailAndPassword(auth, email, password);
            }

            navigate("/dashboard");

            } catch (err) {
                alert(err.message);
            }
        }

        return (
            <div style={{ padding: 30 }}>
            <h1>NihonGO</h1>
            <h3>{mode === "login" ? "Login" : "Register"}</h3>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br/>

            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br/>

            <button onClick={handleSubmit}>
                {mode === "login" ? "Login" : "Register"}
            </button>

            <br /><br />

            <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
                Switch to {mode === "login" ? "Register" : "Login"}
            </button>
            </div>
        );
    }
