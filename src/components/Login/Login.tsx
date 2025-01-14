import * as Auth from "@/communication/Firebase/authorization";
import * as Firestore from "@/communication/Firebase/firestore";
import { LoginProps } from "@/types/Login/LoginType";
import { Unsubscribe, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import IconItem from "../Icons/IconItem";
import { CubeContainer, CubeFaceFront, CubeFaceLeft, CubeFaceRight, CubeScene, SideType } from "../StyledComponents/Cubo/Cube";
import CircularProgressBasic from "../Progress/CircularProgressBasic";
import { LoadingItem } from "@/types/Loading/LoadingItem";
import { Button, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInObject, SignInSchema, SignUpObject, SignUpSchema } from "@/schemas/Login/LoginSchemas";
import { generateId } from "@/utils/GenerateId";
import { photoUrlEmpty, UserType } from "@/types/User/UserType";
import { hashPassword } from "@/utils/Crypt";
import DotsLoading from "../StyledComponents/Loading/DotsLoading";

const Login = ({ onReceive }: LoginProps) => {

	const {
		control: controlSignUp,
		handleSubmit: handleSubmitSignUp,
		setValue: setValueSignUp,
		setError: setErrorSignUp,
		clearErrors: clearErrorsSignUp
	} = useForm<SignUpObject>({
		resolver: zodResolver(SignUpSchema)
	});

	const {
		control : controlSignIn,
		handleSubmit : handleSubmitSignIn,
		setValue: setValueSignIn,
		setError : setErrorSignIn,
		clearErrors : clearErrorsSignIn
	} = useForm<SignInObject>({
		resolver: zodResolver(SignInSchema)
	});

	const [loading, setLoading] = useState<LoadingItem>({active: true});
	const [sideCube, setSideCube] = useState<SideType>('right');

	useEffect(() => {
		let unsubscribeUserAuthenticate: Unsubscribe;
	
		const onAuthenticate = async () => {
			unsubscribeUserAuthenticate = await Auth.onAuthenticateUser(async (User) => {
				loadUserProfile(User);
			}, () => {
				setSideCube('front');
				setLoading({active: false});
			});
		};
	
		onAuthenticate();
	
		return () => {
		  if (unsubscribeUserAuthenticate) {
			unsubscribeUserAuthenticate();
		  }
		};
	  }, []);

	const handleLogin = async () => {
		loadUserProfile(await Auth.githubPopup() as any);
	}

	const loadUserProfile = async (userAuthenticated: User | null) => {
		if (userAuthenticated) {
			let user = await Firestore.getUser(userAuthenticated.uid);
			onReceive({
				id: userAuthenticated.uid,
				displayName: user?.displayName ?? userAuthenticated.displayName ?? 'usuário',
				photoURL: user?.photoURL ?? userAuthenticated.photoURL ?? '',
				note: user?.note,
				allowNotifications: user?.allowNotifications ?? false
			});
		}
		else {
			alert('Não foi possível logar');
		}
	}

	const handleSignUp : SubmitHandler<SignUpObject> = async ({userName, password}) => {
		const salt = userName+":"+password;

		const user : UserType = {
			id: generateId(),
			displayName: userName,
			password: hashPassword(password, salt),
			photoURL: photoUrlEmpty,
			note: '',
			allowNotifications: false
		}

		if (!await Firestore.existUserByCredential(user.displayName as string, user.password as string)) {
			if (await Firestore.addUser(user)) {
				GoAreaSignIn();
			}
			else {
				alert('Algo deu errado ao cadastrar o usuário...');
			}
		}
		else {
			setErrorSignUp('userName', {
				type: "manual",
				message: "Usuário já cadastrado.",
			});
		}
	}

	const handleSignIn : SubmitHandler<SignInObject> = async({userName, password}) => {
		const passwordCrypt = hashPassword(password, userName+":"+password);

		if (await Firestore.existUserByCredential(userName as string, passwordCrypt)) {
			let user = await Firestore.getUserByNameAndPassword(userName, passwordCrypt);

			if (user) {
				onReceive(user);
			}
		}
		else {
			setErrorSignIn('userName', {
				type: "manual",
				message: "Usuário não cadastrado.",
			});
		}
	}

	const GoAreaSignIn = () => {
		setSideCube('front');
		clearFieldsSignUp();
		clearErrorsFieldsSignUp();
	}

	const GoAreaSignUp = () => {
		setSideCube('left');
		clearFieldsSignIn();
		clearErrorsFieldsSignIn();
	}

	const clearFieldsSignUp = () => {
		setValueSignUp('userName', '');
		setValueSignUp('password', '');
		setValueSignUp('confirmPassword', '');
	}

	const clearFieldsSignIn = () => {
		setValueSignIn('userName', '');
		setValueSignIn('password', '');
	}

	const clearErrorsFieldsSignUp = () => {
		clearErrorsSignUp('userName');
		clearErrorsSignUp('password');
		clearErrorsSignUp('confirmPassword');
	}

	const clearErrorsFieldsSignIn = () => {
		clearErrorsSignIn('userName');
		clearErrorsSignIn('password');
	}

	return (
		<CubeContainer>
			<CubeScene
				className="sm:w-[400px] w-[280px] h-[70svh]"
				side={sideCube}
			>
				<CubeFaceLeft
					className="flex flex-col justify-center items-center bg-white"
				>
					<div className="w-full flex items-center justify-center flex-col px-10 py-8">
						<div className="absolute top-4 right-4">
							<IconItem
								className="iconTheme"
								type="ArrowForwardIcon"
								onclick={GoAreaSignIn}
							/>
						</div>
						<div className="text-2xl font-bold mb-10 select-none">Cadastro</div>
						<div className="w-full flex flex-col items-center mb-10">
							<form onSubmit={handleSubmitSignUp(handleSignUp)}>
								<Controller
									control={controlSignUp}
									name="userName"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											required
											label="Nome de usuário"
											variant="outlined"
											style={{ 
												marginBottom: '16px', 
												width: '100%'
											}}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignUp}
									name="password"
									render={({field, fieldState}) => 
										<TextField
											required
											{...field}
											label="Senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignUp}
									name="confirmPassword"
									render={({field, fieldState}) => 
										<TextField
											required
											{...field}
											label="Confirme a senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Button
									type='submit'
									variant="contained"
									className="w-full text-white"
									style={{
										marginBottom: '16px',
										background: '#6FB454'
									}}
								>
									Logar
								</Button>
							</form>
						</div>
					</div>
				</CubeFaceLeft>
				<CubeFaceFront
					className="flex flex-col justify-center items-center bg-white"
				>
					<div className="w-full flex items-center justify-center flex-col px-10 py-8">
						<div className="text-2xl font-bold mb-10 select-none">Login</div>
						<div className="w-full flex flex-col items-center mb-10">
							<form onSubmit={handleSubmitSignIn(handleSignIn)}>
								<Controller
									control={controlSignIn}
									name="userName"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											label="Nome de usuário"
											variant="outlined"
											style={{ 
												marginBottom: '16px', 
												width: '100%'
											}}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Controller
									control={controlSignIn}
									name="password"
									render={({field, fieldState}) => 
										<TextField
											{...field}
											label="Senha"
											variant="outlined"
											type="password"
											style={{ marginBottom: '16px', width: '100%' }}
											error={fieldState.invalid}
											helperText={fieldState.error?.message}
										/>
									}
								/>

								<Button 
									type='submit'
									variant="contained"
									className="w-full text-white"
									style={{
										marginBottom: '16px',
										background: '#6FB454'
									}}
								>
									Entrar
								</Button>
								<p 
									className="cursor-pointer text-sm text-[#686868] text-center"
									onClick={GoAreaSignUp}
								>
									Cadastre-se
								</p>
							</form>
						</div>
						<div className="absolute bottom-10 flex flex-col items-center">
							<p className="text-[12px] text-[#686868] mb-2 select-none">Ou entre com</p>
							<IconItem
								type='GitHubIcon'
								style={{
									width: '35px',
									height: '35px',
									color: '#000',
									cursor: 'pointer'
								}}
								onclick={handleLogin}
							/>
						</div>
					</div>
				</CubeFaceFront>
				<CubeFaceRight
					className="bg-white flex justify-center items-center"
				>
					{loading?.active &&
						<DotsLoading 
							style={{backgroundColor: "#00A884"}}
						/>
					}
				</CubeFaceRight>
			</CubeScene>
		</CubeContainer>
	)
}

export default Login;