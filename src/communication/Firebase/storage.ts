
import storageService from '../../services/firebase.service.storage';

export const getImageUrl = async (urlPath: string) : Promise<string> => {
    return await storageService.getDownloadUrl(urlPath);
}