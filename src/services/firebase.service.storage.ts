import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useFirebase } from '../config/firebase.config';

const getRef = async (urlPath: string) => {
    return ref((await useFirebase()).storage, urlPath);
}

export default {
    getDownloadUrl: async (urlPath: string) : Promise<string> => {
        const storageRef = await getRef(urlPath);
        return await getDownloadURL(storageRef);
    }
}  