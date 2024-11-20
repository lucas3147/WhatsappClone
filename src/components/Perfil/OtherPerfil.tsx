import IconItem from "../Icons/IconItem";
import { UserType } from "@/types/User/UserType";

type Props = {
    show: boolean, 
    setShow: (show: boolean) => void,
    user: UserType
}

const OtherPerfil = ({show, setShow, user} : Props) => {
    return (
        <div className={`relative flex flex-col top-0 right-0 transition-all duration-500 w-full h-full bg-[#F6F6F6] no-select ${show ? 'openFlap translate-x-0' : 'closeFlap translate-x-full'}`}>
            <div className="flex items-center w-full h-16 bg-[#F6F6F6] px-4">
                <IconItem
                    type="CloseOutlinedIcon"
                    className="iconTheme bg-[#e0e0e0] hover:bg-[#cecece]"
                    style={{ color: 'black', width: '40px', height: '40px', padding: '10px 10px', borderRadius: '50%' }}
                    onclick={() => setShow(false)}
                />
            </div>

            <div className="otherPerfil">
                <div className="flex flex-col h-[400px] bg-[white] w-full justify-center items-center">
                    <img src={user.photoURL!} alt="foto de perfil" className="rounded-full mb-4 w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52" />
                    <div className="max-w-40">
                        <p className="text-[25px] font-semibold text-[#111B21] select-none">{user.displayName}</p>
                    </div>
                </div>
                <div className="py-6 px-8 bg-[white] w-full mt-4 flex flex-col items-start">
                    <p className="text-[16px] text-[#607783] mb-2 select-none">Recado</p>
                    <p className="text-[18px] text-[#383838]">{user.note}</p>
                </div>
            </div>
        </div>
    )
}

export default OtherPerfil;