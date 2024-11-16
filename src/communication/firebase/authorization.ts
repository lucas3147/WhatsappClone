import * as Auth from "@/services/firebase.service.auth";

export const githubPopup = async () => {
    let githubCredential;

    Auth.signInWithPopupGithub((credential, user) => {
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

export const signOut = async () : Promise<boolean> => {
    const result = Auth.signOutAuth();

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