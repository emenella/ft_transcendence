import React from 'react';
import { Link } from "react-router-dom";
import { User } from '../../utils/backend_interface';

export function HeaderConnected({ logout, user }: { logout: () => void, user: User }) {
	const linkStyle = {
		color: "white",
	}


    return (
        <div>
            <Link to={"/profil/" + user?.id} style={linkStyle}>Profil</Link>
            <br />
            <Link to="/accountmanagement" style={linkStyle}>Paramètres de compte</Link>
            <br />
			<button onClick={logout}>Déconnexion</button>
        </div>
    );
}

export function HeaderNotConnected({ url } : { url: string }) {
	return (
		<a href={url}>
			<button>Connexion</button>
		</a>
	);
}
