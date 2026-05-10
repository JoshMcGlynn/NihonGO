import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { awardScenarioCompletion } from "../services/progressService";

export default function Dashboard() {

  const navigate = useNavigate();
  const user = auth.currentUser;
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUserProfile(){
      const user = auth.currentUser;

      if(!user) return;

      try{
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
          const data = userSnap.data();
          setUsername(data.username || user.email);
        } else{
          setUsername(user.email);
        }
      } catch(error){
        console.error("Error loading user profile:", error);
        setUsername(user.email);
      }
    }

    fetchUserProfile();
  }, []);

/*  async function testXP() {
    if (!user) {
      console.log("No user logged in");
      return;
    }

    try {
      const result = await awardScenarioCompletion(
        user.uid,
        "test_scenario",
        "easy"
      );

      console.log(result);
    } catch (error) {
      console.error("XP Error:", error);
    }
  } */

  function handleLogout() {
    signOut(auth);
    navigate("/");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NihonGO Dashboard</h1>
      <h3 style={styles.subtitle}>Welcome, {username || user?.email}</h3>

      <div style={styles.card}>
        <h2>Progress Summary</h2>
        <p>Scenarios Completed: 0</p>
        <p>Vocabulary Learned: 0</p>
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/scenarios")}>
          Start Scenarios
        </button>

        <button style={styles.button} onClick={() => alert("Coming soon!")}>
          Vocabulary
        </button>

        <button style={styles.button} onClick={() => navigate("/progress")}>
          Progress Tracking
        </button>

        <button style={styles.button} onClick={() => navigate("/community")}>
          Community Scenarios
        </button>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>

      <button style={styles.button} onClick={() => navigate("/community/create")}>
        Create Scenario
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