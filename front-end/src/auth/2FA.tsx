import React, { useState, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast";
import { getJwtCookie, setJwtCookie } from "../api/JwtCookie";
import { getQRCode, saveQRCode, submitCode2FA } from "../api/Auth";
import { getMe } from "../api/User";
import { User } from "../utils/backendInterface";

export function Enable2FA() {
	const token = getJwtCookie();
	const [QRCode, setQRCode] = React.useState<string>();
	const [secret, setSecret] = useState("");
	const navigate = useNavigate();

	React.useEffect(() => {
		const getQRCodeSrc = async () => {
			const tmp = await getQRCode(token);
			setQRCode(tmp);
		};
		getQRCodeSrc();
	}, [token]);
	
	async function handleClick() {
		const newToken = await saveQRCode(secret, token);
		if (newToken) {
			setJwtCookie(newToken);
			navigate("/home");
		}
		else {
			setSecret("");
			toast.error("Error: Invalid code.");
		}
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	};

	const handleSetSecret = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value);
	};

	async function alreadyEnabledOrUnauthorized() {
		try {
			let user : User  = await getMe();
			if (user?.is2FAActivated === true)
				navigate("/home");
		}
		catch (err) {
			navigate("/error");
		}
	}

	alreadyEnabledOrUnauthorized();

	return (
		<div className="parent">
			<Toaster />
			<p>Veuillez scanner ce QRCode avec votre application Google Authenticator.</p>
			<img src={QRCode} alt="QRCode" />
			<br />
			<div className="form">
				<label>Veuillez entrer votre code secret correspondant : <input maxLength={4096} type="text" value={secret} onChange={handleSetSecret} onKeyDown={handleKeyDown} /> </label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
}

export function Login2FA() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const [secret, setSecret] = useState("");
	const navigate = useNavigate();
	
	async function handleClick() {
		const newToken = await submitCode2FA(secret, token!);
		if (newToken) {
			setJwtCookie(newToken);
			navigate("/home");
		}
		else {
			setSecret("");
			toast.error("Error: Invalid code.");
		}
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	};
	
	const handleSetSecret = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value);
	};

	async function notEnabledOrLoggedIn() {
		try {
			let user : User  = await getMe();
			if (user?.is2FAActivated === false)
				navigate("/home");
		}
		catch (err) {
			navigate("/error");
		}
	}

	notEnabledOrLoggedIn();
	
	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Veuillez entrer votre code secret: <input maxLength={4096} type="text" value={secret} onChange={handleSetSecret} onKeyDown={handleKeyDown}/></label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
};
