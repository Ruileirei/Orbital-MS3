import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";

const db = getFirestore();

export const registerUser = async (
    username: string,
    email: string,
    password: string
) => {
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date(),
        });

        return user;
    } catch (error) {
        throw error;
    }
};

