import { UserType } from '../User/UserType';

export type NewChatProps = {
    //user: UserType,
    listUsers: UserType[],
    //setListUsers: (listUsers: UserType[]) => void,
    show: boolean,
    setShow: (showNewChat: boolean) => void,
    //setListenerUsers: (listenerUsers: boolean) => void,
    addNewChat: (otherUser : UserType) => void
}