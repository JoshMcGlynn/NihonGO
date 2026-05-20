import { doc, runTransaction, serverTimestamp} from "firebase/firestore";
import {db} from "../firebaseConfig";

export async function submitScenarioRating(userId, scenarioId, ratingValue){
    if(!userId){
        throw new Error("User must be logged in to rate a scenario.");
    }
    
    //Ratings are given through a 1-5 star scale
    //This protects the service even if invalid data is somehow sent from the UI
    if(ratingValue < 1 || ratingValue > 5){
        throw new Error("Rating must be between 1 and 5.")
    }

    const scenarioRef = doc(db, "communityScenarios", scenarioId);

    //Each user's rating is stored using their UID as the document ID
    //This is so that the same user cannot rate the same scenario multiple times
    const ratingRef = doc(db, "communityScenarios", scenarioId, "ratings", userId);

    //A Firestore transaction is used so the rating document and scenario average are updated together consistently
    return await runTransaction(db, async (transaction) => {
        const scenarioSnap = await transaction.get(scenarioRef);

        if(!scenarioSnap.exists()){
            throw new Error("Scenario does not exist")
        }

        const scenarioData = scenarioSnap.data();

        //Users should not be able to rate their own scenarios
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