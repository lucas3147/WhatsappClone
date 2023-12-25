import { ChatItem } from '@/types/ChatType';
import { UserType } from './UserType';

export type Props = {
    listContacts: any[],
    setListContacts: (listContacts: any[]) => void
    user: UserType,
    show: boolean,
    setShow: (showNewChat: boolean) => void
}