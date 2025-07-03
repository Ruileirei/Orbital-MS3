export interface NearbyStall {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    openingHours: {
        [key: string]: string[];
    };
    latitude: number;
    longitude: number;
    distanceToUser?: number;
    menu?: string[];
    
}