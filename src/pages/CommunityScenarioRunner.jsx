import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db, auth} from "../firebaseConfig";
import "./ScenarioRunner.css";
import { submitScenarioRating } from "../services/ratingService";

export default function CommunityScenarioRunner(){
    const{id} = useParams();

    const[scenario, setScenario] = useState(null);
    const[loading, setLoading] = useState(true);
    const[stepIndex, setStepIndex] = useState(0);
    const[showResult, setShowResult] = useState(null);
    const[wrongNpcLine, setWrongNpcLine] = useState(null);
    const[scenarioFinished, setScenarioFinished] = useState(false);
    const[selectedRating, setSelectedRating] = useState(0);
    const[ratingMessage, setRatingMessage] = useState("");
    const[hoverRating, setHoverRating] = useState("");

    useEffect(() => {
        async function fetchScenario(){
            try{
                const scenarioRef = doc(db, "communityScenarios", id);
                const snapshot = await getDoc(scenarioRef);

                if(snapshot.exists()){
                    setScenario({
                        id: snapshot.id,
                        ...snapshot.data()
                    });
                }   else {
                    console.log("Scenario not found");
                }
            }   catch (error) {
                console.error("Error loading community scenarios:", error);
            }   finally {
                setLoading(false);
            }
        }

        fetchScenario();
    }, [id]);

    if (loading){
        return(
            <div className="scenarioContainer">
                <h1>Loading scenario...</h1>
            </div>
        );
    }

    if(!scenario){
        return(
            <div className="scenarioContainer">
                <h1>Scenario not found</h1>
                <Link to="/community" classname="finishButton">
                Back to Community Scenarios
                </Link>
            </div>
        );
    }

    const step = scenario.steps[stepIndex];

    function handleChoice(choice){
        if(choice.correct){
            setShowResult("correct");
            setWrongNpcLine(null);
            return;
        }

        let wrongLine;

        if(typeof choice.wrongNpc === "object" && choice.wrongNpc !== null){
            wrongLine = {
                jp: choice.wrongNpc.jp || "それは違います。もう一度試してください。",
                reading: choice.wrongNpc.reading || "",
                roma: choice.wrongNpc.roma || "",
                en: choice.wrongNpc.en || ""
             };
        }   else {
            wrongLine = {
                jp: choice.wrongNpc || "それは違います。もう一度試してください。",
                reading: "",
                roma: "",
                en: ""
            };
        }

        setWrongNpcLine(wrongLine);
        setShowResult("wrong");
    }

    function nextStep(){
        setShowResult(null);
        setWrongNpcLine(null);

        if(stepIndex + 1 < scenario.steps.length){
            setStepIndex(stepIndex + 1);
        } else {
            setScenarioFinished(true);
        }
    }

    function retryStep(){
        setShowResult(null);
        setWrongNpcLine(null);
    }

    function renderTextLayers({jp, reading, roma, en}){
        return(
            <div className="dialogueText">
                {en && <div className="dialogue-en">{en}</div>}
                {roma && <div className="dialogue-roma">{roma}</div>}
                {reading && <div className="dialogue-furi">{reading}</div>}
                <div className="dialogue-jp">{jp}</div>
            </div>
        );
    }

    async function handleRatingSubmit(){
        const user = auth.currentUser;

        if(!user){
            setRatingMessage("You must be logged in to rate a scenario.");
            return;
        }

        if(selectedRating === 0){
            setRatingMessage("Please select a rating first");
            return;
        }

        try{
            await submitScenarioRating(user.uid, scenario.id,  selectedRating);
            setRatingMessage("Thank you! Your rating has been saved");
        }   catch(error){
            setRatingMessage(error.message);
        }
    }

    if(scenarioFinished){
        return(
            <div className="scenarioContainer">
                <h1>Community Scenario Complete!</h1>
                
                <p>
                    You successfully completed:
                    <strong> {scenario.title}</strong>
                </p>

                <p>No XP is currently awared for community scenarios.</p>

                {auth.currentUser?.uid !== scenario.createdBy && (
                    <div style={ratingStyles.ratingBox}>
                        <h3>Rate this scenario:</h3>

                        <div style={ratingStyles.starRow}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const activeRating = hoverRating || selectedRating;
                                const isActive = star <= activeRating;
                            
                            
                            return (
                                <button
                                key={star}
                                type="button"
                                onClick={() => setSelectedRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{
                                    ...ratingStyles.starButton,
                                    color:  isActive ? "#ffcc00" : "#777"
                                }}
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                    {isActive ? "★" : "☆"}
                                </button>
                                );
                            })}
                        </div>

                        <p>{selectedRating > 0
                            ? `Selected rating: ${selectedRating} / 5`
                            : "Select a rating"}
                        </p>

                        <button onClick={handleRatingSubmit} style={ratingStyles.submitButton}>
                            Submit rating
                        </button>

                        {ratingMessage && <p>{ratingMessage}</p>}
                        </div>
                )}

                <div className="finishButtons">
                    <Link to="/community" className="finishButton">
                    Back to Community Scenarios
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
                Step {stepIndex + 1} / {scenario.steps.length}
            </h3>

            <div className="npcBox">{renderTextLayers(npcLine)}</div>

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
                    <p>Incorrect - try again!</p>
                    <button onClick={retryStep} className="retryButton">
                        Retry Step
                    </button>
                </div>
            )}
        </div>
    );
}

const ratingStyles = {
    ratingBox: {
        marginTop: "25px",
        background: "#222",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
    },
    starRow: {
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginBottom: "10px"
    },
    starButton: {
        fontSize: "36px",
        background:"transparent",
        border: "none",
        cursor: "pointer",
        transition: "color 0.2s ease, transform 0.1 ease",
        padding: "4px"
    },
    submitButton: {
        marginTop: "10px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "none",
        background: "#4caf50",
        color: "white",
        cursor: "pointer"
    }
};