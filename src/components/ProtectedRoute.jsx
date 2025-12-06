import React, {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {auth} from "../firebaseConfig";
import {onAuthStateChanged} from "firebase/auth";

export default function ProtectedRoute({ children }){
    const [user, setUser] = React.useState(undefined);

    React.useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    if (user === undefined) return <p>Loading...</p>;

    return user ? children : <Navigate to="/" />;
}