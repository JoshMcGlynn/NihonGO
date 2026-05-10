import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {doc, getDoc, collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {calculateLevelData} from "../utils/levelUtils";

export default function Profile(){
    const {userId} = useParams();

    const [profile, setProfile] = useState(null);
    const [createdScenarios, setCreatedScenarios] = useState([]);
    const [levelData, setLevelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfileData(){
            try{
                //fetch user profile
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if(!userSnap.exists()){
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data();
                setProfile(userData);

                const xp = userData.xp || 0;
                setLevelData(calculateLevelData(xp));

                //fetch scenarios created by this user
                const scenariosQuery = query(
                    collection(db, "communityScenarios"),
                    where("createdBy", "==", userId)
                );

                const scenarioSnapshot = await getDocs(scenariosQuery);

                const scenarios = scenarioSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setCreatedScenarios(scenarios);
            }   catch(error){
                console.error("Error loading profile:", error);
            }   finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [userId]);

    if(loading){
        return (
            <div style={styles.container}>
                <h1>Loading profile...</h1>
            </div>
        );
    }

    if(!profile){
        return (
            <div style={styles.container}>
                <h1>Profile not found</h1>
                <Link to="/community" style={styles.backButton}>
                ← Back to Community Scenarios 
                </Link>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Link to="/community" style={styles.backButton}>
            ← Back to Community Scenarios 
            </Link>

            <div style={styles.profileCard}>
                <h1>{profile.username || "Unknown User"}</h1>

                {levelData && (
                    <>
                        <h2>Level {levelData.level}</h2>

                        <div style={styles.xpBar}>
                            <div style={{
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

                <p>Total XP: {profile.xp || 0}</p>
            </div>

            <h2>Scenarios Created</h2>

            {createdScenarios.length === 0 ? (
                <p>This user has not created any scenarios yet.</p>
            ) : (
                <div style={styles.grid}>
                    {createdScenarios.map((scenario) => (
                        <div key={scenario.id} style={styles.card}>
                            <h3>{scenario.title}</h3>
                            <p>{scenario.description}</p>

                            <p style={styles.ratingText}>
                                ⭐ {scenario.averageRating ? scenario.averageRating.toFixed(1) : "0.0"}{" "}
                                ({scenario.ratingCount || 0} ratings)
                            </p>

                            <Link to={`/community/${scenario.id}`} style={styles.playLink}>
                            Play Scenario 
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
        color: "white"
    },
    backButton: {
        display: "inline-block",
        marginBottom: "20px",
        color: "#4caf50",
        textDecortation: "none"
    },
    profileCard: {
        background: "#222",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "30px"
    },
    xpBar: {
        width: "100%",
        height: "20px",
        backgroundColor: "#333",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "10px",
        marginBottom: "10px"
    },
    xpFill: {
        height: "100%",
        backgroundColor: "#00cc66",
        transition: "width 0.3s ease"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px"
    },
    card: {
        background: "#222",
        padding: "20px",
        borderRadius: "10px"
    },
    playLink: {
        display: "inline-block",
        marginTop: "15px",
        padding: "10px 15px",
        borderRadius: "8px",
        background: "#444",
        color: "white",
        textDecoration: "none"
    },
    ratingText: {
        color: "#ffcc00",
        fontWeight: "bold"
    }
};