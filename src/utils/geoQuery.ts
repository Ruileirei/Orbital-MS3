import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as geofire from 'geofire-common';

interface Stall {
    id: string;
    title: string;
    cuisine: string;
    rating: number;
    openingHours: {[key: string]: string[] };
    latitude: number;
    longitude: number;
    distanceToUser?: number;
    menu?: string[];
}

export const geoQuery = async (userLat: number, userLong: number, radiusMeters: number): Promise<Stall[]> => {
    const bounds = geofire.geohashQueryBounds([userLat, userLong], radiusMeters);
    const promises = [];
    for (const b of bounds) {
        const queryRes = query(
            collection(db, 'stalls'),
            where('geohash', '>=', b[0]),
            where('geohash', '<=', b[1])
        );
        promises.push(getDocs(queryRes));
    }
    const snapshots = await Promise.all(promises);

    const matchingStalls: Stall[] = [];

    snapshots.forEach((snap) => {
        snap.forEach((doc) => {
            const data = doc.data();
            const lat = data.latitude;
            const long = data.longitude;

            const distKm = geofire.distanceBetween([userLat, userLong], [lat, long]);
            const distM = distKm * 1000;

            if (distM <= radiusMeters) {
                matchingStalls.push({
                    id:doc.id,
                    title: data.name ?? '',
                    cuisine: data.cuisine ?? '',
                    rating: data.rating ?? 0,
                    openingHours: data.openingHours ?? {},
                    latitude: lat,
                    longitude: long,
                    distanceToUser: distKm,
                    menu: data.menu ?? "https://png.pngtree.com/png-vector/20221109/ourmid/pngtree-no-image-available-icon-flatvector-illustration-graphic-available-coming-vector-png-image_40958834.jpg",
                });
            }
        });
    });
    matchingStalls.sort((a, b) => (a.distanceToUser! - b.distanceToUser!));
    return matchingStalls;
};