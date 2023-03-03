import React from 'react';
import { Link } from "react-router-dom";
import { logOutApi } from '../api/Logout';

function HeaderConnected() {
    function logout() {
        logOutApi();
        localStorage.removeItem("user");
    }
    
    return (
        <div>
            <Link to="/accountmanagement">Paramètres de compte</Link>
            <br />
            <button onClick={logout}>Déconnexion</button>
        </div>
    );
}

export default HeaderConnected;
