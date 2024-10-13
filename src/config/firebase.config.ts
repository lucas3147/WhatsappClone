import dotenv from 'dotenv';
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import apiCredentials from './firebase.credentials';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

dotenv.config();

const firebaseConfig = {
    apiKey: apiCredentials.api_key,
    authDomain: apiCredentials.auth_domain,
    projectId: apiCredentials.project_id,
    storageBucket: apiCredentials.storage_bucket,
    messagingSenderId: apiCredentials.messaging_sender_id,
    appId: apiCredentials.app_id
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

if (process.env.EMULATOR === 'true') {
    connectFirestoreEmulator(db, 'localhost', 8080);
}

