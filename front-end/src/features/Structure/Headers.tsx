import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../../utils/UserContext';

export function HeaderConnected({ logout }: { logout: () => void }) {
	const userContext = useContext(UserContext);
	
    const user = userContext?.user;
	
	const linkStyle = {
		color: "white",
	};

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

export function HeaderNotConnected({ url, funcLogin } : { url: string, funcLogin: (id: number) => void }) {
	const [id, setId] = React.useState(0);

	const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
		setId(parseInt(e.target.value));
	}

	async function handleKeyDown(event: any) {
		if (event.key === "Enter")
			await funcLogin(id);
	}

	return (
		<div>
			<a href={url}>
				<button>Connexion</button>
			</a>
			<button onClick={() => funcLogin(id)}>Connexion sans 42</button>
			<input type="text" placeholder="id" onChange={onChangeId} onKeyDown={handleKeyDown}/>
		</div>
	);
}
