import React from "react";
import { useNavigate } from "react-router-dom";

// Temporary static scenarios (will move to Firestore later)
const SCENARIOS = [
  {
    id: "restaurant_basic",
    title: "Ordering Food at a Restaurant",
    description: "Learn how to order food politely and interact with staff.",
    difficulty: 1, // beginner
    tags: ["polite", "daily"],
  },
  {
    id: "train_directions",
    title: "Asking for Train Directions",
    description: "Practice asking for help navigating train lines.",
    difficulty: 2, // intermediate
    tags: ["polite", "travel"],
  },
  {
    id: "cityhall_procedure",
    title: "City Hall Procedures",
    description: "A more formal scenario involving residency paperwork.",
    difficulty: 3, // advanced
    tags: ["keigo", "formal"],
  },
];

export default function ScenarioList() {
  const navigate = useNavigate();

  function handleSelectScenario(id) {
    navigate(`/scenario/${id}`);
  }

  function renderDifficultyStars(level) {
    return "⭐".repeat(level) + "☆".repeat(3 - level);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Available Scenarios</h1>
      <p>Select a scenario to begin practicing Japanese in real-life contexts.</p>

      <div style={{ marginTop: 20 }}>
        {SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            style={{
              padding: 20,
              marginBottom: 15,
              background: "#222",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => handleSelectScenario(sc.id)}
          >
            <h2>{sc.title}</h2>
            <p>{sc.description}</p>
            <p>
              Difficulty: <strong>{renderDifficultyStars(sc.difficulty)}</strong>
            </p>
            <p>
              {sc.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    marginRight: 8,
                    padding: "4px 8px",
                    background: "#444",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  {tag}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}