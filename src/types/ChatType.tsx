import { Timestamp } from "firebase/firestore"

export type ChatItem = {
    chatId: string,
    title: string,
    image: string,
    lastMessageDate: Timestamp,
    lastMessage: string
}