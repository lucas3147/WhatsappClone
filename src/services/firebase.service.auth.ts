import { useFirebase } from "@/config/firebase.config";
import { getAuth, getRedirectResult, GithubAuthProvider, OAuthCredential, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";

export const getAuthFirebase = async () => {
    return (await useFirebase()).auth;
}

export const getGithubAuthProvider = () => {
    return new GithubAuthProvider();
}

export const onAuthConnected = async (doWhenAuthorized : (user: User ) => void, doWhenNotAuthorized? : () => void) => {
    return onAuthStateChanged(await getAuthFirebase(), (user) => {
        if (user) {
            doWhenAuthorized(user);
        }
        else{
            if (doWhenNotAuthorized) 
                doWhenNotAuthorized();
        }
    });
}

export const signInWithPopupGithub = async (submit : (credential: OAuthCredential, user: User) => void) => {
    const provider = new GithubAuthProvider();
    const auth = await getAuthFirebase();
    const result = await signInWithPopup(auth, provider);
    if (result) {
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential) {
            submit(credential, result.user);
        }
    }
}

export const signOutAuth = async () : Promise<boolean> => {
    try{
        await signOut(getAuth());
        return true;
    }
    catch(e) {
        return false;
    }
}

export const syncronizeUser = async () : Promise<boolean> => {
    try{
        await getRedirectResult(getAuth());
        return true;
    }
    catch(e) {
        return false;
    }
}