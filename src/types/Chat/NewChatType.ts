import { UserType } from '../User/UserType';

export type Props = {
    listContacts: any[],
    setListContacts: (listContacts: any[]) => void
    user: UserType,
    show: boolean,
    setShow: (showNewChat: boolean) => void
}