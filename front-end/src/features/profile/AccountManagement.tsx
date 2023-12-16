import React, { ChangeEvent, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./AccountManagement.css"
import Emoji from "../../components/Emoji";
import { Enable2FA, Disable2FA } from "./buttons/Buttons";
import { uploadAvatar, changeColorPaddle } from "../../api/User.requests";
import { UserContext } from "../../utils/UserContext";

const avatarMaxSize = 8388608;

function AccountManagement() {
	const userContext = useContext(UserContext);
	const user = userContext?.user;

	const [image, setImage] = useState<File>();
	const [activated2FA] = useState(user?.is2FAActivated);
	const [color, setColor] = useState<string>("");

	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (image) {
			if (image.size > avatarMaxSize)
				toast.error("Erreur: Fichier trop volumineux. 8Mo maximum.");
			else {
				const formData = new FormData();
				formData.append("file", image);
				await uploadAvatar(formData);
				setImage(undefined);
			}
		}
		if (color)
			await changeColorPaddle(color);
	};

	async function handle2FADelete() {
		navigate("/disable2fa");
	};

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		setImage(e.target.files?.[0]);
	};

	function handleColorChange(e: ChangeEvent<HTMLSelectElement>) {
		setColor(e.target.value);
	};

	function homeNav() {
		navigate("/home");
	}

	return (
		<div>
			<button onClick={homeNav}>
				<Emoji label="arrow_left" symbol="⬅️" /> Retour au matchmaking
			</button>
			<div className="account-management">
				<h2>Gestion du compte</h2>
				<form onSubmit={handleSubmit}>
					<label>Avatar : </label>
					<input type="file" accept=".PNG,.JPG,.JPEG,.GIF" onChange={handleImageChange} />
					<br />
					<br />
					<label>Couleur de la raquette : </label>
					<select onChange={handleColorChange} defaultValue={"DEFAULT"}>
						<option value="DEFAULT" disabled hidden>Couleur</option>
						<option value="white">Blanc</option>
						<option value="red">Rouge</option>
						<option value="orange">Orange</option>
						<option value="yellow">Jaune</option>
						<option value="green">Vert</option>
						<option value="blue">Bleu</option>
					</select>
					<br />
					<br />
					<button type="submit">Valider</button>
				</form>
				<br />
				<br />
				<div>{activated2FA ? <Disable2FA onClick={handle2FADelete} /> : <Enable2FA />}</div>
			</div>
		</div>
	);
}

export default AccountManagement;
