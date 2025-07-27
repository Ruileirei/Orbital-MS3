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
        console.error("Failed to load user data:", error);
        }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!auth.currentUser) {
      setErrorMsg("You must be logged in to leave a review.");
      return;
    }
    if (rating === 0 || comment.trim() === '') {
      setErrorMsg("Please provide a rating and a comment.");
      return;
    }

    try {
      setLoading(true);
      await addReviewForStall(id , rating, comment);
      router.back();
    } catch (error) {
      console.error(error);
      setErrorMsg("Error submitting review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={LeaveReviewStyle.container}
    >     
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Image
            source={{ uri: userData.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{userData.name}</Text>
      </View>
      <Text style={LeaveReviewStyle.label}>Your Rating</Text>
      <StarRating rating={rating} size={32} onPress={setRating} />

      <Text style={LeaveReviewStyle.label}>Your Comment</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Write your review here..."
        multiline
        style={LeaveReviewStyle.input}
      />

      {errorMsg ? <Text style={LeaveReviewStyle.errorText}>{errorMsg}</Text> : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[LeaveReviewStyle.button, { backgroundColor: '#ccc', flex: 1, marginRight: 8 }]}
        >
          <Text style={[LeaveReviewStyle.buttonText, { color: '#333' }]}>Cancel</Text>
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

