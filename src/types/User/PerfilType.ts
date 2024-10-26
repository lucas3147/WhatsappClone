import { UserType } from "./UserType"

export type PerfilType = {
    user: UserType,
    setViewPerfil: (viewPerfil: boolean) => void
}