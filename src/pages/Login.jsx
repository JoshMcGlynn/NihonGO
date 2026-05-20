import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function validateUsername(usernameInput){
        const cleanedUsername = usernameInput.trim();

        if(cleanedUsername.length < 3){
            return "Username must be between 3-20 characters."
        }

        if(cleanedUsername.length > 20){
            return "Username must be between 3-20 characters."
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if(!usernameRegex.test(cleanedUsername)){
            return "Username can only contain letters, numbers and underscores.";
        }

        return null;
    }

    async function handleSubmit() {
        try{
            if (mode === "login"){
                await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
            return;
            }

            //Register mode
            const usernameError = validateUsername(username);

            if(usernameError){
                alert(usernameError);
                return;
            }

            const cleanUsername = username.trim();
            const usernameLower = cleanUsername.toLowerCase();

            //create firebase auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            try{
                //reserve username and create user profile
                await runTransaction(db, async (transaction) => {
                    const usernameRef = doc(db, "usernames", usernameLower);
                    const userRef = doc(db, "users", user.uid);

                    const usernameDoc = await transaction.get(usernameRef);

                    if(usernameDoc.exists()){
                        throw new Error("Username is already taken.");
                    }

                    transaction.set(usernameRef, {
                        uid: user.uid,
                        username: cleanUsername,
                        createdAt: serverTimestamp()
                    });

                    transaction.set(userRef, {
                        username: cleanUsername,
                        usernameLower: usernameLower,
                        email: user.email,
                        xp: 0,
                        completedScenarios: {},
                        createdAt: serverTimestamp()
                    });
                });

                navigate("/dashboard");
            }   catch (profileError){
                //if username reservation fails, remove the newly created account
                await deleteUser(user);
                alert(profileError.message);
            }
        }   catch (err){
            alert(err.message);
        }
    }
        return (
            <div style={{ padding: 30 }}>
            <h1>NihonGO</h1>
            <h3>{mode === "login" ? "Login" : "Register"}</h3>
            {mode === "register" && (
                <>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    /><br/>
                </>
            )}

            <input 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            
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
