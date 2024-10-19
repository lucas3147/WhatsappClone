import { Timestamp } from "firebase/firestore"
import { UsersIdType } from "../User/UserType"
import { MessageItemType } from "../Chat/MessageType"

export type ChatUserItem = {
    chatId: string,
    title: string,
    image: string,
    lastMessageDate: Timestamp,
    lastMessage: string,
    with: string
}

export type ChatMessagesItem = {
    messages : MessageItemType[],
    users : UsersIdType,
}