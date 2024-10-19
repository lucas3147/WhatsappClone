import { Timestamp } from "firebase/firestore"

export type MessageItemType = {
    author: string,
    body: string,
    date: Timestamp,
    type: string
}