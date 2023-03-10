import React from 'react';
import { tokenFunction } from '../utils/interface';
import { Link } from "react-router-dom";

class HeaderConnected extends React.Component<tokenFunction> {
    render() {
        return (
            <div>
                <Link to="/accountmanagement">Paramètres de compte</Link>
                <br />
                <button onClick= {() => { localStorage.removeItem("token"); this.props.setToken(); }}>Déconnexion</button>
            </div>
        );
    }
}

export default HeaderConnected;
