export const photoUrlEmpty = 'https://c0.klipartz.com/pngpicture/178/595/gratis-png-perfil-de-usuario-iconos-de-computadora-inicio-de-sesion-avatares-de-usuario.png';

export type UserType = {
    id: string,
    photoURL: string,
    note: string | undefined,
    displayName: string | null,
    password?: string,
    allowNotifications?: boolean
}

export type UsersIdType = string[];