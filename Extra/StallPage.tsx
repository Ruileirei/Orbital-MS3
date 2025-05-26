import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { RootStack } from "./Root";
type StallRouteProp = RouteProp<RootStack, 'StallInfo'>;

const StallScreen = () => {
    const route = useRoute<StallRouteProp>();
    const {place} = route.params;

    return (
        <View style={{padding: 20}}>
            <Text style={{fontSize: 24}}>{place.title}</Text>
            <Text style={{fontSize: 18, marginTop: 10}}>
                Cuisine: {place.cuisine}
            </Text>
            <Text style={{fontSize: 18, marginTop: 5}}>
                Rating: ⭐ {place.rating}
            </Text>
        </View>
    );
}

export default StallScreen;