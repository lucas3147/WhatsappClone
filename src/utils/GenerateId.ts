import { v4 as uuidv4 } from 'uuid';

export const generateId = () : string => {
    return uuidv4()
      .replace(/-/g, "")
      .substring(0, 21);
}

export const setUuidOnSessionStorage = () => {
    let uuid = getUuidOnSessionStorage();

    if (!uuid) {
        uuid = generateId(); 
        sessionStorage.setItem('uuid', uuid); 
    }

    return uuid;
}

export const getUuidOnSessionStorage = () : string | null => {
    return sessionStorage.getItem('uuid');
}