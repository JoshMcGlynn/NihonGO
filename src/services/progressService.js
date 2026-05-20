import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

//XP rewards are based on the difficulty completed
//These values can be changed any time without altering the scenario runner itself
const XP_BY_DIFFICULTY = {
    easy: 10,
    medium: 20,
    hard: 30
};

export async function awardScenarioCompletion(userId, scenarioId, difficulty){
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    //If the user document does not exist yet, create a basic progress record.
    //This protects older accounts that were created or newly created users from missing progress data
    if(!userSnap.exists()){
        //first time user document
        await setDoc(userRef, {
            xp: 0,
            completedScenarios: {}
        });
    }

    const userData = userSnap.exists() ? userSnap.data() : {
        xp: 0,
        completedScenarios: {}
    };

    //Progress is stored per scenario, then per difficulty
    //This allows the same sceanrio to award XP once for easy, medium and hard
    const scenarioProgress = userData.completedScenarios?.[scenarioId] || {};
    const alreadyCompleted = scenarioProgress[difficulty];

    //Prevents users from repeatedly completing the same difficulty to farm XP 
    if (alreadyCompleted) {
        return {
            xpAwarded: 0,
            alreadyCompleted: true,
            totalXp: userData.xp
        };
    }

    const xpToAdd = XP_BY_DIFFICULTY[difficulty];
    const newXp = userData.xp + xpToAdd;

    //Store the newly completed difficulty and update the highest difficulty reached
    const updatedScenarioProgress = {
        ...scenarioProgress,
        [difficulty]: true, 
        highestDifficulty: getHighestDifficulty({
            ...scenarioProgress,
            [difficulty]: true
        })
    };

    await updateDoc(userRef, {
        xp: newXp, 
        [`completedScenarios.${scenarioId}`]: updatedScenarioProgress
    });

    return {
        xpAwarded: xpToAdd,
        alreadyCompleted: false,
        totalXp: newXp
    };
}

//Determines the highest completed difficulty for display purposes
//Hard takes prioirty over medium, and medium takes priority over easy
function getHighestDifficulty(progress){
    if(progress.hard) return "hard";
    if(progress.medium) return "medium";
    if(progress.easy) return "easy";
    return null;
}