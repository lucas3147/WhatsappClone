import { UserType } from "./UserType"

export type OtherPerfilProps = {
    show: boolean, 
    setShow: (show: boolean) => void,
    user: UserType
}