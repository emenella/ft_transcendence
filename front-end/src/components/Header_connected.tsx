import React from 'react';
import { isConnected } from '../utils/interface';
import { Link } from "react-router-dom";

class HeaderConnected extends React.Component<isConnected> {
    render() {
        return (
            <div>
                <Link to="/profil">Profil</Link>
                <br />
                <Link to="/accountmanagement">Paramètres de compte</Link>
                <br />
                <button onClick= {this.props.lougout}>Déconnexion</button>
            </div>
        );
    }
}

export default HeaderConnected;
