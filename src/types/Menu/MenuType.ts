import { ChatUserItem } from "../Chat/ChatType"
import { UserType } from "../User/UserType"

export type MainMenuProps = {
    userState: {
        state: UserType,
        setState: (user: UserType | null) => void
    },
    showGeneralOptionsState: {
        state: boolean | null,
        setState: (state: boolean | null) => void
    }
    onClickChatListItem: (chatUserItem: ChatUserItem) => void,
    activeChatId: string | null
}

export type ClosedMenuProps = {
    handleOpenMenu: () => void
}