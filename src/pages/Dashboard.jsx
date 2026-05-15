import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { calculateLevelData } from "../utils/levelUtils";

export default function Dashboard() {

  const navigate = useNavigate();
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const [levelData, setLevelData] = useState(null);
  const [officialCompletions, setOfficialCompletions] = useState(0);
  const [communityCreated, setCommunityCreated] = useState(0);

  useEffect(() => {
    async function fetchDashboardData(){
      const user = auth.currentUser;

      if(!user) return;

      try{
        //fetch user profile and progress
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
          const data = userSnap.data();
          setUsername(data.username || user.email);

          const xp = data.xp || 0;
          setTotalXP(xp);
          setLevelData(calculateLevelData(xp));

          const completedScenarios = data.completedScenarios || {};
          let completionCount = 0;

          Object.values(completedScenarios).forEach((scenarioProgress) => {
            if(scenarioProgress.easy) completionCount++;
            if(scenarioProgress.medium) completionCount++;
            if(scenarioProgress.hard) completionCount++;
          });

          setOfficialCompletions(completionCount);

        } else{
          setUsername(user.email);
          setTotalXP(0);
          setLevelData(calculateLevelData(0));
          setOfficialCompletions(0);
        }

        //count community scenarios created by the user
        const communityQuery = query(
          collection(db, "communityScenarios"),
          where("createdBy", "==", user.uid)
        );

        const communitySnap = await getDocs(communityQuery);
        setCommunityCreated(communitySnap.size);

      } catch(error){
        console.error("Error loading user profile:", error);
        setUsername(user.email);
        setTotalXP(0);
        setLevelData(calculateLevelData(0));
        setOfficialCompletions(0);
        setCommunityCreated(0);
      }
    }

    fetchDashboardData();
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
        
        {levelData && (
          <>
            <p>
              <strong>Level:</strong>{levelData.level}
            </p>

            <div style={styles.xpBar}>
              <div 
                style={{
                  ...styles.xpFill,
                  width: `${levelData.progressPercent}%`
                }}
              />
            </div>

            <p>
              {levelData.xpIntoLevel} / {levelData.xpNeeded} XP to next level
            </p>
          </>
        )}

        <p>
          <strong>Total XP:</strong> {totalXP}
        </p>

        <p>
          <strong>Official Scenario Completions:</strong> {officialCompletions}
        </p>

        <p>
          <strong>Community Scenarios Created:</strong> {communityCreated}
        </p>
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

        <button style={styles.button} onClick={() => navigate("/community/create")}>
          Create Scenario
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
  xpBar: {
    width: "100%",
    height: "18px",
    backgroundColor: "#333",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px"
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#00cc66",
    transition: "width 0.3s ease"
  }
};