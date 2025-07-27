import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

export async function fetchUserProfile() {
  const userRef = doc(db, 'users', auth.currentUser?.uid ?? '');
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  return userSnap.data();
}

export async function fetchFavouriteStalls(favourites: string[]) {
  const stalls = [];

  for (const stallId of favourites) {
    try {
      const stallRef = doc(db, 'stalls', stallId);
      const stallSnap = await getDoc(stallRef);
      if (stallSnap.exists()) {
        stalls.push({
          id: stallId,
          name: stallSnap.data().name || 'Unnamed stall',
          cuisine: stallSnap.data().cuisine || '',
        });
      } else {
        stalls.push({ id: stallId, name: 'Unknown stall', cuisine: '-' });
      }
    } catch {
      stalls.push({ id: stallId, name: 'Error loading stall', cuisine: '-' });
    }
  }

  return stalls;
}

export async function fetchUserReviews() {
  if (!auth.currentUser) return [];

  const reviewsRef = collection(db, 'userReviews', auth.currentUser.uid, 'reviews');
  const q = query(reviewsRef, orderBy('time', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

