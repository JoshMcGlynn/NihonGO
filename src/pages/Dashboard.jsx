import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  function handleLogout() {
    signOut(auth);
    navigate("/");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NihonGO Dashboard</h1>
      <h3 style={styles.subtitle}>Welcome, {user?.email}</h3>

      {/* SECTION: PROGRESS SUMMARY */}
      <div style={styles.card}>
        <h2>Progress Summary</h2>
        <p>Scenarios Completed: 0</p>
        <p>Vocabulary Learned: 0</p>
      </div>

      {/* SECTION: NAVIGATION BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/scenarios")}>
          Start Scenarios
        </button>

        <button style={styles.button} onClick={() => alert("Coming soon!")}>
          Vocabulary
        </button>

        <button style={styles.button} onClick={() => alert("Coming soon!")}>
          Progress Tracking
        </button>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "600px",
    margin: "auto",
    color: "white",
  },
  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  subtitle: {
    marginBottom: "30px",
  },
  card: {
    background: "#222",
    padding: "20px",
    marginBottom: "30px",
    borderRadius: "10px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    padding: "15px",
    fontSize: "16px",
    background: "#444",
    border: "1px solid #999",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  },
  logoutButton: {
    marginTop: "40px",
    padding: "10px 20px",
    background: "#880000",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};