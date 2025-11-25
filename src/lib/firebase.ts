import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCom8l0KzKQ68S3y8zjAzeBFg93FeAlW2o",
    authDomain: "playstoremanager.firebaseapp.com",
    projectId: "playstoremanager",
    storageBucket: "playstoremanager.firebasestorage.app",
    messagingSenderId: "750808657224",
    appId: "1:750808657224:web:1604c700b8bc9bc740577d",
    measurementId: "G-0B2Q9SKZDE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
