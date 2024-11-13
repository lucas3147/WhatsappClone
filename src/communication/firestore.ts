
import { UsersIdType, UserType } from '@/types/User/UserType';
import { ChatMessagesItem, ChatUserItem } from '@/types/Chat/ChatType';
import { MessageItemType } from '@/types/Chat/MessageType';
import firestoreService from '../services/firebase.service.firestore';
import { arrayUnion } from 'firebase/firestore';

export const addUser =  async (user : UserType) => {
    const docRef = await firestoreService.getRef('users', user.id);

    const userData = {
        name: user.displayName,
        photoUrl: user.photoURL
    }

    try { 
        await firestoreService.setDoc(docRef, userData);
        return true;
    } catch (error) {
        return false;
    }
};

export const getUser= async (userId : string) : Promise<UserType | undefined> => {
    const docSnap = await firestoreService.getDocRef('users', userId);
    let user : UserType | undefined;

    if (docSnap.exists()) {
        let data = docSnap.data();

        user = {
            id: userId,
            photoURL: data.photoUrl,
            displayName: data.name,
            note: data.note
        }
    }

    return user;
};

export const updateUser= async (user : UserType) => {
    await firestoreService.updateDocRef('users', user.id, {
        name: user.displayName,
        photoUrl: user.photoURL,
        note: user.note
    });

    const usersSnap = await firestoreService.getDocsRef('users');
    let chatsOfUser : ChatUserItem[] = [];
    if (usersSnap){
        usersSnap.forEach(async (docRef) => {
            if (docRef.id !== user.id) {
                let otherUser = docRef.data();
                if (otherUser.chats){
                    chatsOfUser = [];

                    otherUser.chats.forEach((chat : ChatUserItem) => {
                        if (chat.with == user.id) 
                        {
                            chatsOfUser.push({
                                ...chat,
                                title: user.displayName as string
                            });
                        } else {
                            chatsOfUser.push({
                                ...chat
                            });
                        }
                    });

                    await firestoreService.updateDocRef('users', docRef.id, {
                        chats: chatsOfUser
                    });
                }
            }
        });
    }
};

export const getUsersToConnect= async (userId: string): Promise<UserType[]> => {
    let usersToConnect: UserType[] = [];

    const userSnap = await firestoreService.getDocRef('users', userId);

    if (userSnap.exists()) {
        const myChats : ChatUserItem[] = userSnap.data().chats;
        const myChatsId = (myChats ?? []).map(chat => chat.with);
        const usersSnap = await firestoreService.getDocsRef('users');

        usersSnap.forEach((doc) => {
            if (doc.id === userId || myChatsId.includes(doc.id)) return;

            usersToConnect.push({
                id: doc.id,
                photoURL: doc.data().photoUrl,
                displayName: doc.data().name,
                note: doc.data().note
            });
        });
    }
    return usersToConnect;
};

export const addNewChat= async (user : UserType, otherUser : UserType) => {
    const docSnapshot = await firestoreService.getDocsQuery('chats', 'users', 'array-contains', user.id);
    let data = true;
    data = docSnapshot.docs.some(d => d.data().users[0] == otherUser.id || d.data().users[1] == otherUser.id);
    if (data == false) {
        let newChat = await firestoreService.addDoc('chats', {
            messages: [],
            users: [user.id, otherUser.id]
        });

        await firestoreService.updateDocRef('users', user.id, {
            chats: arrayUnion({
                chatId: newChat.id,
                title: otherUser.displayName,
                image: otherUser.photoURL,
                with: otherUser.id
            })
        });

        await firestoreService.updateDocRef('users', otherUser.id, {
            chats: arrayUnion({
                chatId: newChat.id,
                title: otherUser.displayName,
                image: otherUser.photoURL,
                with: otherUser.id
            })
        });
    }
};

export const onChatList= async (userId : string, submit : (chat : ChatUserItem[]) => void) => {
    return firestoreService.onSnapShot('users', userId, (doc) => {
        if (doc.exists()) {
            if (doc.data().chats) 
                submit(doc.data().chats);
        }
    });
};

export const onChatContent= async (chatId : string, submit : (chatMessages : ChatMessagesItem) => void) => {
    return firestoreService.onSnapShot('chats', chatId, (doc) => {
        if (doc.exists()) submit(doc.data() as ChatMessagesItem);
    });
};

export const onUsersToConnectList= async (userId : string, submit : () => void) => {
    return firestoreService.onSnapShotCollection('chats', userId, (snapShot) => {
        snapShot.docChanges().forEach((change) => {
            if (change.type === 'added' ||
                change.type === 'removed'
            ) {
                submit();
            }
        });
    });
};

export const sendMessage= async (chatId : string, message : MessageItemType, users : UsersIdType) => {
    await firestoreService.updateDocRef('chats', chatId, {
        messages: arrayUnion({
            type: message.type,
            author: message.author,
            body: message.body,
            date: message.date.toDate()
        })
    });
    
    for(let i in users) {
        const docSnap = await firestoreService.getDocRef('users', users[i]);
        if (docSnap.exists()) {
            if (docSnap.data().chats) {
                let chats : ChatUserItem[] = [...docSnap.data().chats];

                for (let e in chats) {
                    if (chats[e].chatId == chatId) {
                        chats[e].lastMessage = message.body;
                        chats[e].lastMessageDate = message.date;
                    }
                }

                await firestoreService.updateDocRef('users', users[i], {
                    chats
                });
            }
        }
    }
};

export const deleteConversation= async (users : UsersIdType) => {
    const docSnapshot = await firestoreService.getDocsQuery('chats', 'users', '==', users);
    let chatData = docSnapshot.docs[0];
    if (chatData.id) {
        await firestoreService.updateDocRef('chats', chatData.id, {
            messages: []
        });
    }

    for(let i in users) {
        const docSnap = await firestoreService.getDocRef('users', users[i]);
        if (docSnap.exists()) {
            let user = docSnap.data();
            if (user.chats) {
                let chats = [...user.chats];

                for (let e in chats) {
                    if (chats[e].chatId == chatData.id) {
                        chats[e].lastMessage = '';
                        chats[e].lastMessageDate = '';
                    }
                }

                await firestoreService.updateDocRef('users', users[i], {
                    chats
                });
            }
        }
    }
};

export const validationUser= async (userId : string) => {
    const userSnap = await firestoreService.getDocRef('users', userId);
    if (userSnap.exists()) 
    {
        return userSnap.data().admin;
    }
    else 
    {
        return false;
    }
};

export const deleteUser= async (userId : string) => {
    try {
      await firestoreService.deleteDocRef('users', userId);
      return true;
    } catch (error) {
      return false;
    }
};

export const existUser= async (userId : string) => {
    const userSnap = await firestoreService.getDocRef('users', userId);

    if (userSnap.exists()) {
        return true; 
    } else {
        return false; 
    }
};

export const existChat= async (userId : string, otherUserId : string) : Promise<boolean> => {
    const docSnapshot = await firestoreService.getDocsQuery('chats', 'users', 'array-contains', userId);
    return docSnapshot.docs.some(d => d.data().users[0] == otherUserId || d.data().users[1] == otherUserId);
};

export const getChatsUser= async (userId : string) : Promise<any[]> => {
    const userSnap = await firestoreService.getDocRef('users', userId);

    if (userSnap.exists()) {
        return userSnap.data().chats;
    }
    else {
        return [];
    }
}