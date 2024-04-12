import { PerfilType } from "@/types/PerfilType";
import IconItem from "./IconItem";


const OtherPerfil = ({name, image, setViewPerfil} : PerfilType) => {
    return (
        <div
            className="flex-1 flex flex-col items-center h-full min-w-[520px]"
        >
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

            <div className="flex flex-col flex-1 bg-[white] w-full justify-center items-center">
                <img src={image} alt="foto de perfil" className="rounded-full mb-4 w-72 h-72" />
                <div className="w-80">
                    <p className="text-3xl font-semibold mb-4 text-[#111B21]">{name}</p>
                    <p className="cursor-pointer text-[#383838]">Github</p>
                </div>
            </div>
        </div>
    )
}

export default OtherPerfil;