import { UserType } from "./UserType"

export type PerfilType = {
    user: UserType,
    setViewPerfil: (viewPerfil: boolean) => void
}

export type PerfilProps = {
    show: boolean, 
    setShow: (show: boolean) => void,
    user: UserType,
    setUser: (user: UserType) => void
}