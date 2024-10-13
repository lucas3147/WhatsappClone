import apiFirebase from '../../services/firebase.services';
import { UserType } from "../../types/UserType";
import { generateId } from '../../library/resources';
import { ChatItem } from '@/types/ChatType';

describe('Testing firebase services', () => {

    let user : UserType;
    let otherUser: UserType;

    beforeAll(async () => {
        user = {
            id: generateId(),
            displayName: 'Lucas L.',
            photoURL: 'teste_2.img'
        };

        otherUser = {
            id: generateId(),
            displayName: 'Gustavo L.',
            photoURL: 'teste_2.img'
        }
    });
    
    it('should create a new user with name Lucas', async () => {
        let result = await apiFirebase.addUser(user);
        let existUser = await apiFirebase.existUser(user.id);

        expect(result).toBeTruthy();
        expect(existUser).toBeTruthy();
    });

    it('should create a new user with name Gustavo', async () => {
        let result = await apiFirebase.addUser(otherUser);
        let existUser = await apiFirebase.existUser(otherUser.id);

        expect(result).toBeTruthy();
        expect(existUser).toBeTruthy();
    });

    it('should update a user', async () => {
        user.photoURL = 'teste_3_image.png';
        await apiFirebase.updateUser(user);
        let userChanged = await apiFirebase.getUser(user.id);

        expect(userChanged.photoURL).toBe(user.photoURL);
    });

    it('should get the contact lists', async () => {
        let result = await apiFirebase.getContactList([]);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should create a new chat', async () => {
        await apiFirebase.addNewChat(user, otherUser);
        let isChatCreated = await apiFirebase.existChat(user.id, otherUser.id);

        expect(isChatCreated).toBeTruthy();
    });

    it('should grab a complete user chat list', async () => {
        let unsubscribe = apiFirebase.onChatList(user.id, (myChats) => {
            expect(myChats.length).toBeGreaterThan(0);
            expect(myChats[0].with).toBe(otherUser.id);
        });

        unsubscribe();
    });

    it('should grab the user chat content', async () => {
        let unsubscribe = apiFirebase.onChatContent(user.id, (chatContent) => {
            expect(chatContent.messages).toBeDefined();
            expect(chatContent.messages).toHaveLength(0);
            expect(chatContent.users).toContain(user.id);
            expect(chatContent.users).toContain(otherUser.id);
        });

        unsubscribe();
    });

    it('should send chat messages', async () => {
        let message = 'oi, enviando mensagem de teste';
        let users = [user.id, otherUser.id];

        let chatList = await apiFirebase.getChatsUser(user.id);

        await apiFirebase.sendMessage(chatList[0], user.id, 'text', message, users);

        let unsubscribe = apiFirebase.onChatContent(user.id, (chatContent) => {
            expect(chatContent.messages).toBeDefined();
            expect(chatContent.messages.length).toBeGreaterThan(0);
            expect(chatContent.messages[0]).toHaveProperty("body");
            expect(chatContent.messages[0].body).toBe(message);
            expect(chatContent.users).toContain(user.id);
            expect(chatContent.users).toContain(otherUser.id);
        });

        unsubscribe();
    });

    it('should verify on list contacts', async () => {
        let contacts = await apiFirebase.getContactsIncluded(user.id);
        
        expect(contacts.length).toBeGreaterThan(0);
        expect(contacts).toContain(user.id);
        expect(contacts).toContain(otherUser.id);
    });

    it('should delete the conversation', async () => {
        let users = [user.id, otherUser.id];
        await apiFirebase.deleteConversation(users);

        let unsubscribe = apiFirebase.onChatContent(user.id, (chatContent) => {
            expect(chatContent.messages).toBeDefined();
            expect(chatContent.messages).toHaveLength(0);
            expect(chatContent.messages[0]).toBeUndefined();
        });

        unsubscribe();

        unsubscribe = apiFirebase.onChatList(user.id, (chatList) => {
            expect(chatList[0].lastMessage).toHaveLength(0);
            expect(chatList[0].lastMessageDate).toHaveLength(0);
        });
        
        unsubscribe();
    });

    it('should validation a user admin', async () => {
        let isAdmin = await apiFirebase.validationUser(user.id);

        expect(isAdmin).toBeFalsy();
    });

    it.skip('should delete the created users', async () => {
        let result = await apiFirebase.deleteUser(user.id);
        let existUser = await apiFirebase.existUser(user.id);

        expect(result).toBeTruthy();
        expect(existUser).toBeFalsy();
    });
});