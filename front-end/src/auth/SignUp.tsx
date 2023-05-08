import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast";
import "./Auth.css";
import { getJwtCookie } from "../api/JwtCookie";
import { changeUsername, getMe } from "../api/User";
import { User } from "../utils/backendInterface";
import { UserContext } from "../utils/UserContext";

export default function SignUp() {
	const context = useContext(UserContext);
	const [user, setUser] = useState<User | undefined>(context?.user);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	async function handleClick() {
		const req = await changeUsername(username).catch((err) => { toast.error(err.message); console.log(err); });
		if (req?.status === 201) {
			const newUser = await getMe().catch((err) => { toast.error(err.message); });
			if (newUser) {
				setUser(newUser);
				context?.setUser(newUser);
				navigate("/home");
			}
		}
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			await handleClick();
	}

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	}

	const backToHome = () => {
		if (user?.isProfileComplete === true)
			navigate("/home", );
	}

	useEffect(() => {
		console.log('useEffect', user);
		backToHome();	
	}, [user]);

	return (
		<div className="bg-cover absolute h-screen w-screen top-0 left-0 flex flex-col items-center justify-center text-white text-lg bg-blue-500">
			<Toaster />
			<div className="form">
				<label>Pseudonyme : <input className="border-white" maxLength={4096} type="text" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown}/> </label>
				<button className="border-white" onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
}
