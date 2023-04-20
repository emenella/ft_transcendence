import React, { ChangeEvent, useState } from "react";
import { Toaster } from "react-hot-toast";
import "./Form.css";
import { changeUsername } from "../../api/User";
import { UserStatus } from "../../utils/backend_interface";
import { NavigateFunction } from "react-router-dom";

function UsernameForm({ navigate }: { navigate: NavigateFunction } ) {
    const [username, setUsername] = useState('');

	async function handleClick() {
		const req = await changeUsername(username);
		if (req?.status === 201) {
			navigate("/");
		}
		else {
			setUsername('');
		}
	}
	
	async function handleKeyDown(event: any) {
		if (event.key === 'Enter')
			handleClick();
	};

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>{
        setUsername(e.target.value);
    };

	return (
		<div className="parent">
			<Toaster />
			<div className="form">
				<label>Pseudonyme : <input type="text" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown}/> </label>
				<button onClick={handleClick}>Envoyer</button>
			</div>
		</div>
	);
}

export default UsernameForm;
