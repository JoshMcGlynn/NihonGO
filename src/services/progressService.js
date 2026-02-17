import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

const XP_BY_DIFFICULTY = {
    easy: 10,
    medium: 20,
    hard: 30
};

export async function awardScenarioCompletion(userId, scenarioId, difficulty){
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

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

    const scenarioProgress = userData.completedScenarios?.[scenarioId] || {};
    const alreadyCompleted = scenarioProgress[difficulty];

    if (alreadyCompleted) {
        return {
            xpAwarded: 0,
            alreadyCompleted: true,
            totalXp: userData.xp
        };
    }

    const xpToAdd = XP_BY_DIFFICULTY[difficulty];
    const newXp = userData.xp + xpToAdd;

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

function getHighestDifficulty(progress){
    if(progress.hard) return "hard";
    if(progress.medium) return "medium";
    if(progress.easy) return "easy";
    return null;
}