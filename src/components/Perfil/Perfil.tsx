import { UserType } from "@/types/User/UserType";
import IconItem from "../Icons/IconItem";
import { ChangeEvent, useState } from "react";
import * as Auth from "@/communication/firebase/authorization";
import * as Firestore from "@/communication/firebase/firestore";
import { PerfilProps } from "@/types/User/PerfilType";

const Perfil = ({show , setShow, user, setUser}: PerfilProps) => {
    let nameUser = user.displayName ?? '';
    let noteUser = user.note ?? '';

    const [showConfirm, setShowConfirm] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [displayName, setDisplayName] = useState(nameUser);
    const [note, setNote] = useState(noteUser);

    const handleUpdateName = async () => {
        if (displayName !== '' && displayName !== user.displayName) {
            setShowConfirm(false);
            let newUser : UserType = {
                ...user, 
                displayName
            }
            await Firestore.updateUser(newUser);
            setUser(newUser);
        }
    }

    const handleDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
        if (showConfirm) {
            setDisplayName(e.target.value);
        }
    }

    const handleUpdateNote = async () => {
        if (note !== '' && note !== user.note) {
            setShowConfirm(false);
            let newUser : UserType = {
                ...user, 
                note
            }
            await Firestore.updateUser(newUser);
            setUser(newUser);
        }
    }

    const handleDisplayNote = (e: ChangeEvent<HTMLInputElement>) => {
        if (showNote) {
            setNote(e.target.value);
        }
    }

    const handleSynchronizeUser = async () => {
        const user = await Auth.syncronizeUser();
        if (user) {
        }
    }

    const handleClose = () => {
        setShowNote(false);
        setShowConfirm(false);
        setShow(false);
    }

    return (
        <div
            className={`transition-all duration-500 w-full bg-[white] flex flex-col border-r-[1px] border-[#DDD] verticalFlap absolute top-0 bottom-0 left-0 ${show ? 'openFlap translate-x-0' : 'closeFlap translate-x-[-100%]'}`}>
            <div
                className="flex bg-[#008069] items-center px-4 pb-4 pt-[60px]">

                <div onClick={handleClose}>
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
                className="my-[28px] w-full ">
                <div
                    className="relative w-[200px] h-[200px] m-[auto]">
                    <img
                        src={user.photoURL ? user.photoURL : 'https://c0.klipartz.com/pngpicture/178/595/gratis-png-perfil-de-usuario-iconos-de-computadora-inicio-de-sesion-avatares-de-usuario.png'}
                        alt="Foto do perfil"
                        className="rounded-[50%]"
                    />
                    <div
                        onClick={handleSynchronizeUser}
                        className="absolute right-[15px] bottom-0">
                        <IconItem
                            type="AutorenewIcon"
                            style={{ color: '#8696A0', width: '30px', height: '30px', marginBottom: '10px', backgroundColor: 'white', borderRadius: '50%' }}
                            className="iconTheme"
                        />
                    </div>
                </div>
            </div>
            <div
                className="grid grid-rows-2 gap-y-16 w-full px-[30px] pt-[14px] pb-[10px]"
            >
                <div>
                    <p className="mb-[14px] text-[#008069] text-[14px] flex">Seu nome</p>
                    <div
                        className={`w-full h-[34px] flex ${showConfirm ? 'border-b-2 border-b-[#667781]' : 'border-b-0'}`}
                    >
                        <input
                            className="flex-1 inline text-[#3B4A54] text-[16px] border-0 outline-none" 
                            type="text" 
                            name=""
                            value={displayName}
                            onChange={(e) => handleDisplayName(e)}
                        />
                        <div onClick={() => setShowConfirm(!showConfirm)}>
                            {!showConfirm && 
                                <IconItem
                                    className="iconTheme"
                                    type="EditIcon"
                                    style={{ color: '#8696A0', marginBottom: '10px' }}
                                />
                            }
                            {showConfirm && 
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
                <div>
                    <p className="mb-[14px] text-[#008069] text-[14px] flex">Recado</p>
                    <div className="w-full h-[34px] flex" style={{borderBottom: showNote ? '2px solid #667781' : 'none'}}>
                        <input
                            className="flex-1 inline text-[#3B4A54] text-[16px] border-0 outline-none" 
                            type="text" 
                            name=""
                            value={note}
                            onChange={(e) => handleDisplayNote(e)}
                        />
                        <div onClick={() => setShowNote(!showNote)}>
                            {!showNote && 
                                <IconItem
                                    className="iconTheme"
                                    type="EditIcon"
                                    style={{ color: '#8696A0', marginBottom: '10px' }}
                                />
                            }
                            {showNote && 
                                <div onClick={handleUpdateNote}>
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
        </div>
    )
}

export default Perfil;