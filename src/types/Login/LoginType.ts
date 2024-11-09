import { UserType } from "../User/UserType"

export type LoginProps = {
    onReceive: (userRegister: UserType) => Promise<void>
}