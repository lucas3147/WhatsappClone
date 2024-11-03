import { Timestamp } from "firebase/firestore"
import { UserType } from "../User/UserType";

export type MessageItemType = {
    author: string,
    body: string,
    date: Timestamp,
    type: string
}

export type MessageItemProps = {
    data: MessageItemType;
    user: UserType
}