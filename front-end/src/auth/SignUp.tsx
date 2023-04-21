import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import "./Auth.css";
import { getJwtCookie } from "../api/JwtCookie";
import { changeUsername, getMe } from "../api/User";
import { User } from "../utils/backendInterface";

export default function SignUp() {
	const token = getJwtCookie();
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	async function handleClick() {
		const req = await changeUsername(username);
		if (req?.status === 201)
			navigate("/home");
		else
			setUsername("");
	}
	
	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	}

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	}

	async function alreadySignUp() {
		let user : User = await getMe();
		if (user?.isProfileComplete)
			navigate("/home");
	}

	if (!token)
		navigate("/error");

	alreadySignUp();

	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Pseudonyme : <input type="text" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown}/></label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
}
