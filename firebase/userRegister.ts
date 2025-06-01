import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function registerUser(username: string, email: string, password: string) {
    const usersRef = collection(db, "users");

    const emailQuery = query(usersRef, where("email", "==", email));
    const usernameQuery = query(usersRef, where("username", "==", username));

    const [emailRes, usernameRes] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery)
    ]);

    if (!emailRes.empty) {
        throw new Error("Email is already in use");
    }
    if (!usernameRes.empty) {
        throw new Error("Username is already taken");
    }

    await addDoc(usersRef, {
        username,
        email,
        password,
        createdAt: new Date(),
        saved: [],
    });
}