import dotenv from 'dotenv';
import { getAuth } from "firebase/auth";
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

dotenv.config();

var firebaseConfig : FirebaseOptions = {};

const getFirebaseConfig = async () => {
    const res = await fetch('/api/firebase');
    return await res.json();
};

async function initializeFirebase() {
    const firebaseConfig = await getFirebaseConfig();
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    if (process.env.EMULATOR === 'true') {
        connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    return { app, db, auth };
}

export const useFirebase = async () => await initializeFirebase();