import { NewChatProps } from "@/types/Chat/NewChatType";
import SliderCardLeftTitle from "../Sliders/SliderCardLeftTitle";
import { SliderLeftContainer } from "../StyledComponents/Containers/Slider";

const NewChat = ({ addNewChat, listUsers, show, setShow }: NewChatProps) => {
	return (
		<SliderLeftContainer
			className={show ? 'openFlap' : 'closeFlap'}
		>
			<SliderCardLeftTitle
				title='Nova conversa'
				handleShow={setShow}
			/>

			<div className="newChat--list">
				{listUsers.map((item, key) => (
					<div
						key={key}
						className="flex items-center p-4 cursor-pointer hover:bg-[#F5F5F5]"
						style={{ pointerEvents: show ? 'auto' : 'none' }}
						onClick={() => addNewChat(item)}
					>
						<img
							className="w-[50px] h-[50px] rounded-[50%] mr-4"
							src={item.photoURL ? item.photoURL : ''}
							alt="avatar do perfil" />
						<div
							className="text-[17px] text-black"
						>
							{item.displayName}
						</div>
					</div>
				))}
			</div>
		</SliderLeftContainer>
	)
}

export default NewChat;