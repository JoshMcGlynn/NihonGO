import React, { useState } from "react";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import {db, auth} from "../firebaseConfig";

 export default function CommunityScenarioCreator(){
    const [scenarioData, setScenarioData] = useState({
        title: "",
        description: "",
        steps: [
            {
                npc: { en: "", roma: "", reading: "", jp: ""},
                choices: [
                    { en: "", roma: "", reading: "", jp: "", correct: true, wrongNpc: {en: "", roma: "", reading: "", jp: "" } },
                    { en: "", roma: "", reading: "", jp: "", correct: false, wrongNpc: {en: "", roma: "", reading: "", jp:  ""} }
                ]
            }
        ]
    });

    //Helper functions: 
    function addStep(){
        setScenarioData(prev => ({
            ...prev, 
            steps: [
                ...prev.steps,
                {
                    npc: { en: "", roma: "", reading: "", jp: ""},
                    choices: [
                        { en: "", roma: "", reading: "", jp: "", correct: true, wrongNpc: {en: "", roma: "", reading: "", jp: ""} },
                        { en: "", roma: "", reading: "", jp: "", correct: false, wrongNpc: {en: "", roma: "", reading: "", jp: ""} }
                    ]
                }
            ]
        }));
    }

    function removeStep(stepIndex){
        setScenarioData((prev) => ({
            ...prev,
            steps: prev.steps.filter((_, index) => index !== stepIndex)
        }));
    }

    function addChoice(stepIndex){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];

            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                choices: [
                    ...updatedSteps[stepIndex].choices,
                    {
                        en: "",
                        roma: "",
                        reading: "",
                        jp: "",
                        correct: false,
                        wrongNpc: { en: "", roma: "", reading: "", jp: ""}
                    }
                ]
            };
            return{
                ...prev,
                steps: updatedSteps
            };
        });
    }

    function removeChoice(stepIndex, choiceIndex){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];
            const filteredChoices = updatedSteps[stepIndex].choices.filter(
                (_, index) => index !== choiceIndex
            );

            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                choices: filteredChoices.length >= 2 ? filteredChoices : updatedSteps[stepIndex].choices
            };
            return{
                ...prev, 
                steps: updatedSteps
            };
        });
    }


    function setCorrectChoice(stepIndex, choiceIndex){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];

            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                choices: updatedSteps[stepIndex].choices.map((choice, index) => ({
                    ...choice,
                    correct: index === choiceIndex
                }))
            };
            return{
                ...prev,
                steps: updatedSteps
            };
        });
    }

    function handleScenarioFieldChange(field,value){
        setScenarioData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function handleNpcFieldChange(stepIndex, field, value){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];
            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                npc: {
                    ...updatedSteps[stepIndex].npc,
                    [field]: value
                }
            };

            return {
                ...prev,
                steps: updatedSteps
            };
        });
    }

    function handleChoiceFieldChange(stepIndex, choiceIndex, field, value){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];
            const updatedChoices = [...updatedSteps[stepIndex].choices];

            updatedChoices[choiceIndex] = {
                ...updatedChoices[choiceIndex],
                [field]: value
            };

            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                choices: updatedChoices
            };

            return {
                ...prev,
                steps: updatedSteps
            };
        });
    }

    function handleWrongNpcFieldChange(stepIndex, choiceIndex, field, value){
        setScenarioData((prev) => {
            const updatedSteps = [...prev.steps];
            const updatedChoices = [...updatedSteps[stepIndex].choices];

            updatedChoices[choiceIndex] = {
                ...updatedChoices[choiceIndex],
                wrongNpc: {
                    ...updatedChoices[choiceIndex].wrongNpc,
                    [field]: value
                }
            };

            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                choices: updatedChoices
            };

            return {
                ...prev,
                steps: updatedSteps
            };
        });
    }

    async function saveScenario(){
        const user = auth.currentUser;

        if (!user){
            alert("You must be logged in to create a scenario.");
            return;
        }

        try{
            const scenarioToSave = {
                title: scenarioData.title,
                description: scenarioData.description,
                steps: scenarioData.steps,
                createdBy: user.uid,
                createdByEmail: user.email,
                isPublic: true,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(
                collection(db, "communityScenarios"),
                scenarioToSave
            );

            console.log("Scenario saved with ID: ", docRef.id);
            alert("Scenario uploaded successfully!");
        }   catch (error){
            console.error("Error saving scenario:", error);
            alert("Something went wrong while saving the scenario, please try again.");
        }
    }

    //Return JSX last
    return (
        <div style={styles.container}>
        <h1>Create Community Scenario</h1>

        <div style={styles.card}>
            <h2>Scenario Details</h2>

            <input
            type="text"
            placeholder="Scenario title"
            value={scenarioData.title}
            onChange={(e) => handleScenarioFieldChange("title", e.target.value)}
            style={styles.input}
            />

            <textarea
            placeholder="Scenario description"
            value={scenarioData.description}
            onChange={(e) => handleScenarioFieldChange("description", e.target.value)}
            style={styles.textarea}
            />
        </div>

        {scenarioData.steps.map((step, stepIndex) => (
            <div key={stepIndex} style={styles.card}>
            <h2>Step {stepIndex + 1}</h2>

            <h3>NPC Dialogue</h3>

            <input
                type="text"
                placeholder="NPC English"
                value={step.npc.en}
                onChange={(e) => handleNpcFieldChange(stepIndex, "en", e.target.value)}
                style={styles.input}
            />

            <input
                type="text"
                placeholder="NPC Romaji"
                value={step.npc.roma}
                onChange={(e) => handleNpcFieldChange(stepIndex, "roma", e.target.value)}
                style={styles.input}
            />

            <input
                type="text"
                placeholder="NPC Reading"
                value={step.npc.reading}
                onChange={(e) => handleNpcFieldChange(stepIndex, "reading", e.target.value)}
                style={styles.input}
            />

            <input
                type="text"
                placeholder="NPC Japanese"
                value={step.npc.jp}
                onChange={(e) => handleNpcFieldChange(stepIndex, "jp", e.target.value)}
                style={styles.input}
            />

            <h3>Choices</h3>

            {step.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} style={styles.choiceBox}>
                <p><strong>Choice {choiceIndex + 1}</strong></p>

                <input
                    type="text"
                    placeholder="Choice English"
                    value={choice.en}
                    onChange={(e) =>
                    handleChoiceFieldChange(stepIndex, choiceIndex, "en", e.target.value)
                    }
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Choice Romaji"
                    value={choice.roma}
                    onChange={(e) =>
                    handleChoiceFieldChange(stepIndex, choiceIndex, "roma", e.target.value)
                    }
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Choice Reading"
                    value={choice.reading}
                    onChange={(e) =>
                    handleChoiceFieldChange(stepIndex, choiceIndex, "reading", e.target.value)
                    }
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Choice Japanese"
                    value={choice.jp}
                    onChange={(e) =>
                    handleChoiceFieldChange(stepIndex, choiceIndex, "jp", e.target.value)
                    }
                    style={styles.input}
                />

                <label>
                    <input
                    type="radio"
                    name={`correct-choice-${stepIndex}`}
                    checked={choice.correct}
                    onChange={() => setCorrectChoice(stepIndex, choiceIndex)}
                    />
                    Mark as correct
                </label>

                {!choice.correct && (
                    <>
                    <h4>Wrong NPC Reply</h4>

                    <input
                        type="text"
                        placeholder="Wrong reply English"
                        value={choice.wrongNpc.en}
                        onChange={(e) =>
                        handleWrongNpcFieldChange(stepIndex, choiceIndex, "en", e.target.value)
                        }
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Wrong reply Romaji"
                        value={choice.wrongNpc.roma}
                        onChange={(e) =>
                        handleWrongNpcFieldChange(stepIndex, choiceIndex, "roma", e.target.value)
                        }
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Wrong reply Reading"
                        value={choice.wrongNpc.reading}
                        onChange={(e) =>
                        handleWrongNpcFieldChange(stepIndex, choiceIndex, "reading", e.target.value)
                        }
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Wrong reply Japanese"
                        value={choice.wrongNpc.jp}
                        onChange={(e) =>
                        handleWrongNpcFieldChange(stepIndex, choiceIndex, "jp", e.target.value)
                        }
                        style={styles.input}
                    />
                    </>
                )}

                <button onClick={() => removeChoice(stepIndex, choiceIndex)}>
                    Remove Choice
                </button>
                </div>
            ))}

            <div style={styles.buttonRow}>
                <button onClick={() => addChoice(stepIndex)}>Add Choice</button>
                <button onClick={() => removeStep(stepIndex)}>Remove Step</button>
            </div>
            </div>
        ))}

        <div style={styles.buttonRow}>
            <button onClick={addStep}>Add Step</button>
            <button onClick={saveScenario}>Save and Upload Scenario</button>
        </div>
        </div>
    );
 }

 const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "auto",
    color: "white"
  },
  card: {
    background: "#222",
    padding: "20px",
    marginBottom: "30px",
    borderRadius: "10px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#333",
    color: "white"
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#333",
    color: "white"
  },
  choiceBox: {
    background: "#2d2d2d",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px"
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  }
};