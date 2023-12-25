import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAT6JkaKxzQB-AmY29Fvuq-wjM9IBLUxmw",
    authDomain: "whatsappclone-lucas-souza.firebaseapp.com",
    projectId: "whatsappclone-lucas-souza",
    storageBucket: "whatsappclone-lucas-souza.appspot.com",
    messagingSenderId: "758949761775",
    appId: "1:758949761775:web:5e1199f0c34064c744011a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
