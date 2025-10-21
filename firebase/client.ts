
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsiq-Bzp5ued_pUN8CJE7HbFsAV_g-7x8",
  authDomain: "prepfast-f804c.firebaseapp.com",
  projectId: "prepfast-f804c",
  storageBucket: "prepfast-f804c.firebasestorage.app",
  messagingSenderId: "401765459405",
  appId: "1:401765459405:web:1b23815883e09b9414d084",
  measurementId: "G-VXVQFVR9WY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);


// https://firebase.google.com/docs/web/setup#available-libraries