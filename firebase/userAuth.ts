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