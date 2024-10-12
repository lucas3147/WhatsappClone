import apiFirebase from '../../services/firebase.services';
import { UserType } from "../../types/UserType";
import { generateId } from '../../library/resources';

describe('Testing firebase services', () => {

    let user : UserType;
    let otherUser: UserType;

    beforeAll(async () => {
        user = {
            id: generateId(),
            displayName: 'Lucas L.',
            photoURL: 'teste_2.img',
            message: ''
        };

        otherUser = {
            id: generateId(),
            displayName: 'Gustavo L.',
            photoURL: 'teste_2.img',
            message: ''
        }
    });
    
    it('should create a new user with name Lucas', async () => {
        let result = await apiFirebase.setUser(user);
        let existUser = await apiFirebase.existUser(user.id);

        expect(result).toBeTruthy();
        expect(existUser).toBeTruthy();
    });

    it('should create a new user with name Gustavo', async () => {
        let result = await apiFirebase.setUser(otherUser);
        let existUser = await apiFirebase.existUser(otherUser.id);

        expect(result).toBeTruthy();
        expect(existUser).toBeTruthy();
    });

    it('should update a user', async () => {
        user.message = 'oi, teste de mensagem!';
        await apiFirebase.updateUser(user);
        let userChanged = await apiFirebase.getUser(user.id);

        expect(userChanged.message).toBe(user.message);
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
        let chatList = await apiFirebase.onChatList(user.id);
        
        expect(chatList.length).toBeGreaterThan(0);
        expect(chatList[0].with).toBe(otherUser.id);
    });

    it('should grab the user chat content', async () => {
        let chatList = await apiFirebase.onChatList(user.id);
        let chatContent = await apiFirebase.onChatContent(chatList[0].chatId);
        
        expect(chatContent.messages).toBeDefined();
        expect(chatContent.messages).toHaveLength(0);
        expect(chatContent.users).toContain(user.id);
        expect(chatContent.users).toContain(otherUser.id);
    });

    it('should send chat messages', async () => {
        let message = 'oi, enviando mensagem de teste';
        let chatList = await apiFirebase.onChatList(user.id);
        let users = [user.id, otherUser.id];
        await apiFirebase.sendMessage(chatList[0], user.id, 'text', message, users);

        let chatContent = await apiFirebase.onChatContent(chatList[0].chatId);

        expect(chatContent.messages).toBeDefined();
        expect(chatContent.messages.length).toBeGreaterThan(0);
        expect(chatContent.messages[0]).toHaveProperty("body");
        expect(chatContent.messages[0].body).toBe(message);
        expect(chatContent.users).toContain(user.id);
        expect(chatContent.users).toContain(otherUser.id);
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

        let chatList = await apiFirebase.onChatList(user.id);
        let chatContent = await apiFirebase.onChatContent(chatList[0].chatId);

        expect(chatContent.messages).toBeDefined();
        expect(chatContent.messages).toHaveLength(0);
        expect(chatContent.messages[0]).toBeUndefined();
        expect(chatList[0].lastMessage).toHaveLength(0);
        expect(chatList[0].lastMessageDate).toHaveLength(0);
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