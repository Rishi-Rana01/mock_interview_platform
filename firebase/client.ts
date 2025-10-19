
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDptujUwaDFLBokAqK24wwSmZeFrLLF4-g",
  authDomain: "prepfast-9fa3d.firebaseapp.com",
  projectId: "prepfast-9fa3d",
  storageBucket: "prepfast-9fa3d.firebasestorage.app",
  messagingSenderId: "905366516301",
  appId: "1:905366516301:web:b6af6d7c3430d012f66204",
  measurementId: "G-SYHQH7RTGM"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);


// https://firebase.google.com/docs/web/setup#available-libraries