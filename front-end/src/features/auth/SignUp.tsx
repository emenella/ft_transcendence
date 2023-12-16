import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import "./Auth.css";
import { getJwtCookie } from "../../api/Auth";
import { changeUsername, getMe } from "../../api/User.requests";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const token = getJwtCookie();
	const navigate = useNavigate();

	async function handleClick() {
		const req = await changeUsername(username);
		if (req?.status === 201)
			navigate("/home");
		else
			setUsername("");
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	}

	function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
		setUsername(e.target.value);
	}

	useEffect(() => {
		getMe().then((user) => {
			if (user?.isProfileComplete || !token)
			navigate("/error");
		});
	}, [token, navigate])

	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Pseudonyme : <input maxLength={16} type="text" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown} /> </label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
}
