import React from "react";
import { useParams, Link } from "react-router-dom";
import { sampleScenario } from "../data/sampleScenario";

export default function ScenarioStart() {
  const { id } = useParams();
  const scenario = sampleScenario; // only one scenario for now

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>{scenario.title}</h1>
      <p>{scenario.description}</p>

      <h2 style={{ marginTop: "30px" }}>Select Difficulty</h2>

      <div className="difficultyBox">
        <Link to={`/scenario/${id}/easy`}>Easy</Link>
        <p>• English • Romaji • Hiragana/Katakana • Kanji/Kana</p>
      </div>

      <div className="difficultyBox">
        <Link to={`/scenario/${id}/medium`}>Medium</Link>
        <p>• Romaji • Hiragana/Katakana • Kanji/Kana</p>
      </div>

      <div className="difficultyBox">
        <Link to={`/scenario/${id}/hard`}>Hard</Link>
        <p>• Kanji/Kana only</p>
      </div>

      <Link
        to="/scenarios"
        style={{ display: "inline-block", marginTop: 30, color: "#4caf50" }}
      >
        ← Back to Scenario List
      </Link>
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