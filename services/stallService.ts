import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

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
  rating: number,
  comment: string
) {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const uid = auth.currentUser.uid;

  const [userDoc, stallDoc] = await Promise.all([
    getDoc(doc(db, "users", uid)),
    getDoc(doc(db, "stalls", stallId))
  ]);

  const userName = userDoc.exists() ? userDoc.data().username : "Anonymous";
  const stallName = stallDoc.exists() ? stallDoc.data().name : "Undefined";

  const review = {
    rating,
    comment,
    time: serverTimestamp(),
    userName,
    uid,
  };

  try {
    // Update stall rating and numberOfReviews first
    await updateStallRatingAfterReview(stallId, rating);

    // Then write the review documents
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

  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}



export async function updateStallRatingAfterReview(
  stallId: string,
  newRating: number
) {
  console.log('[1] Starting updateStallRatingAfterReview for stall:', stallId);
  
  if (!auth.currentUser?.uid) {
    console.error('[2] No authenticated user');
    throw new Error('User not authenticated');
  }

  const uid = auth.currentUser.uid;
  const stallRef = doc(db, 'stalls', stallId);
  const userReviewRef = doc(db, "stalls", stallId, "reviews", uid);

  try {
    console.log('[3] Fetching stall and review data...');
    const [stallSnap, userReviewSnap] = await Promise.all([
      getDoc(stallRef),
      getDoc(userReviewRef)
    ]);

    if (!stallSnap.exists()) {
      console.error('[4] Stall does not exist');
      throw new Error('Stall does not exist');
    }

    const stallData = stallSnap.data();
    console.log('[5] Current stall data:', {
      rating: stallData.rating,
      numberOfReviews: stallData.numberOfReviews
    });

    const oldAverage = stallData.rating || 0;
    const oldCount = stallData.numberOfReviews || 0;
    const userHadPreviousReview = userReviewSnap.exists();
    const oldUserRating = userHadPreviousReview ? userReviewSnap.data().rating : 0;

    console.log('[6] Calculation inputs:', {
      oldAverage,
      oldCount,
      userHadPreviousReview,
      oldUserRating
    });

    let newAverage, newCount;
    if (userHadPreviousReview) {
      newCount = oldCount;
      newAverage = ((oldAverage * oldCount) - oldUserRating + newRating) / oldCount;
    } else {
      newCount = oldCount + 1;
      newAverage = ((oldAverage * oldCount) + newRating) / newCount;
    }

    console.log('[7] Calculated new values:', {
      newAverage,
      newCount
    });

    const updateData: { rating: number; numberOfReviews?: number } = {
      rating: newAverage
    };

    if (!userHadPreviousReview) {
      updateData.numberOfReviews = newCount;
    }

    console.log('[8] Attempting to update with:', updateData);
    await updateDoc(stallRef, updateData);
    console.log('[9] Update successful!');

    // Verify the update
    const updatedStall = await getDoc(stallRef);
    console.log('[10] Updated stall data:', updatedStall.data());
    
  } catch (error) {
    console.error('[ERROR] In updateStallRatingAfterReview:', error);
    throw error;
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
