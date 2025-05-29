import MapStyle from "@/Components/MapsPageStyle";
import StarRating from "@/Components/starRating";
import { db } from "@/firebase/firebaseConfig";
import { Feather } from '@expo/vector-icons';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, Region } from 'react-native-maps';

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
const Max_zoom = 1;

const MapScreen: React.FC = () => {
    const [stalls, setStalls] = useState<Stall[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

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

    if (loading) {
        return (
            <View style={MapStyle.centered}>
                <Text>Loading stalls...</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <MapView style={MapStyle.map} initialRegion={SINGAPORE_MAP}>
                {stalls.map(stall => (
                    <Marker
                        key={stall.id}
                        coordinate={{latitude: stall.latitude, longitude:stall.longitude}}
                        onPress={() => setSelectedStall(stall)}
                        >
                        <Callout tooltip={true}>
                            <View style={MapStyle.calloutContainer}>
                                <Text style={MapStyle.title}>{stall.name}</Text>
                                <Text style={MapStyle.cuisine}>{stall.cuisine}</Text>
                                <Text style={MapStyle.rating}>{stall.rating}</Text>
                                {stall.location && (<Text style={MapStyle.location}>{stall.location}</Text>)}
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            {selectedStall && (
                <View style={MapStyle.modalContainer}>
                    <View style={MapStyle.modalContent}>
                        <Text style={MapStyle.modalTitle}>{selectedStall.name}</Text>
                        <Text style={MapStyle.modalCuisine}>{selectedStall.cuisine}</Text>
                        <StarRating rating={selectedStall.rating}/>
                        {selectedStall.location && (
                            <Text style={MapStyle.location}>{selectedStall.location}</Text>
                        )}
                        <TouchableOpacity 
                            style={MapStyle.closeIcon}
                            onPress={() => setSelectedStall(null)}>
                            <Feather name="x" size={18} color='333'/>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default MapScreen;