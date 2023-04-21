import React from "react";
import { useContext } from "react";
import { UserContext } from "../../utils/UserContext";
import { Link } from "react-router-dom";

function HeaderBase() {
	return 
}

export function HeaderConnected({ logout }: { logout: () => void }) {
	const userContext = useContext(UserContext);
    const user = userContext?.user;
	
	const linkStyle = {
		color: "white",
	}

    return (
        <div>
            <Link to={"/home/profile/" + user?.id} style={linkStyle}>Profil</Link>
			<br />
            <Link to="/home/accountmanagement" style={linkStyle}>Paramètres de compte</Link>
            <br />
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
