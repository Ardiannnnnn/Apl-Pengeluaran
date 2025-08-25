import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqa7y9BUFPakhuLS0RNv5QsVcOnr9YefM",
  authDomain: "pengeluaran-app.firebaseapp.com",
  projectId: "pengeluaran-app",
  storageBucket: "pengeluaran-app.firebasestorage.app",
  messagingSenderId: "366237419933",
  appId: "1:366237419933:web:4b5cfaf031a41a37044774"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;