import { getStallReviewDoc } from "@/services/firestoreService";
import { Review } from '@/src/types/reviewItem';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

// get rid of this, just put it in the stall page
export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const {id} = useLocalSearchParams();
    const navigation= useNavigation();

    useEffect(() => {
        async function fetchReviews() {
            try {

                const allReviews = await getStallReviewDoc(id.toString());
                setReviews(allReviews.slice(0, 1));
                //timestamp: d.timestamp?.toDate() ?? new Date(),

            } catch(error) {
                console.error('Error loading reviews', error);
            } finally {
                setLoading(false);
            }
        }
    }, [id]);
}
