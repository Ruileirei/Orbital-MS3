// services/stallService.ts
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

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
      menu: data.menu ?? [],
    };
  });
}

export async function getAllReviews(stallId: string) {
  const reviewsRef = collection(db, "stalls", stallId, "reviews");
  const q = query(reviewsRef, orderBy("time", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export async function getPreviewReviews(stallId: string) {
  const reviewsRef = collection(db, "stalls", stallId, "reviews");
  const q = query(reviewsRef, orderBy("time", "desc"), limit(3));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addReviewForStall(
  stallId: string,
  stallName: string,
  rating: number,
  comment: string
) {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const uid = auth.currentUser.uid;
  const userDoc = await getDoc(doc(db, "users", uid));
  const userName = userDoc.exists() ? userDoc.data().username : "Anonymous";

  const review = {
    rating,
    comment,
    time: serverTimestamp(),
    userName,
    uid,
  };
  await setDoc(
    doc(db, "stalls", stallId, "reviews", uid),
    review
  );
  await setDoc(
    doc(db, "userReviews", uid, "reviews", stallId),
    {
      ...review,
      stallId,
      stallName,
    }
  );
  await updateStallRatingAfterReview(stallId, rating);
}



export async function updateStallRatingAfterReview(
  stallId: string,
  newRating: number
) {
  const stallRef = doc(db, 'stalls', stallId);
  const stallSnap = await getDoc(stallRef);

  if (!stallSnap.exists()) {
    throw new Error('Stall does not exist');
  }

  const data = stallSnap.data();
  let oldAverage = data.rating ?? 0;
  let oldCount = data.numberOfReviews ?? 0;

  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }

  const userReviewRef = doc(db, "stalls", stallId, "reviews", uid);
  const userReviewSnap = await getDoc(userReviewRef);

  let newAverage;
  if (userReviewSnap.exists()) {
    const oldUserRating = userReviewSnap.data().rating ?? 0;

    const sum = oldAverage * oldCount;
    const newSum = sum - oldUserRating + newRating;
    newAverage = newSum / oldCount;

  
    await updateDoc(stallRef, {
      rating: newAverage,
    });

  } else {
    const sum = oldAverage * oldCount;
    const newSum = sum + newRating;
    const newCount = oldCount + 1;
    newAverage = newSum / newCount;

    await updateDoc(stallRef, {
      rating: newAverage,
      numberOfReviews: increment(1),
    });
  }
}


export async function getUserReviews(userId: string) {
  const reviewsRef = collection(db, "userReviews", userId, "reviews");
  const q = query(reviewsRef, orderBy("time", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
