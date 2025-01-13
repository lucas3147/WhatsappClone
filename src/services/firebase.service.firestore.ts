import 'firebase/auth';
import 'firebase/firestore';
import { collection, addDoc, onSnapshot, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, DocumentReference, DocumentData, WhereFilterOp, DocumentSnapshot, QuerySnapshot, QueryConstraint } from 'firebase/firestore';
import { useFirebase } from '../config/firebase.config';

const getRef = async (path: string, pathSegments: string) => {
    const db = (await useFirebase()).db;
    return doc(db, path, pathSegments);
}

const getCollectionRef = async (path: string) => {
    const db = (await useFirebase()).db;
    return collection(db, path);
}

export default {
    getRef: async (path: string, pathSegments: string) => {
        return getRef(path, pathSegments)
    },
    getCollectionRef: async (path: string) => {
        return getCollectionRef(path)
    },
    addDoc: async (path: string, data: any) => {
        const collectionRef = await getCollectionRef(path);
        return await addDoc(collectionRef, data);
    },
    setDoc: async (docRef: DocumentReference<any, DocumentData>, data: any) => {
        await setDoc(docRef, data);
    },
    getDocRef: async (path: string, pathSegments: string) => {
        const ref = await getRef(path, pathSegments);
        return await getDoc(ref);
    },
    getDocsRef: async (path: string) => {
        const collectionRef = await getCollectionRef(path);
        return await getDocs(collectionRef);
    },
    updateDocRef: async (path: string, pathSegments: string, data: any) => {
        const ref = await getRef(path, pathSegments);
        await updateDoc(ref, data);
    },
    deleteDocRef: async (path: string, pathSegments: string) => {
        const ref = await getRef(path, pathSegments);
        await deleteDoc(ref);
    },
    getDocsQuery: async (path: string, ...queryConstraints: QueryConstraint[]) => {
        const collectionRef = await getCollectionRef(path);
        const q = query(collectionRef, ...queryConstraints);
        return await getDocs(q);
    },
    onSnapShot: async (path: string, pathSegments: string, submit: (doc: DocumentSnapshot) => void) => {
        const ref = await getRef(path, pathSegments);
        return onSnapshot(ref, submit);
    },
    onSnapShotCollection: async (path: string, pathSegments: string, submit: (doc: QuerySnapshot) => void) => {
        const collectionRef = await getCollectionRef(path);
        return onSnapshot(collectionRef, submit);
    }
};