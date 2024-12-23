import * as Auth from "@/services/firebase.service.auth";
import { User } from "firebase/auth";

export const githubPopup = async () => {
    let githubCredential;

    await Auth.signInWithPopupGithub((credential, user) => {
        if (credential) {
            githubCredential = {
                ...user,
                token : credential.accessToken,
                credential
            };
        }
    });

    return githubCredential;
}

export const onAuthenticateUser = async (submit : (user : User) => void) => {
    return Auth.onAuthConnected(
        (user) => {
            submit(user);
        }
    );
}

export const signOut = async () : Promise<boolean> => {
    const result = await Auth.signOutAuth();

    if (!result) {
        alert('Ocorreu um erro ao sair!');
    }

    return result
}

export const syncronizeUser = async () : Promise<boolean> => {
    const result = Auth.syncronizeUser();

    if (!result) {
        alert('Ocorreu um erro ao recarregar as informações!');
    }

    return result
}