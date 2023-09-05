import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "asbd-championship.firebaseapp.com",
  projectId: "asbd-championship",
  storageBucket: "asbd-championship.appspot.com",
  messagingSenderId: "440750479331",
  appId: "1:440750479331:web:4063edd5ef78635ebe72d6",
  measurementId: "G-QCXQM69JJ9",
};
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
