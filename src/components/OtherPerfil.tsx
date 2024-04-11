import { PerfilType } from "@/types/PerfilType";
import IconItem from "./IconItem";


const OtherPerfil = ({name, image} : PerfilType) => {
    return (
        <div
            className="flex-1 flex flex-col items-center h-full bg-greenish-white"
        >
            <div 
                className="w-full h-1/6"
            >
                <IconItem
                    type="CloseOutlinedIcon"
                    className="iconTheme"
                    style={{ color: 'black', width: '50px', height: '50px' }}
                />
            </div>

            <div className="flex flex-col h-">
                <img src={image} alt="foto de perfil" className="rounded-full mb-4 w-96 h-96" />
                <p>{name}</p>
            </div>
        </div>
    )
}

export default OtherPerfil;