const SignUp = () => {
    return (
        <div className="flex flex-col items-center justify-evenly bg-[#161A1F] w-96 h-80 text-white px-6 rounded-3xl">
            <img
                className="w-32 h-32 rounded-[20px] cursor-pointer"
                src=''
                alt="icone do avatar"
            />
            <input
                className="w-full h-10 border-0 outline-none bg-white rounded-3xl text-base text-[#4A4A4A] px-4"
                type="text"
                placeholder="Digite o seu nome"
                value=''
            />
            <button
                className="w-full h-10 bg-[#1155c1] rounded-3xl text-base text-white px-4"
            >
                Confirmar
            </button>
        </div>
    )
}