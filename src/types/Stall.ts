export type Stall = {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    latitude: number;
    longitude: number;
    location?: string;
    openingHours?: {
        [key: string]: string[];
    };
    menu?: string[];
};