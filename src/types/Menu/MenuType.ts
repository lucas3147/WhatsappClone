import { UserType } from "../User/UserType"

export type MainMenuProps = {
    user: UserType,
    setUser: (user: UserType | null) => void,
    setOtherUser: (otherUser: UserType) => void,
    setShowOtherPerfil: (show: boolean) => void,
    setShowUserOptions: (show: boolean | null) => void
}