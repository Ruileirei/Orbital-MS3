import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

/* --- UNFINISHED --
I saved the reviews as a collection so I think we just need to load that collection... */

const userReviews = () => {
    const router = useRouter();
    const [reviewIds, setReviewIds] = useState<string[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewIDs = async () => {
            try {
                const userRef = doc(db, 'users', auth.currentUser?.uid ?? "");
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const reviews = userSnap.data().reviews || [];
                    setReviewIds(reviews);
                }
            } catch (error) {
                console.error("Error fetching user reviews: ", error);
            }
        };
        fetchReviewIDs();
    }, []);

    


};

export default userReviews;