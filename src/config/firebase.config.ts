import dotenv from 'dotenv';
import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import apiCredentials from './firebase.credentials';
import { getStorage } from 'firebase/storage';

dotenv.config();

let db; // Armazenar a instância do Firestore
let auth; // Armazenar a instância de Auth
let storage; // Armazenar a instância de Storage

const getFirebaseConfig = async () => {
    if (typeof window !== "undefined") {
        // Código executado no lado do cliente
        const res = await fetch('/api/firebase');
        return await res.json();
    } else {
        // Código executado no lado do servidor
        return {
            apiKey: apiCredentials.api_key,
            authDomain: apiCredentials.auth_domain,
            projectId: apiCredentials.project_id,
            storageBucket: apiCredentials.storage_bucket,
            messagingSenderId: apiCredentials.messaging_sender_id,
            appId: apiCredentials.app_id,
        };
    }
};

async function initializeFirebase() {
    
    if (!getApps().length) // Verifica se já existe um app Firebase inicializado
    { 
        const firebaseConfig = await getFirebaseConfig();
        const app = initializeApp(firebaseConfig);
        
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);

        if (process.env.EMULATOR === 'true') {
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
    } 
    else // Se o Firebase já estiver inicializado, obtenha a instância existente
    {
        db = getFirestore(getApp());
        auth = getAuth(getApp());
        storage = getStorage(getApp());
    }

    return { db, auth, storage };
}

export const useFirebase = async () => {
    return await initializeFirebase();
};
