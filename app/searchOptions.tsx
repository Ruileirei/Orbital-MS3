import mapOptionsStyle from "@/src/styles/mapSearchStyle";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

const LOCATIONIQ_API = 'pk.077fa777ead57a7b374b2821ddbcd89c';

const SearchOptions = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const buttonTranslateVert = useRef(new Animated.Value(50)).current;
    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length < 2) {
            setResults([]);
            return;
        }
        try {
            const searchRes = await fetch(
                `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API}&q=${encodeURIComponent(text)}&limit=5&countrycodes=SG&format=json`
            );
            const data = await searchRes.json();
            if (Array.isArray(data)) {
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Autocomplete error: ', error);
        }
    };

    useEffect(() => {
        Animated.timing(buttonTranslateVert, {
            toValue: results.length === 0 ? 1 : 0.3,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [results]);

    const handlePlaceSelect = (item: any) => {
        const lat = item.lat;
        const long = item.lon;
        router.replace({
            pathname: '/Map',
            params: {
                mode: 'place',
                lat: lat.toString(),
                lng: long.toString(),
            }
        });
    };

    const handleSelect = (mode: string) => {
        router.replace({
            pathname: '/Map',
            params: {mode},
        });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <TextInput 
                style={mapOptionsStyle.SearchInput}
                placeholder="Type an area or place"
                value={query}
                onChangeText={handleSearch}
            />
            <View style={{ marginBottom: 10 }}>
                {results.map((item) => (
                    <TouchableOpacity
                        key={item.place_id}
                        style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                        }}
                        onPress={() => handlePlaceSelect(item)}
                    >
                        <Text>{item.display_name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={{fontSize: 15, fontWeight: '600', marginVertical: 20}}>
                Other Options
            </Text>
            <Animated.View 
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    transform:[{translateY:buttonTranslateVert}],
                    opacity: buttonTranslateVert.interpolate({
                        inputRange:[0, 50],
                        outputRange:[1, 0.3],
                    }),
                }}
            >
                <TouchableOpacity
                    style={[mapOptionsStyle.OtherButton, {marginRight: 5}]}
                    onPress={() => handleSelect('all')}
                >
                    <Text style={mapOptionsStyle.OtherButtonText}>Show All Stalls</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[mapOptionsStyle.OtherButton, {marginLeft: 5}]}
                    onPress={() => handleSelect('nearby')}
                >
                    <Text style={mapOptionsStyle.OtherButtonText}>Show Nearby Stalls</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

export default SearchOptions;