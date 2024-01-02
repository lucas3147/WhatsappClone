import { OAuthCredential } from "firebase/auth/cordova"

export type UserType = {
    id: string,
    photoURL: string | null,
    displayName: string | null,
    codeDataBase?: string | null,
}