import { auth } from "@/config/firebase.config";
import { getAuth, getRedirectResult, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export default {
    githubPopup: async () => {
        const provider = new GithubAuthProvider();

        const result = await signInWithPopup(auth, provider);
        if (result) {
            const credential = GithubAuthProvider.credentialFromResult(result);
            if (credential) {
                const token = credential.accessToken;
                const user = result.user;
                return {
                    ...user,
                    token,
                    credential
                };
            }
        }
    },
    signOut: async () => {
        const auth = getAuth();
        return await signOut(auth).then(() => {
            return true;
        }).catch((error : Error) => {
            alert('Ocorreu um erro ao sair!: ' + error.message);
            return false;
        });
    },
    syncronizeUser: async () => {
        return await getRedirectResult(getAuth());
    },
}