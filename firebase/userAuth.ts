import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";


export async function authenticateUser(email: string, password: string) { 
    
    const usersRef = collection(db, "users");

    const q = query(usersRef, 
                    where("email", "==", email),
                    where("password", "==", password));
    const queryRes = await getDocs(q);

    if (!queryRes.empty) {
        return {id: queryRes.docs[0].id, ...queryRes.docs[0].data()};
    } else {
        return null;
    }
    
}
    


/**
 * Authenticate user with email and password using Firebase Authentication.
 * @param email User email
 * @param password User password
 * @returns The authenticated Firebase User object
 *

export const authenticateUser = async (
    email: string,
    password: string
) : Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch 
}
*/