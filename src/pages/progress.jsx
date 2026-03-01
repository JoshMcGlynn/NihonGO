import React, {useEffect, useState} from "react";
import {auth} from "../firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {calculateLevelData} from "../utils/levelUtils";

export default function Progress() {
  const [totalXP, setTotalXP] = useState(0);
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress(){
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if(snapshot.exists()) {
        const data = snapshot.data();
        const xp = data.xp || 0;

        setTotalXP(xp);
        setLevelData(calculateLevelData(xp));
      }

      setLoading(false);
    }

    fetchProgress();
  }, []);

  if (loading) return <div>Loading progress...</div>;
  if (!levelData) return <div>No progress data found</div>;
  
  return (
    <div style = {styles.container}>
      <h1>Your Progress</h1>

      <div style={styles.card}>
        <h2>Level {levelData.level}</h2>

        <div style = {styles.xpBar}>
          <div style={{
            ...styles.xpFill,
            width: `${levelData.progressPercent}%`
          }}
        />
        </div>
        <p>{levelData.xpIntoLevel} / {levelData.xpNeeded} XP</p>
      </div>

      <div style={styles.card}>
        <h3>Total XP</h3>
        <p>{totalXP}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "600px",
    margin: "auto",
    color: "white"
  },
  card: {
    background: "#222",
    padding: "20px",
    marginBottom: "30px",
    borderRadius: "10px"
  },
  xpBar: {
    width: "100%",
    height: "20px",
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