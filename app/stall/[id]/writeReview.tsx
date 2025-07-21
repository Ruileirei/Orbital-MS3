import { auth, db } from '@/firebase/firebaseConfig';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { addReviewToDatabase, updateStallRating } from '@/src/api/reviewApi';
import StarRating from "@/src/Components/starRating";
import ButtonStyles from "@/src/styles/ButtonStyles";
import LeaveReviewStyle from "@/src/styles/LeaveReviewStyle";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { TextInput } from 'react-native-gesture-handler';

const LeaveReviewPage = () => {
    const [userID, setUserID] = useState("");
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewID, setReviewID] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: "Default User",
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    });
    const {id, name} = useLocalSearchParams();
    const stallID = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    const handleReview = async () => {

        if (!userID || !stallID || !text || !rating) {
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
            Alert.alert("You have left a review!");

            await updateStallRating(rev);

            //router.replace('/');

        } catch (error) {
            console.error("Error leaving review: ", error);
            setSuccess(false);

        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        const getData = async () => {
            if (!auth.currentUser) {
                console.log("User is not logged in");
                return;
            }
            setLoading(true);
            
            try {
                const userRef = doc(db, "users", auth.currentUser?.uid ?? "");
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData({
                        name: data.username || userData.name,
                        avatar: data.pfp || userData.avatar
                    });
                    setUserID(auth.currentUser?.uid);
                }
                
            } catch (error) {
                console.error("Error verifying user: ", error);
                setSuccess(false);
            } finally {
                setLoading(false);
            }  
        };
        getData();
    }, []);

    return (
        <View style = {LeaveReviewStyle.background}>
            <SafeAreaView> 
                <ScrollView
                    contentContainerStyle={LeaveReviewStyle.reviewBox}
                    keyboardShouldPersistTaps='handled'
                >

                    <View style = {{flexDirection: 'row', alignItems: 'flex-start', padding: 16}}>
                        <Image
                        source={{ uri:userData.avatar}}
                        style={{ width: 50, height: 50, borderRadius: 25}} />

                        <Text style = {{color: 'black', fontSize: 13}} >{userData.name}</Text>
                    </View>
                    <StarRating onPress = {setRating} size = {20} rating = {rating}/> 

                    <TextInput 
                        value = {text}
                        onChangeText={setText}
                        placeholder="Write your review here..."
                        multiline
                        style = {LeaveReviewStyle.input}/>
                    
                    <View style = {ButtonStyles.LeftHorizontalContainer}>
                        <TouchableOpacity 
                            style = {ButtonStyles.largeGreyButton}
                            onPress = {() => router.back()}>
                            
                            <Text style = {ButtonStyles.orangeText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style = {ButtonStyles.largeOrangeButton}
                            onPress =  {handleReview}>
                            <Text style = {ButtonStyles.largeButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                </ScrollView>

            </SafeAreaView>

        </View>
            
    );
}

export default LeaveReviewPage;