import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, getReactNativePersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6dbL8Pi44smCMTikdrRELrdsdQOJkTHc",
  authDomain: "foodfindr-183a6.firebaseapp.com",
  projectId: "foodfindr-183a6",
  storageBucket: "foodfindr-183a6.firebasestorage.app",
  messagingSenderId: "813264956329",
  appId: "1:813264956329:web:ebc544b6da8414128ff2b8",
  measurementId: "G-626TEMQHLW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };

setPersistence(auth, getReactNativePersistence(AsyncStorage));
