const ChatIntro = () => {
    return (
        <div 
            className="bg-[#f8f9fa] flex flex-col justify-center items-center h-full border-b-8 border-[#4ADF83]"
        >
            <img 
                className="w-[250px] h-auto"
                src="https://whatsapp-clone-web.netlify.app/static/media/intro-connection-light.5690d473.jpg" alt="Celular conectado à rede" />

            <h1 className="text-3xl text-[#525252] font-normal mt-8">Mantenha seu celular conectado</h1>
            <h2 className="text-sm text-[#777] font-normal mt-5 text-center">O Whatsapp conecta ao seu telefone para sincronizar suas mensagens. 
            <br/> Para reduzir o uso de dados, conecte seu telefone a uma rede Wi-fi.</h2>
        </div>
    )
}

export default ChatIntro;