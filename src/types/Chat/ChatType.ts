import { Timestamp } from "firebase/firestore"
import { UsersIdType, UserType } from "../User/UserType"
import { MessageItemType } from "../Chat/MessageType"
import { OptionsStateType } from "../Options/OptionsStateType"
import { ReactNode } from "react"

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

export type ChatListItemProps = {
    onClick: () => void,
    chatItem: ChatUserItem
}

export type ChatWindowProps = {
    user: UserType,
    setViewPerfil: (viewPerfil: boolean) => void
    stateOption: OptionsStateType,
}

export type ActiveChatContextType = {
    activeChat: ChatUserItem | null;
    setActiveChat: (chat: ChatUserItem | null) => void
}

export type ActiveChatContextProps = {
    activeChat: ChatUserItem | null;
    setActiveChat: (chat: ChatUserItem | null) => void,
    children: ReactNode
}