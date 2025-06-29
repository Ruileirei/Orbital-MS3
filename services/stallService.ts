// services/stallService.ts
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function fetchAllStallsFromFirestore() {
  const queryRes = await getDocs(collection(db, 'stalls'));
  return queryRes.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.name ?? '',
      cuisine: data.cuisine ?? '',
      rating: data.rating ?? 0,
      openingHours: data.openingHours ?? {},
      latitude: data.latitude ?? 0,
      longitude: data.longitude ?? 0,
    };
  });
}
