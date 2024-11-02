import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export type firebaseService = {
    app: FirebaseApp;
    db: Firestore;
    auth: Auth;
}