import BotNavBar from "@/Components/navigationBar";
import userStyle from "@/Components/userStyle";
import { auth, db } from "@/firebase/firebaseConfig";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const userPage = () => {
    const router = useRouter();

    const [userData, setUserdata] = useState({
        name: "Default User",
        email: "Default@gmail.com",
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        favourites: [] as string[],
    });
    const [favStall, setFavStall] = useState<{id: string; name: string}[]>([]);
    const [showFavourites, setShowFavourites] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", auth.currentUser?.uid ?? "");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserdata({
                        name: data.username || "Default User",
                        email: data.email || "Default@gmail.com",
                        avatar: data.avatar || userData.avatar,
                        favourites: data.favourites || [],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user data,", error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchFavourite = async () => {
            const stalls: {id: string; name: string}[] = [];

            for (const stallId of userData.favourites) {
                try {
                    const stallRef = doc(db, 'stalls', stallId);
                    const stallSnap = await getDoc(stallRef);
                    if (stallSnap.exists()) {
                        const stallData = stallSnap.data();
                        stalls.push ({
                        id: stallId,
                        name: stallData.name || "Unnamed stall",
                        });
                    } else {
                        stalls.push({
                            id: stallId,
                            name: "Unknown stall",
                        });
                    }
                } catch (error) {
                    console.error(`Failed to fetch stall ${stallId}:`, error);
                    stalls.push({
                        id: stallId,
                        name: "Error loading stall",
                    });
                }
            }
            setFavStall(stalls);
        };
        if (userData.favourites.length > 0) {
            fetchFavourite();
        } else {
            setFavStall([]);
        }
    }, [userData.favourites]);

    const handleLogout = () => {
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
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1 }}>
                    <View style={userStyle.headerContainer}>
                        <Image
                        source={{ uri: userData.avatar }}
                        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, borderWidth: 1, borderColor: "#fff" }}
                        />
                        <View>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>{userData.name}</Text>
                            <Text style={{ color: "#ffe", fontSize: 13 }}>{userData.email}</Text>
                        </View>
                    </View>
                    <ScrollView style={{flex: 1}} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 180}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => setShowFavourites((prev) => !prev)}
                                style={[userStyle.stallButton, { flex: 1, marginRight: 8 }]}
                            >
                                <MaterialCommunityIcons name="bookmark-outline" size={20} color="white" style={{ marginRight: 6 }} />
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                                {showFavourites ? 'Hide Favourites' : 'Show Favourites'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/editProfile')}
                                style={[userStyle.stallButton, { flex: 1, marginLeft: 8 }]}
                            >
                                <MaterialCommunityIcons name="account-edit" size={20} color="white" style={{ marginRight: 6 }} />
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                        {showFavourites && (
                            <View>
                                {favStall.length === 0 ? (
                                    <Text style={{ fontSize: 14, color: "gray" }}>You have no favourite stalls yet.</Text>
                                ) : (
                                    favStall.map((stall, index) => (
                                        <TouchableOpacity
                                        key={index}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/stall/[id]",
                                                params: { id: stall.id, title: stall.name },
                                            })
                                        }
                                        style={userStyle.favouriteButton}
                                        >   
                                            <Text style={{ fontSize: 16 }}>{stall.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        )}
                    </ScrollView>
                    <View style={{ position: 'absolute', bottom: 70, left: 20, right: 20 }}>
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={userStyle.logoutButton}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <BotNavBar />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
    };

export default userPage;
