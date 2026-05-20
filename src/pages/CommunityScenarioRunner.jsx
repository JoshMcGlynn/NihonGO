import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db, auth} from "../firebaseConfig";
import "./ScenarioRunner.css";
import { submitScenarioRating } from "../services/ratingService";
import { speakJapanese } from "../utils/speechUtils";

export default function CommunityScenarioRunner(){
    //The community scenario ID is taken from the route, allowing the runner to load any public scenario stored in Firestore
    const{id} = useParams();

    //State used to control scenario laoding, dialogue progression, answer feedback, scenario completion and ratings
    const[scenario, setScenario] = useState(null);
    const[loading, setLoading] = useState(true);
    const[stepIndex, setStepIndex] = useState(0);
    const[showResult, setShowResult] = useState(null);
    const[wrongNpcLine, setWrongNpcLine] = useState(null);
    const[scenarioFinished, setScenarioFinished] = useState(false);
    const[selectedRating, setSelectedRating] = useState(0);
    const[ratingMessage, setRatingMessage] = useState("");
    const[hoverRating, setHoverRating] = useState(0);

    //Load the selected community scenario from Firestore when the page opens
    //The document ID comes from the route parameter
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

    //Show "loading scenario" while Firestore retrieves the scenario 
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
                <Link to="/community" className="finishButton">
                Back to Community Scenarios
                </Link>
            </div>
        );
    }

    const step = scenario.steps[stepIndex];

    //Handles the user's selected answer
    //Correct answers allow progression, incorrect answers display NPC feedback
    function handleChoice(choice){
        if(choice.correct){
            setShowResult("correct");
            setWrongNpcLine(null);
            return;
        }

        let wrongLine;

        //wrongNpc can either be a simple string or a full text-layer object
        //Supporting both formats makes the runner more flexible with older scenario data
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

    //Advances the scenario to the next step
    //If the final step has been completed it will show the completion screen
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

    //Renders all language layers available for community sceanrios
    //community scenarios currently show all layers because they do not yet use difficulty selection
    function renderTextLayers({jp, reading, roma, en}){
        return(
            <div className="dialogueText">
            {/*    {en && <div className="dialogue-en">{en}</div>}  ->  This would add English translations to community scenarios if needed */} 
                {roma && <div className="dialogue-roma">{roma}</div>}
                {reading && <div className="dialogue-furi">{reading}</div>}
                <div className="dialogue-jp">{jp}</div>
            </div>
        );
    }

    //Submits a user's rating for the completed scenario
    //Rating rules such as duplicate prevention and rating one's own scenario are handled in ratingService.js
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

                <p>No XP is currently awarded for community scenarios.</p>

                {auth.currentUser?.uid !== scenario.createdBy && (
                    <div style={ratingStyles.ratingBox}>
                        <h3>Rate this scenario:</h3>

                        <div style={ratingStyles.starRow}>
                            {/* Interactive 1-5 star rating UI
                            Hovering previews the rating, and clicking stores the value selected */}
                            {[1, 2, 3, 4, 5].map((star) => {
                                //Hovered stars temporarily override the selected rating for visual feedback
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
                Step {stepIndex + 1} / {scenario.steps.length} - MEDIUM MODE
            </h3>

            <div className="npcBox">{renderTextLayers(npcLine)}
                {/* Uses the reading field for TTS when available to avoid incorrect kanji readings */}
                <button className="ttsButton" 
                onClick={() => speakJapanese(npcLine.reading || npcLine.jp)}
                >
                    🔊
                </button>
            </div>

            {showResult === null && (
                <div className="choicesContainer">
                    {step.choices.map((choice, index) => (
                        <div key={index} className="choiceWrapper">
                            <button
                                className="choiceButton"
                                onClick={() => handleChoice(choice)}
                            >
                                {renderTextLayers(choice)}
                            </button>

                            {/*Separate TTS button for choice so user can hear a choice without selecting it */}
                            <button className="ttsButton"
                            onClick={() => speakJapanese(choice.reading || choice.jp)}
                            >
                                🔊
                            </button>

                        </div>
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