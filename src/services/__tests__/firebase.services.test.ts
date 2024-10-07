import { getFirestore } from "firebase/firestore";
import {app, auth} from '../../config/firebase.config';
import Api from '../../services/firebase.services';
import { UserType } from "@/types/UserType";

describe('Testing firebase services', () => {

    let user : UserType;

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
        let result = await Api.addUser(user);
        expect(result).toBeTruthy();
    });
});