import 'firebase/auth';
import 'firebase/firestore';
import { collection, addDoc, onSnapshot, query, where, getDocs, doc, updateDoc, arrayUnion, deleteDoc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { UsersIdType, UserType } from '@/types/User/UserType';
import { ChatMessagesItem, ChatUserItem } from '@/types/Chat/ChatType';
import { MessageItemType } from '@/types/Chat/MessageType';
import { useFirebase } from '@/config/firebase.config';
import { Unsubscribe } from 'firebase/auth';

export default {
    addUser: async (user : UserType) => {
        const db = (await useFirebase()).db;
        const docRef = doc(db, "users", user.id);

        const userData = {
            name: user.displayName,
            photoUrl: user.photoURL
        };

        try { 
            await setDoc(docRef, userData);
            return true;
        } catch (error) {
            return false;
        }
    },
    getUser: async (userId : string) : Promise<UserType | undefined> => {
        const db = (await useFirebase()).db;
        const docSnap = await getDoc(doc(db, "users", userId));
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
    },
    updateUser: async (user : UserType) => {
        const db = (await useFirebase()).db;
        await updateDoc(doc(db, 'users', user.id), {
            name: user.displayName,
            photoUrl: user.photoURL,
            note: user.note
        });

        const otherUsersSnap = await getDocs(collection(db, "users"));
        let chatsOfUser : ChatUserItem[] = [];
        if (otherUsersSnap){
            otherUsersSnap.forEach(async (docRef) => {
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
    
                        await updateDoc(doc(db, 'users', docRef.id), {
                            chats: chatsOfUser
                        });
                    }
                }
            });
        }
    },
    getContactList: async (myContactsIncluded : string[]) => {
        let list : UserType[] = [];
        const db = (await useFirebase()).db;
        const usersRef = collection(db, "users");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (myContactsIncluded.some(c => c == doc.id) == false) 
            {
                list.push({
                    id: doc.id,
                    photoURL: doc.data().photoUrl,
                    displayName: doc.data().name,
                    note: doc.data().note
                });
            }
        });

        return list;
    },
    addNewChat: async (user : UserType, otherUser : UserType) => {
        const db = (await useFirebase()).db;
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("users", "array-contains", user.id));
        const docSnapshot = await getDocs(q);
        let data = true;
        data = docSnapshot.docs.some(d => d.data().users[0] == otherUser.id || d.data().users[1] == otherUser.id);
        if (data == false) {
            let newChat = await addDoc(collection(db, 'chats'), {
                messages: [],
                users: [user.id, otherUser.id]
            });

            let docRef = doc(db, 'users', user.id);

            await updateDoc(docRef, {
                chats: arrayUnion({
                    chatId: newChat.id,
                    title: otherUser.displayName,
                    image: otherUser.photoURL,
                    with: otherUser.id
                })
            });

            docRef = doc(db, 'users', otherUser.id);

            await updateDoc(docRef, {
                chats: arrayUnion({
                    chatId: newChat.id,
                    title: user.displayName,
                    image: user.photoURL,
                    with: user.id
                })
            });
        }
    },
    onChatList: async (userId : string, submit : (chat : ChatUserItem[]) => void) => {
        const db = (await useFirebase()).db;

        return onSnapshot(doc(db, 'users', userId), (doc) => {
            if (doc.exists()) {
                if (doc.data().chats) 
                    submit(doc.data().chats);
            }
        });
    },
    onChatContent: async (chatId : string, submit : (chatMessages : ChatMessagesItem) => void) => {
        const db = (await useFirebase()).db;

        return onSnapshot(doc(db, 'chats', chatId), (doc) => {
            if (doc.exists()) submit(doc.data() as ChatMessagesItem);
        });
    },
    sendMessage: async (chatId : string, message : MessageItemType, users : UsersIdType) => {
        const db = (await useFirebase()).db;
        let chatsRef = doc(db, 'chats', chatId);
    
        await updateDoc(chatsRef, {
            messages: arrayUnion({
                type: message.type,
                author: message.author,
                body: message.body,
                date: message.date.toDate()
            })
        });
        
        for(let i in users) {
            const docSnap = await getDoc(doc(db, "users", users[i]));
            if (docSnap.exists()) {
                if (docSnap.data().chats) {
                    let chats : ChatUserItem[] = [...docSnap.data().chats];
    
                    for (let e in chats) {
                        if (chats[e].chatId == chatId) {
                            chats[e].lastMessage = message.body;
                            chats[e].lastMessageDate = message.date;
                        }
                    }
    
                    await updateDoc(doc(db, 'users', users[i]), {
                        chats
                    });
                }
            }
        }
    },
    getContactsIncluded: async (userId : string) => {
        let list = [];
        const db = (await useFirebase()).db;
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("users", "array-contains", userId));
        const docSnapshot = await getDocs(q);
        docSnapshot.forEach((doc) => {
            list.push(doc.data().users[0]);
            list.push(doc.data().users[1]);
        });
        if(list.length == 0){
            list.push(userId);
        }
        return list;
    },
    deleteConversation: async (users : UsersIdType) => {
        const db = (await useFirebase()).db;
        const chatsRef = collection(db, "chats");
        let q = query(chatsRef, where("users", "==", users));
        let docSnapshot = await getDocs(q);
        let chatData = docSnapshot.docs[0];
        if (chatData.id) {
            await updateDoc(doc(db, 'chats', chatData.id), {
                messages: []
            });
        }

        for(let i in users) {
            const docSnap = await getDoc(doc(db, "users", users[i]));
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
    
                    await updateDoc(doc(db, "users", users[i]), {
                        chats
                    });
                }
            }
        }
    },
    validationUser: async (userId : string) => {
        const db = (await useFirebase()).db;
        const userRef = doc(db, "users", userId); 
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) 
        {
            return userSnap.data().admin;
        }
        else 
        {
            return false;
        }
    },
    deleteUser: async (userId : string) => {
        try {
          const db = (await useFirebase()).db;
          await deleteDoc(doc(db, 'users', userId));
          return true;
        } catch (error) {
          return false;
        }
    },
    existUser: async (userId : string) => {
        const db = (await useFirebase()).db;
        const userRef = doc(db, "users", userId); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return true; 
        } else {
            return false; 
        }
    },
    existChat: async (userId : string, otherUserId : string) : Promise<boolean> => {
        const db = (await useFirebase()).db;
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("users", "array-contains", userId));
        const docSnapshot = await getDocs(q);
        return docSnapshot.docs.some(d => d.data().users[0] == otherUserId || d.data().users[1] == otherUserId);
    },
    getChatsUser: async (userId : string) : Promise<any[]> => {
        const db = (await useFirebase()).db;
        const userRef = doc(db, "users", userId); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().chats;
        }
        else {
            return [];
        }
    }
};