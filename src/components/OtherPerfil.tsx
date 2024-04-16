import { PerfilType } from "@/types/PerfilType";
import IconItem from "./IconItem";


const OtherPerfil = ({name, image, setViewPerfil} : PerfilType) => {
    return (
        <div
            className="flex-1 flex flex-col items-center h-full min-w-[520px] scroll-auto"
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

            <div className="flex flex-col h-[500px] bg-[white] w-full justify-center items-center">
                <img src={image} alt="foto de perfil" className="rounded-full mb-4 w-72 h-72" />
                <div className="w-80">
                    <p className="text-3xl font-semibold text-[#111B21]">{name}</p>
                </div>
            </div>
            <div className="py-8 px-10 bg-[white] w-full mt-4 flex flex-col items-start">
                <p className="text-2xl font-semibold text-[#111B21] mb-2">Github</p>
                <p className="text-[20px] cursor-pointer text-[#383838]">Meu github...</p>
            </div>
            <div className="py-8 px-10 bg-[white] w-full mt-4 flex flex-col items-start">
                <p className="text-2xl font-semibold text-[#111B21] mb-2">Recado</p>
                <p className="text-[20px] text-[#383838]">Meu recado...</p>
            </div>
        </div>
    )
}

export default OtherPerfil;