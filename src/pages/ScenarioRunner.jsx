import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleScenario } from "../data/sampleScenario";
import "./ScenarioRunner.css";
import { awardScenarioCompletion } from "../services/progressService";
import { auth } from "../firebaseConfig";

export default function ScenarioRunner() {
  const { id, difficulty } = useParams();
  const scenario = sampleScenario; // only one scenario for now

  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(null); // "correct" or "wrong"
  const [wrongNpcLine, setWrongNpcLine] = useState(null);
  const [scenarioFinished, setScenarioFinished] = useState(false);

  const step = scenario.steps[stepIndex];

  function handleChoice(choice) {
    if (choice.correct) {
      setShowResult("correct");
      setWrongNpcLine(null);
      return;
    }

    // Support BOTH:
    // 1) wrongNpc: "string"
    // 2) wrongNpc: { jp, reading, roma, en }
    let wrongLine;

    if (typeof choice.wrongNpc === "object" && choice.wrongNpc !== null) {
      wrongLine = {
        jp: choice.wrongNpc.jp || "それは違います。もう一度試してください。",
        reading: choice.wrongNpc.reading || "",
        roma: choice.wrongNpc.roma || "",
        en: choice.wrongNpc.en || ""
      };
    } else {
      wrongLine = {
        jp: choice.wrongNpc || "それは違います。もう一度試してください。",
        reading: choice.wrongNpcReading || "",
        roma: choice.wrongNpcRoma || "",
        en: choice.wrongNpcEn || ""
      };
    }

    setWrongNpcLine(wrongLine);
    setShowResult("wrong");
  }

  const [xpResult, setXpResult] = useState(null);
  async function nextStep() {
    setShowResult(null);
    setWrongNpcLine(null);

    if (stepIndex + 1 < scenario.steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      const user = auth.currentUser;

      if (user) {
        try {
          const result = await awardScenarioCompletion(
            user.uid,
            id,
            difficulty
          );

          setXpResult(result);
        } catch(error) {
          console.error("XP Award Error: ", error);
        }
      }

      setScenarioFinished(true);
    }
  }

  function retryStep() {
    setShowResult(null);
    setWrongNpcLine(null);
  }

  // Render a line of dialogue according to difficulty
  function renderTextLayers({ jp, reading, roma, en }) {
    return (
      <div className="dialogueText">
        {difficulty === "easy" && en && (
          <div className="dialogue-en">{en}</div>
        )}

        {(difficulty === "easy" || difficulty === "medium") && roma && (
          <div className="dialogue-roma">{roma}</div>
        )}

        {(difficulty === "easy" || difficulty === "medium") && reading && (
          <div className="dialogue-furi">{reading}</div>
        )}

        <div className="dialogue-jp">{jp}</div>
      </div>
    );
  }

  // Finished screen
if (scenarioFinished) {
  return (
    <div className="scenarioContainer">
      <h1>Scenario Complete!</h1>

      <p>
        You successfully completed:
        <strong> {scenario.title}</strong>
      </p>

      {xpResult && (
        <div style={{ marginTop: "20px" }}>
          {xpResult.alreadyCompleted ? (
            <p>
              You have already completed this difficulty. No XP awarded.
            </p>
          ) : (
            <p>
              🎉 You earned {xpResult.xpAwarded} XP!
              <br />
              Total XP: {xpResult.totalXp}
            </p>
          )}
        </div>
      )}

      <div className="finishButtons">
        <Link to="/scenarios" className="finishButton">
          Back to Scenario List
        </Link>
        <Link to="/dashboard" className="finishButtonAlt">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

  const npcLine = wrongNpcLine || step.npc;

  return (
    <div className="scenarioContainer">
      <h2>{scenario.title}</h2>
      <h3>
        Step {stepIndex + 1} / {scenario.steps.length} —{" "}
        {difficulty.toUpperCase()}
      </h3>

      {/* NPC dialogue */}
      <div className="npcBox">{renderTextLayers(npcLine)}</div>

      {/* Player choices (hidden when result panel is visible) */}
      {showResult === null && (
        <div className="choicesContainer">
          {step.choices.map((choice, index) => (
            <button
              key={index}
              className="choiceButton"
              onClick={() => handleChoice(choice)}
            >
              {renderTextLayers(choice)}
            </button>
          ))}
        </div>
      )}

      {/* Result panels */}
      {showResult === "correct" && (
        <div className="resultBox correct">
          <p>Correct!</p>
          <button onClick={nextStep} className="nextButton">
            Continue
          </button>
        </div>
      )}

      {showResult === "wrong" && (
        <div className="resultBox wrong">
          <p>Incorrect — try again!</p>
          <button onClick={retryStep} className="retryButton">
            Retry Step
          </button>
        </div>
      )}
    </div>
  );
}