import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import "./Headers.css"
import { UserContext } from '../../utils/UserContext';
import { url42 } from '../../api/Auth';

export function HeaderConnected({ logout }: { logout: () => void }) {
	const userContext = useContext(UserContext);
	const user = userContext?.user;
	const navigate = useNavigate();

	function profileNav() {
		navigate("/home/profile/" + user?.id);
	}

	function accountNav() {
		navigate("/home/accountmanagement");
	}

	return (
		<div>
			<button onClick={profileNav} className='nav_button'>Profil</button>
			<br />
			<button onClick={accountNav} className='nav_button'>Paramètres de compte</button>
			<br />
			<br />
			<button onClick={logout}>Déconnexion</button>
		</div>
	);
}

export function HeaderNotConnected() {
	return (
		<>
			<a href={url42}>
				<button>Connexion</button>
			</a>
		</>
	);
}
