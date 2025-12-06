import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    signOut(auth);
    navigate("/");
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Dashboard</h1>

      {/* USER STATS SECTION */}
      <div style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
        <h3>Your Progress</h3>
        <p>XP: 0</p>
        <p>Scenarios Completed: 0</p>
        <p>Streak: 0 days</p>
      </div>

      {/* MENU SECTION */}
      <div>
        <button onClick={() => navigate("/scenarios")}>
          View Scenarios
        </button>

        <br /><br />

        <button onClick={() => navigate("/progress")}>
          View Progress Details
        </button>

        <br /><br />

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}