import { auth } from '@/firebase/firebaseConfig';

import { getUserReviewDoc } from "@/services/firestoreService";
import { getAllReviews } from '@/services/stallService';
import StarRating from "@/src/Components/starRating";
import StallStyle from "@/src/styles/StallPageStyle";
import allReviewsStyle from '@/src/styles/allReviewsStyle';
import { Review } from '@/src/types/reviewItem';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// This page is to show all reviews with searching and filtering options.
const AllReviewsPage = () => {
    const router = useRouter();
    const [userReview, setUserReview] = useState<Review>();
    //const [reviews, setReviews] = useState<Review[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const {id: rawid, rating: rawRating, numberOfReviews: rawNumberOfReviews} = useLocalSearchParams();
    //const navigation= useNavigation();
    const id = Array.isArray(rawid) ? rawid[0] : rawid;
    const rating = Array.isArray(rawRating) ? rawRating[0] : rawRating;
    const numberOfReviews = Array.isArray(rawNumberOfReviews) ? rawNumberOfReviews[0] : rawNumberOfReviews;

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

    /*
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

    */
    useEffect(() => {
        async function fetchReviews() {
            const allReviews = await getAllReviews(id);
            setReviews(allReviews);
        }
        fetchReviews();
    });
    

    if (loading) {
        return (
            <View style={[StallStyle.container, {justifyContent:"center", alignItems:"center"}]}>
                <Text style={{marginTop: 12, color: 'gray' }}>Loading reviews...</Text>
                <ActivityIndicator size="large" color="#ffb933"/>
            </View>
        );
    }

    return (
        <View style={allReviewsStyle.Container}>
            <View style= {{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                }}>
                <StarRating size = {15} rating = {Number(rating)}/> 
                <Text style = {{fontSize: 12, color: 'gray'}}>{numberOfReviews}</Text>
            </View>

            <Text>filter</Text>

            <ScrollView contentContainerStyle = {allReviewsStyle.ReviewContainer}>
                
                {reviews.map((review) => (
                    <View style={allReviewsStyle.UserReviewContainer}>
                        tempUser = getUserDoc(review.userID);
                        <Text style={{ fontWeight: '100', marginBottom: 4 }}>{review.userID}</Text>
                    </View>
                ))};
            </ScrollView>


        </View>

    );

}

export default AllReviewsPage;
