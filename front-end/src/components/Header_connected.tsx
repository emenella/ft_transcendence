import React from 'react';
import { Link } from "react-router-dom";
import { User } from '../utils/backend_interface';
import { getMe } from '../api/User';

function HeaderConnected(props : { logout: () => void }) {
    const linkStyle = {
        color: "white",
    }

    const [user, setUser] = React.useState<User>();
	React.useEffect(() => {
		const getUser = async () => {
			setUser(await getMe());
		};
		getUser();
	}, []);

    return (
        <div>
            <Link to={"/profil/" + user?.id} style={linkStyle}>Profil</Link>
            <br />
            <Link to="/accountmanagement" style={linkStyle}>Paramètres de compte</Link>
            <br />
            <button onClick= {props.logout}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
