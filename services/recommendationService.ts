import { db } from '@/firebase/firebaseConfig';
import { Stall } from '@/src/types/Stall';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const getCuisineBasedRecommendations = async (userId: string): Promise<Stall[]> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) return [];
        const savedIds: string[] = userDoc.data().favourites || [];
        const reviewsRef = collection(db, 'userReviews', userId, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviewedIds = reviewsSnapshot.docs.map(doc => doc.data().stallId);
        const allSavedReviewed = savedIds.concat(reviewedIds);
        const excludedStallIds = Array.from(new Set(allSavedReviewed));
        console.log(savedIds);
        console.log('All excluded stall IDs:', excludedStallIds);
        const positiveReviewsQuery = query(
            reviewsRef,
            where('rating', '>=', 4)
        );
        const positiveReviews = await getDocs(positiveReviewsQuery);
        const positiveReviewIds = positiveReviews.docs.map(doc => doc.data().stallId);

        const positiveStalls = await Promise.all(
            positiveReviewIds.map(async (stallId) => {
                const stallDoc = await getDoc(doc(db, 'stalls', stallId));
                return stallDoc.exists() ? stallDoc.data() as Stall : null;
            })
        );
        const validPositiveStalls = positiveStalls.filter(Boolean) as Stall[];

        // Calculate top cuisines
        const cuisineCount: Record<string, number> = {};
        validPositiveStalls.forEach(stall => {
            const cuisine = stall.cuisine || '';
            if (cuisine) cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
        });

        const topCuisines = Object.entries(cuisineCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([cuisine]) => cuisine);

        if (topCuisines.length === 0) return [];

        // Get recommendations (excluding favorites & all reviews)
        const recommendations: Stall[] = [];
        
        for (const cuisine of topCuisines) {
            const formattedCuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
            const q = query(
                collection(db, 'stalls'),
                where('cuisine', '==', formattedCuisine)
            );
            
            const snapshot = await getDocs(q);
            const filteredStalls = snapshot.docs         
                                           .filter(doc => !excludedStallIds.includes(doc.id))
                                           .slice(0,5);
            filteredStalls.forEach(doc => {
                recommendations.push({ id: doc.id, ...doc.data() } as Stall);
            });
        }
        return recommendations;
    } catch (error) {
        console.error("Recommendation error:", error);
        return [];
    }
};