import * as Location from 'expo-location';

let cacheLoc: {latitude: number; longitude: number} | null = null;
let cacheTimeStamp: number | null = null;

const CACHE_DURATION = 30000;

export const getUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
        const now = Date.now();
        if (cacheLoc && cacheTimeStamp && (now - cacheTimeStamp) < CACHE_DURATION) {
            console.log("Return cache location: ", cacheLoc);
            return cacheLoc;
        }
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Please enable permissions");
            return null;
        }
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });

        cacheLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };
        cacheTimeStamp = now;

        return cacheLoc;
        
    } catch (error) {
        console.error("Error getting user location: ", error);
        return null;
    }
};