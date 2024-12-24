import { SliderRightContainer } from "../StyledComponents/Containers/Slider";
import { CloseAreaRight } from "../Containers/CloseAreaRight";
import { OtherPerfilProps } from "@/types/User/OtherPerfilType";

const OtherPerfil = ({show, setShow, user} : OtherPerfilProps) => {
    return (
        <SliderRightContainer className={show ? 'openFlap' : 'closeFlap'}>
            <CloseAreaRight
                closeClick={() => setShow(false)}
            />

            <div className="otherPerfil">
                <div className="flex flex-col h-[400px] bg-[white] w-full justify-center items-center shadow-md shadow-neutral-200">
                    <img src={user.photoURL!} alt="foto de perfil" className="rounded-full mb-4 w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52" />
                    <div className="max-w-56">
                        <p className="text-[25px] font-semibold text-[#111B21] select-none">{user.displayName}</p>
                    </div>
                </div>
                <div className="py-6 px-8 bg-[white] w-full mt-4 flex flex-col items-start shadow-md shadow-neutral-200">
                    <p className="text-[16px] text-[#607783] mb-2 select-none">Recado</p>
                    <p className="text-[18px] text-[#383838]">{user.note}</p>
                </div>
            </div>
        </SliderRightContainer>
    )
}

export default OtherPerfil;