import { auth, db } from "@/firebase/firebaseConfig";
import { addReviewForStall } from "@/services/stallService";
import StarRating from "@/src/Components/starRating";
import LeaveReviewStyle from "@/src/styles/LeaveReviewStyle";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

const WriteReviewScreen = () => {
  const router = useRouter();
  const { id: rawid } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<{ name: string; avatar: string }>({
    name: 'User',
    avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
  });
  const id = Array.isArray(rawid) ? rawid[0] : rawid;
  if (!id) {
    return (
      <View style={LeaveReviewStyle.center}>
        <Text style={LeaveReviewStyle.errorText}>Invalid Stall ID.</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchUserData = async () => {
        if (!auth.currentUser?.uid) return;
        try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData({
            name: data.username || "Anonymous",
            avatar: data.pfp || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
            });
        }
        } catch (error) {
            console.error("Error leaving review: ", error);
            setSuccess(false);

        } finally {
            setLoading(false);
        }
    };    

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
                    name: data.name,
                    avatar: data.pfp
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

    return (
        <View style = {LeaveReviewStyle.background}>
            <SafeAreaView> 
                <ScrollView
                    contentContainerStyle={LeaveReviewStyle.reviewBox}
                    keyboardShouldPersistTaps='handled'
                >

                    <View style = {{alignItems: 'flex-start', marginTop: 10,}}>
                        <Image
                        source={{ uri:userData.avatar}}
                        style={{ width: 50, height: 50, borderRadius: 25}} />

                        <Text style = {{color: 'black', fontSize: 13}} >{userData.name}</Text>
                    </View>
                    <StarRating onPress = {setRating} size = {20} rating = {rating}/> 

                    <ScrollView
                        contentContainerStyle={LeaveReviewStyle.input}>
                        <TextInput 
                            value = {text}
                            onChangeText={setText}
                            placeholder="Write your review here..."
                            multiline
                            style = {LeaveReviewStyle.input}/>
                        
                    </ScrollView>

                    <View style = {ButtonStyles.LeftButtonContainer}>
                        <TouchableOpacity 
                            style = {ButtonStyles.largeGreyButton}
                            onPress = {() => router.back()}>
                            
                            <Text style = {ButtonStyles.orangeText}>Cancel</Text>
                        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[LeaveReviewStyle.button, { flex: 1, marginLeft: 8 }]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={LeaveReviewStyle.buttonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
};

export default WriteReviewScreen;

