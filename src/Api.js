import 'firebase/auth';
import 'firebase/firestore';
import {app, auth} from './firebase.config';
import { GithubAuthProvider, signInWithPopup, getAuth, updateCurrentUser } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc, deleteField } from 'firebase/firestore';

const db = getFirestore(app);

export default {
    githubPopup: async () => {
        const provider = new GithubAuthProvider();

        return await signInWithPopup(auth, provider)
                                .then((result) => {
                                    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                                    const credential = GithubAuthProvider.credentialFromResult(result);
                                    const token = credential.accessToken;

                                    // The signed-in user info.
                                    const user = result.user;
                                    // IdP data available using getAdditionalUserInfo(result)
                                    return user;
                                }).catch((error) => {
                                    // Handle Errors here.
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    // The email of the user's account used.
                                    const email = error.customData.email;
                                    // The AuthCredential type that was used.
                                    const credential = GithubAuthProvider.credentialFromError(error);
                                    // ...
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
    getUser: async (myUserId) => {
        const q = query(collection(db, "users"), where("uid", "==", myUserId));
        const docSnap = await getDocs(q);
        let data = docSnap.docs[0].data();

        return {
            id: data.uid,
            photoURL: data.photoUrl,
            displayName: data.name,
            codeDataBase: docSnap.docs[0].id
        }
    },
    updateUser: async (user) => {
        await updateDoc(doc(db, 'users', user.codeDataBase), {
            uid: user.id,
            name: user.displayName,
            photoUrl: user.photoURL
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
        const q = query(usersRef, where("uid", "not-in", myContactsIncluded));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push({
                id: doc.data().uid,
                photoURL: doc.data().photoUrl,
                displayName: doc.data().name,
                codeDataBase: doc.id
            });
        });

        return list;
    },
    addNewChat: async (user, otherUser) => {
        const usersRef = collection(db, "chats");
        const q = query(usersRef, where("users", "array-contains", user.id));
        const docSnapshot = await getDocs(q);
        let data = true;
        data = docSnapshot.docs.some(d => d.data().users[0] == otherUser.id || d.data().users[1] == otherUser.id);
        if (data == false) {
            let newChat = await addDoc(collection(db, 'chats'), {
                messages: [],
                users: [user.id, otherUser.id]
            });

            let docRef = doc(db, 'users', user.codeDataBase);

            await updateDoc(docRef, {
                chats: arrayUnion({
                    chatId: newChat.id,
                    title: otherUser.displayName,
                    image: otherUser.photoURL,
                    with: otherUser.id
                })
            });

            docRef = doc(db, 'users', otherUser.codeDataBase);

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
    onChatList: (codeUser, setChatList) => {
        return onSnapshot(doc(db, 'users', codeUser), (doc) => {
            if (doc.exists) {
                let data = doc.data();
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

                    setChatList(chats);
                }
            }
        });
    },
    onChatContent: (chatId, setList, setUsers) => {
        return onSnapshot(doc(db, 'chats', chatId), (doc) => {
            if (doc.exists) {
                let data = doc.data();
                setList(data.messages);
                setUsers(data.users);
            }
        });
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
            const q = query(usersRef, where("uid", "==", users[i]));
            const docSnap = await getDocs(q);
            let data = docSnap.docs[0];
            if (data.data().chats) {
                let chats = [...data.data().chats];

                for (let e in chats) {
                    if (chats[e].chatId == chatData.chatId) {
                        chats[e].lastMessage = body;
                        chats[e].lastMessageDate = now;
                    }
                }

                await updateDoc(doc(db, 'users', data.id), {
                    chats
                });
            }
        }
    },
    getContactsIncluded: async (myUserId) => {
        let list = [];
        const usersRef = collection(db, "chats");
        const q = query(usersRef, where("users", "array-contains", myUserId));
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
        const listUsers = users;
        const chatsRef = collection(db, "chats");
        const usersRef = collection(db, "users");
        let q = query(chatsRef, where("users", "==", users));
        let docSnapshot = await getDocs(q);
        let chatData = docSnapshot.docs[0];
        if (chatData.id) {
            await updateDoc(doc(db, 'chats', chatData.id), {
                messages: []
            });
        }

        for(let i in users) {
            const q = query(usersRef, where("uid", "==", users[i]));
            const docSnap = await getDocs(q);
            let userData = docSnap.docs[0];
            if (userData.data().chats) {
                let chats = [...userData.data().chats];

                for (let e in chats) {
                    if (chats[e].chatId == chatData.id) {
                        chats[e].lastMessage = '';
                        chats[e].lastMessageDate = '';
                    }
                }

                await updateDoc(doc(db, 'users', userData.id), {
                    chats
                });
            }
        }
    },
    validationUser: async (idUser) => {
        if (idUser) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", idUser));
            const docSnap = await getDocs(q);
            let userData = docSnap.docs[0];
            if (userData.data().admin) {
                return true;
            } else {
                return false
            }
        } else {
            return false;
        }
    }
};