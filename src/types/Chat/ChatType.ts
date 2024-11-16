import { Timestamp } from "firebase/firestore"
import { UsersIdType, UserType } from "../User/UserType"
import { MessageItemType } from "../Chat/MessageType"
import { OptionsStateType } from "../Options/OptionsStateType"

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
    active: boolean,
    chatItem: ChatUserItem
}

export type ChatWindowProps = {
    user: UserType,
    activeChat: ChatUserItem,
    setViewPerfil: (viewPerfil: boolean) => void
    stateOption: OptionsStateType,
}

export type ActiveChatContextType = {
    chat: ChatUserItem | null;
    setChat: (chat: ChatUserItem | null) => void
}