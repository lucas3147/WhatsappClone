import { PerfilType } from "@/types/User/PerfilType";
import IconItem from "../Icons/IconItem";


const OtherPerfil = ({user, setViewPerfil} : PerfilType) => {
    return (
        <div className="h-full flex flex-col">
            <div 
                className="flex items-center w-full h-16 bg-[#F6F6F6] px-4"
                onClick={() => setViewPerfil(false)}
            >
                <IconItem
                    type="CloseOutlinedIcon"
                    className="iconTheme bg-[#e0e0e0] hover:bg-[#cecece]"
                    style={{ color: 'black', width: '40px', height: '40px', padding: '10px 10px', borderRadius: '50%' }}
                />
            </div>

            <div className="otherPerfil">
                <div className="flex flex-col h-[500px] bg-[white] w-full justify-center items-center">
                    <img src={user.photoURL!} alt="foto de perfil" className="rounded-full mb-4 w-56 h-56" />
                    <div className="max-w-40">
                        <p className="text-[25px] font-semibold text-[#111B21] select-none">{user.displayName}</p>
                    </div>
                </div>
                <div className="py-6 px-8 bg-[white] w-full mt-4 flex flex-col items-start">
                    <p className="text-[16px] text-[#607783] mb-2 select-none">Github</p>
                    <p className="text-[18px] cursor-pointer text-[#383838]">Meu github...</p>
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