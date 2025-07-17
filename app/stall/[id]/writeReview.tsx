import { auth } from '@/firebase/firebaseConfig';
import { Alert, SafeAreaView, ScrollView, View } from "react-native";

import { addReviewToDatabase, updateStallRating } from '@/src/api/reviewApi';
import LeaveReviewStyle from "@/src/styles/LeaveReviewStyle";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

const LeaveReviewPage = () => {
    const [userID, setUserID] = useState("");
    const [stallID, setStallID] = useState("");
    const [text, setText] = useState("");
    const [rating, setRating] = useState();
    const [reviewID, setReviewID] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const {id} = useLocalSearchParams();

    const handleReview = async () => {
        if (!auth.currentUser) {
            console.log("User is not logged in");
            return;
        } else if (!userID || !stallID || !text || !rating) {
            Alert.alert("Please fill in all fields");
            return;
        } 
        setLoading(true);

        try {
            const rev = {
                userID,
                stallID, 
                text,
                rating, 
            }
            const rid = await addReviewToDatabase(rev);
            setReviewID(rid.toString());
            setSuccess(true);
            Alert.alert("You have left a review!)");

            await updateStallRating(rev);

            //router.replace('/');

        } catch (error) {
            console.error("Error leaving review: ", error);
            setSuccess(false);

        } finally {
            setLoading(false);
        }
    };    

    return (
        <View style = {LeaveReviewStyle.background}>
            <SafeAreaView> 
                <ScrollView
                    contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingTop: 120,
                            paddingBottom: 50,
                        }}
                        keyboardShouldPersistTaps='handled'
                >
                    
                </ScrollView>
            </SafeAreaView>

        </View>
            
    );
}

export default LeaveReviewPage;