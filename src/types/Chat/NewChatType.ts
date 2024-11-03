import { UserType } from '../User/UserType';

export type NewChatProps = {
    listContacts: any[],
    setListContacts: (listContacts: any[]) => void
    user: UserType,
    show: boolean,
    setShow: (showNewChat: boolean) => void
}