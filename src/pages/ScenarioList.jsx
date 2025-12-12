import React from "react";
import { Link } from "react-router-dom";
import { sampleScenario } from "../data/sampleScenario";

export default function ScenarioList() {
  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Available Scenarios</h1>

      <div
        style={{
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >
        <h2>{sampleScenario.title}</h2>
        <p>{sampleScenario.description}</p>

        <Link
          to={`/scenario/${sampleScenario.id}`}
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#4caf50",
            color: "white",
            textDecoration: "none"
          }}
        >
          Start Scenario
        </Link>
      </div>
    </div>
  );
}