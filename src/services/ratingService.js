import {average, doc, getDoc, runTransaction, serverTimestamp} from "firebase/firestore";
import {db} from "../firebaseConfig";

export async function submitScenarioRating(userId, scenarioId, ratingValue){
    if(!userId){
        throw new Error("User must be logged in to rate a scenario.");
    }

    if(ratingValue < 1 || ratingValue > 5){
        throw new Error("Rating must be between 1 and 5.")
    }

    const scenarioRef = doc(db, "communityScenarios", scenarioId);
    const ratingRef = doc(db, "communityScenarios", scenarioId, "ratings", userId);

    return await runTransaction(db, async (transaction) => {
        const scenarioSnap = await transaction.get(scenarioRef);

        if(!scenarioSnap.exists()){
            throw new Error("Scenario does not exist")
        }

        const scenarioData = scenarioSnap.data();

        if(scenarioData.createdBy === userId){
            throw new Error("You cannot rate your own scenario.");
        }

        const existingRatingSnap = await transaction.get(ratingRef);

        if(existingRatingSnap.exists()){
            throw new Error("You have already rated this scenario");
        }

        const currentAverage = scenarioData.averageRating || 0;
        const currentCount = scenarioData.ratingCount || 0;

        const newCount = currentCount + 1;
        const newAverage = (currentAverage * currentCount + ratingValue) / newCount;

        transaction.set(ratingRef, {
            rating: ratingValue,
            createdAt: serverTimestamp()
        });

        transaction.update(scenarioRef, {
            averageRating: newAverage,
            ratingCount: newCount
        });

        return{
            averageRating: newAverage,
            ratingCount: newCount
        };
    });
}