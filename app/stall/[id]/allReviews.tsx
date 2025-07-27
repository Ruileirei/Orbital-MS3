import { calculateRatingSpread } from "@/src/utils/ratingSpread";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type SortOption = 'highest' | 'lowest' | 'newest';

const AllReviewsScreen = () => {
  const router = useRouter();
  const { id: id } = useLocalSearchParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const ratingCounts = calculateRatingSpread(reviews);
  const totalReviews = reviews.length;
  const maxBarWidth = 180;

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
