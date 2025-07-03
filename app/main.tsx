import { auth } from '@/firebase/firebaseConfig';
import { fetchAllStalls, fetchUserData } from "@/services/firestoreService";
import CategoryList from '@/src/Components/CategoryList';
import BotNavBar from '@/src/Components/navigationBar';
import StarRating from '@/src/Components/starRating';
import mainStyle from '@/src/styles/mainStyle';
import { Stall } from '@/src/types/Stall';
import { getOpenStatus } from '@/src/utils/isOpenStatus';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const pickStall = (stalls: any[]) => {
    if (!stalls.length) return null;
    const today = new Date().getDate();
    const index = today % stalls.length;
    return stalls[index];
};

const MainPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('User');
    const [stallOfTheDay, setStallOfTheDay] = useState<any>(null);
    const [openStalls, setOpenStalls] = useState<Stall[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const snap = await fetchUserData(user.uid);
                    if (snap.exists()) {
                        const data = snap.data();
                        setUsername(data.username || 'User');
                    }
                }
                const allStalls = await fetchAllStalls();
                const selected = pickStall(allStalls);
                setStallOfTheDay(selected);

                const openNow = allStalls.filter(stall => 
                    getOpenStatus(stall.openingHours || {}) === "OPEN"
                );
                setOpenStalls(openNow.slice(0, 3));
            } catch (error) {
                console.error('Error loading data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: 'gray', marginBottom: 10}}>Loading Hawker stalls...</Text>
                <ActivityIndicator size='large' color='#ffb933'/>
            </SafeAreaView>
        )
    }
    

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
                    <CategoryList/>
                    {stallOfTheDay && (
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: '/stall/[id]',
                                params: {
                                    id: stallOfTheDay.id,
                                    title: stallOfTheDay.name,
                                    cuisine: stallOfTheDay.cuisine,
                                    rating: stallOfTheDay.rating?.toString() || '0',
                                },
                            })}
                            style={mainStyle.stalloftheday}
                        >
                            <View style={{flexDirection:'row', alignItems:'center', marginBottom:6}}>
                                <MaterialCommunityIcons
                                    name='medal'
                                    size={20}
                                    color='#ffd700'
                                    style={{marginLeft:-4}}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Stall of the Day</Text>
                            </View>
                            <Text style={{ fontSize: 15, marginTop: 6 }}>{stallOfTheDay.name}</Text>
                            <StarRating rating={stallOfTheDay.rating ?? (stallOfTheDay.rating ? Number(stallOfTheDay.rating) : 0)} size={16}/>
                            {stallOfTheDay.menu?.[0] && (
                                <Image
                                    source={{ uri: stallOfTheDay.menu[0] }}
                                    style={{ width: '100%', height: 150, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                            )}
                        </TouchableOpacity>
                    )}

                    <View style={mainStyle.openStallsMainContainer}>
                        <View style={mainStyle.openStallTitleContainer}>
                            <Text style={{fontSize: 16, fontWeight: '700', color: 'white'}}>
                                Open Now
                            </Text>
                        </View>
                        {openStalls.map((stall, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push({
                                    pathname: '/stall/[id]',
                                    params: {
                                        id: stall.id,
                                    
                                    },
                                })}
                                style={mainStyle.openStallsIndividualContainer}
                            >
                                <Text style={{ fontSize: 15, fontWeight: '500' }}>{stall.name}</Text>
                                <Text style={{ fontSize: 12, color: 'gray' }}>{stall.cuisine}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => router.push('/search?hideClosed=true')}
                            style={mainStyle.openStallSeeMore}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>See More</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <BotNavBar/>
            </View>
        </SafeAreaView>
    );
};

export default MainPage;
