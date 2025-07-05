import { auth } from '@/firebase/firebaseConfig';

import { getStallReviewDoc, getUserReviewDoc } from "@/services/firestoreService";
import { Review } from '@/src/types/reviewItem';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

// This page is to show all reviews with searching and filtering options.
const AllReviewsPage = () => {
    const router = useRouter();
    const [userReview, setUserReview] = useState<Review>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const {id} = useLocalSearchParams();
    //const navigation= useNavigation();

    useEffect(() => {
        async function checkIfReviewed() {
            if (!auth.currentUser || !id) return;

            try {
                const userReviews = await getUserReviewDoc(auth.currentUser.uid);
                const review = userReviews.find(r => r.stallID == id);
                if (review != null) {
                    setUserReview(review);
                }
                
            } catch (error) {
                console.error("Error checking if user has reviewed:", error);
            }
        }
        checkIfReviewed();
    }, [id]);

    useEffect(() => {

        async function fetchReviews() {
            try {

                const allReviews = await getStallReviewDoc(id.toString());
                setReviews(allReviews.slice(0, 10));
                //timestamp: d.timestamp?.toDate() ?? new Date(),

            } catch(error) {
                console.error('Error loading reviews', error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [id]);

}

export default AllReviewsPage;
