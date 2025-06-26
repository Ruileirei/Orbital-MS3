import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const savedStalls = () => {
    const router = useRouter();
    const [stallIds, setStallIds] = useState<string[]>([]);
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserFav = async () => {
            try {
                const userRef = doc(db, 'users', auth.currentUser?.uid ?? "");
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const favourites = userSnap.data().favourites || [];
                    setStallIds(favourites);
                }
            } catch (error) {
                console.error("Error fetching user favourites: ", error);
            }
        };
        fetchUserFav();
    }, []);

    useEffect(() => {
        const fetchStalls = async () => {
            if (stallIds.length === 0) {
                setStalls([]);
                setLoading(false);
                return;
            }
            try {
                const promises = stallIds.map((stallId) => getDoc(doc(db, 'stalls', stallId)));
                const stallDocs = await Promise.all(promises);
                const validStalls = stallDocs.filter((doc) => doc.exists())
                                             .map((doc) => ({id: doc.id, ...doc.data()}));
                setStalls(validStalls);
            } catch (error) {
                console.error("Error loading stalls: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStalls();
    }, [stallIds]);

    const handleStallPress = (stall: any) => {
        router.push({
            pathname: '/stall/[id]',
            params: {
                id: stall.id,
                title: stall.name,
            },
        });
    };

    const renderStalls = ({item} : {item: any}) => {
        return(
            <TouchableOpacity 
                onPress={() => handleStallPress(item)} 
                style={{flexDirection: 'row', alignItems:'center', padding: 12, borderBottomWidth:1, borderColor:'#eee'}}
            >
                <Image 
                    source={{uri: item.menu?.[0] || "https://png.pngtree.com/png-vector/20221109/ourmid/pngtree-no-image-available-icon-flatvector-illustration-graphic-available-coming-vector-png-image_40958834.jpg"}}
                    style={{width: 60, height: 60, borderRadius: 8, marginRight: 10}}
                />
                <View>
                    <Text style={{fontSize: 16, fontWeight:'600'}}>{item.name}</Text>
                    <Text style={{ fontSize: 13, color: "gray" }}>{item.cuisine || "No cuisine info"}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingTop: -35}}>
            {loading ? (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: 'gray', marginBottom: 10}}>Loading saved stalls...</Text>
                    <ActivityIndicator size="large" color='#ffb933'/>
                </View>)
                     : stalls.length === 0 ? (
                <View style={{padding: 10}}>
                    <Text style={{color: 'gray'}}>You haven't saved any stalls yet...</Text>
                </View>)
                     : (
                <FlatList
                    data={stalls}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStalls}
                    contentContainerStyle={{paddingHorizontal: 16}}
                    contentInsetAdjustmentBehavior="never"
                />
            )}
        </SafeAreaView>
    );
};

export default savedStalls;
