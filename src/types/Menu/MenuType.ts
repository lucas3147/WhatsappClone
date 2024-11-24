import { ReactNode } from "react"
import { ChatUserItem } from "../Chat/ChatType"
import { UserType } from "../User/UserType"

export type MainMenuProps = {
    userState: {
        state: UserType,
        setState: (user: UserType | null) => void
    }
    onClickChatListItem: (chatUserItem: ChatUserItem) => void
}

export type ClosedMenuProps = {
    handleOpenMenu: () => void
}

export type ScaleMenuProps = {
    isOpenMainMenu: boolean,
    userState: {
        state: UserType,
        setState: (user: UserType | null) => void
    },
    handleOpenClosedMenu: () => void,
    handleClickChatItem: (chatUserItem: ChatUserItem) => void
}