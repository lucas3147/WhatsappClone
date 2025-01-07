import { UserType } from "../User/UserType"

export type VideoCallProps = {
    show: boolean,
    setShow: (show: boolean) => void,
    otherUser: UserType,
    setShowMenu: (showMenu: boolean) => void
}