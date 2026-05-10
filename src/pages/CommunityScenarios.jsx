import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {Link} from "react-router-dom";

export default function CommunityScenarios(){
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchCommunityScenarios(){
            try{
                const snapshot = await getDocs(collection(db, "communityScenarios"));
                console.log("Community scenario docs found:", snapshot.docs.length);

                const loadedScenarios = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                +-
                setScenarios(loadedScenarios);
            }   catch (error) {
                console.error("Error loading community scenarios:", error);
            }   finally {
                setLoading(false);
            }
        }

        fetchCommunityScenarios();
    }, []);

    if (loading) {
        return(
            <div style={styles.container}>
                <h1>Community Scenarios</h1>
                <p>Loading scenarios...</p>
            </div>
        );
    }

    const filteredScenarios = scenarios.filter((scenario) => {
        const search = searchTerm.toLowerCase();

        const title = scenario.title?.toLowerCase() || "";
        const description = scenario.description?.toLowerCase() || "";
        const creator = scenario.createdByUsername?.toLowerCase() || "";

        return (
            title.includes(search) ||
            description.includes(search) ||
            creator.includes(search)
        );
    });

    return (
        <div style={styles.container}>
            <h1>Community Scenarios</h1>

            <Link to="/community/create" style={styles.createButton}>
            Create new scenario
            </Link>

            <input type="text" placeholder="Search by title, description or creator..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />

            {scenarios.length === 0 ? (
                <p>No community scenarios uploaded yet.</p>
            ) : filteredScenarios.length === 0 ? (
                <p> No scenarios match your search.</p>
            ) : (
                <div style={styles.grid}>
                    {filteredScenarios.map((scenario) => (
                        <div key={scenario.id} style={styles.card}>
                            <h2>{scenario.title}</h2>
                            <p>{scenario.description}</p>

                            <p style={styles.ratingText}>
                                ⭐ {scenario.averageRating ? scenario.averageRating.toFixed(1) : "0.0"}
                                {" "}({scenario.ratingCount || 0} ratings)
                            </p>

                            <p style={styles.meta}>
                                Created by: {" "}
                                <Link to={`/profile/${scenario.createdBy}`} style={styles.creatorLink}>
                                    {scenario.createdByUsername || "Unknown user"}
                                </Link>
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
    createButton: {
        display: "inline-block",
        marginBottom: "30px",
        padding: "12px 18px",
        background: "#4caf50",
        color: "white",
        TextDecoration: "none",
        borderRadius: "8px"
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
    meta: {
        fontSize: "14px",
        color: "#aaa"
    },
    button: {
        marginTop: "15px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "none",
        background: "#444",
        color: "white",
        cursor: "pointer"
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
    searchInput:{
        width: "100%",
        padding: "12px",
        marginBottom: "30px",
        borderRadius: "8px",
        border: "1px solid #555",
        background: "#333",
        color: "white",
        fontSize: "16px"
    },
    creatorLink: {
        color: "#4caf50",
        textDecoration: "none",
        fontWeight: "bold"
    },
    ratingText: {
        color: "#ffcc00",
        fontWeight: "bold"
    }
};