import { auth, db } from "@/firebase/firebaseConfig";
import BotNavBar from "@/src/Components/navigationBar";
import userStyle from "@/src/styles/userStyle";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const userPage = () => {
    const router = useRouter();
    const [userData, setUserdata] = useState({
        name: "Default User",
        email: "Default@gmail.com",
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        favourites: [] as string[],
    });
    const [favStall, setFavStall] = useState<{id: string; name: string; cuisine: string}[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
            // Fetch user
            const userRef = doc(db, "users", auth.currentUser?.uid ?? "");
            const userSnap = await getDoc(userRef);
            let favourites: string[] = [];
            if (userSnap.exists()) {
                const data = userSnap.data();
                setUserdata({
                name: data.username || "Default User",
                email: data.email || "Default@gmail.com",
                avatar: data.pfp || userData.avatar,
                favourites: data.favourites || [],
                });
                favourites = data.favourites || [];
            }

            // Fetch stalls
            const stalls: { id: string; name: string; cuisine: string }[] = [];
            for (const stallId of favourites) {
                try {
                const stallRef = doc(db, 'stalls', stallId);
                const stallSnap = await getDoc(stallRef);
                if (stallSnap.exists()) {
                    const stallData = stallSnap.data();
                    stalls.push({
                    id: stallId,
                    name: stallData.name || "Unnamed stall",
                    cuisine: stallData.cuisine || ""
                    });
                } else {
                    stalls.push({
                    id: stallId,
                    name: "Unknown stall",
                    cuisine: "-"
                    });
                }
                } catch (error) {
                console.error(`Failed to fetch stall ${stallId}:`, error);
                    stalls.push({
                        id: stallId,
                        name: "Error loading stall",
                        cuisine: "-"
                    });
                }
            }
            setFavStall(stalls);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);


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

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <Text style={{ marginBottom: 12 }}>Loading your profile...</Text>
                    <ActivityIndicator size="large" color="#ffb933" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

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
                        <View style={{marginBottom: 20}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
                                <View style={{flexDirection:'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="bookmark" size={20} color="#ffb933"/>
                                    <Text style={{marginLeft:6, fontWeight:'600', fontSize: 16}}>Saved</Text>
                                </View>
                                <TouchableOpacity onPress={() => router.push('/userSavedStalls')}>
                                    <MaterialCommunityIcons name='arrow-right' size={20} color="#ffb933"/>
                                </TouchableOpacity>
                            </View>
                            {favStall.length === 0 ? (
                                <Text style={{fontSize: 14, color: 'gray'}}>You have no favourite stalls yet.</Text>)
                                                    : (
                                <FlatList
                                    data={favStall}
                                    horizontal
                                    keyExtractor={(item) => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingVertical: 4}}
                                    renderItem={({item}) => (
                                        <TouchableOpacity onPress={() => router.push({
                                            pathname: '/stall/[id]',
                                            params: {id: item.id, title: item.name},
                                            })
                                        }
                                    style={{
                                        width:180,
                                        marginRight: 12,
                                        padding: 12,
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: 12,
                                        borderColor: '#ddd',
                                        borderWidth: 1, 
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{fontSize: 14, fontWeight:'600', marginBottom: 6}}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}>{item.cuisine || 'No cuisine info'}</Text>
                                </TouchableOpacity>
                                )}/>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => router.push('/editProfile')}
                                style={[userStyle.stallButton, { flex: 1, marginLeft: 8 }]}
                            >
                                <MaterialCommunityIcons name="account-edit" size={20} color="white" style={{ marginRight: 6 }} />
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
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
