import { UserType } from "@/types/UserType";
import IconItem from "./IconItem";
import { ChangeEvent, useState } from "react";
import Api from "@/Api";

type Props = {
    show: boolean, 
    setShow: (show: boolean) => void,
    user: UserType,
    setUser: (user: UserType) => void
}

const Perfil = ({show , setShow, user, setUser}: Props) => {
    let nameUser = user.displayName ? user.displayName : '';

    const [showNameConfirm, setShowNameConfirm] = useState(false);
    const [name, setName] = useState(nameUser);

    const handleUpdateName = async () => {
        if (name !== '') {
            setShowNameConfirm(false);
            let newUser = {...user, displayName: name}
            await Api.updateUser(newUser);
            setUser(newUser);
        }
    }

    const handleDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
        if (showNameConfirm) {
            setName(e.target.value);
        }
    }

    return (
        <div
            className={`verticalFlap ${show ? 'openFlap' : 'closeFlap'} transition-all duration-500 w-[35%] max-w-[415px] absolute top-0 bottom-0 bg-[white] flex flex-col border-r-[1px] border-[#DDD]`}
        >
            <div
                className="flex bg-[#008069] items-center px-4 pb-4 pt-[60px]">

                <div onClick={() => setShow(false)}>
                    <IconItem
                        className="iconTheme"
                        type="ArrowBackIcon"
                        style={{ color: '#FFF' }}
                    />
                </div>

                <div 
                    className="text-[19px] leading-10 h-10 flex-1 font-bold text-white ml-5"
                >
                    Perfil
                </div>
            </div>
            
            <div 
                className="my-[28px] w-full">
                <img 
                    src={user.photoURL ? user.photoURL : 'https://c0.klipartz.com/pngpicture/178/595/gratis-png-perfil-de-usuario-iconos-de-computadora-inicio-de-sesion-avatares-de-usuario.png'} 
                    alt="Foto do perfil" 
                    className="w-[200px] h-[200px] m-[auto] rounded-[50%]"
                />
            </div>
            <div
                className="w-full px-[30px] pt-[14px] pb-[10px]"
            >
                <p className="mb-[14px] text-[#008069] text-[14px]">Seu nome</p>
                <div
                    className="w-full h-[34px] flex" style={{borderBottom: showNameConfirm ? '2px solid #667781' : 'none'}}
                >
                    <input
                        className="flex-1 inline text-[#3B4A54] text-[16px] border-0 outline-none" 
                        type="text" 
                        name=""
                        value={name}
                        onChange={(e) => handleDisplayName(e)}
                    />
                    <div onClick={() => setShowNameConfirm(!showNameConfirm)}>
                        {!showNameConfirm && 
                            <IconItem
                                className="iconTheme"
                                type="EditIcon"
                                style={{ color: '#8696A0', marginBottom: '10px' }}
                            />
                        }
                        {showNameConfirm && 
                            <div onClick={handleUpdateName}>
                                <IconItem
                                    className="iconTheme"
                                    type="CheckIcon"
                                    style={{ color: '#8696A0', marginBottom: '10px' }}
                                />
                            </div>
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Perfil;