import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Api from '../../services/firebase.services';
import { UserType } from "../../types/UserType";
import { app } from '../../config/firebase.config';

describe('Testing firebase services', () => {

    let user : UserType;
    const db = getFirestore(app);

    beforeAll(() => {
       user = {
        id: '1',
        displayName: 'Lucas',
        message: 'oi',
        photoURL: 'teste.img',
        codeDataBase: '123456'
       };
    });

    it('should create a new user', async () => {
        let result;
        const q = query(collection(db, "users"), where("uid", "==", user.id));
        const docSnap = await getDocs(q);
        if (docSnap.docs.length == 0) {
            const docRef = await addDoc(collection(db, 'users'), {
                uid: user.id,
                name: user.displayName,
                photoUrl: user.photoURL
            });

            user.codeDataBase = docRef.id;
            result = true;
        } else {
            user.codeDataBase = docSnap.docs[0].id;
            result = false;
        }

        expect(result).toBeTruthy();
    });
});