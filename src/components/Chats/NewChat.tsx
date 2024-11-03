import { NewChatProps } from "@/types/Chat/NewChatType";
import IconItem from "../Icons/IconItem";
import { useState, useEffect } from "react";
import { UserType } from "@/types/User/UserType";
import Api from "@/services/firebase.service.firestore";

const NewChat = ({ listContacts, setListContacts, user, show, setShow }: NewChatProps) => {
	const [list, setList] = useState<UserType[]>([]);
	const [disabledContact, setDisabledContact] = useState(false);

	useEffect(() => {
		const getList = async () => {
			if (user) {
				console.log(listContacts);
				const listUsers = await Api.getContactList(listContacts);
				console.log(listUsers);
				setList(listUsers);
			}
		}
		getList();
	}, [listContacts]);

	const addNewChat = async (otherUser: UserType) => {
		setDisabledContact(true);
		await Api.addNewChat(user, otherUser);
		let newContacts = await Api.getContactsIncluded(user.id);
		setListContacts(newContacts);
		setShow(false);
		setDisabledContact(false);
	}

	return (
		<div
			className={`transition-all duration-500 w-full border-[#DDD] bg-[white] flex flex-col border-r-[1px] verticalFlap absolute top-0 bottom-0 left-0 ${show ? 'openFlap translate-x-0' : 'closeFlap translate-x-[-100%]'}`}
		>
			<div className="flex bg-[#008069] items-center px-4 pb-4 pt-[60px]">

				<div onClick={() => setShow(false)}>
					<IconItem
						className="iconTheme"
						type="ArrowBackIcon"
						style={{ color: '#FFF' }}
					/>
				</div>

				<div className="text-[19px] leading-10 h-10 flex-1 font-bold text-white ml-5">
					Nova conversa
				</div>
			</div>

			<div className="newChat--list">
				{list.map((item, key) => (
					<div
						key={key}
						className="flex items-center p-4 cursor-pointer hover:bg-[#F5F5F5]"
						style={{ pointerEvents: disabledContact ? 'none' : 'auto' }}
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
		</div>
	)
}

export default NewChat;