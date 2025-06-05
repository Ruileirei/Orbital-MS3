import BotNavBar from "@/Components/navigationBar";
import userStyle from "@/Components/userStyle";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const userPage = () => {
    const router = useRouter();

    const [userData, setUserdata] = useState({
        name: "Default User",
        email: "Default@gmail.com",
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", "defaultUserId");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserdata({
                        name: data.name || "Default User",
                        email: data.email || "Default@gmail.com",
                        avatar: data.avatar || userData.avatar,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user data,", error);
            }
        };
        fetchUserData();
    }, []);


    const handleLogOut = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [{text: 'cancel', style: 'cancel'},
                {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    router.replace('/');
                },
            },]
        );
    };

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={[userStyle.container, {width: '100%', paddingBottom: 10}]}>
                <View style={userStyle.innerContainer}>
                    <Image
                        source={{uri:userData.avatar}}
                        style={userStyle.avatar}/>
                    <Text style={userStyle.name}>{userData.name}</Text>
                    <Text style={userStyle.email}>{userData.email}</Text>
                    <TouchableOpacity 
                        style={userStyle.logoutButton}
                        onPress={handleLogOut}>
                            <Text style={userStyle.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%'}}><BotNavBar/></View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default userPage;
