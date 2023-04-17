import React from 'react';
// import { isConnected } from '../utils/interface';
import { Link } from "react-router-dom";

class HeaderConnected extends React.Component<{logout: () => void}> {
    constructor(props: {logout: () => void}) {
        super(props);
    }

    render() {
        const linkStyle = {
            color: "white",
        }

        return (
            <div>
                <Link to="/profil" style={linkStyle}>Profil</Link>
                <br />
                <Link to="/accountmanagement" style={linkStyle}>Paramètres de compte</Link>
                <br />
                <button onClick= {this.props.logout}>Déconnexion</button>
            </div>
        );
    }
}

export default HeaderConnected;
