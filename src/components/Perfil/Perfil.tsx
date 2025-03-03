import { UserType } from "@/types/User/UserType";
import IconItem from "../Icons/IconItem";
import { ChangeEvent, useState } from "react";
import * as Auth from "@/communication/Firebase/authorization";
import * as Firestore from "@/communication/Firebase/firestore";
import * as Storage from "@/communication/Firebase/storage";
import { PerfilProps } from "@/types/User/PerfilType";
import SliderCardLeftTitle from "../Sliders/SliderCardLeftTitle";
import { SliderLeftContainer } from "../StyledComponents/Containers/Slider";

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

    const handleUpdateImagePerfil = async () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (file) {
                const url = await Storage.uploadImage(file, user.id + '.jpg');
                let newUser : UserType = {
                    ...user,
                    photoURL: url
                }
                await Firestore.updateUser(newUser);
                setUser(newUser);
            }
        });
        input.click();
        input.remove();
    }

    const handleClose = () => {
        setShowNote(false);
        setShowConfirm(false);
        setShow(false);
    }

    return (
        <SliderLeftContainer
			className={show ? 'openFlap' : 'closeFlap'}
		>

            <SliderCardLeftTitle
                title='Perfil'
                handleShow={handleClose}
            />
            
            <div className="my-[28px] w-full ">
                <div className="relative w-[200px] h-[200px] m-[auto]">
                    <img
                        src={user.photoURL}
                        alt="Foto do perfil"
                        className="rounded-[50%]"
                    />
                    <div
                        onClick={handleUpdateImagePerfil}
                        className="absolute top-0 p-2 w-full h-full flex justify-center items-center flex-col transition duration-150 ease-in-out opacity-0 hover:opacity-100 bg-opacity-30 bg-black rounded-full cursor-pointer">
                        <IconItem
                            className="iconTheme"
                            type="CameraAltIcon"
                            style={{ color: '#fff', marginBottom: '10px' }}
                        />
                        <p className="uppercase text-sm text-white max-w-32">
                            mudar foto do perfil
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-rows-2 gap-y-16 w-full px-[30px] pt-[14px] pb-[10px]">
                <div>
                    <p className="mb-[14px] text-[#008069] text-[14px] flex">Seu nome</p>
                    <div className={`w-full h-[34px] flex ${showConfirm ? 'border-b-2 border-b-[#667781] ' : 'border-b-0'}`}>
                        <input
                            className={`flex-1 inline text-[#3B4A54] text-[16px] border-0 outline-none ${showConfirm ? ' pointer-events-auto' : ' pointer-events-none'}`} 
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
                            className={`flex-1 inline text-[#3B4A54] text-[16px] border-0 outline-none ${showNote ? ' pointer-events-auto' : ' pointer-events-none'}`} 
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
        </SliderLeftContainer>
    )
}

export default Perfil;