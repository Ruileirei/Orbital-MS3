import BotNavBar from '@/Components/navigationBar';
import StarRating from '@/Components/starRating';
import { db } from '@/firebase/firebaseConfig';
import { Icon, SearchBar } from '@rneui/themed';
import { useRouter } from "expo-router";
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchStyle from "../Components/SearchStyle";

interface Stall {
    id: string;
    title: string;
    cuisine: string;
    rating: number;
}

const MainScreen = () => {
    const router = useRouter();
    const [data, setData] = useState<Stall[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const arrayholder = useRef<Stall[]>([]);

    useEffect(() => {
        async function fetchStalls() {
            try {
                const queryRes = await getDocs(collection(db, "stalls"));
                const stalls: Stall[] = [];
                queryRes.forEach((doc) => {
                    const stallData = doc.data();
                    stalls.push({
                        id: doc.id,
                        title: stallData.name ?? "",
                        cuisine: stallData.cuisine ?? "",
                        rating: stallData.rating ?? 0,
                    });
                });
                setData(stalls);
                arrayholder.current = stalls;
            } catch (error) {
                console.error("Error fetching stalls");
            }
        }
        fetchStalls();
    }, []);

    const navigateStall = (item: Stall) => {
        router.push({
            pathname: '/stall/[id]',
            params: {
                id: item.id,
                title: item.title,
                cuisine: item.cuisine,
                rating: item.rating.toString(),
            },
        });
    };

    const handleFilter = () => {
        Alert.alert(":(","Filter coming soon!");
        //router.push('/filter');
    };

    const searchFunction = (text: string) => {
        const filtered = arrayholder.current.filter((item) => {
            const itemData = item.title.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.includes(textData);
        });
        setData(filtered);
        setSearchValue(text);
    }


    const Item = ({ item }: {item: Stall}) => (
        <TouchableOpacity 
            onPress={() => navigateStall(item)}
            style = {SearchStyle.itemButton}>
            <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 4}}>
                {item.title}
            </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text>{item.cuisine} </Text>
                <StarRating rating={item.rating} size={14} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={SearchStyle.container}>
                <View style={{flex: 1}}>
                    <View style={SearchStyle.searchFilter}>
                        <View style={{flex: 1}}>
                            <SearchBar
                                containerStyle={SearchStyle.searchBar}
                                placeholder="Find food near you..."
                                onChangeText={searchFunction}
                                value={searchValue}
                            />
                        </View>
                        <TouchableOpacity onPress={handleFilter} style={{marginLeft: 10}}>
                            <Icon name='filter-list' 
                                  type='material'
                                  size={30}
                                  color='gray'
                                  />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={({item}) => <Item item={item}/>}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => 
                            <Text>No match found</Text>
                        }
                    />
                </View>       
                <BotNavBar/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default MainScreen;