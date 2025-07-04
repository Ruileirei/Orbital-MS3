import { getStallReviewDoc } from "@/services/firestoreService";
import { Review } from '@/src/types/reviewItem';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const {id} = useLocalSearchParams();
    const navigation= useNavigation();

    useEffect(() => {
        async function fetchReviews() {
            try {
                
                    orderBy("timestamp", "desc")
                

                const docRes = await getStallReviewDoc(id.toString());

                const data: Review[] = snapshot.docs.map(doc => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        userID: d.userID,
                        rating: d.rating,
                        text: d.text,
                        timestamp: d.timestamp?.toDate() ?? new Date(),

                    };
                });
            } catch(error) {

            }
        }
    }, [id]);
}