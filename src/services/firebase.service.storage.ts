import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useFirebase } from '../config/firebase.config';

const getRef = async (urlPath: string) => {
    return ref((await useFirebase()).storage, urlPath);
}

export default {
    getDownloadUrl: async (urlPath: string) : Promise<string> => {
        const storageRef = await getRef(urlPath);
        return await getDownloadURL(storageRef);
    },
    uploadImage: async (file: File) : Promise<string> => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }
}  