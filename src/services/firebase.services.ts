import 'firebase/auth';
import 'firebase/firestore';
import { db, auth } from '../config/firebase.config';
import { GithubAuthProvider, signInWithPopup, getAuth, signOut, getRedirectResult } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, where, getDocs, doc, updateDoc, arrayUnion, deleteDoc, setDoc, getDoc } from 'firebase/firestore';

export default {
    githubPopup: async () => {
        const provider = new GithubAuthProvider();

        const result = await signInWithPopup(auth, provider);
        if (result) {
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            return {
                ...user,
                token,
                credential
            };
        }
    },
    signOut: async () => {
        const auth = getAuth();
        return await signOut(auth).then(() => {
            // Sign-out successful.
            return true;
        }).catch((error) => {
            // An error happened.
            alert('Ocorreu um erro ao sair!');
            return false;
        });
    },
    addUser: async (user) => {
        const q = query(collection(db, "users"), where("uid", "==", user.id));
        const docSnap = await getDocs(q);
        if (docSnap.docs.length == 0) {
            const docRef = await addDoc(collection(db, 'users'), {
                uid: user.id,
                name: user.displayName,
                photoUrl: user.photoURL
            });

            user.codeDataBase = docRef.id;
            return true;
        } else {
            user.codeDataBase = docSnap.docs[0].id;
            return false;
        }
    },
    getUser: async (userId) => {
        const docSnap = await getDoc(doc(db, "users", userId));
        let user;

        if (docSnap.exists()) {
            let data = docSnap.data();

            user = {
                id: data.uid,
                photoURL: data.photoUrl,
                displayName: data.name,
                codeDataBase: userId,
                message: data.message
            }
        }

        return user;
    },
    updateUser: async (user) => {
        await updateDoc(doc(db, 'users', user.id), {
            uid: user.id,
            name: user.displayName,
            photoUrl: user.photoURL,
            message: user.message
        });

        const q = query(collection(db, "users"), where("uid", "!=", user.id));
        const querySnapshot = await getDocs(q);
        let listChatsOfUser = [];
        if (querySnapshot){
            querySnapshot.forEach(async (docRef) => {
                if (docRef.data().chats){
                    listChatsOfUser = [];

                    docRef.data().chats.forEach((chat) => {

                        if (chat.with == user.id) 
                        {
                            listChatsOfUser.push({
                                ...chat,
                                title: user.displayName,
                                message: user.message
                            });
                        } else {
                            listChatsOfUser.push({
                                ...chat
                            });
                        }
                    });

                    await updateDoc(doc(db, 'users', docRef.id), {
                        chats: listChatsOfUser
                    });
                }
            });
        }
    },
    getContactList: async (myContactsIncluded) => {
        let list = [];
        const usersRef = collection(db, "users");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (myContactsIncluded.some(c => c == doc.data().uid) == false) 
            {
                list.push({
                    id: doc.data().uid,
                    photoURL: doc.data().photoUrl,
                    displayName: doc.data().name,
                    codeDataBase: doc.id
                });
            }
        });

        return list;
    },
    addNewChat: async (user, otherUser) => {
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
    onChatList: async (userId) => {
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (userSnap.exists()) {
            let data = userSnap.data();
            if (data.chats) {
                let chats = [...data.chats];

                chats.sort((a,b) => {
                    if (a.lastMessageDate === undefined) {
                        return -1;
                    }
                    if (b.lastMessageDate === undefined) {
                        return -1;
                    }
                    if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                        return 1;
                    } else {
                        return -1;
                    }
                })

                return chats;
            }
        }
    },
    onChatContent: async (chatId) => {
        const snapChat = await getDoc(doc(db, 'chats', chatId));
        if (snapChat.exists()) {
            return snapChat.data();
        }
    },
    sendMessage: async (chatData, userId, type, body, users) => {
        let now = new Date();
        let chatsRef = doc(db, 'chats', chatData.chatId);
        let usersRef = collection(db, "users");
    
        await updateDoc(chatsRef, {
            messages: arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        });
        
        for(let i in users) {
            const docSnap = await getDoc(doc(db, "users", users[i]));
            if (docSnap.data().chats) {
                let chats = [...docSnap.data().chats];

                for (let e in chats) {
                    if (chats[e].chatId == chatData.chatId) {
                        chats[e].lastMessage = body;
                        chats[e].lastMessageDate = now;
                    }
                }

                await updateDoc(doc(db, 'users', users[i]), {
                    chats
                });
            }
        }
    },
    getContactsIncluded: async (myUserId) => {
        let list = [];
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("users", "array-contains", myUserId));
        const docSnapshot = await getDocs(q);
        docSnapshot.forEach((doc) => {
            list.push(doc.data().users[0]);
            list.push(doc.data().users[1]);
        });
        if(list.length == 0){
            list.push(myUserId);
        }
        return list;
    },
    deleteConversation: async (users) => {
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
    },
    validationUser: async (userId) => {
        const userRef = doc(db, "users", userId); 
        const userSnap = await getDoc(userRef);
        let user = userSnap.data();
        if (user.admin) {
            return true;
        } else {
            return false
        }
    },
    syncronizeUser: async () => {
        return await getRedirectResult(getAuth());
    },
    deleteUser: async (userId) => {
        try {
          await deleteDoc(doc(db, 'users', userId));
          return true;
        } catch (error) {
          return false;
        }
    },
    setUser: async (user) => {

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
    existUser: async (userId) => {
        const userRef = doc(db, "users", userId); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return true; 
        } else {
            return false; 
        }
    },
    existChat: async (userId, otherUserId) : Promise<boolean> => {
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("users", "array-contains", userId));
        const docSnapshot = await getDocs(q);
        return docSnapshot.docs.some(d => d.data().users[0] == otherUserId || d.data().users[1] == otherUserId);
    }
};