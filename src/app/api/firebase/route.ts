import apiCredentials from "@/config/firebase.credentials";
import { FirebaseOptions } from "firebase/app";
import { NextResponse } from "next/server";

export async function GET() {
    const firebaseOptions: FirebaseOptions = {
        apiKey: apiCredentials.api_key,
        authDomain: apiCredentials.auth_domain,
        projectId: apiCredentials.project_id,
        storageBucket: apiCredentials.storage_bucket,
        messagingSenderId: apiCredentials.messaging_sender_id,
        appId: apiCredentials.app_id,
    };

    return NextResponse.json(firebaseOptions);
}
