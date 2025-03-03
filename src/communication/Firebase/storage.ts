
import storageService from '../../services/firebase.service.storage';

export const getImageUrl = async (urlPath: string) : Promise<string> => {
    return await storageService.getDownloadUrl(urlPath);
}

export const uploadImage = async (file: File, fileName: string) : Promise<string> => {
    return await storageService.uploadImage(file, fileName);
}