import { db } from "@/firebase/firebaseConfig";
import BotNavBar from "@/src/Components/navigationBar";
import StarRating from "@/src/Components/starRating";
import MapStyle from "@/src/styles/MapsPageStyle";
import { Feather } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import * as location from 'expo-location';
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";

type Stall = {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    latitude: number;
    longitude: number;
    location?: string;
};

const SINGAPORE_MAP: Region = {
    latitude: 1.3521,
    longitude: 103.8198,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const MapScreen = () => {
    const [stalls, setStalls] = useState<Stall[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStalls, setFilterStalls] = useState<Stall[]>([]);
    const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const {mode, lat, lng} = useLocalSearchParams<{mode?: string; lat?: string; lng?: string}>();

    useEffect(() => {
        const fetchStalls = async () => {
            try {
                const stallsCol = collection(db, 'stalls');
                const res = await getDocs(stallsCol);
                const data: Stall[] = res.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Stall, 'id'>),
                }));
                setStalls(data);
            } catch (error) {
                console.error("Error fetching stalls: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStalls();
    }, []);

    const getDistance = (lat1: number, long1: number, lat2: number, long2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLong = (long2 - long1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        (async () => {
            let { status } = await location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let loc = await location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });
        })();
    }, []);

    useEffect(() => {
        if (!stalls.length) return;
        if (mode === 'place' && lat && lng) {
            const centerLat = parseFloat(lat);
            const centerLong = parseFloat(lng);
            mapRef.current?.animateToRegion({
                latitude: centerLat,
                longitude: centerLong,
                latitudeDelta: 0.05, 
                longitudeDelta: 0.05,
            }, 1000);
            const nearby = stalls.filter(stall=> {
                const dist = getDistance(centerLat, centerLong, stall.latitude, stall.longitude);
                return dist <= 3;
            });
            setFilterStalls(nearby);
        } else if (mode ==='all') {
            mapRef.current?.animateToRegion(SINGAPORE_MAP, 1000);
            setFilterStalls(stalls);
        }
        if (mode === 'nearby' && userLocation) {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);

            const nearby = stalls.filter(stall => {
                const dist = getDistance(userLocation.latitude, userLocation.longitude, stall.latitude, stall.longitude);
                return dist <= 3;
            });
            setFilterStalls(nearby);
        }
    }, [mode, lat, lng, stalls]);

    const navStall = (item: Stall) => {
        router.push({
            pathname:'/stall/[id]/stallIndex',
            params: {
                id: item.id,
                title: item.name,
                cuisine: item.cuisine,
                rating: item.rating.toString(),
            }
        });
    }

    if (loading) {
        return (
            <View style={MapStyle.centered}>
                <Text>Loading...</Text>
                <ActivityIndicator size='large' color='#ffb933'/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex: 1}} edges={['left', 'right', 'bottom']}>
            <View style={{flex: 1}}>
                <MapView
                    ref={mapRef}
                    style={MapStyle.map} 
                    initialRegion={SINGAPORE_MAP}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                >

                    {filterStalls.map(stall => (
                        <Marker
                            key={stall.id}
                            coordinate={{latitude: stall.latitude, longitude:stall.longitude}}
                            onPress={() => setSelectedStall(stall)}
                            >
                            <Callout tooltip={true}>
                                <View style={MapStyle.calloutContainer}>
                                    <Text style={MapStyle.title} testID="callout-stall-name">{stall.name}</Text>
                                    <Text style={MapStyle.cuisine} testID="callout-stall-cuisine">{stall.cuisine}</Text>
                                    <Text style={MapStyle.rating}>{stall.rating}</Text>
                                    {stall.location && (<Text style={MapStyle.location}>{stall.location}</Text>)}
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
                <Image
                    source={require('../assets/images/storeShutter.png')}
                    style={{ width: '101%', height: 110, top: 0, position: 'absolute' }}
                    resizeMode="cover"
                />

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                    position: 'absolute',
                    top: 40,
                    left: 20,
                    backgroundColor: 'rgba(243, 18, 18, 0.4)',
                    padding: 8,
                    borderRadius: 20
                    }}
                    testID="arrow-left-button"
                >
                    <Icon name="arrow-left" type="font-awesome" color="white" size={20} />
                </TouchableOpacity>
                
                <View style={MapStyle.mapSearchRow}>
                    <TouchableOpacity
                        style={MapStyle.mapSearchBar}
                        onPress={() => router.push('/searchOptions')}
                    >
                        <Feather name="search" size={20} color='gray'/>
                        <Text style={{marginLeft: 10, color: 'gray'}}>Search for places...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowOffset: {width: 0, height: 2},
                            elevation: 3,
                        }}
                        onPress={() => {
                            if (userLocation) {
                                mapRef.current?.animateToRegion({
                                    latitude: userLocation.latitude,
                                    longitude: userLocation.longitude,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                });
                            }
                        }}
                    >
                        <Feather name="navigation" size={20} color="gray"/>
                    </TouchableOpacity>
                </View>
                {selectedStall && (
                    <View style={MapStyle.modalContainer}>
                        <View style={MapStyle.modalContent}>
                            <Text style={MapStyle.modalTitle} testID="modal-stall-name">{selectedStall.name}</Text>
                            <Text style={MapStyle.modalCuisine} testID="modal-stall-cuisine">{selectedStall.cuisine}</Text>
                            <StarRating rating={selectedStall.rating}/>
                            {selectedStall.location && (
                                <Text style={MapStyle.location}>{selectedStall.location}</Text>
                            )}
                            <TouchableOpacity
                                style={MapStyle.navStall}
                                onPress={() => navStall(selectedStall)}>
                                <Text style={MapStyle.navText}>See More</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={MapStyle.closeIcon}
                                onPress={() => setSelectedStall(null)}
                                testID="close-modal-button"
                            >
                                <Feather name="x" size={18} color='333'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            <BotNavBar/>    
            </View>
        </SafeAreaView>
    );
};

export default MapScreen;