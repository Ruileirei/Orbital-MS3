
import { db } from '@/firebase/firebaseConfig';
import { fetchStallData } from '@/src/api/stallApi';
import { Review } from '@/src/types/reviewItem';
import { collection, doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';

/* --- addReviewToDatabase -------
adds review to global Review collection, 
reviews subcollection for user and stall
*/
export async function addReviewToDatabase(reviewData: Review): Promise<String> {
    const batch = writeBatch(db);

    // Generate a new review ID 
    const newReviewRef = doc(collection(db, 'Reviews'));
    const newReviewID = newReviewRef.id;

    // 1. Add to Reviews collection
    batch.set(newReviewRef, {
        ...reviewData,
        timestamp: serverTimestamp(),
        id: newReviewID,
    });

    // 2. Add to stall reviews subcollection
    const stallReviewRef = doc(db, 'stalls', reviewData.stallID, 'reviews', newReviewID);
    batch.set(stallReviewRef, {
        ...reviewData,
        timestamp: serverTimestamp(),
        id: newReviewID,
    });

    // 3. Add to user reviews subcollection
    const userReviewRef = doc(db, 'stalls', reviewData.userID, 'reviews', newReviewID);
    batch.set(userReviewRef, {
        ...reviewData,
        timestamp: serverTimestamp(),
        id: newReviewID,
    });

    await batch.commit();

    console.log('Review written to all paths with ID: ${newReviewID}');
    return newReviewID;

}

/* ---- updateStallRating ------
updates stall rating on firebase but idk if it also updates the screen...
*/
export async function updateStallRating(reviewData: Review): Promise<any | null> {
    const stallID = reviewData.stallID;

    try {
        const stallData = await fetchStallData(stallID);
        //if (stallData != null) {
            const stallRef = doc(db, 'stalls', stallID);
            const numOfReviews = stallData.numberOfReviews;
            const newRating = (stallData.rating * numOfReviews + reviewData.rating) / (numOfReviews + 1);

            await updateDoc(stallRef, {
                rating: newRating,
                numberOfReviews: numOfReviews + 1,
            });
        /*
        } else {
            console.error("Error fetching stall data", error);
            throw error;
        } */
    } catch (error) {
        console.error("Error updating stallrating:", error);
    } 

    return null;

}