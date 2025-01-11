type photoUrlEmpty = 'https://c0.klipartz.com/pngpicture/178/595/gratis-png-perfil-de-usuario-iconos-de-computadora-inicio-de-sesion-avatares-de-usuario.png';

export type UserType = {
    id: string,
    photoURL: string | photoUrlEmpty,
    displayName: string | null,
    note: string | undefined,
    allowNotifications: boolean
}

export type UsersIdType = string[];