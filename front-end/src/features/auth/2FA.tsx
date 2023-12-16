import React, { useState, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import "./Auth.css";
import { getJwtCookie, setJwtCookie } from "../../api/Auth";
import { getQRCode, saveQRCode, submitCode2FA } from "../../api/Auth.requests";
import { delete2FA } from "../../api/User.requests";
import { getMe } from "../../api/User.requests";

export function Enable2FA() {
	const [QRCode, setQRCode] = React.useState<string>();
	const [secret, setSecret] = useState("");
	const token = getJwtCookie();
	const navigate = useNavigate();

	React.useEffect(() => {
		async function unauthorized() {
			let user = await getMe();
			if (!token || !(user?.isProfileComplete) || user?.is2FAActivated)
				navigate("/error");
		}

		const getQRCodeSrc = async () => {
			const tmp = await getQRCode(token);
			setQRCode(tmp);
		};

		unauthorized().then(() => { getQRCodeSrc(); });
	}, [token, navigate]);

	async function handleClick() {
		const newToken = await saveQRCode(secret, token);
		if (newToken) {
			setJwtCookie(newToken);
			navigate("/home");
		}
		else
			setSecret("");
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	};

	const handleSetSecret = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value);
	};

	return (
		<div className="parent">
			<Toaster />
			<p>Scannez ce QRCode avec Google Authenticator.</p>
			<img src={QRCode} alt="QRCode" />
			<br />
			<div className="form">
				<label>Code secret : <input maxLength={6} type="text" value={secret} onChange={handleSetSecret} onKeyDown={handleKeyDown} /> </label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
};

export function Login2FA() {
	const [searchParams] = useSearchParams();
	const [secret, setSecret] = useState("");
	const access_token = searchParams.get("token");
	const token = getJwtCookie();
	const navigate = useNavigate();

	async function handleClick() {
		const newToken = await submitCode2FA(secret, access_token!);
		if (newToken) {
			setJwtCookie(newToken);
			navigate("/home");
		}
		else
			setSecret("");
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	};

	const handleSetSecret = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value);
	};

	React.useEffect(() => {
		async function unauthorized() {
			if (!access_token || token)
				navigate("/error");
		}

		unauthorized();
	}, [access_token, navigate, token]);

	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Code secret: <input maxLength={6} type="text" value={secret} onChange={handleSetSecret} onKeyDown={handleKeyDown} /></label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
};

export function Disable2FA() {
	const [secret, setSecret] = useState("");
	const token = getJwtCookie();
	const navigate = useNavigate();

	async function handleClick() {
		const newToken = await delete2FA(secret);
		if (newToken) {
			setJwtCookie(newToken);
			navigate("/home");
		}
		else
			setSecret("");
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			handleClick();
	};

	const handleSetSecret = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value);
	};

	React.useEffect(() => {
		async function unauthorized() {
			let user = await getMe();
			if (!token || !(user?.isProfileComplete) || !(user?.is2FAActivated))
				navigate("/error");
		}
	
		unauthorized();
	}, [token, navigate]);

	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Code secret: <input maxLength={6} type="text" value={secret} onChange={handleSetSecret} onKeyDown={handleKeyDown} /></label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
};
