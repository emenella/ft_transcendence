import React from 'react';
import { tokenFunction } from '../utils/interface';
import { Link } from "react-router-dom";
import { logOutApi } from '../api/Logout';

class HeaderConnected extends React.Component<tokenFunction> {
    logout() {
        logOutApi();
        localStorage.removeItem("user");
    }
    
    render() {
        return (
            <div>
                <Link to="/accountmanagement">Paramètres de compte</Link>
                <br />
                <button onClick= {() => { this.logout(); this.props.setToken(); }}>Déconnexion</button>
            </div>
        );
    }
}

export default HeaderConnected;
