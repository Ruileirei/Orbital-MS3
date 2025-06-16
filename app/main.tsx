import mainStyle from '@/Components/mainStyle';
import BotNavBar from '@/Components/navigationBar';
import { auth, db } from '@/firebase/firebaseConfig';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
    {label: "halal", icon: "food-halal"},
];

const MainPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('User');

    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setUsername(data.username || 'User');
                }
            }
        };
        fetchUser()
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                    <View style={mainStyle.topContainer}>
                        <Text style={mainStyle.WelcomeText}>Hi {username}</Text>

                        <TouchableOpacity
                            onPress={() => router.push('./search')}
                            style={mainStyle.SearchBar}
                        >
                            <Ionicons name="search" size={20} color='gray'/>
                            <Text style={{marginLeft: 8, color: 'gray'}}>Search for hawker food...</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{fontSize: 16, fontWeight:'600', marginBottom: 10}}>Browse by Category</Text>
                        <View style={mainStyle.categoryContainer}>
                            {categories.map((cat, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => router.push({
                                        pathname: "./group/[id]",
                                        params: {id: cat.label.toLowerCase(). replace(/\s+/g, "_")}
                                    })}
                                    style={mainStyle.categoryButton}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={24} color={"#fff"}/>
                                    <Text style={{marginTop: 6, fontSize: 13, fontWeight: '500', color:'#fff'}}>
                                        {cat.label.charAt(0).toUpperCase() + cat.label.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                <BotNavBar/>
            </View>
        </SafeAreaView>
    );
};

export default MainPage;
