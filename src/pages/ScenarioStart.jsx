import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const SCENARIOS = [
  {
    id: "restaurant_basic",
    title: "Ordering Food at a Restaurant",
    description: "Learn how to order food politely and interact with staff.",
  },
  {
    id: "train_directions",
    title: "Asking for Train Directions",
    description: "Practice asking for help navigating Japanese train systems.",
  },
  {
    id: "cityhall_procedure",
    title: "City Hall Procedures",
    description: "A more formal scenario involving residency paperwork.",
  },
];

export default function ScenarioStart() {
  const { id } = useParams();
  const navigate = useNavigate();

  const scenario = SCENARIOS.find((s) => s.id === id);

  if (!scenario) {
    return <div style={{ padding: 30 }}>Scenario not found.</div>;
  }

  function startScenario(difficulty) {
    navigate(`/scenario/${id}/run?difficulty=${difficulty}`);
  }

  return (
    <div style={styles.container}>
      <h1>{scenario.title}</h1>
      <p>{scenario.description}</p>

      <h2>Select Difficulty</h2>

      <div style={styles.cardContainer}>
        {/* EASY */}
        <div style={styles.card} onClick={() => startScenario("easy")}>
          <h3>Easy</h3>
          <p>• Kanji + Kana • Romaji  • Translations</p>
        </div>

        {/* MEDIUM */}
        <div style={styles.card} onClick={() => startScenario("medium")}>
          <h3>Medium</h3>
          <p>• Kana + Kanji  • Romaji  • No Translations</p>
        </div>

        {/* HARD */}
        <div style={styles.card} onClick={() => startScenario("hard")}>
          <h3>Hard</h3>
          <p>• Kanji and Kana only  • No Romaji  • No Translations</p>
        </div>
      </div>

      <button style={styles.backButton} onClick={() => navigate("/scenarios")}>
        Back to Scenarios
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    color: "white",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 20,
  },
  card: {
    background: "#222",
    padding: 20,
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid #444",
  },
  backButton: {
    marginTop: 30,
    padding: "10px 20px",
    background: "#444",
    color: "white",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};