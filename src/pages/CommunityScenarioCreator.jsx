import React, { useState } from "react";
import {collection, addDoc, serverTimestamp, doc, getDoc} from "firebase/firestore";
import {db, auth} from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

 export default function CommunityScenarioCreator(){
    const navigate = useNavigate();
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

    function isLatinText(value){
        const latinRegex = /^[A-Za-z0-9āīūēōĀĪŪĒŌ\s.,!?'"()\-:;]+$/;
        return latinRegex.test(value.trim());
    }

    function isJapaneseText(value){
        const japaneseRegex = 
            /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9faf\u3000-\u303f0-9\s。、！？ー・（）「」『』]+$/;

            return japaneseRegex.test(value.trim());
    }

    function validateScenario(){
        if(!scenarioData.title.trim()){
            return "Scenario title is required.";
        }

        if(!scenarioData.description.trim()){
            return "Scenario description is required.";
        }

        if(scenarioData.steps.length === 0){
            return "A scenario must contain at least one step.";
        }

        for(let i = 0; i < scenarioData.steps.length; i++){
            const step = scenarioData.steps[i];

            if(!step.npc.en.trim() || !isLatinText(step.npc.en)){
                return `Step ${i + 1}: NPC English must use English/Romaji characters only.`;
            }

            if(!step.npc.roma.trim() || !isLatinText(step.npc.roma)){
                return `Step ${i + 1}: NPC Romaji must use English/Romaji characters only.`;
            }

            if(!step.npc.reading.trim() || !isJapaneseText(step.npc.reading)){
                return `Step ${i + 1}: NPC reading must use Japanese characters only.`;
            }

            if(!step.npc.jp.trim() || !isJapaneseText(step.npc.jp)){
                return `Step ${i + 1}: NPC Japanese must use Japanese characters only.`;
            }

            const choices = step.choices || [];

            if(choices.length < 2){
                return `Step ${i + 1}: Each step must have at least two choices.`;
            }

            const correctChoices = choices.filter((choice) => choice.correct);

            if(correctChoices.length !== 1){
                return `Step ${i + 1}: Each step must have exactly one correct choice.`;
            }

            for(let j = 0; j < choices.length; j++){
                const choice = choices[j];

                if(!choice.en.trim() || !isLatinText(choice.en)){
                    return `Step ${i + 1}, Choice ${j + 1}: English must use English/Romaji characters only.`;
                }

                if(!choice.roma.trim() || !isLatinText(choice.roma)){
                    return `Step ${i + 1}, Choice ${j + 1}: Romaji must use English/Romaji characters only.`;
                }

                if(!choice.reading.trim() || !isJapaneseText(choice.reading)){
                    return `Step ${i + 1}, Choice ${j + 1}: Reading must use Japanese characters only.`;
                }

                if(!choice.jp.trim() || !isJapaneseText(choice.jp)){
                    return `Step ${i + 1}, Choice ${j + 1}: Japanese must use Japanese characters only.`;
                }

                //NPC reply validation, will only validate fields if the user actually typed something into them, so blank fields are allowed and will return the default wrong reply dialogue
                if(!choice.correct && choice.wrongNpc){
                    if(choice.wrongNpc.en.trim() && !isLatinText(choice.wrongNpc.en)){
                        return `Step ${i + 1}, Choice ${j + 1}: Wrong reply English must use English/Romaji characters only.`;
                    }

                    if(choice.wrongNpc.roma.trim() && !isLatinText(choice.wrongNpc.roma)){
                        return `Step ${i + 1}, Choice ${j + 1}: Wrong reply Romaji must use English/Romaji characters only.`;
                    }

                    if(choice.wrongNpc.reading.trim() && !isJapaneseText(choice.wrongNpc.reading)){
                        return `Step ${i + 1}, Choice ${j + 1}: Wrong reply reading must use Japanese characters only.`;
                    }

                    if(choice.wrongNpc.jp.trim() && !isJapaneseText(choice.wrongNpc.jp)){
                        return `Step ${i + 1}, Choice ${j + 1}: Wrong reply Japanese must use Japanese characters only.`;
                    }
                }
            }
        }

        return null;
    }

    async function saveScenario(){
        const user = auth.currentUser;

        if (!user){
            alert("You must be logged in to create a scenario.");
            return;
        }

        const validationError = validateScenario();

        if(validationError){
            alert(validationError);
            return;
        }

        let username = "Anonymous";

        try{
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if(userSnap.exists()){
                username = userSnap.data().username || "Anonymous";
            }

            const scenarioToSave = {
                title: scenarioData.title,
                description: scenarioData.description,
                steps: scenarioData.steps,
                createdBy: user.uid,
                createdByUsername: username,
                isPublic: true,
                createdAt: serverTimestamp(),
                averageRating: 0,
                ratingCount: 0
            };

            const docRef = await addDoc(
                collection(db, "communityScenarios"),
                scenarioToSave
            );

            console.log("Scenario saved with ID: ", docRef.id);
            alert("Scenario uploaded successfully!");
            navigate("/community");
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