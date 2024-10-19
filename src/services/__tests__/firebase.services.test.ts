import apiFirebase from '../firebase.service.firestore';
import { UsersIdType, UserType } from "../../types/User/UserType";
import { generateId } from '../../library/resources';
import { ChatUserItem } from '@/types/Chat/ChatType';
import { MessageItemType } from '@/types/Chat/MessageType';
import { Timestamp } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';

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
        let userChanged = await apiFirebase.getUser(user.id) as UserType;

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
        let body = 'oi, enviando mensagem de teste 23';
        let users = [user.id, otherUser.id];
        let chatList : ChatUserItem[]

        chatList = await apiFirebase.getChatsUser(user.id);

        let message : MessageItemType = { 
            author: user.id, 
            body, 
            date: Timestamp.fromDate(new Date()), 
            type: 'text'
        };

        await apiFirebase.sendMessage(chatList[0].chatId, message, users);

        chatList = await apiFirebase.getChatsUser(user.id);
        expect(chatList[0].lastMessage).toBeDefined();
        expect(chatList[0].lastMessage).toBe(body);
        expect(chatList[0].lastMessageDate).toBeDefined();
        expect(chatList[0].with).toBe(otherUser.id);
    });

    it('should verify on list contacts', async () => {
        let contacts = await apiFirebase.getContactsIncluded(user.id);
        
        expect(contacts.length).toBeGreaterThan(0);
        expect(contacts).toContain(user.id);
        expect(contacts).toContain(otherUser.id);
    });

    it.skip('should delete the conversation', async () => {
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